# ─── Build Stage ───
FROM node:20-alpine AS builder

WORKDIR /app

# Install root dependencies
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts 2>/dev/null || npm install

# Install client dependencies and build
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && (npm ci 2>/dev/null || npm install)

COPY client/ ./client/
RUN cd client && npm run build

# ─── Production Stage ───
FROM node:20-alpine

WORKDIR /app

# Install root dependencies (needed by agent/ modules)
COPY package.json package-lock.json* ./
RUN npm ci --production --ignore-scripts 2>/dev/null || npm install --production

# Install server dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && (npm ci --production 2>/dev/null || npm install --production)

# Copy server source
COPY server/ ./server/

# Copy agent module (required by server/controllers)
COPY agent/ ./agent/

# Copy built client
COPY --from=builder /app/client/dist ./client/dist

# Create uploads directory and log file
RUN mkdir -p server/uploads && touch ai_usage.log

# Set production environment
ENV NODE_ENV=production

CMD ["node", "server/index.js"]
