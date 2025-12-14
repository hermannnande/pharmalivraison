const Pharmacy = require('../models/Pharmacy.model');

// @desc    Créer une pharmacie
// @route   POST /api/pharmacies
// @access  Private (Admin/Pharmacie)
exports.createPharmacy = async (req, res) => {
  try {
    const pharmacyData = {
      ...req.body,
      proprietaire: req.user.id
    };

    const pharmacy = await Pharmacy.create(pharmacyData);

    res.status(201).json({
      success: true,
      message: 'Pharmacie créée avec succès',
      data: pharmacy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la pharmacie',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les pharmacies
// @route   GET /api/pharmacies
// @access  Public
exports.getPharmacies = async (req, res) => {
  try {
    const { commune, ouvert24h, deGarde, latitude, longitude, rayon } = req.query;

    let query = { actif: true };

    // Filtre par commune
    if (commune) {
      query.commune = commune;
    }

    // Filtre par pharmacie 24h
    if (ouvert24h === 'true') {
      query.ouvert24h = true;
    }

    // Filtre par pharmacie de garde
    if (deGarde === 'true') {
      query.deGarde = true;
    }

    let pharmacies;

    // Recherche géolocalisée
    if (latitude && longitude) {
      const maxDistance = rayon ? parseInt(rayon) : 5000; // 5km par défaut

      pharmacies = await Pharmacy.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: maxDistance
          }
        }
      }).populate('proprietaire', 'nom prenom telephone');
    } else {
      pharmacies = await Pharmacy.find(query)
        .populate('proprietaire', 'nom prenom telephone')
        .sort({ note: -1 });
    }

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pharmacies',
      error: error.message
    });
  }
};

// @desc    Obtenir une pharmacie par ID
// @route   GET /api/pharmacies/:id
// @access  Public
exports.getPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id)
      .populate('proprietaire', 'nom prenom telephone email');

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacie non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la pharmacie',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une pharmacie
// @route   PUT /api/pharmacies/:id
// @access  Private (Pharmacie/Admin)
exports.updatePharmacy = async (req, res) => {
  try {
    let pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacie non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (pharmacy.proprietaire.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette pharmacie'
      });
    }

    pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Pharmacie mise à jour avec succès',
      data: pharmacy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la pharmacie',
      error: error.message
    });
  }
};

// @desc    Obtenir les pharmacies ouvertes maintenant
// @route   GET /api/pharmacies/open/now
// @access  Public
exports.getOpenPharmacies = async (req, res) => {
  try {
    const { latitude, longitude, rayon } = req.query;

    // Pharmacies 24h et de garde sont toujours ouvertes
    let query = {
      actif: true,
      $or: [
        { ouvert24h: true },
        { deGarde: true }
      ]
    };

    let pharmacies;

    if (latitude && longitude) {
      const maxDistance = rayon ? parseInt(rayon) : 10000; // 10km par défaut

      pharmacies = await Pharmacy.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: maxDistance
          }
        }
      }).populate('proprietaire', 'nom prenom telephone');
    } else {
      pharmacies = await Pharmacy.find(query)
        .populate('proprietaire', 'nom prenom telephone')
        .sort({ note: -1 });
    }

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pharmacies ouvertes',
      error: error.message
    });
  }
};








