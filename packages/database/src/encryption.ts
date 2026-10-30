import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Encrypts sensitive secrets (e.g. test passwords, API tokens) at rest using AES-256-GCM.
 */
export function encryptSecret(plainText: string, hexKey: string): string {
  if (!hexKey || hexKey.length !== 64) {
    throw new Error('Encryption key must be a 32-byte hexadecimal string (64 characters).');
  }
  const key = Buffer.from(hexKey, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encryptedPayload
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts encrypted credentials.
 */
export function decryptSecret(cipherText: string, hexKey: string): string {
  if (!hexKey || hexKey.length !== 64) {
    throw new Error('Encryption key must be a 32-byte hexadecimal string (64 characters).');
  }
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid cipherText format for AES-256-GCM.');
  }

  const [ivHex, authTagHex, encryptedData] = parts;
  const key = Buffer.from(hexKey, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
