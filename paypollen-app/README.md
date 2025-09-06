# PayPollen Application

A secure fintech application built with Next.js frontend and Express.js backend, featuring client-side field-level encryption, Stytch authentication, and Plaid KYC integration.

## 🏗️ Architecture

```
paypollen-app/
├─ apps/
│  ├─ web/                    # Next.js frontend (app.paypollen.com)
│  └─ api/                    # Express.js backend (api.paypollen.com)
├─ packages/
│  ├─ shared-types/           # Shared TypeScript types
│  └─ ui/                     # Shared UI components (future)
├─ infra/                     # Infrastructure documentation
│  ├─ mongodb/                # MongoDB Atlas & CSFLE setup
│  ├─ kms/                    # AWS KMS configuration
│  └─ stytch-plaid/           # Auth & KYC integration docs
└─ docker/                    # Docker configurations (future)
```

## 🔐 Security Features

- **Client-Side Field Level Encryption (CSFLE)** with AWS KMS
- **PII Data Protection** with MongoDB encryption
- **Authentication** via Stytch magic links
- **KYC Verification** through Plaid Identity Verification
- **Rate Limiting** and DDoS protection
- **Cloudflare Turnstile** for bot protection
- **Comprehensive Audit Logging**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- AWS account (for KMS)
- Stytch account
- Plaid account

### 1. Clone and Install

```bash
git clone <your-repo>
cd paypollen-app
npm install
```

### 2. Environment Setup

```bash
# Root level
cp .env.example .env

# API
cp apps/api/.env.example apps/api/.env

# Web
cp apps/web/.env.local.example apps/web/.env.local
```

### 3. Configure Services

1. **MongoDB**: Update connection string in `.env`
2. **AWS KMS**: Create CMK and update KMS configuration
3. **Stytch**: Set up project and add credentials
4. **Plaid**: Configure IDV template and webhooks

### 4. Initialize Encryption

```bash
cd apps/api
npm run keyvault:init
# Copy the generated data key ID to schemaMap.ts
```

### 5. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:api    # Backend on :3001
npm run dev:web    # Frontend on :3000
```

## 📋 Available Scripts

### Root Level

- `npm run dev` - Start both apps in development
- `npm run build` - Build both apps for production
- `npm run start` - Start both apps in production
- `npm run test` - Run all tests

### API (`apps/api`)

- `npm run dev` - Start with nodemon
- `npm run build` - TypeScript compilation
- `npm run start` - Start production server
- `npm run test` - Run Jest tests
- `npm run keyvault:init` - Initialize MongoDB key vault

### Web (`apps/web`)

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🗄️ Database Schema

### Collections

#### `users`

```javascript
{
  _id: ObjectId,
  stytch_user_id: String,
  email: String (encrypted),
  phone: String (encrypted),
  ssn: String (encrypted),
  address: {
    street: String (encrypted),
    city: String (encrypted),
    state: String (encrypted),
    zipCode: String (encrypted)
  },
  kyc_status: String,
  kyc_approved_at: Date,
  created_at: Date,
  updated_at: Date
}
```

#### `kyc_sessions`

```javascript
{
  _id: ObjectId,
  user_id: String,
  idv_id: String,
  shareable_url: String,
  status: String,
  plaid_data: Object,
  webhook_history: Array,
  created_at: Date,
  updated_at: Date,
  webhook_received_at: Date
}
```

#### `__keyVault` (CSFLE)

```javascript
{
  _id: ObjectId,
  keyMaterial: BinData,
  creationDate: Date,
  updateDate: Date,
  status: Number,
  keyAltNames: Array
}
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - Send magic link
- `POST /api/auth/callback` - Authenticate magic link
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### KYC

- `POST /api/kyc/start` - Start KYC process
- `GET /api/kyc/status` - Get KYC status
- `POST /api/kyc/retry` - Retry failed KYC

### PII (Admin/Audit)

- `GET /api/pii/:userId` - Get user PII (requires step-up)
- `PUT /api/pii/:userId` - Update user PII
- `DELETE /api/pii/:userId` - Delete user PII (GDPR)

### Webhooks

- `POST /webhooks/plaid/idv` - Plaid IDV webhook

## 🧪 Testing

```bash
# Run all tests
npm test

# Run API tests only
cd apps/api && npm test

# Run with coverage
cd apps/api && npm run test:coverage
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   - Update all `.env` files with production values
   - Use secure secrets management (AWS Secrets Manager, etc.)

2. **Database**
   - Configure MongoDB Atlas production cluster
   - Set up IP allowlisting
   - Enable monitoring and alerts

3. **Security**
   - Configure CORS for production domains
   - Set up rate limiting
   - Enable HTTPS only

### Docker Deployment (Future)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d
```

## 📊 Monitoring

- **Application Logs**: Winston logging with structured JSON
- **Database Monitoring**: MongoDB Atlas monitoring
- **Error Tracking**: Configure error tracking service
- **Performance**: Monitor API response times
- **Security**: Audit logs for PII access

## 🔒 Security Checklist

- [ ] All PII fields encrypted with CSFLE
- [ ] AWS KMS keys properly configured
- [ ] Rate limiting enabled on all endpoints
- [ ] HTTPS enforced in production
- [ ] CORS configured for production domains
- [ ] Webhook signatures verified
- [ ] Session tokens validated on all protected routes
- [ ] Audit logging enabled for sensitive operations
- [ ] Regular security updates applied

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Follow security best practices
5. Test with encrypted data flows

## 📄 License

Private - PayPollen Internal Use Only

## 🆘 Support

For technical issues:

1. Check the logs: `apps/api/logs/`
2. Verify environment variables
3. Test database connectivity
4. Check service status (Stytch, Plaid, MongoDB)

For production issues:

1. Check monitoring dashboards
2. Review error tracking
3. Validate webhook deliveries
4. Check rate limiting metrics
