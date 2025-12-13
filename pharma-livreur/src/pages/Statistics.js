import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';

function Statistics() {
  const navigate = useNavigate();
  
  const [stats] = useState({
    totalDeliveries: 247,
    totalEarnings: 1250000,
    averageRating: 4.8,
    acceptanceRate: 95,
    totalDistance: 1234,
    completionRate: 98,
    averageTime: 28,
    bestDay: { date: '08/12/2025', count: 25 },
    bestMonth: { month: 'Novembre 2025', amount: 385000 }
  });

  const [recentPerformance] = useState([
    { month: 'Juin', deliveries: 45, earnings: 225000 },
    { month: 'Juil', deliveries: 52, earnings: 260000 },
    { month: 'Août', deliveries: 48, earnings: 240000 },
    { month: 'Sept', deliveries: 50, earnings: 250000 },
    { month: 'Oct', deliveries: 55, earnings: 275000 },
    { month: 'Nov', deliveries: 62, earnings: 310000 }
  ]);

  const [ratingDistribution] = useState([
    { stars: 5, count: 180, percentage: 73 },
    { stars: 4, count: 50, percentage: 20 },
    { stars: 3, count: 12, percentage: 5 },
    { stars: 2, count: 3, percentage: 1 },
    { stars: 1, count: 2, percentage: 1 }
  ]);

  const maxDeliveries = Math.max(...recentPerformance.map(m => m.deliveries));

  return (
    <div className="statistics-page">
      {/* Header */}
      <div className="stats-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Mes Statistiques</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Main Stats Cards */}
      <div className="main-stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🏍️</div>
          <div className="stat-value">{stats.totalDeliveries}</div>
          <div className="stat-label">Livraisons totales</div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.averageRating}</div>
          <div className="stat-label">Note moyenne</div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.acceptanceRate}%</div>
          <div className="stat-label">Taux d'acceptation</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📍</div>
          <div className="stat-value">{stats.totalDistance} km</div>
          <div className="stat-label">Distance parcourue</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <h2>Performance (6 derniers mois)</h2>
        <div className="performance-chart">
          {recentPerformance.map((month, index) => (
            <div key={index} className="performance-bar-container">
              <div 
                className="performance-bar"
                style={{ height: `${(month.deliveries / maxDeliveries) * 100}%` }}
              >
                <div className="performance-value">{month.deliveries}</div>
              </div>
              <div className="performance-label">{month.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="additional-stats">
        <div className="stat-row">
          <div className="stat-row-icon">⏱️</div>
          <div className="stat-row-info">
            <div className="stat-row-label">Temps moyen de livraison</div>
            <div className="stat-row-value">{stats.averageTime} min</div>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-row-icon">✅</div>
          <div className="stat-row-info">
            <div className="stat-row-label">Taux de complétion</div>
            <div className="stat-row-value">{stats.completionRate}%</div>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-row-icon">🏆</div>
          <div className="stat-row-info">
            <div className="stat-row-label">Meilleur jour</div>
            <div className="stat-row-value">{stats.bestDay.count} livraisons · {stats.bestDay.date}</div>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-row-icon">💰</div>
          <div className="stat-row-info">
            <div className="stat-row-label">Meilleur mois</div>
            <div className="stat-row-value">{new Intl.NumberFormat('fr-FR').format(stats.bestMonth.amount)} FCFA · {stats.bestMonth.month}</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rating-section">
        <h2>Distribution des notes</h2>
        <div className="rating-list">
          {ratingDistribution.map((rating) => (
            <div key={rating.stars} className="rating-row">
              <div className="rating-stars">
                {rating.stars} ⭐
              </div>
              <div className="rating-bar-container">
                <div 
                  className="rating-bar"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <div className="rating-count">{rating.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Earnings Card */}
      <div className="earnings-card">
        <div className="earnings-icon">💎</div>
        <div className="earnings-info">
          <div className="earnings-label">Gains totaux</div>
          <div className="earnings-value">
            {new Intl.NumberFormat('fr-FR').format(stats.totalEarnings)} FCFA
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;


