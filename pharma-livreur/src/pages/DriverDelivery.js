import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import socketService from '../services/socket';
import { getOrderById, startDelivery, arriveAtPharmacy, pickupDelivery, completeDelivery } from '../services/api';
import { calculateCurrentRoute, calculateFullDeliveryRoute, shouldRecalculateRoute } from '../services/routingGoogleMaps';
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

// Composant pour centrer automatiquement la carte sur le livreur
function MapCenterController({ center, zoom = 16 }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, {
        animate: true,
        duration: 1.5 // Animation fluide
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

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
  
  // États pour l'itinéraire Google Maps
  const [routeData, setRouteData] = useState(null); // Données de l'itinéraire actuel
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [lastRouteUpdate, setLastRouteUpdate] = useState(Date.now()); // Pour éviter trop de recalculs

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
  
  // Calculer l'itinéraire avec Google Maps (seulement au changement de statut)
  useEffect(() => {
    const fetchRoute = async () => {
      if (deliveryStatus === 'delivered') return;
      
      // Éviter de recalculer si moins de 30 secondes se sont écoulées
      const timeSinceLastUpdate = Date.now() - lastRouteUpdate;
      if (timeSinceLastUpdate < 30000 && routeData) {
        console.log('⏳ Itinéraire récent, pas de recalcul');
        return;
      }
      
      setRouteLoading(true);
      setRouteError(null);
      
      try {
        console.log('🗺️ Calcul itinéraire Google Maps...', { status: deliveryStatus });
        
        const route = await calculateCurrentRoute(
          driverPosition,
          pharmacyPosition,
          clientPosition,
          deliveryStatus
        );
        
        if (route) {
          setRouteData(route);
          setRoutePoints(route.route); // [[lat, lng], ...]
          setLastRouteUpdate(Date.now());
          console.log('✅ Itinéraire calculé:', {
            distance: route.distance,
            duration: route.durationInTraffic || route.duration,
            points: route.route.length
          });
        }
      } catch (error) {
        console.error('❌ Erreur calcul itinéraire:', error);
        setRouteError('Impossible de calculer l\'itinéraire');
      } finally {
        setRouteLoading(false);
      }
    };
    
    fetchRoute();
    // IMPORTANT: Ne recalculer QUE quand le statut change, PAS à chaque changement de position
  }, [deliveryStatus]);
  
  // Recalculer l'itinéraire si le livreur s'éloigne trop de la route
  useEffect(() => {
    if (!routePoints || routePoints.length === 0 || deliveryStatus === 'delivered') return;
    
    const interval = setInterval(() => {
      if (shouldRecalculateRoute(driverPosition, routePoints, 0.2)) { // 200m de tolérance
        console.log('🔄 Livreur s\'est éloigné de la route (>200m), recalcul...');
        
        // Recalculer l'itinéraire
        calculateCurrentRoute(
          driverPosition,
          pharmacyPosition,
          clientPosition,
          deliveryStatus
        ).then(route => {
          if (route) {
            setRouteData(route);
            setRoutePoints(route.route);
            console.log('✅ Itinéraire recalculé avec succès');
          }
        }).catch(error => {
          console.error('❌ Erreur recalcul itinéraire:', error);
        });
      }
    }, 60000); // Vérifier toutes les 60 secondes (au lieu de 30)
    
    return () => clearInterval(interval);
  }, [driverPosition, routePoints, deliveryStatus, pharmacyPosition, clientPosition]);

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
    
    if (!nextStatus) return;
    
    // Gestion spéciale pour la livraison terminée
    if (nextStatus === 'delivered') {
      if (window.confirm('Confirmer la livraison ?')) {
        try {
          await completeDelivery(orderId);
          socketService.stopLocationTracking();
          setDeliveryStatus(nextStatus);
          
          console.log('✅ Livraison terminée avec succès !');
          
          setTimeout(() => {
            navigate('/livreur-dashboard');
          }, 2000);
        } catch (error) {
          console.error('❌ Erreur lors de la livraison:', error);
          alert('Erreur lors de la confirmation de la livraison');
        }
      }
      return;
    }
    
    // Pour les autres changements de statut
    try {
      if (nextStatus === 'to-pharmacy') {
        // Démarrer la livraison
        await startDelivery(orderId);
        console.log('🏍️ Départ vers la pharmacie !');
        setPanelCollapsed(true);
        
      } else if (nextStatus === 'at-pharmacy') {
        // Arrivé à la pharmacie
        await arriveAtPharmacy(orderId);
        console.log('⚕️ Arrivé à la pharmacie !');
        setPanelCollapsed(false);
        
      } else if (nextStatus === 'to-client') {
        // Médicaments récupérés, départ vers le client
        await pickupDelivery(orderId);
        console.log('🚚 Médicaments récupérés, en route vers le client !');
        setPanelCollapsed(true);
      }
      
      setDeliveryStatus(nextStatus);
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      alert(error.message || 'Erreur lors de la mise à jour du statut');
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
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* Composant pour centrer automatiquement sur le livreur */}
          <MapCenterController center={driverPosition} zoom={16} />

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

          {/* Route Google Maps tracée */}
          {routePoints && routePoints.length > 0 ? (
            <>
              {console.log('🗺️ Affichage de la route:', routePoints.length, 'points')}
              {/* Ombre de la route pour meilleure visibilité */}
              <Polyline
                positions={routePoints}
                pathOptions={{ 
                  color: '#000000', 
                  weight: 8, 
                  opacity: 0.2,
                }}
              />
              {/* Route principale colorée */}
              <Polyline
                positions={routePoints}
                pathOptions={{ 
                  color: '#667eea', // Violet/bleu
                  weight: 6, 
                  opacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            </>
          ) : (
            console.log('❌ Aucune route à afficher (routePoints vide)')
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
        
        {/* Informations itinéraire Google Maps */}
        {routeData && (
          <div className="route-info">
            <h4>📍 Itinéraire</h4>
            {routeLoading && <p className="loading-text">Calcul en cours...</p>}
            {routeError && <p className="error-text">{routeError}</p>}
            {!routeLoading && !routeError && (
              <>
                <div className="route-detail">
                  <span>Distance</span>
                  <strong>{routeData.distance}</strong>
                </div>
                <div className="route-detail">
                  <span>Temps estimé</span>
                  <strong>{routeData.duration}</strong>
                </div>
                {routeData.durationInTraffic && (
                  <div className="route-detail traffic">
                    <span>⚠️ Avec trafic</span>
                    <strong className="traffic-time">{routeData.durationInTraffic}</strong>
                  </div>
                )}
                <div className="route-steps">
                  <summary>Instructions</summary>
                  {routeData.instructions && routeData.instructions.slice(0, 3).map((step, index) => (
                    <div key={index} className="step-item">
                      <span className="step-number">{index + 1}</span>
                      <span className="step-instruction">{step.instruction}</span>
                      <span className="step-distance">{step.distance}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

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

