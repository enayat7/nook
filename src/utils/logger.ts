import winston from 'winston';
import { config } from '../../config';

// Initialize Sentry if enabled
if (config.sentry.enabled && config.sentry.dsn) {
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env
  });
}

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'dating-app' },
  transports: [
    new winston.transports.Console({
      format: config.env === 'production' 
        ? logFormat
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    })
  ]
});