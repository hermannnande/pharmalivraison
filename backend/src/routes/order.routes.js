const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  assignDelivery,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
  .get(protect, getOrders)
  .post(protect, authorize('client'), createOrder);

router.route('/:id')
  .get(protect, getOrder);

router.put('/:id/assign', protect, authorize('livreur'), assignDelivery);
router.put('/:id/status', protect, authorize('livreur', 'admin'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;








