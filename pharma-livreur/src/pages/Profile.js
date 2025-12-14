import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  
  const [profile] = useState({
    firstName: 'Mohamed',
    lastName: 'Diallo',
    phone: '+225 07 08 08 08 08',
    email: 'mohamed.diallo@email.com',
    address: 'Cocody, Abidjan',
    joined: '15 Juin 2024',
    avatar: '👨',
    vehicle: {
      type: 'Moto',
      brand: 'Honda',
      model: 'CBR 150',
      plate: 'AB 1234 CI'
    },
    documents: {
      cni: { verified: true, expiry: '2027' },
      license: { verified: true, expiry: '2026' },
      insurance: { verified: true, expiry: '2025' }
    }
  });

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1>Mon Profil</h1>
        <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18.5 2.5C18.8978 2.1 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1 21.5 2.5C21.898 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.898 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar-large">{profile.avatar}</div>
        <div className="profile-name">{profile.firstName} {profile.lastName}</div>
        <div className="profile-phone">{profile.phone}</div>
        <div className="profile-joined">Membre depuis {profile.joined}</div>
      </div>

      {/* Personal Info */}
      <div className="profile-section">
        <h3>Informations personnelles</h3>
        <div className="info-list">
          <div className="info-item">
            <div className="info-label">📧 Email</div>
            <div className="info-value">{profile.email}</div>
          </div>
          <div className="info-item">
            <div className="info-label">📍 Adresse</div>
            <div className="info-value">{profile.address}</div>
          </div>
          <div className="info-item">
            <div className="info-label">📱 Téléphone</div>
            <div className="info-value">{profile.phone}</div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="profile-section">
        <h3>Véhicule</h3>
        <div className="vehicle-card">
          <div className="vehicle-icon">🏍️</div>
          <div className="vehicle-info">
            <div className="vehicle-name">{profile.vehicle.brand} {profile.vehicle.model}</div>
            <div className="vehicle-details">{profile.vehicle.type} • {profile.vehicle.plate}</div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="profile-section">
        <h3>Documents</h3>
        <div className="documents-list">
          <div className="document-item verified">
            <div className="document-icon">🆔</div>
            <div className="document-info">
              <div className="document-name">Carte d'identité</div>
              <div className="document-expiry">Expire en {profile.documents.cni.expiry}</div>
            </div>
            <div className="document-status">✓ Vérifié</div>
          </div>
          
          <div className="document-item verified">
            <div className="document-icon">🪪</div>
            <div className="document-info">
              <div className="document-name">Permis de conduire</div>
              <div className="document-expiry">Expire en {profile.documents.license.expiry}</div>
            </div>
            <div className="document-status">✓ Vérifié</div>
          </div>
          
          <div className="document-item verified">
            <div className="document-icon">🛡️</div>
            <div className="document-info">
              <div className="document-name">Assurance</div>
              <div className="document-expiry">Expire en {profile.documents.insurance.expiry}</div>
            </div>
            <div className="document-status">✓ Vérifié</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-actions">
        <button className="action-btn primary">
          <span>📝</span>
          Modifier le profil
        </button>
        <button className="action-btn secondary">
          <span>🔒</span>
          Changer le mot de passe
        </button>
      </div>
    </div>
  );
}

export default Profile;

