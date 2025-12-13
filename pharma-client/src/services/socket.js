import { io } from 'socket.io-client';
import { CONFIG } from '../config';

const SOCKET_URL = CONFIG.SOCKET_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem('token');
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      ...CONFIG.SOCKET_CONFIG,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connecté:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket déconnecté');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // ==================== ÉVÉNEMENTS CLIENT ====================

  // Écouter les mises à jour de position du livreur
  onDriverLocationUpdate(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('driver-location-update', (data) => {
      callback(data);
    });

    this.listeners.set('driver-location-update', callback);
  }

  // Écouter les changements de statut de commande
  onOrderStatusChange(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('order-status-change', (data) => {
      callback(data);
    });

    this.listeners.set('order-status-change', callback);
  }

  // Écouter les notifications
  onNotification(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('notification', (data) => {
      callback(data);
    });

    this.listeners.set('notification', callback);
  }

  // Écouter l'arrivée du livreur
  onDriverArriving(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('driver-arriving', (data) => {
      callback(data);
    });

    this.listeners.set('driver-arriving', callback);
  }

  // Demander la position du livreur
  requestDriverLocation(orderId) {
    if (!this.socket) this.connect();
    this.socket.emit('request-driver-location', { orderId });
  }

  // S'abonner aux mises à jour d'une commande spécifique
  subscribeToOrder(orderId) {
    if (!this.socket) this.connect();
    this.socket.emit('subscribe-order', { orderId });
  }

  // Se désabonner des mises à jour d'une commande
  unsubscribeFromOrder(orderId) {
    if (!this.socket) this.connect();
    this.socket.emit('unsubscribe-order', { orderId });
  }

  // Retirer un écouteur d'événement
  off(eventName) {
    if (this.socket && this.listeners.has(eventName)) {
      this.socket.off(eventName);
      this.listeners.delete(eventName);
    }
  }

  // Retirer tous les écouteurs
  offAll() {
    if (this.socket) {
      this.listeners.forEach((_, eventName) => {
        this.socket.off(eventName);
      });
      this.listeners.clear();
    }
  }

  // Vérifier si le socket est connecté
  isConnected() {
    return this.socket?.connected || false;
  }

  // Obtenir l'ID du socket
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Instance singleton
const socketService = new SocketService();

export default socketService;

