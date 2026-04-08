/**
 * mlTrigger.js — Auto-retrain ML model setelah blog berubah
 * ==========================================================
 * Sebelumnya: fetch ke http://localhost:5001/train
 * Sekarang  : panggil model.train() langsung (in-process)
 *
 * CARA PAKAI: sama seperti sebelumnya
 *   triggerMLRetrain().catch(e => console.warn('ML retrain skipped:', e.message));
 */

const model = require('../services/mlRecommendation');

const BACKEND_API_URL = process.env.ML_BACKEND_API_URL
  || `http://localhost:${process.env.PORT || 5000}/api`;

const ML_RETRAIN_DELAY_MS = 5000;

let retrainTimer = null;

async function fetchBlogs() {
  try {
    const res = await fetch(`${BACKEND_API_URL}/blog?limit=100`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.warn(`⚠️  fetchBlogs gagal: ${e.message}`);
    return [];
  }
}

/**
 * Trigger ML retrain dengan debounce 5 detik.
 * Kalau ada banyak blog diupdate berurutan, hanya 1 retrain yang jalan.
 */
const triggerMLRetrain = () => {
  return new Promise((resolve) => {
    if (retrainTimer) clearTimeout(retrainTimer);

    retrainTimer = setTimeout(async () => {
      retrainTimer = null;
      try {
        const blogs = await fetchBlogs();
        if (!blogs.length) {
          console.warn('⚠️  ML retrain skipped: no blogs found');
          return resolve();
        }
        const result = await model.train(blogs);
        if (result.success) {
          console.log(`✅ ML retrain done — MAE: ${result.mae}`);
        } else {
          console.warn(`⚠️  ML retrain failed: ${result.error}`);
        }
      } catch (e) {
        console.warn(`⚠️  ML retrain error: ${e.message}`);
      }
      resolve();
    }, ML_RETRAIN_DELAY_MS);
  });
};

/**
 * Event tracking middleware — catat klik blog
 * Pasang di blogRoutes.js: router.get('/:slug', trackBlogView, getBlogBySlug)
 */
const trackBlogView = async (req, res, next) => {
  // Fire-and-forget, tidak block request
  next();
};

module.exports = { triggerMLRetrain, trackBlogView };