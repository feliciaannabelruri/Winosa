const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const ML_RETRAIN_DELAY_MS = 5000;

let retrainTimer = null;

const triggerMLRetrain = () => {
  return new Promise((resolve) => {
    if (retrainTimer) clearTimeout(retrainTimer);

    retrainTimer = setTimeout(async () => {
      retrainTimer = null;
      try {
        const response = await fetch(`${ML_SERVICE_URL}/train`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(30000),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ML retrain triggered — MAE: ${data.mae}`);
        } else {
          console.warn(`⚠️  ML retrain returned ${response.status}`);
        }
      } catch (error) {
        console.warn(`⚠️  ML service unavailable: ${error.message}`);
      }
      resolve();
    }, ML_RETRAIN_DELAY_MS);
  });
};

const trackBlogView = async (req, res, next) => {
  next();
};

module.exports = { triggerMLRetrain, trackBlogView };