const axios = require("axios");
const Blog = require("../models/Blog");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * Fetch published blogs from DB and send to ML service for training.
 * Called by POST /api/ml/train (admin route).
 */
async function trainML() {
  const blogs = await Blog.find({ isPublished: true })
    .select("title slug excerpt image author tags views readTime createdAt")
    .lean();

  if (!blogs || blogs.length < 2) {
    return {
      success: false,
      error: `Not enough published blogs to train (found ${blogs?.length || 0}, need at least 2)`
    };
  }

  const res = await axios.post(`${ML_SERVICE_URL}/train`, { blogs }, {
    timeout: 60000
  });

  return res.data;
}

/**
 * Get ML service health/stats.
 */
async function getMLStats() {
  const res = await axios.get(`${ML_SERVICE_URL}/stats`, { timeout: 5000 });
  return res.data;
}

module.exports = { trainML, getMLStats };