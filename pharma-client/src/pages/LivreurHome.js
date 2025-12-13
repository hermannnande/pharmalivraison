import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './LivreurHome.css';

function LivreurHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'ongoing'
  
  const [requests] = useState([
    {
      id: 'REQ001',
      client: 'James Smith',
      pharmacie: 'Pharmacie du Plateau',
      pickup: 'Boulevard Angoulvant, Plateau',
      delivery: 'Urban Bites, Sector 137, Noida',
      distance: '3.2 km',
      earnings: '7000 FCFA',
      time: 'Jun 04, 2025 06:01 PM',
      status: 'request'
    },
    {
      id: 'REQ002',
      client: 'Marie Diallo',
      pharmacie: 'Pharmacie de Cocody',
      pickup: 'Rue des Jardins, Cocody',
      delivery: 'Cocody, Angré 8ème Tranche',
      distance: '5.1 km',
      earnings: '15000 FCFA',
      time: 'Jun 04, 2025 05:45 PM',
      status: 'request'
    }
  ]);

  const [ongoing] = useState([
    {
      id: 'LIV003',
      client: 'Kofi Mensah',
      pharmacie: 'Pharmacie d\'Adjamé',
      pickup: 'Marché d\'Adjamé',
      delivery: 'Treichville, Zone 4',
      distance: '2.8 km',
      earnings: '5500 FCFA',
      status: 'en_route_pharmacy'
    }
  ]);

  const stats = {
    livraisonsToday: 8,
    earnings: '45000 FCFA',
    avgTime: '25 min'
  };

  const handleAccept = (id) => {
    alert(`Demande ${id} acceptée ! Rendez-vous à la pharmacie pour récupérer la commande.`);
  };

  return (
    <div className="livreur-home-modern">
      <header className="livreur-header-modern">
        <button className="back-btn" onClick={() => navigate('/role')}>
          ←
        </button>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Online</span>
        </div>
        <div className="user-avatar">👤</div>
      </header>

      <div className="stats-container-modern">
        <div className="stat-card-modern">
          <div className="stat-icon-modern" style={{ background: '#DBEAFE' }}>
            <span style={{ color: '#3B82F6' }}>📦</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Livraisons</p>
            <p className="stat-value" style={{ color: COLORS.text }}>{stats.livraisonsToday}</p>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern" style={{ background: '#D1FAE5' }}>
            <span style={{ color: COLORS.primary }}>💰</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Gains</p>
            <p className="stat-value" style={{ color: COLORS.primary }}>{stats.earnings}</p>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-icon-modern" style={{ background: '#FEF3C7' }}>
            <span style={{ color: '#F59E0B' }}>⏱️</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Temps Moy.</p>
            <p className="stat-value" style={{ color: COLORS.text }}>{stats.avgTime}</p>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
          style={{ borderBottomColor: activeTab === 'requests' ? COLORS.primary : 'transparent' }}
        >
          Demandes
        </button>
        <button
          className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
          style={{ borderBottomColor: activeTab === 'ongoing' ? COLORS.primary : 'transparent' }}
        >
          En cours
        </button>
      </div>

      <div className="content-container">
        {activeTab === 'requests' && (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="delivery-request-card">
                <div className="request-header">
                  <div className="client-info-modern">
                    <div className="client-avatar-small">👤</div>
                    <div>
                      <h3>{request.client}</h3>
                      <span className="badge-delivery" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                        Livraison
                      </span>
                    </div>
                  </div>
                  <div className="earnings-badge" style={{ background: COLORS.primary }}>
                    {request.earnings}
                  </div>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span className="detail-icon green-icon">🏥</span>
                    <div className="detail-text">
                      <p className="detail-label">Pickup Location</p>
                      <p className="detail-value">{request.pickup}</p>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon red-icon">📍</span>
                    <div className="detail-text">
                      <p className="detail-label">Drop Location</p>
                      <p className="detail-value">{request.delivery}</p>
                    </div>
                  </div>
                </div>

                <div className="request-footer">
                  <div className="request-meta">
                    <span>📏 {request.distance}</span>
                    <span>🕒 {request.time}</span>
                  </div>
                </div>

                <div className="request-actions">
                  <button
                    className="accept-btn-modern"
                    onClick={() => handleAccept(request.id)}
                    style={{ background: COLORS.primary }}
                  >
                    ✓ Accepter
                  </button>
                  <button className="reject-btn-modern">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ongoing' && (
          <div className="ongoing-list">
            {ongoing.map((delivery) => (
              <div key={delivery.id} className="ongoing-delivery-card">
                <div className="ongoing-header">
                  <h3>#{delivery.id}</h3>
                  <span className="status-badge-ongoing" style={{ background: COLORS.primary }}>
                    En route
                  </span>
                </div>

                <div className="ongoing-details">
                  <p><strong>Client:</strong> {delivery.client}</p>
                  <p><strong>Pharmacie:</strong> {delivery.pharmacie}</p>
                  <p><strong>Distance:</strong> {delivery.distance}</p>
                  <p className="ongoing-earnings" style={{ color: COLORS.primary }}>
                    <strong>Gains:</strong> {delivery.earnings}
                  </p>
                </div>

                <div className="ongoing-actions">
                  <button className="action-btn-primary" style={{ background: COLORS.primary }}>
                    📍 Arrivé Pharmacie
                  </button>
                  <button className="action-btn-secondary">
                    🗺️ Voir Itinéraire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LivreurHome;
