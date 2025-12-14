import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CONFIG } from '../config';
import { startDelivery, arriveAtPharmacy, pickupDelivery, completeDelivery, getOrderById } from '../services/api';
import socketService from '../services/socket';
import './DriverDeliveryGoogleMaps.css';

const GOOGLE_MAPS_KEY = CONFIG.GOOGLE_MAPS_API_KEY;
const MAP_SCRIPT_ID = 'google-maps-script';

function DriverDeliveryGoogleMaps() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // États
  const [deliveryStatus, setDeliveryStatus] = useState('accepted');
  const [driverPosition, setDriverPosition] = useState(null);
  const [pharmacyPosition, setPharmacyPosition] = useState(null);
  const [clientPosition, setClientPosition] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [followMode, setFollowMode] = useState(true);
  const [isArriving, setIsArriving] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [nextTurn, setNextTurn] = useState(null);
  const [speed, setSpeed] = useState(0);

  // Refs
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const watchIdRef = useRef(null);
  const mapInitializedRef = useRef(false);

  // Charger Google Maps Script
  useEffect(() => {
    const loadScript = () => {
      if (window.google && window.google.maps) {
        // Attendre que le DOM soit prêt avant d'initialiser
        setTimeout(() => initializeMap(), 200);
        return;
      }

      // Ne pas injecter plusieurs fois le script
      if (document.getElementById(MAP_SCRIPT_ID)) {
        // Script déjà chargé, attendre qu'il soit prêt
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            setTimeout(() => initializeMap(), 200);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = MAP_SCRIPT_ID;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google Maps chargé');
        setTimeout(() => initializeMap(), 200);
      };
      script.onerror = () => {
        console.error('❌ Erreur de chargement Google Maps (clé API / réseau)'); 
      };
      document.head.appendChild(script);
    };

    loadScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialiser la carte Google Maps
  const initializeMap = () => {
    if (mapInitializedRef.current) return;
    if (!mapRef.current || !window.google) return;
    mapInitializedRef.current = true;

    const initialPosition = driverPosition || { lat: 5.3600, lng: -4.0083 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 18,
      tilt: 60, // Vue 3D
      heading: 0,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    googleMapRef.current = map;
    // Forcer le type roadmap pour éviter un fond noir si le satellite échoue
    map.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
    
    // Fix affichage à blanc sur certaines acceptations : forcer plusieurs resize
    setTimeout(() => {
      window.google.maps.event.trigger(map, 'resize');
      map.setCenter(initialPosition);
      map.setZoom(18);
    }, 200);
    
    setTimeout(() => {
      window.google.maps.event.trigger(map, 'resize');
      map.setCenter(initialPosition);
      map.setZoom(18);
      map.setTilt(60);
    }, 500);

    // Initialiser le DirectionsRenderer
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      preserveViewport: true, // IMPORTANT: Empêche le zoom automatique sur tout l'itinéraire
      polylineOptions: {
        strokeColor: '#2563EB',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });

    // Créer le marqueur du livreur
    driverMarkerRef.current = new window.google.maps.Marker({
      position: initialPosition,
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        fillColor: '#2563EB',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        rotation: 0
      },
      zIndex: 1000
    });

    console.log('✅ Carte Google Maps 3D initialisée');
    
    // Démarrer le GPS
    startGPSTracking();
    // Focus initial
    focusOnDriver(false);
  };

  // Assurer l'affichage de la carte après changements de statut
  useEffect(() => {
    if (!googleMapRef.current || !window.google) return;
    setTimeout(() => {
      window.google.maps.event.trigger(googleMapRef.current, 'resize');
      if (driverPosition) {
        googleMapRef.current.setCenter(driverPosition);
      }
      googleMapRef.current.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryStatus]);

  // Assurer l'affichage quand la position driver arrive
  useEffect(() => {
    if (!googleMapRef.current || !window.google || !driverPosition) return;
    setTimeout(() => {
      window.google.maps.event.trigger(googleMapRef.current, 'resize');
      googleMapRef.current.setCenter(driverPosition);
      googleMapRef.current.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
    }, 120);
  }, [driverPosition]);

  // Suivi GPS en temps réel
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      console.error('❌ Géolocalisation non disponible');
      startGPSSimulation(); // fallback desktop
      return;
    }

    let gpsTimeout = setTimeout(() => {
      console.warn('⚠️ GPS trop lent, bascule en mode simulation');
      navigator.geolocation.clearWatch(watchIdRef.current);
      startGPSSimulation();
    }, 8000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        clearTimeout(gpsTimeout);
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const heading = position.coords.heading || calculateHeading(driverPosition, newPosition);
        const currentSpeed = position.coords.speed ? (position.coords.speed * 3.6).toFixed(0) : 0;

        setDriverPosition(newPosition);
        setSpeed(currentSpeed);

        // Mettre à jour le marqueur
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setPosition(newPosition);
          
          if (heading !== null) {
            const icon = driverMarkerRef.current.getIcon();
            icon.rotation = heading;
            driverMarkerRef.current.setIcon(icon);
          }
        }

        // Centrer la caméra sur le livreur (mode suivi)
        if (followMode && googleMapRef.current) {
          googleMapRef.current.panTo(newPosition);
          
          if (heading !== null) {
            googleMapRef.current.setHeading(heading);
          }
        }

        // Envoyer la position au backend
        socketService.emit('driver-location-update', {
          orderId: orderId,
          location: {
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            speed: currentSpeed,
            heading: heading || 0,
            timestamp: new Date().toISOString()
          }
        });

        // Vérifier la distance jusqu'à la destination
        checkArrivalDistance(newPosition);
      },
      (error) => {
        console.error('❌ Erreur GPS:', error);
        startGPSSimulation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Simulation GPS pour desktop / timeout
  const startGPSSimulation = () => {
    console.log('🤖 Mode simulation GPS activé');
    let t = 0;
    let isFirstPosition = true;
    const path = [
      { lat: 5.3600, lng: -4.0083 },
      { lat: 5.3550, lng: -4.0110 },
      { lat: 5.3500, lng: -4.0150 }, // pharmacie
      { lat: 5.3580, lng: -4.0120 },
      { lat: 5.3650, lng: -4.0100 } // client
    ];

    const interval = setInterval(() => {
      if (!googleMapRef.current) return;
      const idx = Math.min(path.length - 1, Math.floor(t / 2));
      const newPosition = path[idx];
      setDriverPosition(newPosition);

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setPosition(newPosition);
      }
      
      // Premier positionnement : zoomer sur le livreur
      if (isFirstPosition) {
        isFirstPosition = false;
        const map = googleMapRef.current;
        map.setCenter(newPosition);
        map.setZoom(18);
        map.setTilt(60);
        console.log('📍 Position initiale simulée, zoom appliqué');
      } else if (followMode) {
        googleMapRef.current.panTo(newPosition);
      }
      
      checkArrivalDistance(newPosition);
      t++;
      if (t > path.length * 2) clearInterval(interval);
    }, 1500);
  };

  // Calculer le cap (heading) entre deux positions
  const calculateHeading = (from, to) => {
    if (!from || !to) return null;
    
    const fromLat = from.lat * Math.PI / 180;
    const fromLng = from.lng * Math.PI / 180;
    const toLat = to.lat * Math.PI / 180;
    const toLng = to.lng * Math.PI / 180;

    const dLng = toLng - fromLng;
    const y = Math.sin(dLng) * Math.cos(toLat);
    const x = Math.cos(fromLat) * Math.sin(toLat) -
              Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);

    let heading = Math.atan2(y, x) * 180 / Math.PI;
    heading = (heading + 360) % 360;

    return heading;
  };

  // Calculer l'itinéraire
  useEffect(() => {
    if (!googleMapRef.current || !driverPosition || !window.google) return;

    let destination;
    if (deliveryStatus === 'accepted' || deliveryStatus === 'to-pharmacy') {
      destination = pharmacyPosition;
    } else if (deliveryStatus === 'to-client' || deliveryStatus === 'delivering') {
      destination = clientPosition;
    } else {
      return;
    }

    if (!destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: driverPosition,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: 'bestguess'
        }
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current?.setDirections(result);

          const route = result.routes[0];
          const leg = route.legs[0];

          setRouteData({
            distance: leg.distance.text,
            duration: leg.duration.text,
            durationInTraffic: leg.duration_in_traffic?.text || leg.duration.text
          });

          // Extraire le prochain virage
          if (leg.steps && leg.steps.length > 0) {
            const nextStep = leg.steps[0];
            setNextTurn({
              instruction: nextStep.instructions.replace(/<[^>]*>/g, ''),
              distance: nextStep.distance.text
            });
          }

          // Créer/mettre à jour le marqueur de destination
          if (!destinationMarkerRef.current) {
            destinationMarkerRef.current = new window.google.maps.Marker({
              position: destination,
              map: googleMapRef.current,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#EF4444',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 3
              }
            });
          } else {
            destinationMarkerRef.current.setPosition(destination);
          }

          // Après recalcul, forcer le focus/zoom sur le livreur
          focusOnDriver(true);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverPosition, deliveryStatus, pharmacyPosition, clientPosition]);

  // Vérifier la distance jusqu'à la destination
  const checkArrivalDistance = (currentPosition) => {
    if (!currentPosition || !window.google) return;

    let destination;
    if (deliveryStatus === 'to-pharmacy') {
      destination = pharmacyPosition;
    } else if (deliveryStatus === 'to-client') {
      destination = clientPosition;
    } else {
      return;
    }

    if (!destination) return;

    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng),
      new window.google.maps.LatLng(destination.lat, destination.lng)
    );

    // Si moins de 100m, afficher le badge "Vous arrivez"
    setIsArriving(distance < 100);
  };

  // Gérer les mises à jour de statut
  const handleStatusUpdate = async (newStatus) => {
    try {
      switch (newStatus) {
        case 'to-pharmacy':
          setFollowMode(true);
          await startDelivery(orderId);
          setDeliveryStatus('to-pharmacy');
          focusOnDriver(true);
          break;
        case 'at-pharmacy':
          setFollowMode(true);
          await arriveAtPharmacy(orderId);
          setDeliveryStatus('at-pharmacy');
          focusOnDriver(true);
          break;
        case 'to-client':
          setFollowMode(true);
          await pickupDelivery(orderId);
          setDeliveryStatus('to-client');
          focusOnDriver(true);
          break;
        case 'delivered':
          await completeDelivery(orderId);
          setDeliveryStatus('delivered');
          navigate('/livreur-dashboard');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
    }
  };

  // Bouton de recentrage
  const handleRecenter = () => {
    setFollowMode(true);
    focusOnDriver(true);
  };

  // Gérer les gestes sur la carte
  const handleMapGesture = () => {
    setFollowMode(false);
  };

  // Focus caméra sur le driver avec zoom/tilt/heading
  const focusOnDriver = (animate = false) => {
    if (!googleMapRef.current) return;
    const map = googleMapRef.current;
    
    // Utiliser la position du livreur ou la position initiale par défaut
    const position = driverPosition || driverMarkerRef.current?.getPosition() || { lat: 5.3600, lng: -4.0083 };
    const positionLatLng = position.lat ? position : { lat: position.lat(), lng: position.lng() };
    
    const heading = driverMarkerRef.current?.getIcon()?.rotation || map.getHeading() || 0;

    console.log('📍 Focus sur driver:', positionLatLng, 'Zoom: 18, Tilt: 60');
    
    // Forcer le zoom et l'inclinaison 3D
    map.setZoom(18);
    map.setTilt(60);
    map.setHeading(heading);
    
    if (animate && map.panTo) {
      map.panTo(positionLatLng);
    } else {
      map.setCenter(positionLatLng);
    }
  };

  // Charger les détails de la commande depuis l'API
  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        console.log('📦 Chargement commande:', orderId);
        const response = await getOrderById(orderId);
        console.log('✅ Commande chargée:', response);
        
        if (response.success && response.order) {
          const order = response.order;
          setOrderDetails({
            ...order,
            clientName: order.clientName || `${order.client?.firstName || ''} ${order.client?.lastName || ''}`.trim() || 'Client',
            clientAddress: order.clientAddress || order.deliveryAddress || 'Adresse non spécifiée',
            pharmacyName: order.pharmacyName || 'Pharmacie',
            pharmacyAddress: order.pharmacyAddress || 'Adresse pharmacie non spécifiée'
          });
          
          // Position pharmacie
          if (order.pharmacyLocation) {
            setPharmacyPosition({
              lat: order.pharmacyLocation.lat,
              lng: order.pharmacyLocation.lng
            });
          }
          
          // Position client
          if (order.deliveryLocation || order.clientLocation) {
            const clientLoc = order.deliveryLocation || order.clientLocation;
            setClientPosition({
              lat: clientLoc.lat,
              lng: clientLoc.lng
            });
          }
        } else {
          console.warn('⚠️ Commande non trouvée ou réponse invalide');
        }
      } catch (error) {
        console.error('❌ Erreur chargement commande:', error);
        // Valeurs par défaut en cas d'erreur
        setOrderDetails({
          clientName: 'Client',
          clientAddress: 'Adresse non disponible',
          pharmacyName: 'Pharmacie',
          pharmacyAddress: 'Adresse non disponible'
        });
        setPharmacyPosition({ lat: 5.3500, lng: -4.0150 });
        setClientPosition({ lat: 5.3650, lng: -4.0100 });
      }
    };
    
    if (orderId) {
      loadOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Obtenir le texte du bouton selon le statut
  const getButtonText = () => {
    switch (deliveryStatus) {
      case 'accepted': return '🚀 Partir vers la pharmacie';
      case 'to-pharmacy': return '🏥 Je suis arrivé à la pharmacie';
      case 'at-pharmacy': return '📦 J\'ai récupéré les médicaments';
      case 'to-client': return '✅ Livraison terminée';
      default: return 'Continuer';
    }
  };

  // Obtenir la couleur du bouton selon le statut
  const getButtonColor = () => {
    switch (deliveryStatus) {
      case 'accepted': return '#10B981'; // Vert
      case 'to-pharmacy': return '#3B82F6'; // Bleu
      case 'at-pharmacy': return '#F59E0B'; // Orange
      case 'to-client': return '#8B5CF6'; // Violet
      default: return '#2563EB';
    }
  };

  // Obtenir la prochaine action
  const getNextStatus = () => {
    switch (deliveryStatus) {
      case 'accepted': return 'to-pharmacy';
      case 'to-pharmacy': return 'at-pharmacy';
      case 'at-pharmacy': return 'to-client';
      case 'to-client': return 'delivered';
      default: return null;
    }
  };

  return (
    <div className="driver-delivery-3d">
      {/* Carte Google Maps 3D */}
      <div 
        ref={mapRef} 
        className="google-map-3d"
        onClick={handleMapGesture}
        onTouchStart={handleMapGesture}
      />

      {/* HUD Header */}
      <div className="hud-header" style={{ background: getButtonColor() }}>
        <button className="back-btn" onClick={() => navigate('/livreur-dashboard')}>
          ←
        </button>
        <div className="order-info">
          <span className="order-number">Commande #{orderId}</span>
          <span className="client-name">
            {deliveryStatus === 'accepted' || deliveryStatus === 'to-pharmacy' 
              ? `📍 ${orderDetails?.pharmacyName || 'Pharmacie'}`
              : `📍 ${orderDetails?.clientName || 'Client'}`}
          </span>
          <span className="destination-address">
            {deliveryStatus === 'accepted' || deliveryStatus === 'to-pharmacy'
              ? orderDetails?.pharmacyAddress
              : orderDetails?.clientAddress}
          </span>
        </div>
      </div>

      {/* Prochain virage HUD */}
      {nextTurn && (
        <div className="next-turn-hud">
          <div className="turn-icon">➡️</div>
          <div className="turn-info">
            <div className="turn-instruction">{nextTurn.instruction}</div>
            <div className="turn-distance">{nextTurn.distance}</div>
          </div>
        </div>
      )}

      {/* Badge "Vous arrivez" */}
      {isArriving && (
        <div className="arrival-badge">
          <span className="pulse-dot"></span>
          Vous arrivez à destination
        </div>
      )}

      {/* Bottom HUD */}
      <div className="bottom-hud">
        <div className="hud-row">
          <div className="speed-display">
            <div className="speed-value">{speed}</div>
            <div className="speed-unit">km/h</div>
          </div>

          {routeData && (
            <div className="route-info-hud">
              <div className="eta">{routeData.durationInTraffic}</div>
              <div className="distance">{routeData.distance}</div>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <button
          className="action-btn-3d"
          style={{ 
            backgroundColor: getButtonColor(),
            boxShadow: `0 4px 20px ${getButtonColor()}80`
          }}
          onClick={() => handleStatusUpdate(getNextStatus())}
        >
          {getButtonText()}
        </button>
      </div>

      {/* Bouton recentrer */}
      {!followMode && (
        <button className="recenter-button" onClick={handleRecenter}>
          <span className="recenter-icon">📍</span>
        </button>
      )}
    </div>
  );
}

export default DriverDeliveryGoogleMaps;

