const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../../controllers/admin/adminSettingsController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;