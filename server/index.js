const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-social-agent';

// Environment Validation (for production)
const requiredEnv = ['GEMINI_API_KEY'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.warn(`⚠️ Warning: Missing environment variable ${key}`);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/uploads', uploadRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

// Roots
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    timestamp: new Date().toISOString() 
  });
});

app.get('/', (req, res) => {
  res.send('AI Social Agent API is running.');
});

// Start Server Immediately (Required for Cloud Run Health Check)
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  
  // Connect to MongoDB asynchronously
  console.log('📦 Attempting to connect to MongoDB...');
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      // In production, we might not want to exit immediately to allow health checks to pass,
      // but the app won't be functional without DB.
    });
});

module.exports = app;
