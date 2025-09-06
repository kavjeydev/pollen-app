// CSFLE Schema Map for Client-Side Field Level Encryption
// This defines which fields should be encrypted in each collection

export const schemaMap = {
  [`paypollen.users`]: {
    bsonType: "object",
    properties: {
      // PII fields that should be encrypted
      email: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic", // For queries
          keyId: [
            { $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" } },
          ],
        },
      },
      phone: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random", // For security
          keyId: [
            { $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" } },
          ],
        },
      },
      ssn: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          keyId: [
            { $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" } },
          ],
        },
      },
      address: {
        bsonType: "object",
        properties: {
          street: {
            encrypt: {
              bsonType: "string",
              algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
              keyId: [
                {
                  $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" },
                },
              ],
            },
          },
          city: {
            encrypt: {
              bsonType: "string",
              algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
              keyId: [
                {
                  $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" },
                },
              ],
            },
          },
          state: {
            encrypt: {
              bsonType: "string",
              algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
              keyId: [
                {
                  $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" },
                },
              ],
            },
          },
          zipCode: {
            encrypt: {
              bsonType: "string",
              algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
              keyId: [
                {
                  $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" },
                },
              ],
            },
          },
        },
      },
    },
  },
  [`paypollen.financial_accounts`]: {
    bsonType: "object",
    properties: {
      accountNumber: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          keyId: [
            { $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" } },
          ],
        },
      },
      routingNumber: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          keyId: [
            { $binary: { base64: "DATA_KEY_ID_PLACEHOLDER", subType: "04" } },
          ],
        },
      },
    },
  },
};

// Note: Replace 'DATA_KEY_ID_PLACEHOLDER' with actual data key IDs after running keyvault-init.ts
