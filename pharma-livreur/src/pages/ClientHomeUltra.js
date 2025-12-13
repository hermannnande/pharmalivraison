import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PHARMACIES_REELLES } from '../realPharmacies';
import { COLORS } from '../config';
import './ClientHomeUltra.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Icône pharmacie moderne avec gradient
const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 50 60">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path fill="url(#grad1)" filter="url(#shadow)" d="M25 0C11 0 0 11 0 25c0 18 25 35 25 35s25-17 25-35C50 11 39 0 25 0z"/>
      <circle cx="25" cy="23" r="13" fill="white" opacity="0.95"/>
      <path fill="#059669" d="M25 14v18M16 23h18" stroke="white" stroke-width="3.5"/>
    </svg>
  `),
  iconSize: [50, 60],
  iconAnchor: [25, 60],
  popupAnchor: [0, -60]
});

// Icône position utilisateur (curseur bleu pulsant)
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="#3B82F6" opacity="0.3">
        <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="20" cy="20" r="12" fill="#3B82F6" opacity="0.6">
        <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="20" cy="20" r="8" fill="#FFFFFF" stroke="#3B82F6" stroke-width="3"/>
      <circle cx="20" cy="20" r="4" fill="#3B82F6"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Composant pour recentrer la carte sur la position utilisateur
function RecenterMap({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

function ClientHomeUltra() {
  const navigate = useNavigate();
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [selectedPharmacie, setSelectedPharmacie] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [medicineDescription, setMedicineDescription] = useState('');
  const [userLocation, setUserLocation] = useState([5.3364, -4.0267]); // Cocody par défaut
  const [locationAccuracy, setLocationAccuracy] = useState(50);
  const [isLocating, setIsLocating] = useState(false);

  const pharmacies = PHARMACIES_REELLES;
  const pharmaciesOuvertes = pharmacies.filter(p => p.estOuverte);

  // Localiser l'utilisateur automatiquement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationAccuracy(accuracy);
          console.log('📍 Position utilisateur:', latitude, longitude);
        },
        (error) => {
          console.log('⚠️ Géolocalisation non disponible, utilisation position par défaut');
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Localiser manuellement
  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationAccuracy(accuracy);
          setIsLocating(false);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          setIsLocating(false);
          alert('Impossible de vous localiser. Vérifiez les permissions GPS.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const savedLocations = [
    { id: 'current', label: '📍 Ma position actuelle', address: 'Position GPS', coordinates: userLocation },
    { id: 'home', label: '🏠 Mon domicile', address: '123 Rue de Cocody, Abidjan', coordinates: [5.3400, -3.9900] },
    { id: 'work', label: '💼 Travail', address: 'Boulevard du Plateau, Abidjan', coordinates: [5.3200, -4.0100] },
    { id: 'other', label: '📍 Autre adresse', address: 'Nouvelle adresse...', coordinates: null }
  ];

  const handlePharmacyClick = (pharmacie) => {
    setSelectedPharmacie(pharmacie);
    setShowOrderPopup(true);
  };

  const handleConfirmOrder = () => {
    if (!selectedLocation) {
      alert('Veuillez sélectionner votre localisation');
      return;
    }
    if (!medicineDescription.trim()) {
      alert('Veuillez décrire vos médicaments ou uploader une ordonnance');
      return;
    }

    setShowOrderPopup(false);
    navigate('/live-tracking', { 
      state: { 
        pharmacie: selectedPharmacie,
        location: selectedLocation,
        medicines: medicineDescription
      } 
    });
  };

  return (
    <div className="client-home-ultra">
      {/* HEADER GLASSMORPHISM */}
      <header className="header-glass">
        <button className="btn-glass-circle" onClick={() => navigate('/role')}>
          <span className="icon-back">←</span>
        </button>
        <div className="location-badge-modern">
          <span className="location-icon pulse">📍</span>
          <div className="location-text">
            <span className="location-title">Votre position</span>
            <span className="location-subtitle">Cocody, Abidjan</span>
          </div>
        </div>
        <button className="btn-glass-circle" onClick={handleLocateMe}>
          <span className={`icon-locate ${isLocating ? 'spin' : ''}`}>🎯</span>
        </button>
      </header>

      {/* CARTE ULTRA MODERNE */}
      <div className="ultra-map-container">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          <RecenterMap center={userLocation} />
          
          {/* Marqueur position utilisateur avec cercle de précision */}
          <Circle
            center={userLocation}
            radius={locationAccuracy}
            pathOptions={{ 
              fillColor: '#3B82F6',
              fillOpacity: 0.1,
              color: '#3B82F6',
              weight: 1,
              opacity: 0.3
            }}
          />
          <Marker position={userLocation} icon={userLocationIcon} />
          
          {/* Pharmacies */}
          {pharmaciesOuvertes.map((pharmacie) => (
            <Marker
              key={pharmacie.id}
              position={[pharmacie.position.lat, pharmacie.position.lng]}
              icon={pharmacyIcon}
              eventHandlers={{
                click: () => handlePharmacyClick(pharmacie)
              }}
            >
              <Popup className="modern-popup">
                <div className="popup-content-modern">
                  <h4 className="popup-title">{pharmacie.nom}</h4>
                  <div className="popup-badge-open">✓ Ouverte {pharmacie.heuresOuverture}</div>
                  <p className="popup-address">{pharmacie.adresse}</p>
                  <div className="popup-stats">
                    <span className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-value">{pharmacie.note}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">📏</span>
                      <span className="stat-value">{pharmacie.distance}</span>
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Badge pharmacies flottant */}
        <div className="pharmacy-counter-modern">
          <div className="counter-pulse"></div>
          <div className="counter-content">
            <span className="counter-number">{pharmaciesOuvertes.length}</span>
            <span className="counter-label">Pharmacies</span>
          </div>
        </div>

        {/* Bouton localisation flottant */}
        <button className="btn-locate-floating" onClick={handleLocateMe}>
          <span className={`locate-icon ${isLocating ? 'spin' : ''}`}>🎯</span>
        </button>
      </div>

      {/* BARRE D'ACTIONS MODERNE */}
      <div className="actions-bar-ultra">
        <button className="action-btn-ultra secondary" onClick={() => navigate('/upload-prescription')}>
          <div className="btn-icon-ultra">📷</div>
          <span className="btn-text">Ordonnance</span>
        </button>
        <button 
          className="action-btn-ultra primary"
          onClick={() => {
            if (pharmaciesOuvertes.length > 0) {
              handlePharmacyClick(pharmaciesOuvertes[0]);
            }
          }}
        >
          <div className="btn-icon-ultra">🛒</div>
          <span className="btn-text">Commander</span>
          <div className="btn-glow"></div>
        </button>
      </div>

      {/* POPUP DE COMMANDE MODERNE */}
      {showOrderPopup && (
        <div className="order-popup-ultra" onClick={() => setShowOrderPopup(false)}>
          <div className="popup-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle"></div>
            
            <button className="btn-close-modern" onClick={() => setShowOrderPopup(false)}>
              ✕
            </button>
            
            <div className="pharmacy-header-modern">
              <div className="pharmacy-icon-large">🏥</div>
              <div className="pharmacy-info">
                <h2 className="pharmacy-name">{selectedPharmacie?.nom}</h2>
                <div className="pharmacy-meta">
                  <span className="meta-badge open">✓ Ouverte</span>
                  <span className="meta-distance">📏 {selectedPharmacie?.distance}</span>
                  <span className="meta-rating">⭐ {selectedPharmacie?.note}</span>
                </div>
              </div>
            </div>

            <div className="section-modern">
              <h3 className="section-title">
                <span className="title-icon">📍</span>
                Votre localisation
              </h3>
              <div className="locations-grid">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`location-card ${selectedLocation?.id === loc.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    <div className="card-icon">{loc.label.split(' ')[0]}</div>
                    <div className="card-content">
                      <p className="card-title">{loc.label.substring(3)}</p>
                      <p className="card-subtitle">{loc.address}</p>
                    </div>
                    {selectedLocation?.id === loc.id && (
                      <div className="check-badge">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section-modern">
              <h3 className="section-title">
                <span className="title-icon">💊</span>
                Vos médicaments
              </h3>
              <textarea
                className="input-modern"
                placeholder="Décrivez vos médicaments ou symptômes..."
                value={medicineDescription}
                onChange={(e) => setMedicineDescription(e.target.value)}
                rows="3"
              />
              <label className="upload-modern">
                <input type="file" accept="image/*" hidden />
                <span className="upload-icon">📷</span>
                <span className="upload-text">Ou importer une ordonnance</span>
              </label>
            </div>

            <button className="btn-confirm-ultra" onClick={handleConfirmOrder}>
              <span className="btn-confirm-text">Confirmer la commande</span>
              <span className="btn-confirm-icon">→</span>
            </button>

            <p className="popup-hint">
              💡 Un livreur proche sera automatiquement sélectionné
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientHomeUltra;

