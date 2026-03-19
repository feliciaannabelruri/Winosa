const express = require('express');
const router = express.Router();
const {
  createService,
  updateService,
  deleteService,
  getAllServices,
  getServiceById,
} = require('../../controllers/admin/adminServiceController');
const { protect, admin } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createServiceSchema, updateServiceSchema } = require('../../validators/serviceValidator');

router.use(protect);
router.use(admin);

router.get('/', getAllServices);

router.post('/', validate(createServiceSchema), createService);

router.route('/:id')
  .get(getServiceById)
  .put(validate(updateServiceSchema), updateService)
  .delete(deleteService);

module.exports = router;