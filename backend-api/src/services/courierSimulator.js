// =====================================================
// SIMULATEUR DE LIVREURS VIRTUELS
// Pour tester le système de dispatch
// =====================================================

const dispatchService = require('./dispatchService');

// Positions de départ des livreurs virtuels (différents quartiers d'Abidjan)
const virtualCouriers = [
  {
    id: 'sim-1',
    firstName: 'Kouadio',
    lastName: 'Yao',
    phone: '+2250101010101',
    rating: 4.8,
    totalDeliveries: 234,
    isAvailable: true,
    location: { lat: 5.3400, lng: -4.0250 }, // Plateau
    vehicle: { type: 'Moto', brand: 'Yamaha', model: 'NMAX' }
  },
  {
    id: 'sim-2',
    firstName: 'Aminata',
    lastName: 'Touré',
    phone: '+2250202020202',
    rating: 4.9,
    totalDeliveries: 456,
    isAvailable: true,
    location: { lat: 5.3600, lng: -3.9900 }, // Cocody
    vehicle: { type: 'Moto', brand: 'Honda', model: 'PCX' }
  },
  {
    id: 'sim-3',
    firstName: 'Ibrahim',
    lastName: 'Koné',
    phone: '+2250303030303',
    rating: 4.7,
    totalDeliveries: 189,
    isAvailable: true,
    location: { lat: 5.3200, lng: -4.0400 }, // Adjamé
    vehicle: { type: 'Moto', brand: 'Suzuki', model: 'Burgman' }
  },
  {
    id: 'sim-4',
    firstName: 'Fatou',
    lastName: 'Diallo',
    phone: '+2250404040404',
    rating: 5.0,
    totalDeliveries: 567,
    isAvailable: true,
    location: { lat: 5.3800, lng: -4.0200 }, // Angré
    vehicle: { type: 'Moto', brand: 'Honda', model: 'CBR' }
  },
  {
    id: 'sim-5',
    firstName: 'Moussa',
    lastName: 'Camara',
    phone: '+2250505050505',
    rating: 4.6,
    totalDeliveries: 123,
    isAvailable: true,
    location: { lat: 5.3500, lng: -4.0600 }, // Yopougon
    vehicle: { type: 'Moto', brand: 'Yamaha', model: 'Aerox' }
  }
];

let simulationInterval = null;

/**
 * Démarrer la simulation
 */
function startSimulation() {
  console.log('');
  console.log('========================================');
  console.log('🤖 SIMULATION DE LIVREURS DÉMARRÉE');
  console.log('========================================');
  console.log(`${virtualCouriers.length} livreurs virtuels créés`);
  console.log('');

  // Mettre tous les livreurs virtuels en ligne
  virtualCouriers.forEach(courier => {
    dispatchService.setCourierOnline(courier);
    console.log(`✅ ${courier.firstName} ${courier.lastName} - ${courier.location.lat.toFixed(4)}, ${courier.location.lng.toFixed(4)}`);
  });

  console.log('');
  console.log('🔄 Déplacement automatique activé (toutes les 10 secondes)');
  console.log('');

  // Faire bouger les livreurs toutes les 10 secondes
  simulationInterval = setInterval(() => {
    moveCouriers();
  }, 10000);
}

/**
 * Arrêter la simulation
 */
function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  virtualCouriers.forEach(courier => {
    dispatchService.setCourierOffline(courier.id);
  });

  console.log('🛑 Simulation de livreurs arrêtée');
}

/**
 * Déplacer les livreurs virtuels (mouvement aléatoire)
 */
function moveCouriers() {
  virtualCouriers.forEach(courier => {
    // Mouvement aléatoire de ±0.002 degrés (~200m)
    const deltaLat = (Math.random() - 0.5) * 0.004;
    const deltaLng = (Math.random() - 0.5) * 0.004;

    courier.location.lat += deltaLat;
    courier.location.lng += deltaLng;

    // Limites d'Abidjan (empêcher de sortir de la ville)
    courier.location.lat = Math.max(5.30, Math.min(5.40, courier.location.lat));
    courier.location.lng = Math.max(-4.10, Math.min(-3.95, courier.location.lng));

    dispatchService.updateCourierLocation(courier.id, courier.location);
  });

  const stats = dispatchService.getStats();
  console.log(`🔄 [${new Date().toLocaleTimeString()}] ${stats.onlineCouriers} livreurs en mouvement`);
}

/**
 * Obtenir les livreurs virtuels
 */
function getVirtualCouriers() {
  return virtualCouriers;
}

/**
 * Obtenir un livreur virtuel spécifique
 */
function getVirtualCourier(id) {
  return virtualCouriers.find(c => c.id === id);
}

module.exports = {
  startSimulation,
  stopSimulation,
  getVirtualCouriers,
  getVirtualCourier
};

