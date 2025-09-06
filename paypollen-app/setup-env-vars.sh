#!/bin/bash

echo "🔧 Setting up PayPollen environment variables in Railway..."
echo ""
echo "⚠️  BEFORE RUNNING: Update this script with your actual credentials!"
echo "📋 You should have collected these from the setup steps:"
echo "   - 4 AWS values (Region, KMS Key ID, Access Key, Secret Key)"
echo "   - 3 Stytch values (Project ID, Secret, Public Token)"
echo "   - 2 Plaid values (Client ID, Secret)"
echo ""

read -p "Have you updated this script with your actual credentials? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please update the credentials below and run again."
    exit 1
fi

# Basic configuration
railway variables --set "NODE_ENV=production"
railway variables --set "PORT=3001"
railway variables --set "MONGODB_DB_NAME=paypollen"

# MongoDB (already set)
echo "✅ MongoDB URI already configured"

# AWS KMS - REPLACE WITH YOUR VALUES FROM AWS CONSOLE
echo "🔧 Setting AWS credentials..."
railway variables --set "AWS_REGION=us-east-1"
railway variables --set "AWS_KMS_KEY_ID=arn:aws:kms:us-east-1:123456789:key/YOUR-KEY-ID-HERE"
railway variables --set "AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_HERE"
railway variables --set "AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY_HERE"

# Stytch - REPLACE WITH YOUR VALUES FROM STYTCH DASHBOARD
echo "🔧 Setting Stytch credentials..."
railway variables --set "STYTCH_PROJECT_ID=project-test-YOUR-PROJECT-ID"
railway variables --set "STYTCH_SECRET=secret-test-YOUR-SECRET-HERE"
railway variables --set "STYTCH_PUBLIC_TOKEN=public-token-test-YOUR-TOKEN-HERE"

# Plaid - REPLACE WITH YOUR VALUES FROM PLAID DASHBOARD
echo "🔧 Setting Plaid credentials..."
railway variables --set "PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID"
railway variables --set "PLAID_SECRET=YOUR_PLAID_SANDBOX_SECRET"
railway variables --set "PLAID_ENV=sandbox"

# Security
echo "🔧 Setting security variables..."
railway variables --set "JWT_SECRET=$(openssl rand -base64 32)"
railway variables --set "TURNSTILE_SECRET_KEY=placeholder-get-from-cloudflare"

# URLs - Update after getting Railway URL
railway variables --set "CORS_ORIGINS=http://localhost:3000"
railway variables --set "FRONTEND_URL=http://localhost:3000"
railway variables --set "API_URL=https://your-railway-url.railway.app"

echo ""
echo "✅ Environment variables set!"
echo "🌐 Get your Railway URL with: railway open"
echo "🔄 Your API will automatically restart with new environment variables"
echo ""
echo "📋 Next steps:"
echo "1. Get your Railway URL from dashboard"
echo "2. Update Stytch redirect URLs with your Railway URL"
echo "3. Update Plaid webhook URL with your Railway URL"
echo "4. Test authentication: curl https://your-url.railway.app/health"
