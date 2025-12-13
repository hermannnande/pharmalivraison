import { io } from 'socket.io-client';
import { CONFIG } from '../config';

const SOCKET_URL = CONFIG.SOCKET_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.locationInterval = null;
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
      console.log('✅ Socket livreur connecté:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket livreur déconnecté');
      this.stopLocationTracking();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    this.stopLocationTracking();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // ==================== ÉVÉNEMENTS LIVREUR ====================

  // Méthode générique pour écouter n'importe quel événement
  on(eventName, callback) {
    if (!this.socket) this.connect();
    
    this.socket.on(eventName, callback);
    this.listeners.set(eventName, callback);
  }

  // Méthode générique pour émettre n'importe quel événement
  emit(eventName, data) {
    if (!this.socket) this.connect();
    
    if (this.socket?.connected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn(`⚠️ Socket non connecté, impossible d'émettre: ${eventName}`);
    }
  }

  // Écouter les nouvelles commandes disponibles
  onNewDelivery(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('new-delivery-available', (data) => {
      callback(data);
    });

    this.listeners.set('new-delivery-available', callback);
  }

  // Écouter les annulations de commande
  onDeliveryCancel(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('delivery-cancelled', (data) => {
      callback(data);
    });

    this.listeners.set('delivery-cancelled', callback);
  }

  // Écouter les demandes de position du client
  onLocationRequest(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('location-request', (data) => {
      callback(data);
    });

    this.listeners.set('location-request', callback);
  }

  // Écouter les notifications
  onNotification(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('notification', (data) => {
      callback(data);
    });

    this.listeners.set('notification', callback);
  }

  // Écouter les messages du client
  onClientMessage(callback) {
    if (!this.socket) this.connect();
    
    this.socket.on('client-message', (data) => {
      callback(data);
    });

    this.listeners.set('client-message', callback);
  }

  // ==================== ÉMISSION D'ÉVÉNEMENTS ====================

  // Mettre à jour la position du livreur
  updateLocation(orderId, latitude, longitude, speed = 0, heading = 0) {
    if (!this.socket) this.connect();
    
    this.socket.emit('driver-location-update', {
      orderId,
      location: {
        latitude,
        longitude,
        speed,
        heading,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Démarrer le suivi de position automatique
  startLocationTracking(orderId, intervalMs = 5000) {
    if (this.locationInterval) {
      this.stopLocationTracking();
    }

    // Vérifier si la géolocalisation est disponible
    if (!navigator.geolocation) {
      console.error('❌ Géolocalisation non disponible');
      return;
    }

    // Fonction pour obtenir et envoyer la position
    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, speed, heading } = position.coords;
          this.updateLocation(orderId, latitude, longitude, speed || 0, heading || 0);
          console.log('📍 Position envoyée:', { latitude, longitude });
        },
        (error) => {
          console.error('❌ Erreur de géolocalisation:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

    // Envoyer immédiatement
    sendLocation();

    // Puis envoyer à intervalle régulier
    this.locationInterval = setInterval(sendLocation, intervalMs);
  }

  // Arrêter le suivi de position automatique
  stopLocationTracking() {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      this.locationInterval = null;
      console.log('⏹️ Suivi de position arrêté');
    }
  }

  // Mettre à jour le statut de livraison
  updateDeliveryStatus(orderId, status) {
    if (!this.socket) this.connect();
    
    this.socket.emit('delivery-status-update', {
      orderId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  // Envoyer un message au client
  sendMessageToClient(orderId, message) {
    if (!this.socket) this.connect();
    
    this.socket.emit('driver-message', {
      orderId,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Signaler une urgence
  sendSOS(orderId, location, message) {
    if (!this.socket) this.connect();
    
    this.socket.emit('driver-sos', {
      orderId,
      location,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Mettre à jour la disponibilité
  updateAvailability(isAvailable) {
    if (!this.socket) this.connect();
    
    this.socket.emit('driver-availability', {
      isAvailable,
      timestamp: new Date().toISOString(),
    });
  }

  // Accepter une livraison
  acceptDelivery(deliveryId) {
    if (!this.socket) this.connect();
    this.socket.emit('accept-delivery', { deliveryId });
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

