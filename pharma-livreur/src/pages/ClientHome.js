import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PHARMACIES_DEMO } from '../config';
import './ClientHome.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ClientHome() {
  const navigate = useNavigate();
  const [selectedPharmacie, setSelectedPharmacie] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [description, setDescription] = useState('');
  const [ordonnance, setOrdonnance] = useState(null);

  const center = [5.3364, -4.0267]; // Abidjan

  const handleOrderClick = (pharmacie) => {
    setSelectedPharmacie(pharmacie);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = () => {
    alert(`Commande envoyée à ${selectedPharmacie.nom}!\n\nDescription: ${description}\n\nUn livreur va prendre en charge votre commande.`);
    setShowOrderModal(false);
    setDescription('');
    setOrdonnance(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrdonnance(file);
    }
  };

  return (
    <div className="client-home">
      <header className="client-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Retour
        </button>
        <h1>🏥 Pharmacies à Abidjan</h1>
        <div className="user-icon">👤</div>
      </header>

      <div className="map-container">
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {PHARMACIES_DEMO.map((pharmacie) => (
            <Marker
              key={pharmacie.id}
              position={[pharmacie.position.lat, pharmacie.position.lng]}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{pharmacie.nom}</h3>
                  <p><strong>📍</strong> {pharmacie.adresse}</p>
                  <p><strong>📞</strong> {pharmacie.telephone}</p>
                  <p><strong>🕒</strong> {pharmacie.heuresOuverture}</p>
                  <p>
                    <strong>Statut:</strong>{' '}
                    <span className={pharmacie.estOuverte ? 'status-open' : 'status-closed'}>
                      {pharmacie.estOuverte ? '✅ Ouverte' : '❌ Fermée'}
                    </span>
                  </p>
                  {pharmacie.estOuverte && (
                    <button
                      className="order-button"
                      onClick={() => handleOrderClick(pharmacie)}
                    >
                      Commander
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="pharmacies-list">
        <h2>Pharmacies Disponibles</h2>
        <div className="pharmacies-grid">
          {PHARMACIES_DEMO.filter(p => p.estOuverte).map((pharmacie) => (
            <div key={pharmacie.id} className="pharmacie-card">
              <h3>💊 {pharmacie.nom}</h3>
              <p>{pharmacie.adresse}</p>
              <p className="hours">🕒 {pharmacie.heuresOuverture}</p>
              <button
                className="order-btn"
                onClick={() => handleOrderClick(pharmacie)}
              >
                Commander Maintenant
              </button>
            </div>
          ))}
        </div>
      </div>

      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowOrderModal(false)}>
              ×
            </button>
            <h2>🛒 Nouvelle Commande</h2>
            <h3>{selectedPharmacie?.nom}</h3>

            <div className="form-group">
              <label>Description des médicaments *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Doliprane 1000mg, Vitamine C..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Ordonnance (optionnel)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {ordonnance && (
                <p className="file-selected">✅ {ordonnance.name}</p>
              )}
            </div>

            <div className="modal-info">
              <p>💡 <strong>Comment ça marche ?</strong></p>
              <ol>
                <li>Décrivez vos médicaments</li>
                <li>Uploadez votre ordonnance (si nécessaire)</li>
                <li>Un livreur va acheter les médicaments</li>
                <li>Il vous livre à domicile</li>
                <li>Vous payez le livreur (médicaments + frais)</li>
              </ol>
            </div>

            <button
              className="submit-order-btn"
              onClick={handleSubmitOrder}
              disabled={!description.trim()}
            >
              Envoyer la Commande
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientHome;

