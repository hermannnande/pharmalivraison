// =====================================================
// BASE DE DONNÉES EN MÉMOIRE - PHARMALIVRAISON
// =====================================================

// ============ UTILISATEURS ============
let users = [
  // CLIENT
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Kouassi',
    email: 'client@test.com',
    phone: '+22507070707',
    password: 'password123',
    role: 'client',
    location: { lat: 5.3650, lng: -4.0100 },
    address: 'Cocody Angré, 7ème Tranche',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  // LIVREUR
  {
    id: '2',
    firstName: 'Mohamed',
    lastName: 'Diallo',
    email: 'livreur@test.com',
    phone: '+22508080808',
    password: 'password123',
    role: 'driver',
    isAvailable: true,
    rating: 4.9,
    totalDeliveries: 342,
    earnings: 1250000,
    level: 'Gold',
    location: { lat: 5.3600, lng: -4.0083 },
    vehicle: {
      type: 'Moto',
      brand: 'Honda',
      model: 'CBR 150',
      plate: 'AB 1234 CI'
    },
    avatar: 'https://i.pravatar.cc/150?img=33'
  },
  // PHARMACIEN
  {
    id: '3',
    firstName: 'Aïcha',
    lastName: 'Traoré',
    email: 'pharmacien@test.com',
    phone: '+22509090909',
    password: 'password123',
    role: 'pharmacist',
    pharmacyId: '1',
    avatar: 'https://i.pravatar.cc/150?img=45'
  }
];

// ============ PHARMACIES ============
let pharmacies = [
  {
    id: '1',
    name: 'Pharmacie Cocody Angré',
    phone: '+22527201234',
    address: 'Cocody Angré 7ème Tranche',
    location: { lat: 5.3680, lng: -4.0120 },
    isOpen: true,
    is24h: false,
    isOnGuard: false,
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: 1000,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400',
    openingHours: {
      monday: '08:00-20:00',
      tuesday: '08:00-20:00',
      wednesday: '08:00-20:00',
      thursday: '08:00-20:00',
      friday: '08:00-20:00',
      saturday: '08:00-18:00',
      sunday: 'Fermé'
    }
  },
  {
    id: '2',
    name: 'Pharmacie de la Paix',
    phone: '+22527205678',
    address: 'Plateau, Avenue Marchand',
    location: { lat: 5.3250, lng: -4.0280 },
    isOpen: true,
    is24h: true,
    isOnGuard: true,
    rating: 4.9,
    deliveryTime: '20-30 min',
    deliveryFee: 1500,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    openingHours: {
      monday: '24h/24',
      tuesday: '24h/24',
      wednesday: '24h/24',
      thursday: '24h/24',
      friday: '24h/24',
      saturday: '24h/24',
      sunday: '24h/24'
    }
  },
  {
    id: '3',
    name: 'Pharmacie Abobo Gare',
    phone: '+22527209012',
    address: 'Abobo Gare, Face Marché',
    location: { lat: 5.4200, lng: -4.0200 },
    isOpen: true,
    is24h: false,
    isOnGuard: false,
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2000,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400',
    openingHours: {
      monday: '07:00-21:00',
      tuesday: '07:00-21:00',
      wednesday: '07:00-21:00',
      thursday: '07:00-21:00',
      friday: '07:00-21:00',
      saturday: '08:00-20:00',
      sunday: '09:00-18:00'
    }
  }
];

// ============ MÉDICAMENTS ============
let medications = [
  {
    id: '1',
    name: 'Doliprane 1000mg',
    category: 'Antalgique',
    price: 2500,
    description: 'Traitement de la douleur et de la fièvre',
    requiresPrescription: false,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
    pharmacyId: '1'
  },
  {
    id: '2',
    name: 'Amoxicilline 500mg',
    category: 'Antibiotique',
    price: 4500,
    description: 'Traitement des infections bactériennes',
    requiresPrescription: true,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200',
    pharmacyId: '1'
  },
  {
    id: '3',
    name: 'Efferalgan 500mg',
    category: 'Antalgique',
    price: 2000,
    description: 'Contre les douleurs légères à modérées',
    requiresPrescription: false,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1550572017-4892b527a4d8?w=200',
    pharmacyId: '2'
  },
  {
    id: '4',
    name: 'Ibuprofène 400mg',
    category: 'Anti-inflammatoire',
    price: 3000,
    description: 'Anti-inflammatoire non stéroïdien',
    requiresPrescription: false,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200',
    pharmacyId: '1'
  },
  {
    id: '5',
    name: 'Ventoline',
    category: 'Antiasthmatique',
    price: 8500,
    description: 'Traitement de l\'asthme',
    requiresPrescription: true,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200',
    pharmacyId: '2'
  }
];

// ============ COMMANDES ============
let orders = [
  {
    id: '1',
    orderNumber: 'CMD001',
    clientId: '1',
    pharmacyId: '1',
    livreurId: '2',
    medications: [
      { id: '1', name: 'Doliprane 1000mg', quantity: 2, price: 2500, total: 5000 },
      { id: '2', name: 'Amoxicilline 500mg', quantity: 1, price: 4500, total: 4500 }
    ],
    subtotal: 9500,
    deliveryFee: 1000,
    totalPrice: 10500,
    status: 'delivering',
    deliveryAddress: 'Cocody Angré, 7ème Tranche',
    deliveryLocation: { lat: 5.3650, lng: -4.0100 },
    pharmacyLocation: { lat: 5.3680, lng: -4.0120 },
    hasPrescription: true,
    prescriptionImage: 'https://example.com/prescription.jpg',
    paymentMethod: 'mobile_money',
    paymentStatus: 'paid',
    estimatedDeliveryTime: 15,
    createdAt: new Date('2024-12-13T10:30:00'),
    acceptedAt: new Date('2024-12-13T10:32:00'),
    deliveredAt: null
  },
  {
    id: '2',
    orderNumber: 'CMD002',
    clientId: '1',
    pharmacyId: '2',
    livreurId: null,
    medications: [
      { id: '3', name: 'Efferalgan 500mg', quantity: 1, price: 2000, total: 2000 }
    ],
    subtotal: 2000,
    deliveryFee: 1500,
    totalPrice: 3500,
    status: 'pending',
    deliveryAddress: 'Cocody Angré, 7ème Tranche',
    deliveryLocation: { lat: 5.3650, lng: -4.0100 },
    pharmacyLocation: { lat: 5.3250, lng: -4.0280 },
    hasPrescription: false,
    prescriptionImage: null,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    estimatedDeliveryTime: 20,
    createdAt: new Date('2024-12-13T11:00:00'),
    acceptedAt: null,
    deliveredAt: null
  }
];

// ============ LIVRAISONS ============
let deliveries = [
  {
    id: '1',
    orderId: '1',
    livreurId: '2',
    status: 'delivering',
    currentLocation: { lat: 5.3620, lng: -4.0095 },
    startLocation: { lat: 5.3680, lng: -4.0120 },
    endLocation: { lat: 5.3650, lng: -4.0100 },
    estimatedTime: 8,
    distance: 1.2,
    startedAt: new Date('2024-12-13T10:35:00'),
    completedAt: null
  }
];

// ============ TRANSACTIONS (Portefeuille) ============
let transactions = [
  {
    id: '1',
    userId: '2',
    type: 'earning',
    amount: 2500,
    description: 'Livraison CMD001',
    date: new Date('2024-12-13T09:30:00'),
    status: 'completed'
  },
  {
    id: '2',
    userId: '2',
    type: 'earning',
    amount: 3000,
    description: 'Livraison CMD002',
    date: new Date('2024-12-12T15:20:00'),
    status: 'completed'
  },
  {
    id: '3',
    userId: '2',
    type: 'withdrawal',
    amount: -50000,
    description: 'Retrait Mobile Money',
    date: new Date('2024-12-10T10:00:00'),
    status: 'completed'
  }
];

// ============ NOTIFICATIONS ============
let notifications = [
  {
    id: '1',
    userId: '1',
    title: 'Commande en cours',
    message: 'Votre livreur Mohamed est en route',
    type: 'delivery',
    isRead: false,
    createdAt: new Date('2024-12-13T10:35:00')
  },
  {
    id: '2',
    userId: '2',
    title: 'Nouvelle commande',
    message: 'Nouvelle commande disponible à 1.2km',
    type: 'order',
    isRead: false,
    createdAt: new Date('2024-12-13T11:00:00')
  }
];

module.exports = { 
  users, 
  pharmacies, 
  medications, 
  orders, 
  deliveries, 
  transactions,
  notifications
};
