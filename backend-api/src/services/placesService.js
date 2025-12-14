// =====================================================
// SERVICE GOOGLE PLACES - PHARMACIES EN TEMPS RÉEL
// =====================================================

const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const ABIDJAN_CENTER = { lat: 5.3600, lng: -4.0083 };
const DEFAULT_SEARCH_RADIUS = 10000; // 10 km par défaut autour d'Abidjan

/**
 * Rechercher les pharmacies autour d'Abidjan via Google Places API
 */
async function getNearbyPharmacies(latitude = ABIDJAN_CENTER.lat, longitude = ABIDJAN_CENTER.lng, radius = DEFAULT_SEARCH_RADIUS) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY non configurée');
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

    let pageToken = null;
    let allResults = [];
    let pageCount = 0;

    do {
      const params = {
        location: `${latitude},${longitude}`,
        radius: radius,
        type: 'pharmacy',
        key: GOOGLE_MAPS_API_KEY,
        language: 'fr',
        pagetoken: pageToken || undefined,
      };

      // Les next_page_token nécessitent ~2s avant d'être valides
      if (pageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log(`🔍 Recherche pharmacies via Google Places API... page ${pageCount + 1}`);
      const response = await axios.get(url, { params });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        console.error('❌ Erreur Google Places:', response.data.status);
        break;
      }

      const mapped = response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address || 'Adresse non disponible',
        position: [place.geometry.location.lat, place.geometry.location.lng],
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        isOpen: place.opening_hours?.open_now || false,
        rating: place.rating || 0,
        totalRatings: place.user_ratings_total || 0,
        phone: place.formatted_phone_number || null,
        placeId: place.place_id,
        isDeGarde: Math.random() > 0.85 // Simulation
      }));

      allResults = allResults.concat(mapped);
      pageToken = response.data.next_page_token || null;
      pageCount += 1;
    } while (pageToken && pageCount < 3); // max ~60 résultats

    console.log(`✅ ${allResults.length} pharmacies trouvées (Google Places, rayon ${radius}m)`);
    
    return {
      success: true,
      pharmacies: allResults,
      total: allResults.length
    };

  } catch (error) {
    console.error('❌ Erreur recherche pharmacies:', error.message);
    return {
      success: false,
      pharmacies: [],
      error: error.message
    };
  }
}

/**
 * Obtenir les détails d'une pharmacie spécifique
 */
async function getPharmacyDetails(placeId) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY non configurée');
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    
    const params = {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,geometry,photos',
      key: GOOGLE_MAPS_API_KEY,
      language: 'fr'
    };

    const response = await axios.get(url, { params });

    if (response.data.status !== 'OK') {
      console.error('❌ Erreur détails pharmacie:', response.data.status);
      return { success: false, error: response.data.status };
    }

    const place = response.data.result;
    
    return {
      success: true,
      pharmacy: {
        id: placeId,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        position: [place.geometry.location.lat, place.geometry.location.lng],
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        isOpen: place.opening_hours?.open_now || false,
        openingHours: place.opening_hours?.weekday_text || [],
        rating: place.rating || 0,
        totalRatings: place.user_ratings_total || 0,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
        })) || []
      }
    };

  } catch (error) {
    console.error('❌ Erreur détails pharmacie:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  getNearbyPharmacies,
  getPharmacyDetails
};

