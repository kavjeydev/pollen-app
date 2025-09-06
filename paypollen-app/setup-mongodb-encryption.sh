#!/bin/bash

echo "🔐 Setting up MongoDB Client-Side Field Level Encryption..."

# Step 1: Set up environment variables locally for the script
echo "Creating local .env file for keyvault initialization..."

cat > .env << EOF
NODE_ENV=development
MONGODB_URI=mongodb+srv://kavin11205_db_user:<db_password>@pollenusers.rurttir.mongodb.net/?retryWrites=true&w=majority&appName=pollenusers
MONGODB_DB_NAME=paypollen
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=YOUR_KMS_KEY_ID
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
EOF

echo "⚠️  IMPORTANT: Update .env with your actual AWS credentials before running keyvault:init"
echo ""
echo "Steps to complete MongoDB encryption setup:"
echo "1. Update .env file with your AWS credentials"
echo "2. Run: cd apps/api && npm run keyvault:init"
echo "3. Copy the generated Data Key ID"
echo "4. Update apps/api/src/db/schemaMap.ts with the Data Key ID"
echo "5. Delete the .env file for security"
