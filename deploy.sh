#!/bin/bash

# Configuration
PROJECT_ID="kushal-project1-490706"
SERVICE_NAME="postflow-ai"
REGION="us-central1"

# Environment Variables (Extracted from .env)
MONGODB_URI="YOUR_MONGODB_URI_HERE"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

echo "🚀 Starting deployment for $SERVICE_NAME..."

# Step 1: Set Project
echo "📍 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Step 2: Enable necessary services
echo "⚙️ Enabling Cloud Run and Cloud Build APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# Step 3: Deploy to Cloud Run
echo "📤 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=$MONGODB_URI,GEMINI_API_KEY=$GEMINI_API_KEY,NODE_ENV=production"

echo "✅ Success! Your live link will be displayed above."
