// =====================================================
// SERVICE DE DISPATCH AUTOMATIQUE
// =====================================================

const io = require('../server').io;

// Stockage des livraisons en attente
const pendingDeliveries = new Map();

// Stockage des livreurs en ligne avec leur position
const onlineCouriers = new Map();

// Statistiques de dispatch
let dispatchStats = {
  totalDispatched: 0,
  totalDistance: 0,
  totalTime: 0
};

/**
 * Fonction de distance Haversine (calcul distance entre 2 points GPS)
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

  return R * c; // Distance en mètres
}

/**
 * Calculer le score d'un livreur pour une commande
 */
function calculateCourierScore(courier, order) {
  const distance = haversineDistance(
    courier.location.lat,
    courier.location.lng,
    order.clientLocation.lat,
    order.clientLocation.lng
  );

  // Score basé sur :
  // - Distance (poids 60%)
  // - Note du livreur (poids 20%)
  // - Nombre de livraisons (poids 20%)
  
  const distanceScore = Math.max(0, 100 - (distance / 50)); // 5km = 0 points
  const ratingScore = (courier.rating || 0) * 20; // Note sur 5 -> 100
  const experienceScore = Math.min(100, (courier.totalDeliveries || 0) / 10);

  const totalScore = (distanceScore * 0.6) + (ratingScore * 0.2) + (experienceScore * 0.2);

  return {
    score: totalScore,
    distance,
    distanceKm: (distance / 1000).toFixed(2),
    estimatedTime: Math.ceil(distance / 400), // ~24 km/h en moto
    courier
  };
}

/**
 * Trouver le meilleur livreur pour une commande
 */
function findBestCourier(order) {
  console.log('');
  console.log('========================================');
  console.log('🔍 RECHERCHE DU MEILLEUR LIVREUR');
  console.log('========================================');
  console.log('Commande:', order.id);
  console.log('Position client:', order.clientLocation);
  console.log('Livreurs en ligne:', onlineCouriers.size);
  console.log('');

  if (onlineCouriers.size === 0) {
    console.log('❌ Aucun livreur disponible');
    return null;
  }

  // Calculer le score de chaque livreur
  const scoredCouriers = [];
  
  onlineCouriers.forEach((courier, courierId) => {
    if (courier.isAvailable) {
      const score = calculateCourierScore(courier, order);
      scoredCouriers.push(score);
      console.log(`📊 ${courier.firstName} ${courier.lastName}:`);
      console.log(`   Distance: ${score.distanceKm} km`);
      console.log(`   ETA: ${score.estimatedTime} min`);
      console.log(`   Score: ${score.score.toFixed(2)}/100`);
      console.log('');
    }
  });

  if (scoredCouriers.length === 0) {
    console.log('❌ Aucun livreur disponible');
    return null;
  }

  // Trier par score (le plus haut en premier)
  scoredCouriers.sort((a, b) => b.score - a.score);

  const best = scoredCouriers[0];
  console.log('✅ MEILLEUR LIVREUR TROUVÉ:');
  console.log(`   ${best.courier.firstName} ${best.courier.lastName}`);
  console.log(`   Distance: ${best.distanceKm} km`);
  console.log(`   ETA: ${best.estimatedTime} min`);
  console.log(`   Score: ${best.score.toFixed(2)}/100`);
  console.log('');

  return best;
}

/**
 * Dispatcher une commande au meilleur livreur
 */
function dispatchOrder(order, io) {
  console.log('');
  console.log('========================================');
  console.log('🚀 DISPATCH AUTOMATIQUE');
  console.log('========================================');
  console.log('Commande:', order.id);
  console.log('');

  // Trouver le meilleur livreur
  const best = findBestCourier(order);

  if (!best) {
    console.log('❌ Impossible de dispatcher: aucun livreur disponible');
    return {
      success: false,
      message: 'Aucun livreur disponible'
    };
  }

  // Préparer les données de l'offre
  const offerData = {
    orderId: order.id,
    orderNumber: order.orderNumber || order.id,
    id: order.id,
    clientName: order.clientName || 'Client',
    clientAddress: order.clientAddress || order.deliveryAddress,
    clientPhone: order.clientPhone || '',
    clientPosition: [order.clientLocation.lat, order.clientLocation.lng],
    pharmacyName: order.pharmacyName || 'Pharmacie',
    pharmacyAddress: order.pharmacyAddress || '',
    pharmacyPosition: order.pharmacyLocation ? 
      [order.pharmacyLocation.lat, order.pharmacyLocation.lng] : 
      [5.3500, -4.0150],
    medications: order.medications || [],
    orderType: order.orderType || 'ordonnance',
    orderDetails: order.medicationList || order.symptoms || order.notes || 'Détails',
    totalPrice: order.totalPrice || 0,
    estimatedPrice: `${order.totalPrice || 0} FCFA`,
    deliveryFee: order.deliveryFee || 1000,
    distance: `${best.distanceKm} km`,
    eta: `${best.estimatedTime} min`,
    estimatedTime: `${best.estimatedTime} min`,
    deliveryLocation: order.clientLocation,
    pharmacyLocation: order.pharmacyLocation,
    forOther: order.forOther || false,
    urgentOrder: order.isUrgent || false,
    timestamp: new Date().toLocaleTimeString('fr-FR')
  };

  // Envoyer via Socket.IO
  if (io) {
    console.log('📡 Envoi notification Socket.IO...');
    
    // Broadcast à tous les livreurs
    io.emit('new:order', offerData);
    
    // Envoyer aussi une offre ciblée au meilleur livreur
    io.emit('new:order:offer', offerData);
    
    console.log('✅ Notification envoyée !');
    console.log('');
  }

  // Enregistrer la livraison en attente
  pendingDeliveries.set(order.id, {
    order,
    assignedCourier: best.courier,
    status: 'pending',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  });

  // Mettre à jour les statistiques
  dispatchStats.totalDispatched++;
  dispatchStats.totalDistance += parseFloat(best.distanceKm);
  dispatchStats.totalTime += best.estimatedTime;

  return {
    success: true,
    courier: best.courier,
    distance: best.distanceKm,
    estimatedTime: best.estimatedTime,
    score: best.score
  };
}

/**
 * Mettre à jour la position d'un livreur
 */
function updateCourierLocation(courierId, location) {
  const courier = onlineCouriers.get(courierId);
  if (courier) {
    courier.location = location;
    onlineCouriers.set(courierId, courier);
    return true;
  }
  return false;
}

/**
 * Mettre un livreur en ligne
 */
function setCourierOnline(courier) {
  console.log(`✅ Livreur connecté: ${courier.firstName} ${courier.lastName} (${courier.id})`);
  onlineCouriers.set(courier.id, {
    ...courier,
    isAvailable: true,
    lastUpdate: new Date()
  });
}

/**
 * Mettre un livreur hors ligne
 */
function setCourierOffline(courierId) {
  const courier = onlineCouriers.get(courierId);
  if (courier) {
    console.log(`❌ Livreur déconnecté: ${courier.firstName} ${courier.lastName}`);
  }
  onlineCouriers.delete(courierId);
}

/**
 * Obtenir tous les livreurs en ligne
 */
function getOnlineCouriers() {
  return Array.from(onlineCouriers.values());
}

/**
 * Obtenir les statistiques
 */
function getStats() {
  const avgDistance = dispatchStats.totalDispatched > 0 
    ? (dispatchStats.totalDistance / dispatchStats.totalDispatched).toFixed(2) 
    : 0;
  
  const avgTime = dispatchStats.totalDispatched > 0 
    ? Math.round(dispatchStats.totalTime / dispatchStats.totalDispatched) 
    : 0;

  return {
    onlineCouriers: onlineCouriers.size,
    pendingDeliveries: pendingDeliveries.size,
    totalDispatched: dispatchStats.totalDispatched,
    avgDistance,
    avgTime,
    couriers: getOnlineCouriers().map(c => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      location: c.location,
      isAvailable: c.isAvailable,
      rating: c.rating,
      totalDeliveries: c.totalDeliveries
    }))
  };
}

module.exports = {
  dispatchOrder,
  findBestCourier,
  updateCourierLocation,
  setCourierOnline,
  setCourierOffline,
  getOnlineCouriers,
  getStats
};

