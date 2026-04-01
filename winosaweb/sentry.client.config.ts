import * as Sentry from "@sentry/nextjs";

console.log("SENTRY CLIENT INIT");

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1.0,

  replaysOnErrorSampleRate: 1.0,
});