// Service de calcul d'itinéraire avec Google Maps Directions API
// Inclut le trafic en temps réel et les instructions turn-by-turn

import { CONFIG } from '../config';

const API_URL = CONFIG.API_URL.replace('/api', ''); // Enlever /api du base URL

/**
 * Calculer l'itinéraire entre deux points avec Google Maps
 * @param {Array|Object} start - [lat, lng] ou {lat, lng} Point de départ
 * @param {Array|Object} end - [lat, lng] ou {lat, lng} Point d'arrivée  
 * @returns {Object} { route: [[lat,lng]...], distance, duration, durationInTraffic, instructions }
 */
export const calculateRoute = async (start, end) => {
  try {
    // Normaliser les coordonnées
    const startCoords = Array.isArray(start) ? start : [start.lat, start.lng];
    const endCoords = Array.isArray(end) ? end : [end.lat, end.lng];
    
    const origin = `${startCoords[0]},${startCoords[1]}`;
    const destination = `${endCoords[0]},${endCoords[1]}`;
    
    console.log('🗺️ [GOOGLE MAPS] Calcul itinéraire:', { from: origin, to: destination });
    
    const url = `${API_URL}/api/google-maps/directions?origin=${origin}&destination=${destination}&mode=driving&departure_time=now`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erreur lors du calcul de l\'itinéraire');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Erreur Google Maps');
    }
    
    const { route } = data;
    
    console.log('✅ [GOOGLE MAPS] Itinéraire calculé:', {
      distance: route.distance.text,
      duration: route.duration.text,
      traffic: route.duration_in_traffic ? route.duration_in_traffic.text : 'N/A'
    });
    
    return {
      route: route.polyline, // [[lat, lng], ...]
      distance: route.distance.text, // "12.5 km"
      distanceValue: route.distance.value, // 12500 (en mètres)
      duration: route.duration.text, // "25 mins"
      durationValue: route.duration.value, // 1500 (en secondes)
      durationInTraffic: route.duration_in_traffic ? route.duration_in_traffic.text : null,
      durationInTrafficValue: route.duration_in_traffic ? route.duration_in_traffic.value : null,
      instructions: route.steps,
      startAddress: route.start_address,
      endAddress: route.end_address,
      hasTrafficData: !!route.duration_in_traffic
    };
  } catch (error) {
    console.error('❌ [GOOGLE MAPS] Erreur calcul itinéraire:', error);
    throw error;
  }
};

/**
 * Calculer l'itinéraire complet : livreur → pharmacie → client
 */
export const calculateFullDeliveryRoute = async (driverPos, pharmacyPos, clientPos) => {
  try {
    console.log('🚚 [GOOGLE MAPS] Calcul itinéraire complet de livraison...');
    
    // Route 1: Livreur → Pharmacie
    const toPharmacy = await calculateRoute(driverPos, pharmacyPos);
    
    // Route 2: Pharmacie → Client
    const toClient = await calculateRoute(pharmacyPos, clientPos);
    
    // Calculer les totaux
    const totalDistanceValue = toPharmacy.distanceValue + toClient.distanceValue;
    const totalDistance = (totalDistanceValue / 1000).toFixed(1) + ' km';
    
    const totalDurationValue = (toPharmacy.durationInTrafficValue || toPharmacy.durationValue) + 
                               (toClient.durationInTrafficValue || toClient.durationValue);
    const totalDuration = Math.round(totalDurationValue / 60) + ' mins';
    
    const estimatedArrival = new Date(Date.now() + totalDurationValue * 1000);
    
    console.log('✅ [GOOGLE MAPS] Itinéraire complet calculé:', {
      toPharmacy: `${toPharmacy.distance}, ${toPharmacy.durationInTraffic || toPharmacy.duration}`,
      toClient: `${toClient.distance}, ${toClient.durationInTraffic || toClient.duration}`,
      total: `${totalDistance}, ${totalDuration}`,
      eta: estimatedArrival.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });
    
    return {
      toPharmacy,
      toClient,
      totalDistance,
      totalDuration,
      totalDistanceValue,
      totalDurationValue,
      estimatedArrival
    };
  } catch (error) {
    console.error('❌ [GOOGLE MAPS] Erreur calcul itinéraire complet:', error);
    throw error;
  }
};

/**
 * Calculer uniquement l'itinéraire actuel selon le statut
 */
export const calculateCurrentRoute = async (driverPos, pharmacyPos, clientPos, status) => {
  try {
    if (status === 'accepted' || status === 'to-pharmacy') {
      // Livreur → Pharmacie
      console.log('📍 [GOOGLE MAPS] Calcul route vers pharmacie');
      return await calculateRoute(driverPos, pharmacyPos);
    } else if (status === 'at-pharmacy' || status === 'to-client') {
      // Livreur actuel (ou pharmacie si pas encore parti) → Client
      console.log('📍 [GOOGLE MAPS] Calcul route vers client');
      const origin = status === 'to-client' ? driverPos : pharmacyPos;
      return await calculateRoute(origin, clientPos);
    }
    return null;
  } catch (error) {
    console.error('❌ [GOOGLE MAPS] Erreur calcul itinéraire actuel:', error);
    return null;
  }
};

/**
 * Recalculer l'itinéraire si le livreur s'éloigne trop de la route
 */
export const shouldRecalculateRoute = (driverPos, routePoints, threshold = 0.1) => {
  if (!routePoints || routePoints.length === 0) return true;
  
  // Trouver le point le plus proche sur la route
  let minDistance = Infinity;
  routePoints.forEach(point => {
    const distance = calculateDistance(
      Array.isArray(driverPos) ? driverPos : [driverPos.lat, driverPos.lng],
      point
    );
    if (distance < minDistance) {
      minDistance = distance;
    }
  });
  
  // Si le livreur est à plus de 100m de la route, recalculer
  return minDistance > threshold;
};

/**
 * Calculer la distance entre deux points (en km) - Formule de Haversine
 */
const calculateDistance = (point1, point2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);
  const lat1 = toRad(point1[0]);
  const lat2 = toRad(point2[0]);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

/**
 * Formater la durée en français
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  }
  return `${minutes} min`;
};

/**
 * Formater la distance en français
 */
export const formatDistance = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

export default {
  calculateRoute,
  calculateFullDeliveryRoute,
  calculateCurrentRoute,
  shouldRecalculateRoute,
  formatDuration,
  formatDistance
};


