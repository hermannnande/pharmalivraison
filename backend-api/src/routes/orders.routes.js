const express = require('express');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const orderNumber = 'CMD' + Date.now().toString().slice(-6);
    
    const order = await Order.create({
      ...req.body,
      orderNumber,
      client: req.user.id
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};
    
    if (role === 'client') {
      query.client = req.user.id;
    } else if (role === 'livreur') {
      query.livreur = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('client', 'firstName lastName phone')
      .populate('livreur', 'firstName lastName phone')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/orders/:id/status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/orders/:id/assign
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { livreurId } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { livreur: livreurId, status: 'assigned' },
      { new: true }
    );

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


