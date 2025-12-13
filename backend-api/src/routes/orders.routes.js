const express = require('express');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    console.log('📥 [BACKEND] Création de commande:', req.body);
    
    // Générer un vrai numéro de commande séquentiel
    const orderCount = await Order.countDocuments();
    const orderNumber = `#ORD-${String(orderCount + 1).padStart(5, '0')}`;
    
    const order = await Order.create({
      ...req.body,
      orderNumber,
      client: req.user.id,
      status: 'pending'
    });

    console.log('✅ [BACKEND] Commande créée:', orderNumber);

    // Populer les informations du client
    await order.populate('client', 'firstName lastName phone avatar');

    // Émettre l'événement Socket.IO pour notifier les livreurs
    const io = req.app.get('io');
    if (io) {
      console.log('📡 [BACKEND] Émission événement Socket.IO: new:order');
      io.emit('new:order', {
        id: order._id,
        orderNumber: order.orderNumber,
        orderType: order.orderType,
        medicationList: order.medicationList,
        symptoms: order.symptoms,
        notes: order.notes,
        client: order.client,
        pharmacyId: order.pharmacyId,
        deliveryAddress: order.deliveryAddress,
        deliveryLocation: order.deliveryLocation,
        pharmacyLocation: order.pharmacyLocation,
        status: order.status,
        createdAt: order.createdAt
      });
    } else {
      console.warn('⚠️ [BACKEND] Socket.IO non disponible');
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('❌ [BACKEND] Erreur création commande:', error);
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



