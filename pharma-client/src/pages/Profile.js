import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'Client Test',
    email: 'client@test.com',
    phone: '+225 07 00 00 00 00',
    birthday: '1990-01-15',
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn-profile" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="profile-title">Mon profil</h1>
        <button 
          className="edit-btn-profile"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Enregistrer' : 'Modifier'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="profile-container">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#4caf50"/>
                  <path d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21" fill="#4caf50"/>
                </svg>
              </div>
            )}
            {isEditing && (
              <label className="avatar-upload-btn">
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/>
                </svg>
              </label>
            )}
          </div>
          <h2 className="profile-name-display">{profile.name}</h2>
          <p className="profile-email-display">{profile.email}</p>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <div className="form-section">
            <h3 className="section-title">Informations personnelles</h3>
            
            <div className="form-group-profile">
              <label>Nom complet</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group-profile">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group-profile">
              <label>Téléphone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group-profile">
              <label>Date de naissance</label>
              <input
                type="date"
                value={profile.birthday}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="form-section stats-section">
            <h3 className="section-title">Statistiques</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-value">12</div>
                <div className="stat-label">Commandes</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-value">3</div>
                <div className="stat-label">Favoris</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-value">3</div>
                <div className="stat-label">Adresses</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-value">3</div>
                <div className="stat-label">Rappels</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;





