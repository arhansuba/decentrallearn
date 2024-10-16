#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Setting up DecentralLearn project..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Setup environment variables
echo "Setting up environment variables..."
cp .env.example .env
echo "Please update the .env file with your specific configuration."

# Initialize database
echo "Initializing database..."
npm run db:init

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Setup AI models
echo "Setting up AI models..."
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python setup_ai_models.py

echo "Setup completed successfully!"