#!/bin/bash

# PayPollen Railway Deployment Script
# Run this script to deploy your API to Railway

set -e

echo "🚀 Starting PayPollen API deployment to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
fi

# Initialize project if not already done
if [ ! -f "railway.toml" ]; then
    echo "📝 Initializing Railway project..."
    railway init
fi

# Set environment variables
echo "🔧 Setting environment variables..."

# Required environment variables
ENV_VARS=(
    "NODE_ENV=production"
    "PORT=3001"
    "MONGODB_DB_NAME=paypollen"
)

# Set basic env vars
for var in "${ENV_VARS[@]}"; do
    echo "Setting $var"
    railway variables set $var
done

# Prompt for sensitive variables
echo ""
echo "🔐 Please enter your sensitive environment variables:"

read -p "MongoDB URI: " MONGODB_URI
railway variables set MONGODB_URI="$MONGODB_URI"

read -p "AWS KMS Key ID: " AWS_KMS_KEY_ID
railway variables set AWS_KMS_KEY_ID="$AWS_KMS_KEY_ID"

read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
railway variables set AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"

read -s -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
echo
railway variables set AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"

read -p "Stytch Project ID: " STYTCH_PROJECT_ID
railway variables set STYTCH_PROJECT_ID="$STYTCH_PROJECT_ID"

read -s -p "Stytch Secret: " STYTCH_SECRET
echo
railway variables set STYTCH_SECRET="$STYTCH_SECRET"

read -p "Stytch Public Token: " STYTCH_PUBLIC_TOKEN
railway variables set STYTCH_PUBLIC_TOKEN="$STYTCH_PUBLIC_TOKEN"

read -p "Plaid Client ID: " PLAID_CLIENT_ID
railway variables set PLAID_CLIENT_ID="$PLAID_CLIENT_ID"

read -s -p "Plaid Secret: " PLAID_SECRET
echo
railway variables set PLAID_SECRET="$PLAID_SECRET"

read -p "Plaid Environment (sandbox/production): " PLAID_ENV
railway variables set PLAID_ENV="$PLAID_ENV"

read -s -p "JWT Secret: " JWT_SECRET
echo
railway variables set JWT_SECRET="$JWT_SECRET"

read -s -p "Turnstile Secret Key: " TURNSTILE_SECRET_KEY
echo
railway variables set TURNSTILE_SECRET_KEY="$TURNSTILE_SECRET_KEY"

read -p "Frontend URL (e.g., https://app.paypollen.com): " FRONTEND_URL
railway variables set FRONTEND_URL="$FRONTEND_URL"

read -p "CORS Origins (comma-separated): " CORS_ORIGINS
railway variables set CORS_ORIGINS="$CORS_ORIGINS"

# Deploy the application
echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Railway dashboard to get your deployment URL"
echo "2. Update your frontend API_URL to point to the Railway URL"
echo "3. Configure custom domain (api.paypollen.com) in Railway dashboard"
echo "4. Test your API endpoints"
echo ""
echo "🔍 Monitor your deployment:"
echo "railway logs"
echo ""
echo "🌐 Open Railway dashboard:"
echo "railway open"
