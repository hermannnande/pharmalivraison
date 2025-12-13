import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { COLORS } from '../config';
import './LiveTracking.css';

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Icône livreur (en mouvement)
const deliveryIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="${COLORS.primary}" stroke="white" stroke-width="2"/>
      <text x="25" y="32" font-size="24" text-anchor="middle" fill="white">🛵</text>
    </svg>
  `),
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

// Icône client
const clientIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <text x="20" y="26" font-size="18" text-anchor="middle" fill="white">🏠</text>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Icône pharmacie
const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" fill="#10B981" stroke="white" stroke-width="2"/>
      <text x="20" y="26" font-size="18" text-anchor="middle" fill="white">🏥</text>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function LiveTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pharmacie, location: userLocation, medicines } = location.state || {};

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'livreur', text: 'Bonjour ! Je suis Kofi, votre livreur 👋', time: '8:35' },
    { sender: 'livreur', text: "Je vais récupérer vos médicaments à la pharmacie", time: '8:35' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Simulation position livreur (se déplace vers pharmacie puis vers client)
  const [deliveryPosition, setDeliveryPosition] = useState([5.3500, -4.0100]);
  const [deliveryStatus, setDeliveryStatus] = useState('En route vers la pharmacie');
  const [progress, setProgress] = useState(15);

  const pharmacyPosition = pharmacie?.position ? [pharmacie.position.lat, pharmacie.position.lng] : [5.3400, -4.0000];
  const clientPosition = userLocation?.coordinates || [5.3200, -4.0300];

  // Simulation du mouvement du livreur
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDeliveryStatus('✅ Livraison terminée !');
          return 100;
        }
        
        // Mettre à jour la position
        if (prev < 50) {
          // Vers pharmacie
          setDeliveryStatus('🏍️ En route vers la pharmacie');
          setDeliveryPosition(prevPos => [
            prevPos[0] + (pharmacyPosition[0] - prevPos[0]) * 0.1,
            prevPos[1] + (pharmacyPosition[1] - prevPos[1]) * 0.1
          ]);
        } else if (prev === 50) {
          setDeliveryStatus('⏱️ Récupération des médicaments...');
          setChatMessages(prev => [...prev, { 
            sender: 'livreur', 
            text: "J'ai récupéré vos médicaments ! En route vers vous 🚀", 
            time: '8:42' 
          }]);
        } else {
          // Vers client
          setDeliveryStatus('🏍️ En route vers vous');
          setDeliveryPosition(prevPos => [
            prevPos[0] + (clientPosition[0] - prevPos[0]) * 0.1,
            prevPos[1] + (clientPosition[1] - prevPos[1]) * 0.1
          ]);
        }
        
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pharmacyPosition, clientPosition]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages([...chatMessages, { 
      sender: 'client', 
      text: newMessage, 
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
    
    // Simulation réponse livreur
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'livreur', 
        text: 'Message bien reçu ! 👍', 
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleCall = () => {
    alert('📞 Appel vers Kofi le livreur...\n+225 07 XX XX XX XX');
  };

  if (!pharmacie) {
    return (
      <div className="live-tracking-error">
        <h2>Aucune commande en cours</h2>
        <button onClick={() => navigate('/client')}>Retour</button>
      </div>
    );
  }

  return (
    <div className="live-tracking">
      {/* HEADER */}
      <header className="tracking-header">
        <button className="back-btn" onClick={() => navigate('/client')}>←</button>
        <div className="header-info">
          <h3>{deliveryStatus}</h3>
          <p className="eta">Arrivée estimée: {Math.round((100 - progress) / 2)} min</p>
        </div>
      </header>

      {/* CARTE EN TEMPS RÉEL */}
      <div className="tracking-map">
        <MapContainer
          center={deliveryPosition}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Marqueur Livreur */}
          <Marker position={deliveryPosition} icon={deliveryIcon} />
          
          {/* Marqueur Pharmacie */}
          <Marker position={pharmacyPosition} icon={pharmacyIcon} />
          
          {/* Marqueur Client */}
          <Marker position={clientPosition} icon={clientIcon} />
          
          {/* Ligne de trajet */}
          {progress < 50 ? (
            <Polyline 
              positions={[deliveryPosition, pharmacyPosition]} 
              color={COLORS.primary}
              dashArray="10, 10"
            />
          ) : (
            <Polyline 
              positions={[deliveryPosition, clientPosition]} 
              color={COLORS.primary}
              dashArray="10, 10"
            />
          )}
        </MapContainer>

        {/* Barre de progression */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%`, background: COLORS.primary }} />
        </div>
      </div>

      {/* INFO LIVREUR */}
      <div className="delivery-info-card">
        <div className="driver-profile">
          <div className="driver-avatar">👨‍🦱</div>
          <div className="driver-details">
            <h4>Kofi Mensah</h4>
            <div className="driver-rating">⭐ 4.9 (234 livraisons)</div>
          </div>
          <button className="call-btn" onClick={handleCall}>
            📞
          </button>
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <span className="label">Pharmacie:</span>
            <span className="value">{pharmacie.nom}</span>
          </div>
          <div className="summary-item">
            <span className="label">Destination:</span>
            <span className="value">{userLocation?.label?.substring(3) || 'Votre adresse'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Médicaments:</span>
            <span className="value">{medicines?.substring(0, 40)}...</span>
          </div>
        </div>
      </div>

      {/* BOUTONS ACTIONS */}
      <div className="action-buttons">
        <button 
          className="chat-toggle-btn" 
          onClick={() => setShowChat(!showChat)}
          style={{ background: showChat ? COLORS.primary : '#F3F4F6' }}
        >
          💬 {showChat ? 'Fermer' : 'Chat'}
        </button>
        <button className="call-driver-btn" onClick={handleCall} style={{ background: COLORS.primary }}>
          📞 Appeler le livreur
        </button>
      </div>

      {/* CHAT */}
      {showChat && (
        <div className="chat-panel">
          <div className="chat-header">
            <h4>💬 Discussion avec Kofi</h4>
            <button className="close-chat" onClick={() => setShowChat(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} style={{ background: COLORS.primary }}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveTracking;

