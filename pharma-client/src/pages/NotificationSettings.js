import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationSettings.css';

function NotificationSettings() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    // Push notifications
    pushEnabled: true,
    orderUpdates: true,
    driverLocation: true,
    promotions: true,
    medicationReminders: true,
    emergencyAlerts: true,
    
    // SMS notifications
    smsEnabled: false,
    smsOrderUpdates: false,
    smsEmergency: true,
    
    // Email notifications
    emailEnabled: true,
    emailReceipts: true,
    emailPromotions: false,
    emailNewsletter: false,
    
    // WhatsApp notifications
    whatsappEnabled: true,
    whatsappOrderUpdates: true,
    whatsappDelivery: true,
    
    // Paramètres avancés
    doNotDisturb: false,
    dndStart: '22:00',
    dndEnd: '07:00',
    urgencyOnly: false,
    soundEnabled: true,
    vibrationEnabled: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTimeChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    alert('✅ Paramètres de notifications enregistrés !');
    navigate(-1);
  };

  return (
    <div className="notif-settings-page">
      {/* Header */}
      <div className="notif-header">
        <button className="back-btn-notif" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>🔔 Notifications</h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="notif-content">
        {/* Mode Ne pas déranger */}
        <div className="notif-section highlight">
          <div className="section-header">
            <div className="section-icon">🌙</div>
            <div>
              <h2>Mode Ne pas déranger</h2>
              <p>Silencieux pendant certaines heures</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.doNotDisturb}
                onChange={() => handleToggle('doNotDisturb')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {settings.doNotDisturb && (
            <div className="dnd-schedule">
              <div className="time-picker">
                <label>🌙 Début</label>
                <input 
                  type="time" 
                  value={settings.dndStart}
                  onChange={(e) => handleTimeChange('dndStart', e.target.value)}
                />
              </div>
              <div className="time-picker">
                <label>☀️ Fin</label>
                <input 
                  type="time" 
                  value={settings.dndEnd}
                  onChange={(e) => handleTimeChange('dndEnd', e.target.value)}
                />
              </div>
              
              <div className="notif-item">
                <div className="notif-label">
                  <span>🚨 Urgences uniquement</span>
                  <p>Autoriser les alertes d'urgence</p>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.urgencyOnly}
                    onChange={() => handleToggle('urgencyOnly')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Push */}
        <div className="notif-section">
          <div className="section-header">
            <div className="section-icon">📱</div>
            <div>
              <h2>Notifications Push</h2>
              <p>Notifications sur votre téléphone</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.pushEnabled}
                onChange={() => handleToggle('pushEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {settings.pushEnabled && (
            <div className="notif-list">
              <div className="notif-item">
                <div className="notif-label">
                  <span>📦 Mises à jour commandes</span>
                  <p>Confirmation, préparation, livraison</p>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.orderUpdates}
                    onChange={() => handleToggle('orderUpdates')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>🚗 Position livreur</span>
                  <p>Suivre le livreur en temps réel</p>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.driverLocation}
                    onChange={() => handleToggle('driverLocation')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>💊 Rappels médicaments</span>
                  <p>Heure de prise des médicaments</p>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.medicationReminders}
                    onChange={() => handleToggle('medicationReminders')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>🎁 Promotions</span>
                  <p>Offres et réductions exclusives</p>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.promotions}
                    onChange={() => handleToggle('promotions')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>🚨 Alertes d'urgence</span>
                  <p>Rappels médicaux importants</p>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.emergencyAlerts}
                    onChange={() => handleToggle('emergencyAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* SMS */}
        <div className="notif-section">
          <div className="section-header">
            <div className="section-icon">💬</div>
            <div>
              <h2>Notifications SMS</h2>
              <p>Messages texte sur votre mobile</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.smsEnabled}
                onChange={() => handleToggle('smsEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {settings.smsEnabled && (
            <div className="notif-list">
              <div className="notif-item">
                <div className="notif-label">
                  <span>📦 Mises à jour commandes</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.smsOrderUpdates}
                    onChange={() => handleToggle('smsOrderUpdates')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>🚨 Urgences uniquement</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.smsEmergency}
                    onChange={() => handleToggle('smsEmergency')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="notif-section">
          <div className="section-header">
            <div className="section-icon">📧</div>
            <div>
              <h2>Notifications Email</h2>
              <p>Emails sur votre boîte mail</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.emailEnabled}
                onChange={() => handleToggle('emailEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {settings.emailEnabled && (
            <div className="notif-list">
              <div className="notif-item">
                <div className="notif-label">
                  <span>🧾 Factures et reçus</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.emailReceipts}
                    onChange={() => handleToggle('emailReceipts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>🎁 Promotions</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.emailPromotions}
                    onChange={() => handleToggle('emailPromotions')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>📰 Newsletter</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNewsletter}
                    onChange={() => handleToggle('emailNewsletter')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp */}
        <div className="notif-section">
          <div className="section-header">
            <div className="section-icon">💚</div>
            <div>
              <h2>Notifications WhatsApp</h2>
              <p>Messages sur WhatsApp</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.whatsappEnabled}
                onChange={() => handleToggle('whatsappEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {settings.whatsappEnabled && (
            <div className="notif-list">
              <div className="notif-item">
                <div className="notif-label">
                  <span>📦 Mises à jour commandes</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.whatsappOrderUpdates}
                    onChange={() => handleToggle('whatsappOrderUpdates')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="notif-item">
                <div className="notif-label">
                  <span>🚗 Livreur en route</span>
                </div>
                <label className="toggle-switch small">
                  <input 
                    type="checkbox" 
                    checked={settings.whatsappDelivery}
                    onChange={() => handleToggle('whatsappDelivery')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Préférences avancées */}
        <div className="notif-section">
          <div className="section-header">
            <div className="section-icon">⚙️</div>
            <div>
              <h2>Préférences avancées</h2>
              <p>Sons et vibrations</p>
            </div>
          </div>
          
          <div className="notif-list">
            <div className="notif-item">
              <div className="notif-label">
                <span>🔊 Son</span>
                <p>Jouer un son lors des notifications</p>
              </div>
              <label className="toggle-switch small">
                <input 
                  type="checkbox" 
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notif-item">
              <div className="notif-label">
                <span>📳 Vibration</span>
                <p>Faire vibrer lors des notifications</p>
              </div>
              <label className="toggle-switch small">
                <input 
                  type="checkbox" 
                  checked={settings.vibrationEnabled}
                  onChange={() => handleToggle('vibrationEnabled')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <button className="btn-save-notif" onClick={saveSettings}>
          💾 Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;





