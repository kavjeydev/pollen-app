# MongoDB Infrastructure

## Setup

### MongoDB Atlas Configuration

1. **Create MongoDB Atlas Cluster**
   - Use your existing connection string: `mongodb+srv://kavin11205_db_user:<db_password>@pollenusers.rurttir.mongodb.net/?retryWrites=true&w=majority&appName=pollenusers`
   - Database name: `paypollen`

2. **Network Security**
   - Configure IP allowlist for production servers
   - Use PrivateLink for enhanced security (optional)

3. **Database Users**
   - Application user: `kavin11205_db_user` (read/write access)
   - Admin user: Create separate admin user for maintenance

### Client-Side Field Level Encryption (CSFLE) Setup

1. **AWS KMS Configuration**
   - Create Customer Master Key (CMK) in AWS KMS
   - Set up IAM role with KMS permissions
   - Configure region: `us-east-1`

2. **Key Vault Initialization**

   ```bash
   cd apps/api
   npm run keyvault:init
   ```

3. **Update Schema Map**
   - Replace `DATA_KEY_ID_PLACEHOLDER` in `src/db/schemaMap.ts` with actual data key ID

### Collections

- `users` - User profiles with encrypted PII
- `kyc_sessions` - KYC verification sessions
- `financial_accounts` - Bank account info (encrypted)
- `__keyVault` - Encryption keys (CSFLE)

### Indexes

```javascript
// Users collection
db.users.createIndex({ stytch_user_id: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// KYC sessions
db.kyc_sessions.createIndex({ user_id: 1 });
db.kyc_sessions.createIndex({ idv_id: 1 }, { unique: true });
db.kyc_sessions.createIndex({ status: 1 });

// Key vault
db.__keyVault.createIndex(
  { keyAltNames: 1 },
  { unique: true, partialFilterExpression: { keyAltNames: { $exists: true } } },
);
```

### Monitoring

- Enable MongoDB monitoring in Atlas
- Set up alerts for:
  - High CPU usage
  - High connection count
  - Slow queries
  - Index usage
