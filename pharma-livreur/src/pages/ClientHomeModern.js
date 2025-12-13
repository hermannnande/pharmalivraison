import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PHARMACIES_DEMO, COLORS } from '../config';
import { PHARMACIES_REELLES } from '../realPharmacies';
import './ClientHomeModern.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom green pharmacy marker
const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 50 60">
      <path fill="#10B981" d="M25 0C11 0 0 11 0 25c0 18 25 35 25 35s25-17 25-35C50 11 39 0 25 0z"/>
      <circle cx="25" cy="23" r="13" fill="white"/>
      <path fill="#10B981" d="M25 14v18M16 23h18" stroke="white" stroke-width="3.5"/>
    </svg>
  `),
  iconSize: [50, 60],
  iconAnchor: [25, 60],
  popupAnchor: [0, -60]
});

function ClientHomeModern() {
  const navigate = useNavigate();
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [selectedPharmacie, setSelectedPharmacie] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [medicineDescription, setMedicineDescription] = useState('');
  
  // UTILISATION DIRECTE DES VRAIES DONNÉES !
  const pharmacies = PHARMACIES_REELLES;

  const center = [5.3364, -4.0267]; // Abidjan

  const savedLocations = [
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

    // Lancer la commande
    setShowOrderPopup(false);
    navigate('/live-tracking', { 
      state: { 
        pharmacie: selectedPharmacie,
        location: selectedLocation,
        medicines: medicineDescription
      } 
    });
  };

  // Filtrer uniquement les pharmacies ouvertes
  const pharmaciesOuvertes = pharmacies.filter(p => p.estOuverte);

  return (
    <div className="client-home-final">
      {/* HEADER COMPACT */}
      <header className="header-compact">
        <button className="back-btn-simple" onClick={() => navigate('/role')}>←</button>
        <div className="location-chip">
          <span>📍</span>
          <span>Cocody, Abidjan</span>
        </div>
        <div className="user-badge">👤</div>
      </header>

      {/* CARTE PLEIN ÉCRAN */}
      <div className="fullscreen-map">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {pharmaciesOuvertes.map((pharmacie) => (
            <Marker
              key={pharmacie.id}
              position={[pharmacie.position.lat, pharmacie.position.lng]}
              icon={pharmacyIcon}
              eventHandlers={{
                click: () => handlePharmacyClick(pharmacie)
              }}
            >
              <Popup>
                <div className="simple-popup">
                  <h4>{pharmacie.nom}</h4>
                  <p className="popup-dist">{pharmacie.distance}</p>
                  <p className="popup-addr">{pharmacie.adresse}</p>
                  <span className="badge-open-popup">✓ Ouverte</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Badge nombre pharmacies */}
        <div className="pharmacies-badge">
          <span className="count-circle">{pharmaciesOuvertes.length}</span>
          <span>Pharmacies ouvertes</span>
        </div>

        {/* Instructions */}
        {!showOrderPopup && (
          <div className="map-instructions">
            <div className="instruction-box">
              <span className="pulse-icon">📍</span>
              <p>Cliquez sur une pharmacie verte pour commander</p>
            </div>
          </div>
        )}
      </div>

      {/* BARRE D'ACTIONS EN BAS */}
      {!showOrderPopup && (
        <div className="bottom-actions-bar">
          <button className="action-btn-secondary" onClick={() => navigate('/upload-prescription')}>
            <span className="btn-icon">📷</span>
            <span>Upload ordonnance</span>
          </button>
          <button className="action-btn-primary" onClick={() => {
            if (pharmaciesOuvertes.length > 0) {
              handlePharmacyClick(pharmaciesOuvertes[0]);
            }
          }} style={{ background: COLORS.primary }}>
            <span className="btn-icon">🛒</span>
            <span>Commander maintenant</span>
          </button>
        </div>
      )}

      {/* POPUP DE COMMANDE */}
      {showOrderPopup && (
        <div className="order-popup-overlay" onClick={() => setShowOrderPopup(false)}>
          <div className="order-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowOrderPopup(false)}>✕</button>
            
            <h2>🏥 {selectedPharmacie?.nom}</h2>
            <p className="pharmacy-distance">📏 {selectedPharmacie?.distance}</p>

            {/* SÉLECTION LOCALISATION */}
            <div className="location-selection">
              <h3>📍 Choisissez votre localisation</h3>
              <div className="locations-list">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`location-item ${selectedLocation?.id === loc.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ borderColor: selectedLocation?.id === loc.id ? COLORS.primary : '#E5E7EB' }}
                  >
                    <div className="location-icon">{loc.label.split(' ')[0]}</div>
                    <div className="location-info">
                      <p className="location-label">{loc.label.substring(3)}</p>
                      <p className="location-address">{loc.address}</p>
                    </div>
                    {selectedLocation?.id === loc.id && (
                      <div className="check-icon" style={{ color: COLORS.primary }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION MÉDICAMENTS */}
            <div className="medicine-input-popup">
              <h3>💊 Vos médicaments</h3>
              <textarea
                placeholder="Décrivez vos médicaments ou symptômes..."
                value={medicineDescription}
                onChange={(e) => setMedicineDescription(e.target.value)}
                rows="3"
              />
              <label className="upload-label">
                <input type="file" accept="image/*" style={{ display: 'none' }} />
                <span>📷 Ou importer une ordonnance</span>
              </label>
            </div>

            {/* BOUTON COMMANDER */}
            <button
              className="confirm-order-btn"
              onClick={handleConfirmOrder}
              style={{ background: COLORS.primary }}
            >
              Confirmer la commande
            </button>

            <p className="popup-info">
              💡 Un livreur proche sera automatiquement sélectionné
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientHomeModern;
