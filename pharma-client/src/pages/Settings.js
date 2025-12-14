import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotif: true,
    smsNotif: false,
    language: 'fr',
    currency: 'FCFA',
    darkMode: false
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <button className="back-btn-settings" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="settings-title">Paramètres</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Settings Container */}
      <div className="settings-container">
        {/* Notifications */}
        <div className="settings-section">
          <h3 className="settings-section-title">Notifications</h3>
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-icon">🔔</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Notifications push</div>
                <div className="settings-item-desc">Recevoir les notifications</div>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-icon">📧</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Notifications email</div>
                <div className="settings-item-desc">Recevoir par email</div>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotif}
                onChange={() => handleToggle('emailNotif')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-icon">💬</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Notifications SMS</div>
                <div className="settings-item-desc">Recevoir par SMS</div>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.smsNotif}
                onChange={() => handleToggle('smsNotif')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h3 className="settings-section-title">Préférences</h3>
          <button className="settings-item-button">
            <div className="settings-item-info">
              <div className="settings-item-icon">🌐</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Langue</div>
                <div className="settings-item-desc">Français</div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="settings-item-button">
            <div className="settings-item-info">
              <div className="settings-item-icon">💰</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Devise</div>
                <div className="settings-item-desc">FCFA</div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-icon">🌙</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Mode sombre</div>
                <div className="settings-item-desc">Thème sombre</div>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section">
          <h3 className="settings-section-title">Sécurité</h3>
          <button className="settings-item-button">
            <div className="settings-item-info">
              <div className="settings-item-icon">🔒</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Changer le mot de passe</div>
                <div className="settings-item-desc">Sécuriser votre compte</div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="settings-item-button">
            <div className="settings-item-info">
              <div className="settings-item-icon">🔐</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Authentification à 2 facteurs</div>
                <div className="settings-item-desc">Sécurité renforcée</div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* About */}
        <div className="settings-section">
          <h3 className="settings-section-title">À propos</h3>
          <button className="settings-item-button" onClick={() => navigate('/about')}>
            <div className="settings-item-info">
              <div className="settings-item-icon">ℹ️</div>
              <div className="settings-item-text">
                <div className="settings-item-label">À propos de l'application</div>
                <div className="settings-item-desc">Version 1.0.0</div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="settings-item-button" onClick={() => navigate('/terms')}>
            <div className="settings-item-info">
              <div className="settings-item-icon">📄</div>
              <div className="settings-item-text">
                <div className="settings-item-label">Conditions d'utilisation</div>
                <div className="settings-item-desc">Termes et politique</div>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;





