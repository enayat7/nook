import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../../env/.env') });

const uriConfigPath = path.join(__dirname, '../../env/.uri.config.json');
const uriConfig = JSON.parse(fs.readFileSync(uriConfigPath, 'utf8'));

const env = process.env.NODE_ENV || 'development';

// Build MongoDB URI from environment variables or use direct URI
const buildMongoURI = (): string => {
  // If MONGO_URI is provided, use it directly
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }
  
  // Build URI from individual components
  const host = process.env.MONGO_HOST || 'localhost';
  const port = process.env.MONGO_PORT || '27017';
  const database = process.env.MONGO_DATABASE || 'dating-app';
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  
  if (username && password) {
    return `mongodb://${username}:${password}@${host}:${port}/${database}`;
  }
  
  return `mongodb://${host}:${port}/${database}`;
};

export const config = {
  env,
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Database
  database: {
    uri: buildMongoURI(),
    options: uriConfig[env]?.mongodb?.options || {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
  },
  
  // JWT configuration removed
  
  // Bcrypt
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10)
  },
  
  // Email
  email: {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  },
  
  sentry: {
    enabled: process.env.SENTRY_ENABLED === 'true',
    dsn: process.env.SENTRY_DSN
  }
};