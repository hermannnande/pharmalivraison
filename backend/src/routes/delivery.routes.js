const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

// @desc    Mettre à jour la disponibilité du livreur
// @route   PUT /api/deliveries/availability
// @access  Private (Livreur)
router.put('/availability', protect, authorize('livreur'), async (req, res) => {
  try {
    const { disponible } = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      { 'livreurInfo.disponible': disponible },
      { new: true }
    );

    res.json({
      success: true,
      message: `Disponibilité mise à jour: ${disponible ? 'disponible' : 'indisponible'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
});

// @desc    Obtenir les livreurs disponibles
// @route   GET /api/deliveries/available
// @access  Private (Admin)
router.get('/available', protect, authorize('admin'), async (req, res) => {
  try {
    const livreurs = await User.find({
      role: 'livreur',
      'livreurInfo.disponible': true,
      actif: true
    }).select('-motDePasse');

    res.json({
      success: true,
      count: livreurs.length,
      data: livreurs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération',
      error: error.message
    });
  }
});

module.exports = router;








