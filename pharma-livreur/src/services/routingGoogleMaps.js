// =====================================================
// SERVICE DE ROUTAGE GOOGLE MAPS
// Calcul d'itinéraires avec trafic en temps réel
// =====================================================

const API_BASE_URL = 'http://localhost:5000/api/google-maps';

/**
 * Calculer un itinéraire avec Google Directions API
 */
export async function calculateRoute(origin, destination, mode = 'driving') {
  try {
    console.log('🗺️ [GOOGLE MAPS] Calcul itinéraire...', { origin, destination });
    
    const url = `${API_BASE_URL}/directions?` +
      `origin=${origin.lat},${origin.lng}&` +
      `destination=${destination.lat},${destination.lng}&` +
      `mode=${mode}&` +
      `departure_time=now`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erreur lors du calcul de l\'itinéraire');
    }

    const data = await response.json();
    
    if (data.success && data.route) {
      console.log('✅ [GOOGLE MAPS] Itinéraire calculé:', {
        distance: data.route.distance.text,
        duration: data.route.duration.text,
        traffic: data.route.duration_in_traffic?.text || 'N/A'
      });

      return {
        success: true,
        polyline: data.route.polyline,
        distance: data.route.distance,
        duration: data.route.duration,
        duration_in_traffic: data.route.duration_in_traffic,
        steps: data.route.steps,
        bounds: {
          northeast: data.route.polyline[0],
          southwest: data.route.polyline[data.route.polyline.length - 1]
        }
      };
    } else {
      throw new Error(data.message || 'Impossible de calculer l\'itinéraire');
    }
  } catch (error) {
    console.error('❌ [GOOGLE MAPS] Erreur calcul itinéraire:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculer l'itinéraire complet de livraison (livreur -> pharmacie -> client)
 */
export async function calculateFullDeliveryRoute(driverLocation, pharmacyLocation, clientLocation) {
  try {
    console.log('🗺️ [GOOGLE MAPS] Calcul itinéraire complet de livraison...');

    // Étape 1: Livreur -> Pharmacie
    const toPharmacy = await calculateRoute(driverLocation, pharmacyLocation);
    
    // Étape 2: Pharmacie -> Client
    const toClient = await calculateRoute(pharmacyLocation, clientLocation);

    if (toPharmacy.success && toClient.success) {
      return {
        success: true,
        toPharmacy,
        toClient,
        totalDistance: {
          value: toPharmacy.distance.value + toClient.distance.value,
          text: `${((toPharmacy.distance.value + toClient.distance.value) / 1000).toFixed(2)} km`
        },
        totalDuration: {
          value: toPharmacy.duration.value + toClient.duration.value,
          text: `${Math.ceil((toPharmacy.duration.value + toClient.duration.value) / 60)} min`
        }
      };
    } else {
      throw new Error('Impossible de calculer l\'itinéraire complet');
    }
  } catch (error) {
    console.error('❌ [GOOGLE MAPS] Erreur itinéraire complet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculer l'itinéraire actuel selon le statut de la livraison
 */
export async function calculateCurrentRoute(driverLocation, pharmacyLocation, clientLocation, deliveryStatus) {
  console.log(`🗺️ [GOOGLE MAPS] Calcul itinéraire actuel (statut: ${deliveryStatus})...`);

  try {
    switch (deliveryStatus) {
      case 'accepted':
      case 'to-pharmacy':
        // Livreur vers pharmacie
        return await calculateRoute(driverLocation, pharmacyLocation);

      case 'at-pharmacy':
        // En attente à la pharmacie
        return {
          success: true,
          polyline: [pharmacyLocation],
          message: 'En attente à la pharmacie'
        };

      case 'to-client':
      case 'delivering':
        // Pharmacie vers client
        return await calculateRoute(driverLocation, clientLocation);

      default:
        return {
          success: false,
          error: 'Statut de livraison inconnu'
        };
    }
  } catch (error) {
    console.error('❌ [GOOGLE MAPS] Erreur calcul itinéraire actuel:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Vérifier si le livreur s'est trop éloigné de l'itinéraire
 */
export function shouldRecalculateRoute(driverLocation, routePolyline, threshold = 200) {
  if (!routePolyline || routePolyline.length === 0) return false;

  // Calculer la distance minimale entre le livreur et tous les points de l'itinéraire
  let minDistance = Infinity;

  for (const point of routePolyline) {
    const distance = haversineDistance(
      driverLocation.lat,
      driverLocation.lng,
      point.lat,
      point.lng
    );
    minDistance = Math.min(minDistance, distance);
  }

  // Si le livreur est à plus de X mètres de l'itinéraire, recalculer
  return minDistance > threshold;
}

/**
 * Calculer la distance entre deux points GPS (formule de Haversine)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

/**
 * Décoder une polyline Google Maps (format encodé)
 */
export function decodePolyline(encoded) {
  if (!encoded) return [];
  
  const poly = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return poly;
}
