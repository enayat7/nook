import { config } from '../../config';

let Sentry: any = null;

if (config.sentry.enabled && config.sentry.dsn) {
  Sentry = require('@sentry/node');
}

export const captureException = (error: Error, context?: any) => {
  if (Sentry) {
    if (context) {
      Sentry.withScope((scope: any) => {
        scope.setContext('additional', context);
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (Sentry) {
    Sentry.captureMessage(message, level);
  }
};