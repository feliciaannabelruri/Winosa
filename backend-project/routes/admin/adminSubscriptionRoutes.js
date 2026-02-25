const express = require('express');
const router = express.Router();
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require('../../controllers/admin/adminSubscriptionController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/', getAllSubscriptions);
router.post('/', createSubscription);

router.route('/:id')
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);

module.exports = router;