const Blog = require('../models/Blog');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const ML_RETRAIN_DELAY_MS = 5000;

let retrainTimer = null;

/**
 * Trigger ML service to retrain with latest published blog data.
 * Debounced: waits 5s after last call before actually retraining.
 * Sends blog data in request body so ML doesn't need to call back.
 */
const triggerMLRetrain = () => {
  return new Promise((resolve) => {
    if (retrainTimer) clearTimeout(retrainTimer);

    retrainTimer = setTimeout(async () => {
      retrainTimer = null;
      try {
        // Fetch published blogs from DB to send to ML service
        const blogs = await Blog.find({ isPublished: true })
          .select('title slug excerpt image author tags views readTime createdAt')
          .lean();

        if (!blogs || blogs.length < 2) {
          console.log(`ML retrain skipped — not enough blogs (${blogs?.length || 0} found, need at least 2)`);
          resolve();
          return;
        }

        const response = await fetch(`${ML_SERVICE_URL}/train`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blogs }),
          signal: AbortSignal.timeout(30000),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`ML retrain complete — MAE: ${data.mae}, blogs: ${data.total_blogs}`);
        } else {
          const errText = await response.text().catch(() => '');
          console.warn(`ML retrain returned ${response.status}: ${errText}`);
        }
      } catch (error) {
        console.warn(`ML service unavailable: ${error.message}`);
      }
      resolve();
    }, ML_RETRAIN_DELAY_MS);
  });
};

/**
 * Run ML training at server startup (non-blocking).
 * Waits 10s for DB to be fully connected before attempting.
 */
const triggerMLRetrainOnStartup = () => {
  setTimeout(async () => {
    try {
      const blogs = await Blog.find({ isPublished: true })
        .select('title slug excerpt image author tags views readTime createdAt')
        .lean();

      if (!blogs || blogs.length < 2) {
        console.log(`ML startup training skipped — not enough blogs (${blogs?.length || 0})`);
        return;
      }

      console.log(`Triggering ML startup training with ${blogs.length} blogs...`);

      const response = await fetch(`${ML_SERVICE_URL}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogs }),
        signal: AbortSignal.timeout(60000), // longer timeout for startup
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`ML startup training done — MAE: ${data.mae}, blogs: ${data.total_blogs}`);
      } else {
        console.warn(`ML startup training returned ${response.status}`);
      }
    } catch (error) {
      console.warn(`ML startup training failed: ${error.message} (ML service may not be running)`);
    }
  }, 10000); // wait 10s after server start
};

const trackBlogView = async (req, res, next) => {
  next();
};

module.exports = { triggerMLRetrain, triggerMLRetrainOnStartup, trackBlogView };