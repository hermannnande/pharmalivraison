import axios from 'axios';
import { CONFIG } from '../config';

// Configuration de l'URL de base de l'API
const API_URL = CONFIG.API_URL;

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTIFICATION ====================

export const loginDriver = async (phone, password) => {
  try {
    console.log('📤 Envoi requête login livreur:', { phone, password: '***' });
    const response = await api.post('/auth/login', { phone, password });
    console.log('📥 Réponse reçue:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Erreur de connexion' };
  }
};

export const registerDriver = async (userData) => {
  try {
    const response = await api.post('/auth/register', { ...userData, role: 'driver' });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur d\'inscription' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ==================== COMMANDES ====================

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des commandes' };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération de la commande' };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour de la commande' };
  }
};

// ==================== LIVRAISONS ====================

export const getDeliveries = async () => {
  try {
    const response = await api.get('/deliveries');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des livraisons' };
  }
};

export const acceptDelivery = async (orderId) => {
  try {
    const response = await api.post(`/deliveries/${orderId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de l\'acceptation de la livraison' };
  }
};

export const updateDeliveryLocation = async (deliveryId, location) => {
  try {
    const response = await api.put(`/deliveries/${deliveryId}/location`, location);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour de la position' };
  }
};

export const completeDelivery = async (deliveryId) => {
  try {
    const response = await api.post(`/deliveries/${deliveryId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la finalisation de la livraison' };
  }
};

// ==================== PORTEFEUILLE ====================

export const getWalletBalance = async () => {
  try {
    const response = await api.get('/wallet/balance');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération du solde' };
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get('/wallet/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des transactions' };
  }
};

export const requestWithdrawal = async (amount, method) => {
  try {
    const response = await api.post('/wallet/withdraw', { amount, method });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la demande de retrait' };
  }
};

// ==================== STATISTIQUES ====================

export const getDriverStats = async () => {
  try {
    const response = await api.get('/wallet/balance'); // Utilise le même endpoint
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des statistiques' };
  }
};

// ==================== DISPONIBILITÉ ====================

export const updateAvailability = async (isAvailable) => {
  try {
    const response = await api.put('/auth/availability', { isAvailable });
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour de la disponibilité' };
  }
};

// ==================== NOTIFICATIONS ====================

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des notifications' };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour de la notification' };
  }
};

// ==================== PROFIL ====================

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la mise à jour du profil' };
  }
};

export default api;
