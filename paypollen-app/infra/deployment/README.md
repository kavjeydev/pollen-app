# PayPollen API Deployment Guide

## 🚀 Quick Start Deployments

### 1. Railway (Recommended for MVP)

**Why Railway?**

- Zero-config deployments
- Built-in environment variables
- Automatic HTTPS
- Database integration
- Free tier available

**Steps:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd paypollen-app
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set STYTCH_SECRET="your-stytch-secret"
railway variables set PLAID_SECRET="your-plaid-secret"
railway variables set AWS_KMS_KEY_ID="your-kms-key-id"
railway variables set JWT_SECRET="your-jwt-secret"

# Deploy
railway up
```

**Custom Domain:**

- Go to Railway dashboard
- Add custom domain: `api.paypollen.com`
- Update CORS_ORIGINS to include your domain

---

### 2. Vercel (Serverless)

**Why Vercel?**

- Same platform as your frontend
- Serverless scaling
- Global edge network
- Easy integration

**Steps:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd paypollen-app
vercel

# Set environment variables
vercel env add NODE_ENV production
vercel env add MONGODB_URI
vercel env add STYTCH_SECRET
vercel env add PLAID_SECRET
# ... add all other env vars

# Deploy to production
vercel --prod
```

**Note:** Your API will be available at `https://your-project.vercel.app`

---

### 3. Digital Ocean App Platform

**Why Digital Ocean?**

- Simple setup
- Predictable pricing
- Good performance
- Managed databases available

**Steps:**

1. Push code to GitHub
2. Go to Digital Ocean Dashboard
3. Create new App
4. Connect GitHub repository
5. Select `apps/api` as source directory
6. Set build command: `npm run build`
7. Set run command: `npm start`
8. Add environment variables
9. Deploy

**Custom Domain:**

- Add domain in DO dashboard
- Point DNS to provided endpoint

---

### 4. AWS ECS Fargate (Production)

**Why AWS ECS?**

- Full control and security
- Integrates with your KMS setup
- Production-grade scaling
- VPC isolation

**Prerequisites:**

- AWS CLI configured
- Docker installed
- ECR repository created

**Steps:**

```bash
# Build and push Docker image
cd paypollen-app
docker build -f docker/Dockerfile.api -t paypollen-api .

# Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com
docker tag paypollen-api:latest ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/paypollen-api:latest
docker push ACCOUNT-ID.dkr.ecr.us-east-1.amazonaws.com/paypollen-api:latest

# Create ECS service
aws ecs create-service --cli-input-json file://infra/aws/ecs-task-definition.json
```

**Security Setup:**

- Store secrets in AWS Secrets Manager
- Use IAM roles for KMS access
- Configure VPC and security groups

---

### 5. Google Cloud Run

**Why Cloud Run?**

- Serverless containers
- Pay-per-request pricing
- Auto-scaling
- Easy deployment

**Steps:**

```bash
# Install gcloud CLI
# Build and deploy
cd paypollen-app
gcloud builds submit --tag gcr.io/PROJECT-ID/paypollen-api

# Deploy to Cloud Run
gcloud run deploy paypollen-api \
  --image gcr.io/PROJECT-ID/paypollen-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001
```

---

## 🔧 Environment Variables Setup

For any deployment, you'll need these environment variables:

### Required Variables

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://kavin11205_db_user:PASSWORD@pollenusers.rurttir.mongodb.net/?retryWrites=true&w=majority&appName=pollenusers
MONGODB_DB_NAME=paypollen

# AWS KMS
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=your-kms-key-id
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Stytch
STYTCH_PROJECT_ID=your-project-id
STYTCH_SECRET=your-secret-key
STYTCH_PUBLIC_TOKEN=your-public-token

# Plaid
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret-key
PLAID_ENV=production

# Security
JWT_SECRET=your-super-secure-jwt-secret
TURNSTILE_SECRET_KEY=your-turnstile-secret

# CORS
CORS_ORIGINS=https://app.paypollen.com,https://www.paypollen.com

# URLs
FRONTEND_URL=https://app.paypollen.com
API_URL=https://api.paypollen.com
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] All secrets stored securely (not in code)
- [ ] HTTPS enforced
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Health checks working
- [ ] Database connection encrypted
- [ ] KMS permissions configured
- [ ] Webhook endpoints secured

## 📊 Monitoring Setup

Add these monitoring tools:

1. **Application Monitoring**
   - New Relic / DataDog
   - Error tracking (Sentry)
   - Performance monitoring

2. **Infrastructure Monitoring**
   - Uptime monitoring (Pingdom)
   - Server metrics
   - Database performance

3. **Security Monitoring**
   - Failed authentication attempts
   - Rate limit violations
   - Unusual access patterns

## 🚀 Quick Recommendation

**For getting started quickly:** Use **Railway**

- Easiest setup
- Great for MVP/testing
- Can scale later

**For production at scale:** Use **AWS ECS**

- Better security controls
- Integrates with your KMS
- More configuration options

**For serverless:** Use **Vercel**

- Same platform as frontend
- Automatic scaling
- Global distribution

Choose based on your current needs and team expertise!
