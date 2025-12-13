import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencyMode.css';

function EmergencyMode() {
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [, setEmergencyContact] = useState(null);

  const contacts = [
    { id: 1, name: 'Maman', phone: '+225 07 12 34 56 78', relation: 'Famille' },
    { id: 2, name: 'Papa', phone: '+225 07 98 76 54 32', relation: 'Famille' },
    { id: 3, name: 'Marie', phone: '+225 01 23 45 67 89', relation: 'Amie' }
  ];

  const [nearestPharmacy] = useState({
    name: 'Pharmacie de Garde 24/7',
    address: 'Cocody Angré 7ème tranche',
    distance: 0.8,
    phone: '+225 27 22 45 67 89',
    coordinates: [5.3650, -4.0100]
  });

  const handleSOSActivate = () => {
    setSosActive(true);
  };

  useEffect(() => {
    if (sosActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (sosActive && countdown === 0) {
      // Déclencher l'appel d'urgence
      handleEmergencyCall();
    }
  }, [sosActive, countdown]);

  const handleEmergencyCall = () => {
    alert('🚨 Appel d\'urgence SAMU déclenché !\n📞 Contacts d\'urgence notifiés !\n📍 Position GPS partagée !');
    window.location.href = 'tel:185'; // SAMU Côte d'Ivoire
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setCountdown(5);
  };

  const handleCallPharmacy = () => {
    window.location.href = `tel:${nearestPharmacy.phone}`;
  };

  const handleCallContact = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleShareLocation = (contact) => {
    setEmergencyContact(contact);
    const message = `🚨 URGENCE ! Je suis à ${nearestPharmacy.address}. J'ai besoin d'aide !`;
    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="emergency-page">
      {/* Header */}
      <div className="emergency-header">
        <button className="back-btn-emergency" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>🚨 Mode Urgence</h1>
        <div style={{ width: '44px' }}></div>
      </div>

      {/* SOS Button */}
      <div className="sos-section">
        {!sosActive ? (
          <>
            <button className="sos-button-main" onClick={handleSOSActivate}>
              <div className="sos-pulse"></div>
              <div className="sos-pulse-2"></div>
              <span className="sos-icon">🚨</span>
              <span className="sos-text">SOS</span>
            </button>
            <p className="sos-description">
              Appuyez en cas d'urgence médicale
            </p>
            <p className="sos-info">
              ⚡ Appel SAMU automatique<br/>
              📍 Position GPS partagée<br/>
              👨‍👩‍👧‍👦 Contacts notifiés
            </p>
          </>
        ) : (
          <div className="sos-active">
            <div className="countdown-circle">
              <svg className="countdown-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="countdown-bg"/>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="countdown-progress"
                  style={{
                    strokeDashoffset: 283 - (283 * (5 - countdown)) / 5
                  }}
                />
              </svg>
              <div className="countdown-number">{countdown}</div>
            </div>
            <p className="sos-activating">Appel d'urgence dans {countdown}s...</p>
            <button className="btn-cancel-sos" onClick={handleCancelSOS}>
              Annuler
            </button>
          </div>
        )}
      </div>

      {/* Pharmacie de Garde */}
      <div className="emergency-card">
        <div className="card-header-emergency">
          <div className="card-icon-emergency">⚕️</div>
          <div>
            <h2>Pharmacie de Garde</h2>
            <p>La plus proche de vous</p>
          </div>
        </div>
        
        <div className="pharmacy-info-emergency">
          <h3>{nearestPharmacy.name}</h3>
          <p className="pharmacy-address">📍 {nearestPharmacy.address}</p>
          <p className="pharmacy-distance">🚗 {nearestPharmacy.distance} km ({Math.ceil(nearestPharmacy.distance * 3)} min)</p>
          
          <div className="pharmacy-actions">
            <button className="btn-call-pharmacy" onClick={handleCallPharmacy}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" fill="currentColor"/>
              </svg>
              Appeler
            </button>
            <button className="btn-navigate" onClick={() => alert('Navigation GPS lancée !')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Y aller
            </button>
          </div>
        </div>
      </div>

      {/* Numéros d'urgence */}
      <div className="emergency-card">
        <div className="card-header-emergency">
          <div className="card-icon-emergency red">📞</div>
          <div>
            <h2>Numéros d'urgence</h2>
            <p>Services d'urgence nationaux</p>
          </div>
        </div>
        
        <div className="emergency-numbers">
          <button className="emergency-number-btn" onClick={() => window.location.href = 'tel:185'}>
            <span className="number-icon">🚑</span>
            <div>
              <p className="number-name">SAMU</p>
              <p className="number-value">185</p>
            </div>
          </button>
          
          <button className="emergency-number-btn" onClick={() => window.location.href = 'tel:110'}>
            <span className="number-icon">🚓</span>
            <div>
              <p className="number-name">Police</p>
              <p className="number-value">110 / 111</p>
            </div>
          </button>
          
          <button className="emergency-number-btn" onClick={() => window.location.href = 'tel:180'}>
            <span className="number-icon">🚒</span>
            <div>
              <p className="number-name">Pompiers</p>
              <p className="number-value">180</p>
            </div>
          </button>
        </div>
      </div>

      {/* Contacts d'urgence */}
      <div className="emergency-card">
        <div className="card-header-emergency">
          <div className="card-icon-emergency">👨‍👩‍👧‍👦</div>
          <div>
            <h2>Contacts d'urgence</h2>
            <p>Vos proches à notifier</p>
          </div>
        </div>
        
        <div className="contacts-list">
          {contacts.map(contact => (
            <div key={contact.id} className="contact-item">
              <div className="contact-avatar">{contact.name[0]}</div>
              <div className="contact-info">
                <p className="contact-name">{contact.name}</p>
                <p className="contact-relation">{contact.relation}</p>
              </div>
              <button 
                className="btn-contact-call" 
                onClick={() => handleCallContact(contact.phone)}
              >
                📞
              </button>
              <button 
                className="btn-contact-share" 
                onClick={() => handleShareLocation(contact)}
              >
                📍
              </button>
            </div>
          ))}
        </div>
        
        <button className="btn-add-contact">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Ajouter un contact
        </button>
      </div>

      {/* Dossier médical */}
      <div className="emergency-card">
        <div className="card-header-emergency">
          <div className="card-icon-emergency blue">📋</div>
          <div>
            <h2>Dossier médical</h2>
            <p>Accès rapide</p>
          </div>
        </div>
        
        <div className="medical-quick-info">
          <div className="medical-info-item">
            <span>🩸 Groupe sanguin</span>
            <strong>O+</strong>
          </div>
          <div className="medical-info-item">
            <span>⚠️ Allergies</span>
            <strong>Pénicilline</strong>
          </div>
          <div className="medical-info-item">
            <span>💊 Traitements</span>
            <strong>Doliprane</strong>
          </div>
        </div>
        
        <button className="btn-view-full" onClick={() => navigate('/profile')}>
          Voir dossier complet →
        </button>
      </div>
    </div>
  );
}

export default EmergencyMode;


