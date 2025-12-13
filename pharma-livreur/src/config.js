// =====================================================
// CONFIGURATION ENVIRONNEMENT - PHARMALIVRAISON LIVREUR
// =====================================================

// Détection automatique de l'environnement
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// URLs de l'API
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://pharmalivraison-production.up.railway.app/api',
};

// Configuration
export const CONFIG = {
  // URL de l'API backend
  API_URL: isDevelopment ? API_URLS.development : API_URLS.production,
  
  // URL Socket.IO
  SOCKET_URL: isDevelopment 
    ? 'http://localhost:5000' 
    : 'https://pharmalivraison-production.up.railway.app',
  
  // Informations de l'app
  APP_NAME: 'PharmaLivraison Livreur',
  APP_VERSION: '1.0.0',
  
  // Configuration Socket.IO
  SOCKET_CONFIG: {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  },
  
  // Configuration Google Maps (à ajouter plus tard)
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_KEY || '',
  
  // Délais et timeouts
  REQUEST_TIMEOUT: 30000, // 30 secondes
  
  // Paramètres de localisation
  DEFAULT_LOCATION: {
    lat: 5.3650,
    lng: -4.0100,
    city: 'Abidjan',
    country: 'Côte d\'Ivoire'
  },
  
  // Intervalles de mise à jour GPS
  GPS_UPDATE_INTERVAL: 10000, // 10 secondes
  
  // Système de niveaux
  DRIVER_LEVELS: {
    BRONZE: { name: 'Bronze', minDeliveries: 0, color: '#CD7F32', emoji: '🥉' },
    SILVER: { name: 'Silver', minDeliveries: 50, color: '#C0C0C0', emoji: '🥈' },
    GOLD: { name: 'Gold', minDeliveries: 200, color: '#FFD700', emoji: '🥇' },
    PLATINUM: { name: 'Platinum', minDeliveries: 500, color: '#E5E4E2', emoji: '💎' },
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
};

// Couleurs de l'app
export const COLORS = {
  primary: '#2563EB',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8F9FA',
  text: '#333333',
  textLight: '#666666',
  border: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3',
  
  // Couleurs spécifiques livreur
  earnings: '#10B981',
  level: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
  }
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur, veuillez réessayer',
  VALIDATION_ERROR: 'Veuillez vérifier les données saisies',
  GPS_ERROR: 'Impossible d\'accéder à votre position GPS',
};

// Statuts des livraisons
export const DELIVERY_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PICKING_UP: 'picking_up',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Traductions des statuts (français)
export const DELIVERY_STATUS_LABELS = {
  pending: 'En attente',
  accepted: 'Acceptée',
  picking_up: 'Récupération en cours',
  delivering: 'En cours de livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

// Types de transactions
export const TRANSACTION_TYPES = {
  EARNING: 'earning',
  BONUS: 'bonus',
  WITHDRAWAL: 'withdrawal',
  PENALTY: 'penalty',
};

// Traductions des types de transactions
export const TRANSACTION_TYPE_LABELS = {
  earning: '💰 Gain',
  bonus: '🎁 Bonus',
  withdrawal: '💸 Retrait',
  penalty: '⚠️ Pénalité',
};

// Méthodes de retrait
export const WITHDRAWAL_METHODS = {
  ORANGE_MONEY: 'orange_money',
  MTN_MONEY: 'mtn_money',
  MOOV_MONEY: 'moov_money',
  BANK_TRANSFER: 'bank_transfer',
};

// Traductions des méthodes de retrait
export const WITHDRAWAL_METHOD_LABELS = {
  orange_money: '🟠 Orange Money',
  mtn_money: '🟡 MTN Money',
  moov_money: '🔵 Moov Money',
  bank_transfer: '🏦 Virement bancaire',
};

// Fonction pour obtenir le niveau du livreur
export const getDriverLevel = (totalDeliveries) => {
  if (totalDeliveries >= CONFIG.DRIVER_LEVELS.PLATINUM.minDeliveries) {
    return CONFIG.DRIVER_LEVELS.PLATINUM;
  } else if (totalDeliveries >= CONFIG.DRIVER_LEVELS.GOLD.minDeliveries) {
    return CONFIG.DRIVER_LEVELS.GOLD;
  } else if (totalDeliveries >= CONFIG.DRIVER_LEVELS.SILVER.minDeliveries) {
    return CONFIG.DRIVER_LEVELS.SILVER;
  } else {
    return CONFIG.DRIVER_LEVELS.BRONZE;
  }
};

// Fonction pour calculer la progression vers le prochain niveau
export const getProgressToNextLevel = (totalDeliveries) => {
  const currentLevel = getDriverLevel(totalDeliveries);
  
  if (currentLevel.name === 'Platinum') {
    return { progress: 100, nextLevel: null, remaining: 0 };
  }
  
  let nextLevel;
  if (currentLevel.name === 'Bronze') nextLevel = CONFIG.DRIVER_LEVELS.SILVER;
  else if (currentLevel.name === 'Silver') nextLevel = CONFIG.DRIVER_LEVELS.GOLD;
  else if (currentLevel.name === 'Gold') nextLevel = CONFIG.DRIVER_LEVELS.PLATINUM;
  
  const progress = ((totalDeliveries - currentLevel.minDeliveries) / 
                   (nextLevel.minDeliveries - currentLevel.minDeliveries)) * 100;
  const remaining = nextLevel.minDeliveries - totalDeliveries;
  
  return { progress, nextLevel, remaining };
};

export default CONFIG;
