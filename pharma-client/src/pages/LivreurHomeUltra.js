import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './LivreurHomeUltra.css';

function LivreurHomeUltra() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('demandes'); // demandes, encours, historique
  const [stats, setStats] = useState({
    demandesEnAttente: 3,
    coursesEnCours: 1,
    coursesTerminees: 24,
    gainsDuJour: 15000,
    evaluation: 4.9
  });

  // Demandes en attente
  const demandes = [
    {
      id: 1,
      client: 'Marie Kouassi',
      clientAvatar: '👩',
      pharmacie: 'Pharmacie du Longchamp',
      adresseClient: 'Cocody Riviera, Abidjan',
      distance: '2.5 km',
      montantEstime: 5000,
      medicaments: ['Paracétamol', 'Vitamine C'],
      urgence: 'Normale',
      duree: '15 min'
    },
    {
      id: 2,
      client: 'Kofi Mensah',
      clientAvatar: '👨',
      pharmacie: 'Grande Pharmacie Deux Plateaux',
      adresseClient: 'Deux Plateaux, Abidjan',
      distance: '1.8 km',
      montantEstime: 8000,
      medicaments: ['Ordonnance à récupérer'],
      urgence: 'Urgente',
      duree: '10 min'
    },
    {
      id: 3,
      client: 'Aïcha Traoré',
      clientAvatar: '👧',
      pharmacie: 'Pharmacie Toit-Rouge',
      adresseClient: 'Cocody Danga, Abidjan',
      distance: '3.2 km',
      montantEstime: 6500,
      medicaments: ['Antipaludéen', 'Doliprane'],
      urgence: 'Normale',
      duree: '20 min'
    }
  ];

  // Courses en cours
  const coursesEnCours = [
    {
      id: 101,
      client: 'Jean-Paul N\'Guessan',
      clientAvatar: '👨‍💼',
      statut: 'En route vers pharmacie',
      progression: 35,
      pharmacie: 'Pharmacie Adjamé Santé',
      destination: 'Adjamé Résidentiel',
      tempsRestant: '8 min'
    }
  ];

  const handleAcceptDemande = (demandeId) => {
    console.log('Demande acceptée:', demandeId);
    // Animation + redirection vers LiveTracking
    navigate('/live-tracking');
  };

  const handleRejectDemande = (demandeId) => {
    console.log('Demande refusée:', demandeId);
  };

  return (
    <div className="livreur-ultra">
      {/* HEADER MODERNE */}
      <header className="livreur-header-ultra">
        <div className="header-top">
          <button className="btn-back-ultra" onClick={() => navigate('/role')}>←</button>
          <div className="header-title">
            <h1>Espace Livreur</h1>
            <p className="status-online">🟢 En ligne</p>
          </div>
          <div className="profile-badge">
            <span className="avatar">👨‍🦱</span>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="stats-ultra">
          <div className="stat-card gradient-primary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-value">{stats.gainsDuJour.toLocaleString()} F</p>
              <p className="stat-label">Aujourd'hui</p>
            </div>
          </div>
          <div className="stat-card gradient-secondary">
            <div className="stat-icon">🏍️</div>
            <div className="stat-content">
              <p className="stat-value">{stats.coursesTerminees}</p>
              <p className="stat-label">Courses</p>
            </div>
          </div>
          <div className="stat-card gradient-accent">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <p className="stat-value">{stats.evaluation}</p>
              <p className="stat-label">Évaluation</p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs-ultra">
          <button 
            className={`tab-btn ${activeTab === 'demandes' ? 'active' : ''}`}
            onClick={() => setActiveTab('demandes')}
          >
            <span className="tab-badge">{stats.demandesEnAttente}</span>
            <span className="tab-text">Demandes</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'encours' ? 'active' : ''}`}
            onClick={() => setActiveTab('encours')}
          >
            <span className="tab-badge">{stats.coursesEnCours}</span>
            <span className="tab-text">En cours</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'historique' ? 'active' : ''}`}
            onClick={() => setActiveTab('historique')}
          >
            <span className="tab-text">Historique</span>
          </button>
        </div>
      </header>

      {/* CONTENU */}
      <div className="livreur-content-ultra">
        {activeTab === 'demandes' && (
          <div className="demandes-list">
            {demandes.map((demande, idx) => (
              <div 
                key={demande.id} 
                className="demande-card-ultra"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`urgence-badge ${demande.urgence.toLowerCase()}`}>
                  {demande.urgence === 'Urgente' ? '🔴' : '🟢'} {demande.urgence}
                </div>

                <div className="demande-header-card">
                  <div className="client-avatar-large">{demande.clientAvatar}</div>
                  <div className="client-info-card">
                    <h3 className="client-name">{demande.client}</h3>
                    <p className="client-address">{demande.adresseClient}</p>
                  </div>
                </div>

                <div className="demande-details">
                  <div className="detail-row">
                    <span className="detail-icon">🏥</span>
                    <span className="detail-text">{demande.pharmacie}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📏</span>
                    <span className="detail-text">{demande.distance}</span>
                    <span className="detail-badge">⏱️ {demande.duree}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">💊</span>
                    <span className="detail-text">{demande.medicaments.join(', ')}</span>
                  </div>
                  <div className="detail-row gain">
                    <span className="detail-icon">💰</span>
                    <span className="detail-text gain-text">{demande.montantEstime.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="demande-actions">
                  <button 
                    className="btn-action reject"
                    onClick={() => handleRejectDemande(demande.id)}
                  >
                    <span>✕</span>
                    <span>Refuser</span>
                  </button>
                  <button 
                    className="btn-action accept"
                    onClick={() => handleAcceptDemande(demande.id)}
                  >
                    <span>✓</span>
                    <span>Accepter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'encours' && (
          <div className="encours-list">
            {coursesEnCours.map((course) => (
              <div key={course.id} className="course-card-ultra">
                <div className="course-header">
                  <div className="course-client">
                    <span className="course-avatar">{course.clientAvatar}</span>
                    <span className="course-name">{course.client}</span>
                  </div>
                  <span className="course-timer">⏱️ {course.tempsRestant}</span>
                </div>

                <div className="progress-bar-ultra">
                  <div 
                    className="progress-fill"
                    style={{ width: `${course.progression}%` }}
                  >
                    <span className="progress-percentage">{course.progression}%</span>
                  </div>
                </div>

                <p className="course-status">{course.statut}</p>

                <div className="course-route">
                  <div className="route-point">
                    <div className="route-dot green"></div>
                    <span>{course.pharmacie}</span>
                  </div>
                  <div className="route-line"></div>
                  <div className="route-point">
                    <div className="route-dot blue"></div>
                    <span>{course.destination}</span>
                  </div>
                </div>

                <button className="btn-view-course" onClick={() => navigate('/live-tracking')}>
                  Voir la course
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'historique' && (
          <div className="historique-empty">
            <div className="empty-icon">📦</div>
            <h3>Historique de vos courses</h3>
            <p>Vos courses terminées apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LivreurHomeUltra;

