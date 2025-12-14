const express = require('express');
const Delivery = require('../models/Delivery');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @route GET /api/deliveries (livreur)
router.get('/', auth, checkRole('livreur'), async (req, res) => {
  try {
    const deliveries = await Delivery.find({ livreur: req.user.id })
      .populate('order')
      .sort('-createdAt');

    res.json({ success: true, deliveries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/deliveries/:id/location
router.put('/:id/location', auth, checkRole('livreur'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { 
        currentLocation: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      },
      { new: true }
    );

    // Émettre via Socket.IO
    req.io.emit(`delivery:${delivery.order}:location`, { lat, lng });

    res.json({ success: true, delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/deliveries/:id/status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    req.io.emit(`delivery:${delivery.order}:status`, { status });

    res.json({ success: true, delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;





