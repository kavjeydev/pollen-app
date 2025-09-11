#!/bin/bash

echo "🏛️ Updating Plaid template ID in your code..."
echo ""
echo "⚠️  You need to replace 'YOUR_TEMPLATE_ID_HERE' with your actual Plaid template ID"
echo "📋 Your template ID should look like: idvtmp_4FrXJvfQU3zGUR"
echo ""

read -p "Enter your Plaid template ID (starts with idvtmp_): " TEMPLATE_ID

if [[ $TEMPLATE_ID == idvtmp_* ]]; then
    echo "✅ Valid template ID format"

    # Update the Plaid integration file
    sed -i.bak "s/YOUR_TEMPLATE_ID_HERE/$TEMPLATE_ID/g" apps/api/src/kyc/plaid.ts

    echo "✅ Updated apps/api/src/kyc/plaid.ts with your template ID"
    echo "🔄 You'll need to rebuild and redeploy to Railway"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run build"
    echo "2. Run: railway up"
    echo "3. Test your KYC flow"
else
    echo "❌ Invalid template ID format. Should start with 'idvtmp_'"
    exit 1
fi
