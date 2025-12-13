// Service pour intégrer Google Maps API
// Chercher vraies pharmacies d'Abidjan avec horaires, téléphones, etc.

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// IMPORTANT: Pour utiliser ce service, vous devez :
// 1. Obtenir une clé Google Maps API (voir GUIDE_GOOGLE_MAPS_API.md)
// 2. Créer un fichier .env.local à la racine de pharma-web/ avec :
//    REACT_APP_GOOGLE_MAPS_API_KEY=votre_clé_ici

/**
 * Rechercher les pharmacies autour d'une position
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Rayon de recherche en mètres (par défaut 5km)
 * @returns {Promise<Array>} - Liste des pharmacies trouvées
 */
export async function searchPharmacies(lat, lng, radius = 5000) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Clé Google Maps API non configurée. Utilisation des données de démonstration.');
    return [];
  }

  try {
    // Note: Cette requête nécessite un proxy backend car Google Places API
    // ne permet pas les requêtes directes depuis le frontend (CORS)
    
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/google-maps/pharmacies/search?lat=${lat}&lng=${lng}&radius=${radius}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de pharmacies');
    }
    
    const data = await response.json();
    
    return data.results.map(place => ({
      id: place.place_id,
      nom: place.name,
      adresse: place.vicinity,
      position: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      estOuverte: place.opening_hours?.open_now || false,
      note: place.rating || 0,
      nombreAvis: place.user_ratings_total || 0,
      photos: place.photos ? place.photos.map(p => p.photo_reference) : []
    }));
  } catch (error) {
    console.error('Erreur recherche pharmacies:', error);
    return [];
  }
}

/**
 * Obtenir les détails complets d'une pharmacie
 * @param {string} placeId - ID Google Places de la pharmacie
 * @returns {Promise<Object>} - Détails de la pharmacie
 */
export async function getPharmacyDetails(placeId) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Clé Google Maps API non configurée.');
    return null;
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/google-maps/pharmacies/details?place_id=${placeId}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails');
    }
    
    const data = await response.json();
    const result = data.result;
    
    return {
      telephone: result.formatted_phone_number || 'Non disponible',
      horaires: result.opening_hours?.weekday_text || [],
      ouvert24h: result.opening_hours?.periods?.length === 1,
      siteWeb: result.website,
      adresseComplete: result.formatted_address,
      photos: result.photos ? result.photos.map(p => p.photo_reference) : []
    };
  } catch (error) {
    console.error('Erreur détails pharmacie:', error);
    return null;
  }
}

/**
 * Identifier les pharmacies de garde (ouvertes 24h/24)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Array>} - Liste des pharmacies de garde
 */
export async function getPharmaciesDeGarde(lat, lng) {
  try {
    const pharmacies = await searchPharmacies(lat, lng, 10000); // 10km
    
    // Filtrer celles ouvertes maintenant
    const ouvertes = pharmacies.filter(p => p.estOuverte);
    
    // Pour chaque pharmacie, vérifier si 24h/24
    const deGarde = [];
    for (const pharma of ouvertes) {
      const details = await getPharmacyDetails(pharma.id);
      if (details && details.ouvert24h) {
        deGarde.push({ ...pharma, ...details });
      }
    }
    
    return deGarde;
  } catch (error) {
    console.error('Erreur pharmacies de garde:', error);
    return [];
  }
}

/**
 * Calculer la distance entre deux points
 * @param {Object} origin - Point d'origine {lat, lng}
 * @param {Object} destination - Point de destination {lat, lng}
 * @returns {Promise<Object>} - Distance et durée
 */
export async function calculateDistance(origin, destination) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Clé Google Maps API non configurée.');
    // Calcul approximatif de distance (formule de Haversine)
    const distance = haversineDistance(origin, destination);
    return {
      distance: `${distance.toFixed(1)} km`,
      duree: `${Math.round(distance * 3)} min`,
      metres: Math.round(distance * 1000),
      secondes: Math.round(distance * 3 * 60)
    };
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(
      `${API_BASE_URL}/api/google-maps/distance?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}`
    );
    
    if (!response.ok) {
      throw new Error('Erreur calcul distance');
    }
    
    const data = await response.json();
    const element = data.rows[0].elements[0];
    
    return {
      distance: element.distance.text,
      duree: element.duration.text,
      metres: element.distance.value,
      secondes: element.duration.value
    };
  } catch (error) {
    console.error('Erreur calcul distance:', error);
    return null;
  }
}

/**
 * Obtenir un itinéraire entre deux points
 * @param {Object} origin - Point d'origine {lat, lng}
 * @param {Object} destination - Point de destination {lat, lng}
 * @returns {Promise<Object>} - Itinéraire détaillé
 */
export async function getDirections(origin, destination) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Clé Google Maps API non configurée.');
    return null;
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(
      `${API_BASE_URL}/api/google-maps/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving`
    );
    
    if (!response.ok) {
      throw new Error('Erreur obtention itinéraire');
    }
    
    const data = await response.json();
    const route = data.routes[0];
    
    return {
      polyline: route.overview_polyline.points,
      distance: route.legs[0].distance.text,
      duree: route.legs[0].duration.text,
      etapes: route.legs[0].steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duree: step.duration.text
      }))
    };
  } catch (error) {
    console.error('Erreur itinéraire:', error);
    return null;
  }
}

/**
 * Formule de Haversine pour calculer la distance entre deux points GPS
 * (utilisé comme fallback si Google Maps API n'est pas configurée)
 */
function haversineDistance(coord1, coord2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Obtenir l'URL d'une photo Google Places
 * @param {string} photoReference - Référence de la photo
 * @param {number} maxWidth - Largeur maximale
 * @returns {string} - URL de la photo
 */
export function getPhotoUrl(photoReference, maxWidth = 400) {
  if (!GOOGLE_MAPS_API_KEY || !photoReference) {
    return '/placeholder-pharmacy.jpg';
  }
  
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
}

/**
 * Géocoder une adresse (adresse → coordonnées GPS)
 * @param {string} address - Adresse à géocoder
 * @returns {Promise<Object>} - Coordonnées {lat, lng}
 */
export async function geocodeAddress(address) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Clé Google Maps API non configurée.');
    return null;
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/google-maps/geocode?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error('Erreur géocodage');
    }
    
    const data = await response.json();
    const location = data.results[0].geometry.location;
    
    return {
      lat: location.lat,
      lng: location.lng,
      adresseFormatee: data.results[0].formatted_address
    };
  } catch (error) {
    console.error('Erreur géocodage:', error);
    return null;
  }
}

/**
 * Géocodage inverse (coordonnées GPS → adresse)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Adresse formatée
 */
export async function reverseGeocode(lat, lng) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️ Clé Google Maps API non configurée.');
    return 'Abidjan, Côte d\'Ivoire';
  }

  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/google-maps/geocode?latlng=${lat},${lng}`);
    
    if (!response.ok) {
      throw new Error('Erreur géocodage inverse');
    }
    
    const data = await response.json();
    return data.results[0].formatted_address;
  } catch (error) {
    console.error('Erreur géocodage inverse:', error);
    return 'Abidjan, Côte d\'Ivoire';
  }
}

