// =====================================================
// SERVICE DE DISPATCH AUTOMATIQUE V2
// Recherche en cascade autour de la PHARMACIE: 5→10→15km
// =====================================================

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
function calculateCourierScore(courier, distance) {
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
 * Recherche en cascade autour de la PHARMACIE : 5km → 10km → 15km
 */
async function findBestCourier(order, io) {
  console.log('');
  console.log('========================================');
  console.log('🔍 RECHERCHE DU MEILLEUR LIVREUR');
  console.log('========================================');
  console.log('Commande:', order.id);
  console.log('Position pharmacie:', order.pharmacyLocation);
  console.log('Livreurs en ligne:', onlineCouriers.size);
  console.log('');

  if (onlineCouriers.size === 0) {
    console.log('❌ Aucun livreur disponible');
    return null;
  }

  // Rayons de recherche en mètres : 5km → 10km → 15km
  const searchRadii = [5000, 10000, 15000];
  
  for (const radius of searchRadii) {
    const radiusKm = radius / 1000;
    console.log(`📡 Recherche livreurs dans ${radiusKm} km de la pharmacie...`);
    
    // Informer le client de la progression (radar animé)
    if (io) {
      io.emit('courier:search-progress', {
        orderId: order.id,
        radius: radiusKm,
        pharmacyName: order.pharmacyName,
        pharmacyLocation: order.pharmacyLocation
      });
    }

    // Filtrer les livreurs dans le rayon
    const nearbyScores = [];
    
    onlineCouriers.forEach((courier, courierId) => {
      if (courier.isAvailable && courier.location) {
        // Distance entre le LIVREUR et la PHARMACIE
        const distance = haversineDistance(
          courier.location.lat,
          courier.location.lng,
          order.pharmacyLocation.lat,
          order.pharmacyLocation.lng
        );

        // Si dans le rayon actuel
        if (distance <= radius) {
          const score = calculateCourierScore(courier, distance);
          nearbyScores.push(score);
          console.log(`   ✓ ${courier.firstName} ${courier.lastName}:`);
          console.log(`     Distance de pharmacie: ${score.distanceKm} km`);
          console.log(`     ETA: ${score.estimatedTime} min`);
          console.log(`     Score: ${score.score.toFixed(2)}/100`);
        }
      }
    });

    // Si livreurs trouvés dans ce rayon
    if (nearbyScores.length > 0) {
      // Trier par score décroissant
      nearbyScores.sort((a, b) => b.score - a.score);
      const best = nearbyScores[0];
      
      console.log('');
      console.log(`✅ Meilleur livreur trouvé à ${radiusKm} km:`);
      console.log(`   ${best.courier.firstName} ${best.courier.lastName}`);
      console.log(`   Distance: ${best.distanceKm} km`);
      console.log(`   ETA: ${best.estimatedTime} min`);
      console.log('========================================');
      
      return best;
    } else {
      console.log(`   ⚠️ Aucun livreur disponible dans ${radiusKm} km`);
      // Petite pause pour l'effet radar
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Aucun livreur trouvé après toutes les tentatives
  console.log('');
  console.log('❌ AUCUN LIVREUR DISPONIBLE dans un rayon de 15 km');
  console.log('========================================');
  return null;
}

/**
 * Dispatcher une commande au meilleur livreur
 */
async function dispatchOrder(order, io) {
  console.log('');
  console.log('========================================');
  console.log('🚀 DISPATCH AUTOMATIQUE V2');
  console.log('========================================');
  console.log('Commande:', order.id);
  console.log('');

  // Trouver le meilleur livreur (recherche en cascade)
  const best = await findBestCourier(order, io);

  if (!best) {
    console.log('❌ Impossible de dispatcher: aucun livreur disponible');
    
    // Notifier le client qu'aucun livreur n'est disponible
    if (io) {
      io.emit('courier:not-found', {
        orderId: order.id,
        message: 'Aucun livreur disponible dans votre zone'
      });
    }
    
    return {
      success: false,
      message: 'Aucun livreur disponible',
      error: 'NO_COURIER_AVAILABLE'
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
    
    // Notifier le client que le livreur a été trouvé
    io.emit('courier:found', {
      orderId: order.id,
      courier: {
        firstName: best.courier.firstName,
        lastName: best.courier.lastName,
        name: `${best.courier.firstName} ${best.courier.lastName}`,
        distance: best.distanceKm,
        eta: best.estimatedTime
      }
    });
    
    console.log('✅ Notification "courier:found" envoyée au client');
    
    // Petit délai avant d'envoyer l'offre au livreur (pour que le client voie le message)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Broadcast à tous les livreurs
    io.emit('new:order', offerData);
    
    // Envoyer aussi une offre ciblée au meilleur livreur
    io.emit('new:order:offer', offerData);
    
    console.log('✅ Offre de commande envoyée aux livreurs');
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
    console.log(`📍 Position livreur ${courierId} mise à jour:`, location);
  }
}

/**
 * Mettre un livreur en ligne
 */
function setCourierOnline(courier) {
  onlineCouriers.set(courier.id, {
    ...courier,
    isAvailable: true,
    connectedAt: new Date()
  });
  console.log(`✅ Livreur ${courier.firstName} ${courier.lastName} en ligne`);
}

/**
 * Mettre un livreur hors ligne
 */
function setCourierOffline(courierId) {
  onlineCouriers.delete(courierId);
  console.log(`❌ Livreur ${courierId} hors ligne`);
}

/**
 * Obtenir tous les livreurs en ligne
 */
function getOnlineCouriers() {
  return Array.from(onlineCouriers.values());
}

/**
 * Obtenir les statistiques de dispatch
 */
function getStats() {
  const avgDistance = dispatchStats.totalDispatched > 0 
    ? (dispatchStats.totalDistance / dispatchStats.totalDispatched).toFixed(2)
    : 0;
  const avgTime = dispatchStats.totalDispatched > 0
    ? Math.round(dispatchStats.totalTime / dispatchStats.totalDispatched)
    : 0;

  return {
    totalDispatched: dispatchStats.totalDispatched,
    onlineCouriers: onlineCouriers.size,
    avgDistance: `${avgDistance} km`,
    avgTime: `${avgTime} min`
  };
}

module.exports = {
  dispatchOrder,
  updateCourierLocation,
  setCourierOnline,
  setCourierOffline,
  getOnlineCouriers,
  getStats
};

