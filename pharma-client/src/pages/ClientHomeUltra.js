import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PHARMACIES_REELLES } from '../realPharmacies';
import OrderModal from '../components/OrderModal';
import DrawerMenu from '../components/DrawerMenu';
import socketService from '../services/socket';
import { getOrderById, getDirections } from '../services/api';
import './ClientHomeUltra.css';

// Icône pour la position de l'utilisateur (point bleu)
const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="user-location-pulse"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Icône pour les pharmacies (pin vert)
const createPharmacyIcon = () => L.divIcon({
  className: 'pharmacy-marker',
  html: `<div class="pharmacy-pin">
    <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
      <path d="M20 0C9 0 0 9 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 9 31 0 20 0Z" fill="#2e7d32"/>
      <circle cx="20" cy="20" r="8" fill="white"/>
    </svg>
  </div>`,
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50]
});

// Icône pour le livreur (moto en mouvement)
const driverIcon = L.divIcon({
  className: 'driver-marker',
  html: `<div class="driver-pin">
    <div class="driver-pulse"></div>
    <div class="driver-icon">🏍️</div>
  </div>`,
  iconSize: [50, 50],
  iconAnchor: [25, 25]
});

function ClientHomeUltra() {
  // const navigate = useNavigate();
  const formatVehicle = (vehicle) => {
    if (!vehicle) return '';
    if (typeof vehicle === 'string') return vehicle;
    const parts = [];
    if (vehicle.type) parts.push(vehicle.type);
    if (vehicle.brand) parts.push(vehicle.brand);
    if (vehicle.model) parts.push(vehicle.model);
    if (vehicle.plate) parts.push(vehicle.plate);
    return parts.join(' • ');
  };

  const [userPosition, setUserPosition] = useState([5.3600, -4.0083]); // Abidjan par défaut
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [locationName] = useState('Cocody, Abidjan');
  const [showList, setShowList] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showOnlyDeGarde, setShowOnlyDeGarde] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  // Activer automatiquement l'urgence de garde : week-end (samedi/dimanche) ou soir 18h-6h
  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 dimanche, 6 samedi
    const hour = now.getHours();
    const isWeekend = day === 0 || day === 6;
    const isNight = hour >= 18 || hour < 6;
    if ((isWeekend || isNight) && !showOnlyDeGarde) {
      setShowOnlyDeGarde(true);
      setShowList(true); // Ouvrir la liste automatiquement pour l'usage urgent
    }
  }, [showOnlyDeGarde]);

  // Suivi multi-commandes
  const [deliveries, setDeliveries] = useState({}); // {orderId: {orderNumber, status, positions, route...}}
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const mapRef = useRef(null);

  // Recentre la carte sur un ordre (livreur + pharmacie)
  const focusOnOrder = (orderId, data = deliveries) => {
    if (!orderId || !data[orderId] || !mapRef.current) return;
    const d = data[orderId];
    const points = [];
    if (d.driverPosition) points.push([d.driverPosition.lat, d.driverPosition.lng]);
    if (d.pharmacyPosition) points.push(d.pharmacyPosition);

    if (points.length === 0) return;

    if (points.length === 1) {
      mapRef.current.setView(points[0], 16);
    } else {
      const bounds = L.latLngBounds(points);
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  // Fonction pour vérifier si on est en période d'urgence (week-end ou 18h-6h)
  const isUrgentTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0=dimanche, 6=samedi
    const hour = now.getHours();
    
    // Week-end (samedi ou dimanche)
    if (day === 0 || day === 6) return true;
    
    // Lundi à vendredi: 18h à 6h (soir + nuit)
    if (hour >= 18 || hour < 6) return true;
    
    return false;
  };

  useEffect(() => {
    // Obtenir la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.log('Géolocalisation désactivée, utilisation de la position par défaut');
        }
      );
    }

    // Filtrer les pharmacies proches
    let pharmacies = PHARMACIES_REELLES.slice(0, 18);
    
    // Ajouter aléatoirement le statut "de garde" à quelques pharmacies (simulation)
    pharmacies = pharmacies.map((p, index) => ({
      ...p,
      isDeGarde: index % 4 === 0 || index % 7 === 0 // Environ 25% sont de garde
    }));
    
    setNearbyPharmacies(pharmacies);

    // Connecter Socket.IO et écouter les événements d'acceptation
    console.log('🔌 [CLIENT] Initialisation Socket.IO...');
    socketService.connect();

    // Écouter les acceptations de commande
    const handleOrderAccepted = async (data) => {
      console.log('✅ [CLIENT] Commande acceptée par un livreur:', data);
      setSelectedOrderId(data.orderId);
      
      // Charger les détails de commande (pharmacie + client) et créer/mettre à jour l'entrée
      try {
        const res = await getOrderById(data.orderId);
        if (res?.order) {
          const pharmLoc = res.order.pharmacyLocation || res.order.pharmacy?.location || res.order.pharmacyCoords;
          const clientLoc = res.order.deliveryLocation || res.order.clientLocation || res.order.destination;
          const deliveryEntry = {
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            livreurId: data.livreurId,
            status: 'accepted',
            livreur: res.order.livreur || null,
            pharmacyPosition: pharmLoc?.latitude && pharmLoc?.longitude ? [pharmLoc.latitude, pharmLoc.longitude] : null,
            clientPosition: clientLoc?.latitude && clientLoc?.longitude ? [clientLoc.latitude, clientLoc.longitude] : null,
            driverPosition: null,
            routeCoords: [],
            routeInfo: null
          };
          setDeliveries(prev => ({ ...prev, [data.orderId]: { ...(prev[data.orderId] || {}), ...deliveryEntry } }));
        }
      } catch (err) {
        console.error('❌ [CLIENT] Impossible de charger la commande:', err);
      }
      
      // Afficher une notification
      setNotification({
        type: 'success',
        title: 'Livreur assigné !',
        message: 'Un livreur a accepté votre commande et est en route vers la pharmacie.',
        orderId: data.orderId,
        showTrackButton: true
      });

      // Masquer après 8 secondes
      setTimeout(() => setNotification(null), 8000);
    };

    // Écouter TOUS les événements order:*:accepted (wildcard ne marche pas avec Socket.IO)
    // Solution: Écouter l'événement générique
    console.log('👂 [CLIENT] Ecoute de l\'événement "order:accepted"...');
    socketService.on('order:accepted', handleOrderAccepted);

    // Écouter les mises à jour de statut de livraison
    const handleStatusUpdate = (data) => {
      console.log('📦 [CLIENT] Statut livraison mis à jour:', data);
      if (data?.status && data?.orderId) {
        setDeliveries(prev => {
          const existing = prev[data.orderId] || {};
          return {
            ...prev,
            [data.orderId]: {
              ...existing,
              status: data.status
            }
          };
        });
      }
      
      const statusMessages = {
        'to_pharmacy': {
          title: '🏍️ En route vers la pharmacie',
          message: 'Le livreur se dirige vers la pharmacie pour récupérer vos médicaments.',
          type: 'info'
        },
        'at_pharmacy': {
          title: '⚕️ À la pharmacie',
          message: 'Le livreur est arrivé à la pharmacie et récupère votre commande.',
          type: 'info'
        },
        'to_client': {
          title: '🚚 En route vers vous !',
          message: 'Vos médicaments ont été récupérés. Le livreur arrive bientôt !',
          type: 'success'
        },
        'delivered': {
          title: '🎉 Livraison terminée !',
          message: 'Votre commande a été livrée avec succès. Bonne santé !',
          type: 'success'
        }
      };
      
      const statusInfo = statusMessages[data.status];
      if (statusInfo) {
        setNotification({
          ...statusInfo,
          showTrackButton: false
        });
        setTimeout(() => setNotification(null), 6000);
      }
    };
    
    if (socketService.socket) {
      socketService.socket.on('order:status-update', handleStatusUpdate);
    }

    // Test: Ajouter aussi un écouteur pour TOUS les événements
    if (socketService.socket) {
      socketService.socket.onAny((eventName, ...args) => {
        console.log(`📩 [CLIENT] Événement reçu: ${eventName}`, args);
        
        // Si c'est un événement d'acceptation spécifique, le traiter aussi
        if (eventName.match(/^order:\d+:accepted$/)) {
          console.log('🎯 [CLIENT] Détection événement acceptation spécifique!');
          handleOrderAccepted(args[0]);
        }
        
        // Si c'est un événement de mise à jour de statut spécifique
        if (eventName.match(/^order:\d+:status-update$/)) {
          console.log('🎯 [CLIENT] Détection événement statut spécifique!');
          handleStatusUpdate(args[0]);
        }
        
        // Si c'est une mise à jour de position GPS
        if (eventName === 'driver-location-update') {
          console.log('📍 [CLIENT] Position livreur reçue:', args[0]);
          const locationData = args[0];
          if (!locationData?.orderId || !locationData.location) return;
          
          setDeliveries(prev => {
            const current = prev[locationData.orderId] || {};
            return {
              ...prev,
              [locationData.orderId]: {
                ...current,
                driverPosition: {
                  lat: locationData.location.latitude,
                  lng: locationData.location.longitude,
                  speed: locationData.location.speed,
                  timestamp: locationData.location.timestamp
                }
              }
            };
          });
        }
      });
    }

    return () => {
      console.log('🔌 [CLIENT] Nettoyage Socket.IO...');
      socketService.off('order:accepted');
    };
  }, []);

  // Filtrer les pharmacies selon le mode
  const displayedPharmacies = showOnlyDeGarde 
    ? nearbyPharmacies.filter(p => p.isDeGarde && p.isOpen)
    : nearbyPharmacies;

  const handleUrgenceDeGarde = () => {
    setShowOnlyDeGarde(!showOnlyDeGarde);
    if (!showOnlyDeGarde) {
      setShowList(true); // Ouvrir la liste automatiquement
    }
  };

  const handleCommand = () => {
    // Ouvrir le modal de commande
    setIsOrderModalOpen(true);
  };

  const handlePrescription = () => {
    // Ouvrir le modal de commande
    setIsOrderModalOpen(true);
  };

  // Recalculer l'itinéraire pour chaque livraison dès qu'on a une position livreur
  useEffect(() => {
    const computeRoutes = async () => {
      const entries = Object.values(deliveries);
      for (const d of entries) {
        if (!d.driverPosition) continue;
        const destination = (d.status === 'to-client' || d.status === 'delivered') ? d.clientPosition : d.pharmacyPosition;
        if (!destination || !destination[0] || !destination[1]) continue;
        try {
          const originStr = `${d.driverPosition.lat},${d.driverPosition.lng}`;
          const destStr = `${destination[0]},${destination[1]}`;
          const res = await getDirections(originStr, destStr);
          if (res?.success && res.route?.polyline) {
            const coords = res.route.polyline.map(p => [p.lat, p.lng]);
            setDeliveries(prev => ({
              ...prev,
              [d.orderId]: {
                ...prev[d.orderId],
                routeCoords: coords,
                routeInfo: {
                  distance: res.route.distance?.text,
                  duration: res.route.duration_in_traffic?.text || res.route.duration?.text
                }
              }
            }));
          }
        } catch (err) {
          console.error('❌ [CLIENT] Erreur itinéraire:', err);
        }
      }
    };
    computeRoutes();
  }, [deliveries]);

  // Recentrer la carte sur le livreur (et la pharmacie) quand on sélectionne une commande
  useEffect(() => {
    focusOnOrder(selectedOrderId, deliveries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderId, deliveries]);

  return (
    <div className="client-home-ultra">
      {/* Notification d'acceptation de commande */}
      {notification && (
        <div className={`order-notification ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'success' ? '✅' : 'ℹ️'}
          </div>
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            {notification.showTrackButton && selectedOrderId && deliveries[selectedOrderId] && (
              <button 
                className="track-button"
                onClick={() => {
                  setNotification(null);
                  setSelectedOrderId(selectedOrderId);
                }}
              >
                📍 Voir sur la carte
              </button>
            )}
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Menu latéral */}
      <DrawerMenu 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Modal de commande */}
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />

      {/* En-tête moderne */}
      <div className="map-header-modern">
        <button className="back-btn-modern" onClick={() => setIsDrawerOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="map-title-modern">Pharmacies</h1>
        <button className="location-btn-modern" onClick={() => setShowList(!showList)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Bouton Urgence Pharmacie de Garde - affiché uniquement en période d'urgence */}
      {isUrgentTime() && !showOnlyDeGarde && (
        <button 
          className="urgence-btn"
          onClick={handleUrgenceDeGarde}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 5V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V5L12 2Z" fill="currentColor"/>
            <path d="M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="white"/>
          </svg>
          <span>Urgence pharmacie de garde</span>
        </button>
      )}

      {/* Carte */}
      <div className="map-container-ultra">
        <MapContainer
          center={userPosition}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Position de l'utilisateur */}
          <Marker position={userPosition} icon={userIcon}>
            <Popup>Votre position</Popup>
          </Marker>

          {/* Livraisons en cours : drivers + itinéraires multiples */}
          {Object.values(deliveries).map((d) => (
            <React.Fragment key={d.orderId || d.orderNumber}>
              {d.driverPosition && (
                <Marker 
                  position={[d.driverPosition.lat, d.driverPosition.lng]} 
                  icon={driverIcon}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>🏍️ Livreur</strong>
                      <br />
                      <small>Commande: {d.orderNumber}</small>
                      {d.driverPosition.speed > 0 && (
                        <>
                          <br />
                          <small>Vitesse: {(d.driverPosition.speed * 3.6).toFixed(0)} km/h</small>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}

              {d.pharmacyPosition && (
                <Marker position={d.pharmacyPosition} icon={createPharmacyIcon()}>
                  <Popup>Pharmacie</Popup>
                </Marker>
              )}

              {d.clientPosition && (
                <Marker position={d.clientPosition} icon={userIcon}>
                  <Popup>Adresse de livraison</Popup>
                </Marker>
              )}

              {d.routeCoords && d.routeCoords.length > 0 && (
                <Polyline
                  positions={d.routeCoords}
                  pathOptions={{ color: '#2563EB', weight: d.orderId === selectedOrderId ? 7 : 5, opacity: 0.9 }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Cercle autour de l'utilisateur */}
          <Circle
            center={userPosition}
            radius={1000}
            pathOptions={{
              color: '#2196f3',
              fillColor: '#2196f3',
              fillOpacity: 0.1,
              weight: 2
            }}
          />

          {/* Marqueurs des pharmacies */}
          {displayedPharmacies.map((pharmacy, index) => (
            <Marker
              key={pharmacy.id || pharmacy.name || index}
              position={pharmacy.position}
              icon={createPharmacyIcon()}
              eventHandlers={{
                click: () => setSelectedPharmacy(pharmacy)
              }}
            >
              <Popup>
                <div className="pharmacy-popup">
                  <h3>{pharmacy.name}</h3>
                  <p>{pharmacy.address}</p>
                  <div className="pharmacy-badges">
                    <span className={`status ${pharmacy.isOpen ? 'open' : 'closed'}`}>
                      {pharmacy.isOpen ? '🟢 Ouverte' : '🔴 Fermée'}
                    </span>
                    {pharmacy.isDeGarde && (
                      <span className="badge-de-garde">🚑 DE GARDE</span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Panel moderne en bas */}
      <div className={`bottom-panel-modern ${showList ? 'expanded' : 'collapsed'}`}>
        {/* Indicateur de drag */}
        <div className="drag-indicator" onClick={() => setShowList(!showList)}>
          <div className="drag-line"></div>
        </div>

        {/* Bouton de fermeture */}
        {showList && (
          <button 
            className="close-panel-btn"
            onClick={() => setShowList(false)}
            title="Fermer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        )}

        {/* Contenu principal */}
        <div className="panel-content">
          {/* En-tête du panel - Affiché uniquement en mode liste */}
          {showList && (
            <div className="panel-header">
              <div className="location-badge">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C6.13 0 3 3.13 3 7C3 12.25 10 20 10 20C10 20 17 12.25 17 7C17 3.13 13.87 0 10 0ZM10 9.5C8.62 9.5 7.5 8.38 7.5 7C7.5 5.62 8.62 4.5 10 4.5C11.38 4.5 12.5 5.62 12.5 7C12.5 8.38 11.38 9.5 10 9.5Z" fill="#2e7d32"/>
                </svg>
                <span>Votre position</span>
              </div>
              <h2 className="location-title">{locationName}</h2>
              <div className="pharmacy-stats">
                <span className="stat-item">
                  <span className="stat-number">{displayedPharmacies.length}</span>
                  <span className="stat-label">{showOnlyDeGarde ? 'de garde' : 'pharmacies'}</span>
                </span>
                <span className="stat-divider">•</span>
                <span className="stat-item">
                  <span className="stat-number">{displayedPharmacies.filter(p => p.isOpen).length}</span>
                  <span className="stat-label">ouvertes</span>
                </span>
                {showOnlyDeGarde && (
                  <>
                    <span className="stat-divider">•</span>
                    <span className="stat-item urgence-tag">
                      <span className="stat-label">🚑 Mode urgence</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Boutons d'action modernes */}
          <div className="action-buttons-modern">
            <button className="btn-modern btn-secondary" onClick={handlePrescription}>
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
                  <line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="btn-text">
                <span className="btn-label">Ordonnance</span>
              </div>
            </button>
            
            <button className="btn-modern btn-primary" onClick={handleCommand}>
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/>
                </svg>
              </div>
              <div className="btn-text">
                <span className="btn-label">Commander</span>
              </div>
            </button>
          </div>

          {/* Suivi de livraison */}
          {selectedOrderId && deliveries[selectedOrderId] && (
            <div className="tracking-card">
              <div className="tracking-header">
                <div>
                  <div className="tracking-title">Suivi commande {deliveries[selectedOrderId].orderNumber || selectedOrderId}</div>
                  <div className="tracking-subtitle">
                    {deliveries[selectedOrderId].status === 'to-pharmacy' ? 'En route vers la pharmacie' :
                     deliveries[selectedOrderId].status === 'at-pharmacy' ? 'À la pharmacie' :
                     deliveries[selectedOrderId].status === 'to-client' ? 'En route vers vous' :
                     deliveries[selectedOrderId].status === 'delivered' ? 'Livrée' : 'Acceptée'}
                  </div>
                </div>
                {deliveries[selectedOrderId].routeInfo && (
                  <div className="tracking-metrics">
                    <span>{deliveries[selectedOrderId].routeInfo.distance}</span>
                    <span className="dot">•</span>
                    <span>{deliveries[selectedOrderId].routeInfo.duration}</span>
                  </div>
                )}
              </div>
              {deliveries[selectedOrderId].livreur && (
                <div className="tracking-driver" onClick={() => focusOnOrder(selectedOrderId)}>
                  <div className="avatar">{deliveries[selectedOrderId].livreur.name?.[0] || 'L'}</div>
                  <div className="driver-info">
                    <div className="driver-name">{deliveries[selectedOrderId].livreur.name}</div>
                    <div className="driver-meta">
                      <span>{deliveries[selectedOrderId].livreur.phone}</span>
                      {(() => {
                        const vehicleStr = formatVehicle(deliveries[selectedOrderId].livreur.vehicle);
                        return vehicleStr
                          ? (
                            <>
                              <span className="dot">•</span>
                              <span>{vehicleStr}</span>
                            </>
                          )
                          : null;
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Liste des commandes avec sélection */}
          {Object.values(deliveries).length > 0 && (
            <div className="tracking-list">
              <h3>Vos commandes</h3>
              <div className="list-items">
                {Object.values(deliveries).map((d) => (
                  <div
                    key={d.orderId || d.orderNumber}
                    className={`tracking-item ${selectedOrderId === d.orderId ? 'selected' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedOrderId(d.orderId);
                      focusOnOrder(d.orderId);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedOrderId(d.orderId);
                        focusOnOrder(d.orderId);
                      }
                    }}
                  >
                    <div className="tracking-item-main">
                      <div className="tracking-item-title">{d.orderNumber || `Commande ${d.orderId}`}</div>
                      <div className="tracking-item-sub">
                        {d.status === 'to-pharmacy' ? 'Vers la pharmacie' :
                         d.status === 'at-pharmacy' ? 'À la pharmacie' :
                         d.status === 'to-client' ? 'Vers vous' :
                         d.status === 'delivered' ? 'Livrée' : 'Acceptée'}
                      </div>
                    </div>
                    <div className="tracking-item-meta">
                      {d.livreur?.name && <span>{d.livreur.name}</span>}
                      {d.routeInfo?.distance && (
                        <>
                          <span className="dot">•</span>
                          <span>{d.routeInfo.distance}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Liste des pharmacies (si expanded) */}
          {showList && (
            <div className="pharmacies-list">
              <h3 className="list-title">
                {showOnlyDeGarde ? 'Pharmacies de garde ouvertes' : 'Pharmacies à proximité'}
              </h3>
              <div className="list-items">
          {displayedPharmacies.slice(0, 10).map((pharmacy, index) => (
                  <div 
              key={pharmacy.id || pharmacy.name || index} 
                    className={`pharmacy-item ${selectedPharmacy === pharmacy ? 'selected' : ''} ${pharmacy.isDeGarde ? 'de-garde' : ''}`}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                  >
                    <div className="pharmacy-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L4 5V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V5L12 2ZM15 16H13V18H11V16H9V14H11V12H9V10H11V8H13V10H15V12H13V14H15V16Z" fill="#2e7d32"/>
                      </svg>
                    </div>
                    <div className="pharmacy-info">
                      <h4>
                        {pharmacy.name}
                        {pharmacy.isDeGarde && <span className="mini-badge-garde">🚑</span>}
                      </h4>
                      <p>{pharmacy.address}</p>
                    </div>
                    <div className={`pharmacy-status ${pharmacy.isOpen ? 'open' : 'closed'}`}>
                      <span className="status-dot"></span>
                      {pharmacy.isOpen ? 'Ouverte' : 'Fermée'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientHomeUltra;
