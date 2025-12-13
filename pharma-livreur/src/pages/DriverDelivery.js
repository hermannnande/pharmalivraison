import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import socketService from '../services/socket';
import { getOrderById, pickupDelivery, completeDelivery } from '../services/api';
import 'leaflet/dist/leaflet.css';
import './DriverDelivery.css';

// Icônes personnalisées
const driverIcon = L.divIcon({
  className: 'driver-marker',
  html: `<div class="driver-pin">🏍️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const pharmacyIcon = L.divIcon({
  className: 'pharmacy-marker',
  html: `<div class="pharmacy-pin">⚕️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const clientIcon = L.divIcon({
  className: 'client-marker',
  html: `<div class="client-pin">📍</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function DriverDelivery() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [deliveryStatus, setDeliveryStatus] = useState('accepted'); // accepted, to-pharmacy, at-pharmacy, to-client, delivered
  const [driverPosition, setDriverPosition] = useState([5.3600, -4.0083]);
  const [pharmacyPosition, setPharmacyPosition] = useState([5.3500, -4.0150]);
  const [clientPosition, setClientPosition] = useState([5.3650, -4.0100]);
  const [routePoints, setRoutePoints] = useState([]);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    id: orderId || 'CMD-2025-001',
    clientName: 'Client Test',
    clientPhone: '+225 07 00 00 00 00',
    clientAddress: 'Cocody, 2 Plateaux',
    pharmacyName: 'Pharmacie du Plateau',
    pharmacyAddress: 'Boulevard de la République',
    orderType: 'ordonnance',
    estimatedPrice: '12,500 FCFA',
    deliveryFee: '1,000 FCFA'
  });

  // Charger les détails de la commande et connecter Socket.IO
  useEffect(() => {
    if (orderId) {
      // Récupérer les détails de la commande
      getOrderById(orderId)
        .then(order => {
          setOrderDetails({
            id: order._id,
            clientName: order.client?.name || 'Client',
            clientPhone: order.client?.phone || '',
            clientAddress: order.deliveryAddress?.full || order.deliveryAddress?.address || 'Adresse inconnue',
            pharmacyName: order.pharmacy?.name || 'Pharmacie',
            pharmacyAddress: order.pharmacy?.address || '',
            orderType: order.orderType || 'ordonnance',
            estimatedPrice: `${order.totalAmount || 0} FCFA`,
            deliveryFee: `${order.deliveryFee || 0} FCFA`
          });

          // Mettre à jour les positions
          if (order.deliveryAddress?.latitude && order.deliveryAddress?.longitude) {
            setClientPosition([
              order.deliveryAddress.latitude,
              order.deliveryAddress.longitude
            ]);
          }

          if (order.pharmacy?.location?.coordinates) {
            setPharmacyPosition([
              order.pharmacy.location.coordinates[1],
              order.pharmacy.location.coordinates[0]
            ]);
          }
        })
        .catch(err => {
          console.error('Erreur lors du chargement de la commande:', err);
        });

      // Connecter au Socket.IO
      socketService.connect();

      // Écouter les messages du client
      socketService.onClientMessage((data) => {
        if (data.orderId === orderId) {
          alert(`Message du client: ${data.message}`);
        }
      });
    }

    return () => {
      socketService.off('client-message');
    };
  }, [orderId]);

  // Suivre la position GPS et l'envoyer en temps réel
  useEffect(() => {
    if (orderId && deliveryStatus !== 'delivered') {
      // Démarrer le suivi de position automatique (toutes les 5 secondes)
      socketService.startLocationTracking(orderId, 5000);
    }

    return () => {
      // Arrêter le suivi quand le composant est démonté
      socketService.stopLocationTracking();
    };
  }, [orderId, deliveryStatus]);

  // Calculer la distance
  const calculateDistance = () => {
    let target = deliveryStatus === 'to-pharmacy' || deliveryStatus === 'at-pharmacy' 
      ? pharmacyPosition 
      : clientPosition;
    
    const R = 6371; // Rayon de la Terre en km
    const dLat = (target[0] - driverPosition[0]) * Math.PI / 180;
    const dLon = (target[1] - driverPosition[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(driverPosition[0] * Math.PI / 180) * Math.cos(target[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return (distance * 1000).toFixed(0); // en mètres
  };

  const estimatedTime = () => {
    const distance = calculateDistance();
    const speedKmh = 30; // Vitesse moyenne en ville
    const timeHours = (distance / 1000) / speedKmh;
    const timeMinutes = Math.ceil(timeHours * 60);
    return timeMinutes;
  };

  // Simuler le déplacement GPS (simulation pour le développement)
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition(prev => {
        let target = deliveryStatus === 'to-pharmacy' || deliveryStatus === 'at-pharmacy' 
          ? pharmacyPosition 
          : clientPosition;

        const newLat = prev[0] + (target[0] - prev[0]) * 0.1;
        const newLng = prev[1] + (target[1] - prev[1]) * 0.1;
        
        // Mettre à jour la position actuelle
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            const realLat = position.coords.latitude;
            const realLng = position.coords.longitude;
            setDriverPosition([realLat, realLng]);
          });
        }
        
        return [newLat, newLng];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [deliveryStatus, pharmacyPosition, clientPosition]);

  // Mettre à jour la route
  useEffect(() => {
    if (deliveryStatus === 'to-pharmacy' || deliveryStatus === 'at-pharmacy') {
      setRoutePoints([driverPosition, pharmacyPosition]);
    } else if (deliveryStatus === 'to-client') {
      setRoutePoints([driverPosition, clientPosition]);
    }
  }, [driverPosition, deliveryStatus, pharmacyPosition, clientPosition]);

  const handleStatusUpdate = async () => {
    const statusFlow = {
      'accepted': 'to-pharmacy',
      'to-pharmacy': 'at-pharmacy',
      'at-pharmacy': 'to-client',
      'to-client': 'delivered'
    };

    const nextStatus = statusFlow[deliveryStatus];
    
    // Réduire le panel quand on part vers la pharmacie ou le client
    if (nextStatus === 'to-pharmacy' || nextStatus === 'to-client') {
      setPanelCollapsed(true);
    }
    
    // Agrandir le panel quand on arrive
    if (nextStatus === 'at-pharmacy') {
      setPanelCollapsed(false);
    }
    
    if (nextStatus === 'delivered') {
      if (window.confirm('Confirmer la livraison ?')) {
        // Mettre à jour via l'API
        try {
          await completeDelivery(orderId);
          socketService.updateDeliveryStatus(orderId, 'delivered');
          socketService.stopLocationTracking();
        } catch (error) {
          console.error('Erreur lors de la livraison:', error);
        }
        
        setDeliveryStatus(nextStatus);
        setTimeout(() => {
          navigate('/livreur-dashboard');
        }, 2000);
      }
    } else {
      setDeliveryStatus(nextStatus);
      
      // Mettre à jour le statut via Socket.IO et l'API
      try {
        if (nextStatus === 'at-pharmacy') {
          socketService.updateDeliveryStatus(orderId, 'at_pharmacy');
        } else if (nextStatus === 'to-client') {
          await pickupDelivery(orderId);
          socketService.updateDeliveryStatus(orderId, 'picked_up');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
      }
    }
  };

  const getStatusInfo = () => {
    switch (deliveryStatus) {
      case 'accepted':
        return {
          icon: '✅',
          title: 'Commande acceptée',
          subtitle: 'Préparez-vous à partir',
          action: 'Partir vers la pharmacie',
          color: '#4caf50'
        };
      case 'to-pharmacy':
        return {
          icon: '🏍️',
          title: 'En route vers la pharmacie',
          subtitle: `${orderDetails.pharmacyName}`,
          action: 'Je suis arrivé',
          color: '#2196f3'
        };
      case 'at-pharmacy':
        return {
          icon: '⚕️',
          title: 'À la pharmacie',
          subtitle: 'Récupérez les médicaments',
          action: 'J\'ai les médicaments',
          color: '#ff9800'
        };
      case 'to-client':
        return {
          icon: '🚚',
          title: 'En livraison',
          subtitle: `Vers ${orderDetails.clientName}`,
          action: 'Confirmer la livraison',
          color: '#9c27b0'
        };
      case 'delivered':
        return {
          icon: '🎉',
          title: 'Livraison terminée !',
          subtitle: 'Commande livrée avec succès',
          action: '',
          color: '#4caf50'
        };
      default:
        return {};
    }
  };

  const statusInfo = getStatusInfo();

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="driver-delivery">
      {/* Header */}
      <div className="delivery-header" style={{ background: statusInfo.color }}>
        <button className="back-btn-delivery" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-status">
          <div className="status-icon">{statusInfo.icon}</div>
          <div>
            <h2>{statusInfo.title}</h2>
            <p>{statusInfo.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="delivery-map">
        <MapContainer
          center={driverPosition}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Driver Position */}
          <Marker position={driverPosition} icon={driverIcon} />
          <Circle
            center={driverPosition}
            radius={100}
            pathOptions={{ color: '#2196f3', fillColor: '#2196f3', fillOpacity: 0.1 }}
          />

          {/* Pharmacy */}
          <Marker position={pharmacyPosition} icon={pharmacyIcon} />

          {/* Client */}
          <Marker position={clientPosition} icon={clientIcon} />

          {/* Route */}
          {routePoints.length > 0 && (
            <>
              {/* Ombre de la route */}
              <Polyline
                positions={routePoints}
                pathOptions={{ 
                  color: '#000000', 
                  weight: 8, 
                  opacity: 0.2,
                  dashArray: '0'
                }}
              />
              {/* Route principale */}
              <Polyline
                positions={routePoints}
                pathOptions={{ 
                  color: statusInfo.color, 
                  weight: 5, 
                  dashArray: '10, 10',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Ligne animée sur la route */}
              <Polyline
                positions={routePoints}
                pathOptions={{ 
                  color: 'white', 
                  weight: 2, 
                  dashArray: '10, 20',
                  dashOffset: '0',
                  lineCap: 'round'
                }}
                className="animated-route"
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className={`delivery-panel ${panelCollapsed ? 'collapsed' : ''}`}>
        {/* Toggle Button */}
        <button 
          className="panel-toggle-btn"
          onClick={() => setPanelCollapsed(!panelCollapsed)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d={panelCollapsed ? "M6 15L12 9L18 15" : "M6 9L12 15L18 9"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {!panelCollapsed && (
          <>
            {/* Order Info */}
            <div className="order-info-card">
          <div className="info-header">
            <div className="info-id">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 2H15L21 8V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V4C3 3.46957 3.21071 2.96086 3.58579 2.58579C3.96086 2.21071 4.46957 2 5 2H9Z" stroke="#2e7d32" strokeWidth="2"/>
              </svg>
              <span>{orderDetails.id}</span>
            </div>
          </div>

          <div className="contact-buttons">
            <button className="contact-btn client" onClick={() => handleCall(orderDetails.clientPhone)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" fill="currentColor"/>
              </svg>
              Appeler {orderDetails.clientName}
            </button>
          </div>

          <div className="delivery-addresses">
            <div className="address-item">
              <div className="address-icon pharmacy">⚕️</div>
              <div className="address-info">
                <div className="address-label">Pharmacie</div>
                <div className="address-text">{orderDetails.pharmacyName}</div>
                <div className="address-sub">{orderDetails.pharmacyAddress}</div>
              </div>
            </div>

            <div className="address-connector"></div>

            <div className="address-item">
              <div className="address-icon client">📍</div>
              <div className="address-info">
                <div className="address-label">Client</div>
                <div className="address-text">{orderDetails.clientName}</div>
                <div className="address-sub">{orderDetails.clientAddress}</div>
              </div>
            </div>
          </div>

          <div className="payment-info">
            <div className="payment-row">
              <span>Prix estimé</span>
              <strong>{orderDetails.estimatedPrice}</strong>
            </div>
            <div className="payment-row highlight">
              <span>Votre gain</span>
              <strong>{orderDetails.deliveryFee}</strong>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {statusInfo.action && deliveryStatus !== 'delivered' && (
          <button 
            className="action-btn"
            style={{ background: `linear-gradient(135deg, ${statusInfo.color}, ${statusInfo.color}dd)` }}
            onClick={handleStatusUpdate}
          >
            {statusInfo.action}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {deliveryStatus === 'delivered' && (
          <div className="success-message">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#4caf50"/>
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Livraison terminée !</h3>
            <p>Retour au dashboard dans quelques secondes...</p>
          </div>
        )}
          </>
        )}

        {/* Compact Info when Collapsed */}
        {panelCollapsed && (
          <div className="compact-info">
            <div className="compact-status">
              <span className="status-icon-compact">{statusInfo.icon}</span>
              <div>
                <p className="compact-title">{statusInfo.title}</p>
                <p className="compact-subtitle">
                  📍 {parseInt(calculateDistance()) > 1000 
                    ? `${(parseInt(calculateDistance()) / 1000).toFixed(1)} km` 
                    : `${calculateDistance()} m`} 
                  · ⏱️ {estimatedTime()} min
                </p>
              </div>
            </div>
            {statusInfo.action && deliveryStatus !== 'delivered' && (
              <button 
                className="compact-action-btn"
                style={{ background: statusInfo.color }}
                onClick={handleStatusUpdate}
              >
                {statusInfo.action}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Distance and Time Overlay on Map */}
      {(deliveryStatus === 'to-pharmacy' || deliveryStatus === 'to-client') && (
        <div className="map-overlay-info">
          <div className="distance-card">
            <div className="distance-value">
              {parseInt(calculateDistance()) > 1000 
                ? `${(parseInt(calculateDistance()) / 1000).toFixed(1)} km` 
                : `${calculateDistance()} m`}
            </div>
            <div className="time-value">⏱️ {estimatedTime()} min</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverDelivery;

