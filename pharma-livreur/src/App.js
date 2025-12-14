import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import LivreurDashboard from './pages/LivreurDashboard';
import DriverDelivery from './pages/DriverDelivery';
import DriverDeliveryGoogleMaps from './pages/DriverDeliveryGoogleMaps';
import Menu from './pages/Menu';
import Wallet from './pages/Wallet';
import Statistics from './pages/Statistics';
import './App.css';

// APP LIVREUR
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/livreur-dashboard" element={<LivreurDashboard />} />
          <Route path="/driver-delivery" element={<DriverDelivery />} />
          <Route path="/driver-delivery-3d/:orderId" element={<DriverDeliveryGoogleMaps />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/chat" element={<ComingSoon title="Chat" />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="/withdrawal" element={<ComingSoon title="Retrait" />} />
          <Route path="/levels" element={<ComingSoon title="Niveaux" />} />
          <Route path="/profile" element={<ComingSoon title="Profil" />} />
          <Route path="/settings" element={<ComingSoon title="Paramètres" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Composant Coming Soon temporaire
function ComingSoon({ title }) {
  const navigate = require('react-router-dom').useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px' }}>
      <h1 style={{ fontSize: '48px', margin: '20px 0' }}>🚧</h1>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>{title}</h2>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>Fonctionnalité en cours de développement</p>
      <button onClick={() => navigate(-1)} style={{ padding: '12px 24px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
        Retour
      </button>
    </div>
  );
}

// Page SOS
function SOSPage() {
  const navigate = require('react-router-dom').useNavigate();
  const [activated, setActivated] = React.useState(false);
  
  const handleSOS = () => {
    setActivated(true);
    // Simuler l'envoi d'alerte
    setTimeout(() => {
      alert('🆘 ALERTE ENVOYÉE !\n\n✅ Position GPS envoyée au support\n✅ Contacts d\'urgence notifiés\n✅ Police alertée\n\nAide en route !');
    }, 1000);
  };
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f44336, #d32f2f)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '20px', cursor: 'pointer', marginBottom: '40px' }}>←</button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', margin: '0 0 20px 0' }}>🆘</h1>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '12px' }}>URGENCE</h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px', maxWidth: '300px' }}>
          En appuyant sur ce bouton, votre position GPS sera envoyée au support et aux autorités
        </p>
        <button 
          onClick={handleSOS}
          disabled={activated}
          style={{ 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            border: '8px solid white', 
            background: activated ? '#666' : '#fff', 
            color: activated ? '#fff' : '#f44336', 
            fontSize: '32px', 
            fontWeight: '900', 
            cursor: activated ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {activated ? '✅' : 'SOS'}
        </button>
        {activated && (
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginTop: '20px', animation: 'pulse 1s infinite' }}>
            🚨 ALERTE ACTIVÉE 🚨
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
