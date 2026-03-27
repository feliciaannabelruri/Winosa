const express = require('express');
const router = express.Router();
const { getSettings } = require('../controllers/admin/adminSettingsController');

router.get('/', getSettings);

module.exports = router;