/**
 * mlProcess.js — ML lifecycle (versi JS, tidak perlu Python lagi)
 * ================================================================
 * Sebelumnya: spawn Python Flask di port 5001
 * Sekarang  : import mlRecommendation.js langsung, tidak ada subprocess
 *
 * startMLService() → fetch blogs dari backend → train model
 * stopMLService()  → clear model (no-op, tidak ada process)
 */

const model = require('../services/mlRecommendation');

const BACKEND_API_URL = process.env.ML_BACKEND_API_URL
  || `http://localhost:${process.env.PORT || 5000}/api`;

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

const startMLService = async () => {
  console.log('\nStarting ML service (JS native)...');
  const blogs = await fetchBlogs();
  if (!blogs.length) {
    console.warn('Tidak ada blog untuk training — ML akan retrain saat ada request');
    return;
  }
  await model.train(blogs);
};

const stopMLService = () => {
  // Tidak ada process untuk dihentikan
  console.log('ML service stopped (JS native — no subprocess)');
};

module.exports = { startMLService, stopMLService };