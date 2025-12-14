const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Routes utilisateur basiques
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;








