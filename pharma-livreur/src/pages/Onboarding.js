import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './Onboarding.css';

function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="illustration">
          <div className="illustration-bg">
            <div className="pharmacy-icon">🏥</div>
            <div className="person-icon">🧑</div>
            <div className="delivery-icon">🏍️</div>
            <div className="medicine-box">💊</div>
          </div>
        </div>

        <div className="onboarding-text">
          <h1>Fais-toi livrer tes médicaments sans te déplacer à Abidjan</h1>
          <p>Commandez vos médicaments en ligne et recevez-les directement chez vous</p>
        </div>

        <div className="onboarding-buttons">
          <button
            className="btn-primary"
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => navigate('/register')}
          >
            Créer un compte
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
        </div>

        <div className="onboarding-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Livraison rapide</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Paiement sécurisé</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📍</span>
            <span>Suivi en temps réel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;

