const express = require('express');
const router = express.Router();
const {
  createService,
  updateService,
  deleteService,
  getAllServices
} = require('../../controllers/admin/adminServiceController');
const { protect, admin } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createServiceSchema, updateServiceSchema } = require('../../validators/serviceValidator');

// All routes are protected and admin only
router.use(protect);
router.use(admin);

// GET tidak perlu validation
router.get('/', getAllServices);

// POST dan PUT pakai validation
router.post('/', validate(createServiceSchema), createService);

router.route('/:id')
  .put(validate(updateServiceSchema), updateService)
  .delete(deleteService);

module.exports = router;