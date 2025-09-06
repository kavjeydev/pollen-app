#!/bin/bash

echo "🔍 Testing AWS KMS Key Setup..."
echo ""
echo "⚠️  First, set your AWS credentials:"
echo "export AWS_ACCESS_KEY_ID=your-access-key"
echo "export AWS_SECRET_ACCESS_KEY=your-secret-key"
echo "export AWS_DEFAULT_REGION=us-east-1"
echo ""

read -p "Have you set your AWS credentials as environment variables? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set your AWS credentials first:"
    echo "export AWS_ACCESS_KEY_ID=your-actual-key"
    echo "export AWS_SECRET_ACCESS_KEY=your-actual-secret"
    echo "export AWS_DEFAULT_REGION=us-east-1"
    exit 1
fi

# Test KMS key access
echo "🔧 Testing KMS key access..."
KMS_KEY_ID="arn:aws:kms:us-east-1:123456789012:key/YOUR-KEY-ID-HERE"

echo "⚠️  Update KMS_KEY_ID in this script with your actual key ARN!"
read -p "Have you updated the KMS_KEY_ID above? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please update KMS_KEY_ID with your actual key ARN"
    exit 1
fi

# Test key describe (this verifies permissions)
echo "🔍 Testing key access..."
aws kms describe-key --key-id "$KMS_KEY_ID"

if [ $? -eq 0 ]; then
    echo "✅ KMS key is accessible! Your setup is correct."
else
    echo "❌ KMS key access failed. Check your credentials and key ID."
fi
