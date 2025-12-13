import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PHARMACIES_REELLES } from '../realPharmacies';
import OrderModal from '../components/OrderModal';
import DrawerMenu from '../components/DrawerMenu';
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

function ClientHomeUltra() {
  const navigate = useNavigate();
  const [userPosition, setUserPosition] = useState([5.3600, -4.0083]); // Abidjan par défaut
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [locationName] = useState('Cocody, Abidjan');
  const [showList, setShowList] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showOnlyDeGarde, setShowOnlyDeGarde] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  return (
    <div className="client-home-ultra">
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

      {/* Bouton Urgence Pharmacie de Garde */}
      <button 
        className={`urgence-btn ${showOnlyDeGarde ? 'active' : ''}`}
        onClick={handleUrgenceDeGarde}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 5V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V5L12 2Z" fill="currentColor"/>
          <path d="M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="white"/>
        </svg>
        <span>{showOnlyDeGarde ? 'Toutes les pharmacies' : 'Urgence pharmacie de garde'}</span>
      </button>

      {/* Bouton Support WhatsApp */}
      <button 
        className="whatsapp-btn"
        onClick={() => window.open('https://wa.me/2250709090909?text=Bonjour,%20j\'ai%20besoin%20d\'aide%20avec%20PharmaLivraison', '_blank')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" fill="currentColor"/>
        </svg>
        <span>Support</span>
      </button>

      {/* Carte */}
      <div className="map-container-ultra">
        <MapContainer
          center={userPosition}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Position de l'utilisateur */}
          <Marker position={userPosition} icon={userIcon}>
            <Popup>Votre position</Popup>
          </Marker>

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
              key={index}
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
      <div className={`bottom-panel-modern ${showList ? 'expanded' : ''}`}>
        {/* Indicateur de drag */}
        <div className="drag-indicator" onClick={() => setShowList(!showList)}>
          <div className="drag-line"></div>
        </div>

        {/* Contenu principal */}
        <div className="panel-content">
          {/* En-tête du panel */}
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

          {/* Liste des pharmacies (si expanded) */}
          {showList && (
            <div className="pharmacies-list">
              <h3 className="list-title">
                {showOnlyDeGarde ? 'Pharmacies de garde ouvertes' : 'Pharmacies à proximité'}
              </h3>
              <div className="list-items">
                {displayedPharmacies.slice(0, 10).map((pharmacy, index) => (
                  <div 
                    key={index} 
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
