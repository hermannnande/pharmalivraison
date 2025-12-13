import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoritePharmacies.css';

const FavoritePharmacies = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Pharmacie du Plateau',
      address: 'Boulevard de la République, Plateau',
      distance: '1.2 km',
      isOpen: true,
      isDeGarde: false,
      phone: '+225 27 20 22 22 22',
      rating: 4.5,
      deliveryTime: '25-35 min'
    },
    {
      id: 2,
      name: 'Pharmacie de la Gare',
      address: 'Avenue 7, Treichville',
      distance: '2.5 km',
      isOpen: true,
      isDeGarde: true,
      phone: '+225 27 21 33 33 33',
      rating: 4.8,
      deliveryTime: '30-40 min'
    },
    {
      id: 3,
      name: 'Pharmacie des 2 Plateaux',
      address: 'Rue des Jardins, 2 Plateaux',
      distance: '3.8 km',
      isOpen: false,
      isDeGarde: false,
      phone: '+225 27 22 44 44 44',
      rating: 4.3,
      deliveryTime: '40-50 min'
    }
  ]);

  const removeFavorite = (id) => {
    if (window.confirm('Retirer cette pharmacie des favoris ?')) {
      setFavorites(favorites.filter(f => f.id !== id));
    }
  };

  const handleOrderFromPharmacy = (pharmacy) => {
    navigate('/home', {
      state: {
        selectedPharmacy: pharmacy
      }
    });
  };

  return (
    <div className="favorites-page">
      {/* Header */}
      <div className="favorites-header">
        <button className="back-btn-favorites" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="favorites-title">Pharmacies favorites</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Liste des favoris */}
      <div className="favorites-container">
        {favorites.length === 0 ? (
          <div className="empty-state-favorites">
            <div className="empty-icon-favorites">⭐</div>
            <h3>Aucune pharmacie favorite</h3>
            <p>Ajoutez vos pharmacies préférées pour y accéder rapidement</p>
            <button className="empty-back-btn" onClick={() => navigate('/home')}>
              Découvrir les pharmacies
            </button>
          </div>
        ) : (
          <div className="favorites-list">
            {favorites.map((pharmacy) => (
              <div key={pharmacy.id} className="favorite-card">
                {/* Header avec badges */}
                <div className="favorite-card-header">
                  <div className="status-badges">
                    {pharmacy.isDeGarde && (
                      <span className="badge-de-garde">
                        🚑 DE GARDE
                      </span>
                    )}
                    <span className={`badge-status ${pharmacy.isOpen ? 'open' : 'closed'}`}>
                      {pharmacy.isOpen ? '● Ouverte' : '● Fermée'}
                    </span>
                  </div>
                  <button 
                    className="unfavorite-btn"
                    onClick={() => removeFavorite(pharmacy.id)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="#f44336"/>
                    </svg>
                  </button>
                </div>

                {/* Infos principales */}
                <div className="favorite-info">
                  <h3 className="pharmacy-name">{pharmacy.name}</h3>
                  <div className="pharmacy-address">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21C12 21 4 15 4 9C4 5.68629 6.68629 3 10 3H14C17.3137 3 20 5.68629 20 9C20 15 12 21 12 21Z" stroke="#757575" strokeWidth="2"/>
                      <circle cx="12" cy="9" r="2" fill="#757575"/>
                    </svg>
                    <span>{pharmacy.address}</span>
                  </div>
                  <div className="pharmacy-meta">
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#4caf50" strokeWidth="2"/>
                        <path d="M12 7V12L15 14" stroke="#4caf50" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>{pharmacy.deliveryTime}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12L8 7L13 12L21 4" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{pharmacy.distance}</span>
                    </div>
                    <div className="meta-item rating">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#ffc107"/>
                      </svg>
                      <span>{pharmacy.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="favorite-actions">
                  <a 
                    href={`tel:${pharmacy.phone}`} 
                    className="action-btn call-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" fill="currentColor"/>
                    </svg>
                    Appeler
                  </a>
                  <button 
                    className="action-btn order-btn"
                    onClick={() => handleOrderFromPharmacy(pharmacy)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePharmacies;



