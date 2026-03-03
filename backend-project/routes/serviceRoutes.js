const express = require('express');
const router = express.Router();
const { getServices, getServiceBySlug } = require('../controllers/serviceController');
const { cache } = require('../middleware/cache');

router.get('/',      cache(300, 'services'), getServices);
router.get('/:slug', cache(300, 'services'), getServiceBySlug);

module.exports = router;