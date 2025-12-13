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

export const loginClient = async (phone, password) => {
  try {
    console.log('📤 Envoi requête login:', { phone, password: '***' });
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

export const registerClient = async (userData) => {
  try {
    const response = await api.post('/auth/register', { ...userData, role: 'client' });
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

// ==================== PHARMACIES ====================

export const getPharmacies = async (params = {}) => {
  try {
    const response = await api.get('/pharmacies', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des pharmacies' };
  }
};

export const getPharmacyById = async (pharmacyId) => {
  try {
    const response = await api.get(`/pharmacies/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération de la pharmacie' };
  }
};

export const getNearbyPharmacies = async (latitude, longitude) => {
  try {
    const response = await api.get('/pharmacies', {
      params: { lat: latitude, lng: longitude },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des pharmacies' };
  }
};

// ==================== MÉDICAMENTS ====================

export const getMedications = async (params = {}) => {
  try {
    const response = await api.get('/medications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des médicaments' };
  }
};

export const getMedicationsByPharmacy = async (pharmacyId) => {
  try {
    const response = await api.get(`/medications/pharmacy/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la récupération des médicaments' };
  }
};

// ==================== COMMANDES ====================

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de la création de la commande' };
  }
};

export const getMyOrders = async () => {
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

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status: 'cancelled' });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors de l\'annulation de la commande' };
  }
};

// ==================== LIVRAISONS ====================

export const trackDelivery = async (orderId) => {
  try {
    const response = await api.get(`/deliveries/track/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur lors du suivi de la livraison' };
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
