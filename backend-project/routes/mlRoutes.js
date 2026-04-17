const express = require("express");
const router = express.Router();
const { trainML, getMLStats } = require("../services/mlService");
const { protect, admin } = require("../middleware/auth");

/**
 * POST /api/ml/train
 * Admin-only: manually trigger ML retraining with latest blog data.
 */
router.post("/train", protect, admin, async (req, res) => {
  try {
    const result = await trainML();
    res.json(result);
  } catch (err) {
    console.error("ML training error:", err.message);
    res.status(500).json({
      success: false,
      error: `ML training failed: ${err.message}`
    });
  }
});

/**
 * GET /api/ml/stats
 * Admin-only: get ML service training status and stats.
 */
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const stats = await getMLStats();
    res.json(stats);
  } catch (err) {
    res.status(503).json({
      success: false,
      error: `ML service unavailable: ${err.message}`
    });
  }
});

module.exports = router;