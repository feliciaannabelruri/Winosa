/**
 * mlTrigger.js — Auto-retrain ML model setelah blog berubah
 * 
 * CARA PAKAI: tambahkan ke adminBlogController.js
 * 
 * Di createBlog, updateBlog, deleteBlog — setelah cache.invalidatePrefix(CACHE_PREFIX):
 *   triggerMLRetrain().catch(e => console.warn('ML retrain skipped:', e.message));
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const ML_RETRAIN_DELAY_MS = 5000; // tunggu 5 detik agar DB sudah update

let retrainTimer = null;

/**
 * Trigger ML retrain dengan debounce (5 detik).
 * Kalau ada banyak blog diupdate berurutan, hanya 1 retrain yang jalan.
 */
const triggerMLRetrain = () => {
  return new Promise((resolve) => {
    if (retrainTimer) {
      clearTimeout(retrainTimer);
    }
    retrainTimer = setTimeout(async () => {
      retrainTimer = null;
      try {
        const response = await fetch(`${ML_SERVICE_URL}/train`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(30000), // timeout 30 detik
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ML retrain triggered — MAE: ${data.mae}`);
        } else {
          console.warn(`⚠️  ML retrain returned ${response.status}`);
        }
      } catch (error) {
        // ML service mungkin tidak jalan — tidak apa-apa, tidak crash backend
        console.warn(`⚠️  ML service unavailable: ${error.message}`);
      }
      resolve();
    }, ML_RETRAIN_DELAY_MS);
  });
};

/**
 * Event tracking middleware — catat klik blog untuk data ML
 * 
 * CARA PAKAI: pasang di blogRoutes.js sebelum getBlogBySlug:
 *   router.get('/:slug', trackBlogView, getBlogBySlug);
 */
const trackBlogView = async (req, res, next) => {
  // Fire-and-forget: tidak block request
  // Data dikirim ke ML service untuk future training improvement
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const referer   = req.headers['referer']    || '';

  // Hanya track real users, bukan bots
  const isBot = /bot|crawler|spider|scraper/i.test(userAgent);
  if (!isBot) {
    fetch(`${ML_SERVICE_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, referer, timestamp: new Date().toISOString() }),
      signal: AbortSignal.timeout(2000),
    }).catch(() => {}); // silently ignore
  }

  next();
};

module.exports = { triggerMLRetrain, trackBlogView };
