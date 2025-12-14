const express = require('express');
const router = express.Router();
const {
  createPharmacy,
  getPharmacies,
  getPharmacy,
  updatePharmacy,
  getOpenPharmacies
} = require('../controllers/pharmacy.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
  .get(getPharmacies)
  .post(protect, authorize('pharmacie', 'admin'), createPharmacy);

router.get('/open/now', getOpenPharmacies);

router.route('/:id')
  .get(getPharmacy)
  .put(protect, authorize('pharmacie', 'admin'), updatePharmacy);

module.exports = router;








