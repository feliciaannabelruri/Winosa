const express = require('express');
const router = express.Router();
const { 
  getSubscriptions, 
  getSubscriptionById 
} = require('../controllers/subscriptionController');

router.get('/', getSubscriptions);
router.get('/:id', getSubscriptionById);

module.exports = router;