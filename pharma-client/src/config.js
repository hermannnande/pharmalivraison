// =====================================================
// CONFIGURATION ENVIRONNEMENT - PHARMALIVRAISON CLIENT
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
  APP_NAME: 'PharmaLivraison',
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
  
  // Paramètres de recherche
  SEARCH_RADIUS: 10, // km
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
};

// Couleurs de l'app
export const COLORS = {
  primary: '#0066CC',
  secondary: '#00C853',
  accent: '#FF6B6B',
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
  
  // Gradients (si besoin)
  gradientPrimary: 'linear-gradient(135deg, #0066CC, #0052A3)',
  gradientSuccess: 'linear-gradient(135deg, #00C853, #00A843)',
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur, veuillez réessayer',
  VALIDATION_ERROR: 'Veuillez vérifier les données saisies',
};

// Statuts des commandes
export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Traductions des statuts (français)
export const ORDER_STATUS_LABELS = {
  pending: 'En attente',
  accepted: 'Acceptée',
  preparing: 'En préparation',
  ready: 'Prête',
  delivering: 'En cours de livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
  ORANGE_MONEY: 'orange_money',
  MTN_MONEY: 'mtn_money',
  MOOV_MONEY: 'moov_money',
  CARD: 'card',
};

// Traductions des méthodes de paiement
export const PAYMENT_METHOD_LABELS = {
  cash: '💵 Espèces',
  mobile_money: '📱 Mobile Money',
  orange_money: '🟠 Orange Money',
  mtn_money: '🟡 MTN Money',
  moov_money: '🔵 Moov Money',
  card: '💳 Carte bancaire',
};

export default CONFIG;
