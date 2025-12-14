import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'wallet',
      title: 'Mon Portefeuille',
      icon: '💰',
      description: 'Gains et historique',
      route: '/wallet',
      badge: '340,000 FCFA',
      color: '#2196f3'
    },
    {
      id: 'stats',
      title: 'Mes Statistiques',
      icon: '📊',
      description: 'Performance détaillée',
      route: '/statistics',
      badge: '247 livraisons',
      color: '#9c27b0'
    },
    {
      id: 'chat',
      title: 'Messages',
      icon: '💬',
      description: 'Client & Pharmacie',
      route: '/chat',
      badge: '2 nouveaux',
      color: '#4caf50'
    },
    {
      id: 'sos',
      title: 'Urgence SOS',
      icon: '🆘',
      description: 'Bouton d\'urgence',
      route: '/sos',
      color: '#f44336'
    },
    {
      id: 'withdrawal',
      title: 'Retrait d\'argent',
      icon: '💸',
      description: 'Demander un retrait',
      route: '/withdrawal',
      color: '#ff9800'
    },
    {
      id: 'levels',
      title: 'Mon Niveau',
      icon: '🏅',
      description: 'Badges et récompenses',
      route: '/levels',
      badge: 'Or',
      color: '#ffd700'
    },
    {
      id: 'profile',
      title: 'Mon Profil',
      icon: '👤',
      description: 'Informations personnelles',
      route: '/profile',
      color: '#607d8b'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      icon: '⚙️',
      description: 'Configuration app',
      route: '/settings',
      color: '#9e9e9e'
    }
  ];

  return (
    <div className="menu-page">
      {/* Header */}
      <div className="menu-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Menu</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-icon">🏍️</div>
        </div>
        <div className="profile-info">
          <h2>Livreur Test</h2>
          <p>livreur@test.com</p>
          <div className="profile-badges">
            <span className="badge gold">🥇 Or</span>
            <span className="badge">⭐ 4.8</span>
            <span className="badge">🏍️ 247</span>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            className="menu-item"
            onClick={() => navigate(item.route)}
            style={{ borderLeftColor: item.color }}
          >
            <div className="menu-item-icon" style={{ background: item.color + '20', color: item.color }}>
              {item.icon}
            </div>
            <div className="menu-item-content">
              <div className="menu-item-title">{item.title}</div>
              <div className="menu-item-description">{item.description}</div>
            </div>
            {item.badge && (
              <div className="menu-item-badge" style={{ background: item.color + '20', color: item.color }}>
                {item.badge}
              </div>
            )}
            <svg className="menu-item-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/livreur-dashboard')}>
            <span className="action-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/wallet')}>
            <span className="action-icon">💰</span>
            <span>Portefeuille</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/statistics')}>
            <span className="action-icon">📊</span>
            <span>Stats</span>
          </button>
          <button className="action-btn sos" onClick={() => navigate('/sos')}>
            <span className="action-icon">🆘</span>
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <button className="logout-btn" onClick={() => {
        if (window.confirm('Se déconnecter ?')) {
          navigate('/login');
        }
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Se déconnecter
      </button>
    </div>
  );
}

export default Menu;





