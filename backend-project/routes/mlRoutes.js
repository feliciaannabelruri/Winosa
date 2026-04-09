const express = require("express");
const router = express.Router();
const { trainML } = require("../services/mlService");

router.post("/train", async (req, res) => {
  try {
    const result = await trainML();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ML training failed" });
  }
});

module.exports = router;