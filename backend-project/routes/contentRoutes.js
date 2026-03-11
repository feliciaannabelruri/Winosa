const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/admin/adminContentController');

router.get('/team',  ctrl.getTeam);
router.get('/glass', ctrl.getGlass);

module.exports = router;