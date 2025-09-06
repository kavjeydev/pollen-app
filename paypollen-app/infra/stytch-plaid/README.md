# Stytch & Plaid Integration

## Stytch Authentication Setup

### 1. Stytch Project Configuration

- **Project Type**: Consumer
- **Authentication Methods**:
  - Email Magic Links
  - SMS (optional)
  - OAuth (optional)

### 2. Redirect URLs

Add these URLs in your Stytch dashboard:

**Development:**

- `http://localhost:3000/auth/callback`

**Production:**

- `https://app.paypollen.com/auth/callback`

### 3. Webhook Endpoints

Configure webhooks for:

- User creation: `https://api.paypollen.com/webhooks/stytch/user`
- Session events: `https://api.paypollen.com/webhooks/stytch/session`

## Plaid Identity Verification Setup

### 1. Plaid Dashboard Configuration

- **Product**: Identity Verification
- **Environment**:
  - Development: `sandbox`
  - Production: `production`

### 2. IDV Template Configuration

Create an IDV template with:

- Document verification
- Selfie verification
- KYC checks
- Risk assessment

### 3. Webhook Configuration

**Webhook URL:**

- Development: `http://localhost:3001/webhooks/plaid/idv`
- Production: `https://api.paypollen.com/webhooks/plaid/idv`

**Webhook Events:**

- `IDENTITY_VERIFICATION.APPROVED`
- `IDENTITY_VERIFICATION.REJECTED`
- `IDENTITY_VERIFICATION.REQUIRES_RETRY`
- `IDENTITY_VERIFICATION.FAILED`
- `IDENTITY_VERIFICATION.CANCELED`

### 4. Environment Variables

```bash
# Stytch
STYTCH_PROJECT_ID=project-test-xxx
STYTCH_SECRET=secret-test-xxx
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=public-token-test-xxx

# Plaid
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret-key
PLAID_ENV=sandbox
```

## Integration Flow

### Authentication Flow

1. User enters email on login page
2. Frontend calls `/api/auth/login`
3. Backend creates Stytch magic link
4. User clicks link in email
5. Frontend calls `/api/auth/callback` with token
6. Backend validates token and returns session

### KYC Flow

1. Authenticated user starts KYC: `/api/kyc/start`
2. Backend creates Plaid IDV session
3. User completes verification on Plaid's hosted flow
4. Plaid sends webhook to `/webhooks/plaid/idv`
5. Backend updates user's KYC status
6. Frontend polls `/api/kyc/status` for updates

## Security Considerations

1. **Token Validation**: Always validate tokens server-side
2. **Session Management**: Use secure session tokens
3. **Webhook Verification**: Verify webhook signatures
4. **Rate Limiting**: Implement rate limits on auth endpoints
5. **HTTPS Only**: Use HTTPS in production
6. **CORS**: Configure CORS properly for your domains
