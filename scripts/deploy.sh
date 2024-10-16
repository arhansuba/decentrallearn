#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if the environment argument is provided
if [ -z "$1" ]; then
    echo "Please provide the environment (production or staging) as an argument."
    exit 1
fi

ENVIRONMENT=$1

echo "Deploying DecentralLearn to $ENVIRONMENT environment..."

# Load environment variables
source .env.$ENVIRONMENT

# Build the project
echo "Building the project..."
npm run build

# Run database migrations
echo "Running database migrations..."
npm run db:migrate

# Deploy smart contract (if needed)
echo "Deploying smart contract..."
npx hardhat run scripts/deploy_rewards.js --network $ENVIRONMENT

# Deploy to Spheron
echo "Deploying to Spheron..."
spheron deploy --token $SPHERON_TOKEN

# Restart the application server
echo "Restarting the application server..."
pm2 restart decentrallearn-$ENVIRONMENT

echo "Deployment completed successfully!"