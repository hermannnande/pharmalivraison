import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1>Paramètres</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Compte */}
      <div className="settings-section">
        <div className="section-title">Compte</div>
        <div className="settings-list">
          <div className="setting-item" onClick={() => navigate('/profile')}>
            <div className="setting-icon">👤</div>
            <div className="setting-content">
              <div className="setting-label">Mon profil</div>
              <div className="setting-desc">Informations personnelles</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item" onClick={() => navigate('/wallet')}>
            <div className="setting-icon">💰</div>
            <div className="setting-content">
              <div className="setting-label">Portefeuille</div>
              <div className="setting-desc">Gérer mes gains</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🔒</div>
            <div className="setting-content">
              <div className="setting-label">Mot de passe</div>
              <div className="setting-desc">Changer mon mot de passe</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="section-title">Notifications</div>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-icon">🔔</div>
            <div className="setting-content">
              <div className="setting-label">Notifications push</div>
              <div className="setting-desc">Recevoir les alertes</div>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🔊</div>
            <div className="setting-content">
              <div className="setting-label">Son</div>
              <div className="setting-desc">Sons et vibrations</div>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Apparence */}
      <div className="settings-section">
        <div className="section-title">Apparence</div>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-icon">🌙</div>
            <div className="setting-content">
              <div className="setting-label">Mode sombre</div>
              <div className="setting-desc">Thème d'affichage</div>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🌍</div>
            <div className="setting-content">
              <div className="setting-label">Langue</div>
              <div className="setting-desc">Français</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="settings-section">
        <div className="section-title">Support</div>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-icon">❓</div>
            <div className="setting-content">
              <div className="setting-label">Centre d'aide</div>
              <div className="setting-desc">FAQ et tutoriels</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">💬</div>
            <div className="setting-content">
              <div className="setting-label">Contacter le support</div>
              <div className="setting-desc">Aide en ligne</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">⭐</div>
            <div className="setting-content">
              <div className="setting-label">Noter l'application</div>
              <div className="setting-desc">Donner votre avis</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>
        </div>
      </div>

      {/* À propos */}
      <div className="settings-section">
        <div className="section-title">À propos</div>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-icon">📄</div>
            <div className="setting-content">
              <div className="setting-label">Conditions d'utilisation</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">🔐</div>
            <div className="setting-content">
              <div className="setting-label">Politique de confidentialité</div>
            </div>
            <div className="setting-arrow">›</div>
          </div>

          <div className="setting-item">
            <div className="setting-icon">ℹ️</div>
            <div className="setting-content">
              <div className="setting-label">Version</div>
              <div className="setting-desc">v1.0.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="settings-actions">
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          Déconnexion
        </button>
      </div>

      <div className="settings-footer">
        © 2025 PharmaLivraison - Tous droits réservés
      </div>
    </div>
  );
}

export default Settings;

