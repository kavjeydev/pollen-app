# AWS KMS Configuration

## Customer Master Key (CMK) Setup

### 1. Create CMK

```bash
aws kms create-key \
  --description "PayPollen CSFLE Master Key" \
  --key-usage ENCRYPT_DECRYPT \
  --key-spec SYMMETRIC_DEFAULT
```

### 2. Create Key Alias

```bash
aws kms create-alias \
  --alias-name alias/paypollen-csfle \
  --target-key-id <KEY_ID>
```

### 3. Key Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow use of the key for CSFLE",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:role/paypollen-api-role"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```

### 4. IAM Role for API

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:ACCOUNT-ID:key/KEY-ID"
    }
  ]
}
```

## Environment Variables

Add to your `.env`:

```bash
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=arn:aws:kms:us-east-1:ACCOUNT-ID:key/KEY-ID
# Or use alias:
# AWS_KMS_KEY_ID=alias/paypollen-csfle

# For development (use IAM roles in production)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Security Best Practices

1. **Use IAM Roles**: In production, use IAM roles instead of access keys
2. **Least Privilege**: Grant minimum required permissions
3. **Key Rotation**: Enable automatic key rotation
4. **Monitoring**: Set up CloudTrail logging for KMS operations
5. **Multi-Region**: Consider cross-region replication for disaster recovery
