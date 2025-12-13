import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import socketService from '../services/socket';
import { trackDelivery } from '../services/api';
import 'leaflet/dist/leaflet.css';
import './LiveTrackingPro.css';

const driverIcon = L.divIcon({
  html: '<div class="driver-marker-live">🏍️</div>',
  iconSize: [50, 50],
  iconAnchor: [25, 50]
});

const clientIcon = L.divIcon({
  html: '<div class="client-marker-live">📍</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function LiveTrackingPro() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  
  const [driverPosition, setDriverPosition] = useState([5.3600, -4.0083]);
  const [clientPosition] = useState([5.3650, -4.0100]);
  const [eta, setEta] = useState(8);
  const [distance, setDistance] = useState(1.2);
  const [status, setStatus] = useState('En route vers vous');
  const [, setIsConnected] = useState(false);
  
  const [driverInfo, setDriverInfo] = useState({
    name: 'Mohamed K.',
    photo: '👨',
    plate: 'CI-1234-AB',
    rating: 4.9,
    totalDeliveries: 342,
    phone: '+225 07 12 34 56 78'
  });

  // Connexion Socket.IO et récupération des données
  useEffect(() => {
    // Connecter au Socket.IO
    socketService.connect();
    setIsConnected(true);

    // Récupérer les informations de livraison
    if (orderId) {
      trackDelivery(orderId)
        .then(delivery => {
          if (delivery.driver) {
            setDriverInfo({
              name: delivery.driver.name || 'Livreur',
              photo: '👨',
              plate: delivery.driver.vehicle?.plate || 'N/A',
              rating: delivery.driver.rating || 5.0,
              totalDeliveries: delivery.driver.totalDeliveries || 0,
              phone: delivery.driver.phone || ''
            });
          }
          
          if (delivery.currentLocation) {
            setDriverPosition([
              delivery.currentLocation.latitude,
              delivery.currentLocation.longitude
            ]);
          }
          
          setStatus(getStatusText(delivery.status));
        })
        .catch(err => {
          console.error('Erreur lors du suivi:', err);
        });

      // S'abonner aux mises à jour de la commande
      socketService.subscribeToOrder(orderId);
    }

    // Écouter les mises à jour de position en temps réel
    socketService.onDriverLocationUpdate((data) => {
      if (data.orderId === orderId) {
        setDriverPosition([
          data.location.latitude,
          data.location.longitude
        ]);
        
        // Calculer la distance et l'ETA
        const dist = calculateDistance(
          data.location.latitude,
          data.location.longitude,
          clientPosition[0],
          clientPosition[1]
        );
        setDistance(dist);
        
        // ETA basé sur la distance et la vitesse moyenne (30 km/h en ville)
        const calculatedEta = (dist / 30) * 60; // en minutes
        setEta(Math.max(1, Math.ceil(calculatedEta)));
      }
    });

    // Écouter les changements de statut
    socketService.onOrderStatusChange((data) => {
      if (data.orderId === orderId) {
        setStatus(getStatusText(data.status));
      }
    });

    // Écouter l'arrivée du livreur
    socketService.onDriverArriving((data) => {
      if (data.orderId === orderId) {
        setStatus('Le livreur arrive !');
        // Afficher une notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('PharmaLivraison', {
            body: 'Votre livreur arrive dans quelques instants !',
            icon: '/logo192.png'
          });
        }
      }
    });

    return () => {
      if (orderId) {
        socketService.unsubscribeFromOrder(orderId);
      }
      socketService.off('driver-location-update');
      socketService.off('order-status-change');
      socketService.off('driver-arriving');
    };
  }, [orderId, clientPosition]);

  // Calculer la distance entre deux points (en km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Convertir le statut en texte
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'En attente d\'un livreur',
      'accepted': 'Livreur assigné',
      'picked_up': 'Médicament récupéré',
      'in_transit': 'En route vers vous',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
  };

  const handleCall = () => {
    window.location.href = `tel:${driverInfo.phone}`;
  };

  const handleSMS = () => {
    window.location.href = `sms:${driverInfo.phone}`;
  };

  return (
    <div className="live-tracking-pro">
      {/* Header avec infos livreur */}
      <div className="tracking-header-pro">
        <button className="back-btn-track" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="driver-info-compact">
          <div className="driver-avatar">{driverInfo.photo}</div>
          <div>
            <p className="driver-name">{driverInfo.name}</p>
            <p className="driver-status">{status}</p>
          </div>
        </div>

        <button className="call-btn-header" onClick={handleCall}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* ETA Card */}
      <div className="eta-card-pro">
        <div className="eta-main">
          <div className="eta-icon">⏱️</div>
          <div>
            <div className="eta-time">{Math.ceil(eta)} min</div>
            <div className="eta-label">Temps estimé</div>
          </div>
        </div>
        <div className="eta-distance">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#6c757d"/>
          </svg>
          {distance.toFixed(1)} km
        </div>
      </div>

      {/* Map */}
      <div className="map-container-pro">
        <MapContainer
          center={driverPosition}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={driverPosition} icon={driverIcon} />
          <Circle
            center={driverPosition}
            radius={80}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
          />
          
          <Marker position={clientPosition} icon={clientIcon} />
          
          <Polyline
            positions={[driverPosition, clientPosition]}
            pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10, 10' }}
          />
        </MapContainer>
      </div>

      {/* Driver Details Card */}
      <div className="driver-details-pro">
        <div className="driver-profile-card">
          <div className="driver-avatar-large">{driverInfo.photo}</div>
          <div className="driver-details-info">
            <h2>{driverInfo.name}</h2>
            <div className="driver-stats">
              <span>⭐ {driverInfo.rating}</span>
              <span>•</span>
              <span>{driverInfo.totalDeliveries} livraisons</span>
            </div>
            <div className="driver-plate">
              🏍️ {driverInfo.plate}
            </div>
          </div>
        </div>

        <div className="contact-buttons-pro">
          <button className="contact-btn call" onClick={handleCall}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" fill="currentColor"/>
            </svg>
            Appeler
          </button>
          <button className="contact-btn sms" onClick={handleSMS}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" fill="currentColor"/>
            </svg>
            Message
          </button>
        </div>

        <div className="delivery-progress">
          <div className="progress-steps">
            <div className="step completed">
              <div className="step-icon">✅</div>
              <div className="step-label">Commande acceptée</div>
            </div>
            <div className="step completed">
              <div className="step-icon">⚕️</div>
              <div className="step-label">À la pharmacie</div>
            </div>
            <div className="step active">
              <div className="step-icon">🏍️</div>
              <div className="step-label">En livraison</div>
            </div>
            <div className="step">
              <div className="step-icon">📦</div>
              <div className="step-label">Livré</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveTrackingPro;


