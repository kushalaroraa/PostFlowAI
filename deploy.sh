#!/bin/bash

# Configuration
PROJECT_ID="kushal-project1-490706"
SERVICE_NAME="postflow-ai"
REGION="us-central1"

# Environment Variables (Required for Deployment)
# These should be set in your environment or passed to the script
if [ -z "$MONGODB_URI" ]; then
  echo "❌ Error: MONGODB_URI is not set."
  echo "Please set it: export MONGODB_URI='your_mongodb_uri'"
  exit 1
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY is not set."
  echo "Please set it: export GEMINI_API_KEY='your_gemini_api_key'"
  exit 1
fi

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
  --set-env-vars="MONGODB_URI=$MONGODB_URI,GEMINI_API_KEY=$GEMINI_API_KEY,NODE_ENV=production" \
  --quiet

echo "✅ Success! Your live link will be displayed above."
