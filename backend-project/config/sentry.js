/**
 * sentry.js — Sentry error tracking setup
 * 
 * INSTALL: npm install @sentry/node @sentry/profiling-node
 * 
 * USAGE: Import this BEFORE everything else in server.js:
 *   require('./config/sentry');   // must be first line after dotenv
 */

const Sentry = require('@sentry/node');

const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    console.log('ℹ️  Sentry DSN not set — skipping Sentry init');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Only enable in production & staging
    enabled: ['production', 'staging'].includes(process.env.NODE_ENV),
    
    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Ignore common noise
    ignoreErrors: [
      'Not authorized',
      'Resource not found',
      'CastError',
    ],

    beforeSend(event, hint) {
      const err = hint.originalException;
      // Don't send 4xx errors to Sentry (user errors, not our bugs)
      if (err && err.statusCode && err.statusCode < 500) {
        return null;
      }
      return event;
    },
  });

  console.log('✅ Sentry initialized');
};

/**
 * Express error handler — place AFTER all routes in server.js:
 * 
 *   app.use(Sentry.Handlers.errorHandler());
 *   app.use(errorHandler);  // your existing handler
 */
const sentryRequestHandler = () => {
  if (!process.env.SENTRY_DSN) return (req, res, next) => next();
  return Sentry.Handlers.requestHandler();
};

const sentryErrorHandler = () => {
  if (!process.env.SENTRY_DSN) return (err, req, res, next) => next(err);
  return Sentry.Handlers.errorHandler();
};

module.exports = { initSentry, sentryRequestHandler, sentryErrorHandler };
