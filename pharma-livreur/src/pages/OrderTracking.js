import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { COLORS } from '../config';
import './OrderTracking.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons with simple SVG (no emojis)
const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <path fill="#DC2626" d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z"/>
      <path fill="white" d="M20 8v24M8 20h24" stroke="white" stroke-width="3"/>
    </svg>
  `),
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <path fill="#10B981" d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z"/>
      <circle cx="20" cy="20" r="12" fill="white"/>
      <path fill="#10B981" d="M15 20l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50]
});

const homeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <path fill="#3B82F6" d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z"/>
      <path fill="white" d="M20 10L10 18v12h6v-8h8v8h6V18z"/>
    </svg>
  `),
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50]
});

function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const pharmacie = location.state?.pharmacie || {
    nom: 'Pharmacie Cocody',
    adresse: 'Rue des Jardins, Cocody',
    position: { lat: 5.3500, lng: -3.9800 }
  };

  const [orderStatus] = useState('en_route');
  const deliveryPosition = [5.3450, -3.9850];
  const clientPosition = [5.3400, -3.9900];

  const timeline = [
    { id: 1, label: 'Commande acceptée', completed: true },
    { id: 2, label: 'Livreur en route à la pharmacie', completed: true },
    { id: 3, label: 'Médicament acheté', completed: true },
    { id: 4, label: 'Livreur en route chez vous', completed: orderStatus !== 'waiting', active: orderStatus === 'en_route' }
  ];

  const pathCoordinates = [
    [pharmacie.position.lat, pharmacie.position.lng],
    deliveryPosition,
    clientPosition
  ];

  return (
    <div className="order-tracking">
      <header className="tracking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Commande #2143214</h1>
        <div></div>
      </header>

      <div className="tracking-map">
        <MapContainer
          center={deliveryPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[pharmacie.position.lat, pharmacie.position.lng]}
            icon={pharmacyIcon}
          />
          <Marker
            position={deliveryPosition}
            icon={deliveryIcon}
          />
          <Marker
            position={clientPosition}
            icon={homeIcon}
          />
          <Polyline
            positions={pathCoordinates}
            color={COLORS.primary}
            weight={4}
            dashArray="10, 10"
          />
        </MapContainer>
      </div>

      <div className="tracking-content">
        <div className="delivery-person-card">
          <div className="delivery-person-info">
            <div className="delivery-avatar">👨</div>
            <div className="delivery-details">
              <h3>Jean</h3>
              <p>Votre livreur</p>
            </div>
          </div>
          <div className="status-badge-active" style={{ background: COLORS.primary }}>
            En route
          </div>
        </div>

        <div className="order-timeline">
          {timeline.map((step) => (
            <div key={step.id} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
              <div className="timeline-marker">
                {step.completed ? (
                  <div className="marker-check" style={{ background: COLORS.primary }}>✓</div>
                ) : step.active ? (
                  <div className="marker-active" style={{ background: COLORS.primary }}></div>
                ) : (
                  <div className="marker-pending"></div>
                )}
              </div>
              <div className="timeline-content">
                <p className={step.active ? 'active-text' : ''}>{step.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="delivery-time-card">
          <h3>Votre commande sera bientôt livrée</h3>
          <div className="time-estimate" style={{ color: COLORS.primary }}>
            5 min
          </div>
          <button
            className="contact-delivery-btn"
            style={{ background: COLORS.primary }}
          >
            📞 Contacter le livreur
          </button>
        </div>

        <div className="order-status-section">
          <h3>Statut de la commande</h3>
          <div className="status-dropdown">
            <p>En route vers le client</p>
            <span>▼</span>
          </div>
        </div>

        <div className="order-details-section">
          <div className="detail-item">
            <div className="detail-icon" style={{ background: '#FEE2E2' }}>
              <span style={{ color: '#DC2626' }}>🏥</span>
            </div>
            <div className="detail-info">
              <h4>{pharmacie.nom}</h4>
              <p>{pharmacie.adresse}</p>
            </div>
            <button className="call-btn">📞</button>
          </div>

          <div className="detail-item">
            <div className="detail-icon" style={{ background: '#DBEAFE' }}>
              <span style={{ color: '#3B82F6' }}>🏠</span>
            </div>
            <div className="detail-info">
              <h4>Livraison</h4>
              <p>Cocody, Angré 8ème Tranche</p>
            </div>
            <button className="call-btn">📞</button>
          </div>
        </div>

        <button
          className="order-delivered-btn"
          style={{ background: '#DC2626' }}
          onClick={() => {
            alert('Commande marquée comme livrée ! Merci d\'avoir utilisé PharmaLivraison 🎉');
            navigate('/client');
          }}
        >
          Commande livrée
        </button>
      </div>
    </div>
  );
}

export default OrderTracking;
