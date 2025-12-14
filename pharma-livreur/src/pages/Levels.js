import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Levels.css';

function Levels() {
  const navigate = useNavigate();
  
  const [currentLevel] = useState({
    level: 3,
    name: 'Bronze',
    currentPoints: 1850,
    nextLevelPoints: 2500,
    totalDeliveries: 247,
    rating: 4.8
  });

  const levels = [
    {
      id: 1,
      name: 'Débutant',
      icon: '🌱',
      minPoints: 0,
      maxPoints: 500,
      benefits: ['Accès basique', 'Support standard', '1% bonus']
    },
    {
      id: 2,
      name: 'Argent',
      icon: '🥈',
      minPoints: 500,
      maxPoints: 1500,
      benefits: ['Priorité moyenne', 'Support prioritaire', '2% bonus']
    },
    {
      id: 3,
      name: 'Bronze',
      icon: '🥉',
      minPoints: 1500,
      maxPoints: 2500,
      benefits: ['Haute priorité', 'Support VIP', '3% bonus', 'Badge bronze']
    },
    {
      id: 4,
      name: 'Or',
      icon: '🥇',
      minPoints: 2500,
      maxPoints: 5000,
      benefits: ['Priorité maximale', 'Support 24/7', '5% bonus', 'Badge or', 'Missions exclusives']
    },
    {
      id: 5,
      name: 'Platine',
      icon: '💎',
      minPoints: 5000,
      maxPoints: 10000,
      benefits: ['VIP total', 'Manager dédié', '8% bonus', 'Badge platine', 'Événements exclusifs']
    },
    {
      id: 6,
      name: 'Légende',
      icon: '👑',
      minPoints: 10000,
      maxPoints: Infinity,
      benefits: ['Statut légende', 'Service premium', '10% bonus', 'Badge légende', 'Récompenses mensuelles']
    }
  ];

  const progress = ((currentLevel.currentPoints - currentLevel.minPoints) / (currentLevel.nextLevelPoints - currentLevel.minPoints)) * 100;

  return (
    <div className="levels-page">
      {/* Header */}
      <div className="levels-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1>Mon Niveau</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Current Level Card */}
      <div className="current-level-card">
        <div className="level-badge-large">
          {levels[currentLevel.level - 1].icon}
        </div>
        <div className="level-name-large">{levels[currentLevel.level - 1].name}</div>
        <div className="level-points">{currentLevel.currentPoints} points</div>
        
        {/* Progress Bar */}
        <div className="level-progress-container">
          <div className="level-progress-bar">
            <div className="level-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="level-progress-text">
            {currentLevel.nextLevelPoints - currentLevel.currentPoints} points pour le niveau suivant
          </div>
        </div>

        {/* Stats */}
        <div className="level-stats-grid">
          <div className="level-stat">
            <div className="level-stat-value">{currentLevel.totalDeliveries}</div>
            <div className="level-stat-label">Livraisons</div>
          </div>
          <div className="level-stat">
            <div className="level-stat-value">{currentLevel.rating}⭐</div>
            <div className="level-stat-label">Note moyenne</div>
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="levels-list">
        <h2>Tous les niveaux</h2>
        {levels.map((level) => {
          const isCurrentLevel = level.id === currentLevel.level;
          const isPassed = level.id < currentLevel.level;
          const isLocked = level.id > currentLevel.level;

          return (
            <div 
              key={level.id} 
              className={`level-item ${isCurrentLevel ? 'current' : ''} ${isPassed ? 'passed' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div className="level-item-badge">{level.icon}</div>
              <div className="level-item-content">
                <div className="level-item-header">
                  <div className="level-item-name">{level.name}</div>
                  {isCurrentLevel && <span className="level-current-badge">Actuel</span>}
                  {isPassed && <span className="level-passed-badge">✓</span>}
                  {isLocked && <span className="level-locked-badge">🔒</span>}
                </div>
                <div className="level-item-points">
                  {level.maxPoints === Infinity 
                    ? `${level.minPoints}+ points`
                    : `${level.minPoints} - ${level.maxPoints} points`
                  }
                </div>
                <div className="level-benefits">
                  {level.benefits.map((benefit, index) => (
                    <span key={index} className="benefit-tag">• {benefit}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to Earn Points */}
      <div className="earn-points-section">
        <h2>Comment gagner des points</h2>
        <div className="earn-points-list">
          <div className="earn-point-item">
            <div className="earn-point-icon">📦</div>
            <div className="earn-point-info">
              <div className="earn-point-title">Livraison réussie</div>
              <div className="earn-point-desc">+10 points par livraison</div>
            </div>
          </div>
          <div className="earn-point-item">
            <div className="earn-point-icon">⭐</div>
            <div className="earn-point-info">
              <div className="earn-point-title">Note 5 étoiles</div>
              <div className="earn-point-desc">+5 points bonus</div>
            </div>
          </div>
          <div className="earn-point-item">
            <div className="earn-point-icon">⚡</div>
            <div className="earn-point-info">
              <div className="earn-point-title">Livraison rapide</div>
              <div className="earn-point-desc">+3 points bonus</div>
            </div>
          </div>
          <div className="earn-point-item">
            <div className="earn-point-icon">🎯</div>
            <div className="earn-point-info">
              <div className="earn-point-title">Série de 10 livraisons</div>
              <div className="earn-point-desc">+20 points bonus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Levels;

