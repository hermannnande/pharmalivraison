import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryCompletedModal.css';

const DeliveryCompletedModal = ({ isOpen, onClose, earnings, orderNumber }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  // S'assurer que earnings est un nombre valide
  const safeEarnings = isNaN(earnings) || !earnings ? 0 : Math.round(earnings);

  const handleViewEarnings = () => {
    onClose();
    navigate('/earnings');
  };

  return (
    <div className="completion-modal-overlay" onClick={onClose}>
      <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
        {/* Animation de confettis */}
        <div className="confetti-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>

        {/* Icône de succès */}
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#4caf50"/>
            <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Message de félicitation */}
        <h2 className="completion-title">🎉 Félicitations !</h2>
        <p className="completion-subtitle">Livraison {orderNumber} terminée avec succès</p>

        {/* Montant gagné */}
        <div className="earnings-display">
          <div className="earnings-label">Vous avez gagné</div>
          <div className="earnings-amount">{safeEarnings.toLocaleString('fr-FR')} FCFA</div>
          <div className="earnings-badge">+{safeEarnings} FCFA</div>
        </div>

        {/* Statistiques rapides */}
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-text">
              <div className="stat-value">80%</div>
              <div className="stat-label">Commission</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-text">
              <div className="stat-value">+10</div>
              <div className="stat-label">Points</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="completion-actions">
          <button className="btn-secondary" onClick={handleViewEarnings}>
            Voir mes gains
          </button>
          <button className="btn-primary" onClick={onClose}>
            Nouvelle course
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCompletedModal;

