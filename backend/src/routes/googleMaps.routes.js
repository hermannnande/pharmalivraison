// Routes pour proxy Google Maps API
// Ces routes permettent d'appeler Google Maps API depuis le backend
// pour éviter les problèmes CORS et sécuriser la clé API

const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Vérifier si la clé API est configurée
router.use((req, res, next) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return res.status(500).json({
      error: 'Google Maps API non configurée',
      message: 'Veuillez ajouter GOOGLE_MAPS_API_KEY dans le fichier .env'
    });
  }
  next();
});

/**
 * POST /api/google-maps/pharmacies/search
 * Rechercher les pharmacies à proximité
 */
router.get('/pharmacies/search', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        message: 'lat et lng sont requis'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type: 'pharmacy',
        key: GOOGLE_MAPS_API_KEY,
        language: 'fr' // Résultats en français
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur recherche pharmacies:', error.message);
    res.status(500).json({
      error: 'Erreur lors de la recherche',
      message: error.message
    });
  }
});

/**
 * GET /api/google-maps/pharmacies/details
 * Obtenir les détails d'une pharmacie
 */
router.get('/pharmacies/details', async (req, res) => {
  try {
    const { place_id } = req.query;

    if (!place_id) {
      return res.status(400).json({
        error: 'Paramètre manquant',
        message: 'place_id est requis'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    
    const response = await axios.get(url, {
      params: {
        place_id,
        fields: 'name,formatted_phone_number,opening_hours,website,formatted_address,photos,rating,user_ratings_total',
        key: GOOGLE_MAPS_API_KEY,
        language: 'fr'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur détails pharmacie:', error.message);
    res.status(500).json({
      error: 'Erreur lors de la récupération des détails',
      message: error.message
    });
  }
});

/**
 * GET /api/google-maps/distance
 * Calculer la distance entre deux points
 */
router.get('/distance', async (req, res) => {
  try {
    const { origins, destinations } = req.query;

    if (!origins || !destinations) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        message: 'origins et destinations sont requis'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    
    const response = await axios.get(url, {
      params: {
        origins,
        destinations,
        mode: 'driving',
        key: GOOGLE_MAPS_API_KEY,
        language: 'fr'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur calcul distance:', error.message);
    res.status(500).json({
      error: 'Erreur lors du calcul de distance',
      message: error.message
    });
  }
});

/**
 * GET /api/google-maps/directions
 * Obtenir un itinéraire entre deux points
 */
router.get('/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        message: 'origin et destination sont requis'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json`;
    
    const response = await axios.get(url, {
      params: {
        origin,
        destination,
        mode,
        key: GOOGLE_MAPS_API_KEY,
        language: 'fr'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur itinéraire:', error.message);
    res.status(500).json({
      error: 'Erreur lors de l\'obtention de l\'itinéraire',
      message: error.message
    });
  }
});

/**
 * GET /api/google-maps/geocode
 * Géocoder une adresse ou des coordonnées
 */
router.get('/geocode', async (req, res) => {
  try {
    const { address, latlng } = req.query;

    if (!address && !latlng) {
      return res.status(400).json({
        error: 'Paramètre manquant',
        message: 'address ou latlng est requis'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    
    const params = {
      key: GOOGLE_MAPS_API_KEY,
      language: 'fr'
    };

    if (address) {
      params.address = address;
    } else {
      params.latlng = latlng;
    }

    const response = await axios.get(url, { params });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur géocodage:', error.message);
    res.status(500).json({
      error: 'Erreur lors du géocodage',
      message: error.message
    });
  }
});

/**
 * GET /api/google-maps/photo
 * Obtenir une photo Google Places
 */
router.get('/photo', async (req, res) => {
  try {
    const { photo_reference, maxwidth = 400 } = req.query;

    if (!photo_reference) {
      return res.status(400).json({
        error: 'Paramètre manquant',
        message: 'photo_reference est requis'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/photo`;
    
    const response = await axios.get(url, {
      params: {
        photo_reference,
        maxwidth,
        key: GOOGLE_MAPS_API_KEY
      },
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (error) {
    console.error('Erreur photo:', error.message);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la photo',
      message: error.message
    });
  }
});

module.exports = router;






