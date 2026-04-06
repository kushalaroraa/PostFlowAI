# PostFlowAI

A MERN (MongoDB, Express, React, Node.js) based Social Media Agent that helps automate post generation, scheduling, and management using AI (Google Gemini).

## Project Structure

- **`/client`**: React + Vite frontend for managing posts and viewing the dashboard.
- **`/server`**: Node.js + Express backend handling API requests and MongoDB integration.
- **`/agent`**: Core AI logic for generating content plans and post execution.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/AI-SocialAgent.git
    cd AI-SocialAgent
    ```

2.  **Setup Server**:
    ```bash
    cd server
    npm install
    cp .env.example .env
    # Edit .env with your MONGODB_URI and GEMINI_API_KEY
    npm run dev
    ```

3.  **Setup Client**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

## Features
- AI-powered content generation.
- Post scheduling and status tracking with calendar.
- Smart AI posting time suggestions with reasoning.
- AI Studio with persona and style customization.
- Image uploads and preview.
- Real-time Dashboard with draft/published/scheduled posts.

## Deployment
The project includes a `Dockerfile` and `deploy.sh` script for deployment to Google Cloud Run.
