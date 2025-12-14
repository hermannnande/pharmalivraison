import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions, getWalletBalance } from '../services/api';
import './Statistics.css';

function Statistics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month'); // today, week, month, year, all
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [stats] = useState({
    totalDeliveries: 247,
    averageRating: 4.8,
    acceptanceRate: 95,
    totalDistance: 1234,
    completionRate: 98,
    averageTime: 28,
    bestDay: { date: '08/12/2025', count: 25 }
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        getWalletBalance(),
        getTransactions()
      ]);

      if (balanceRes.success) {
        setBalance(balanceRes.balance || 0);
      }

      if (transactionsRes.success) {
        setTransactions(transactionsRes.transactions || []);
      }
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les transactions par période
  const getFilteredTransactions = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      switch (period) {
        case 'today':
          return transactionDate >= startOfDay;
        case 'week':
          return transactionDate >= startOfWeek;
        case 'month':
          return transactionDate >= startOfMonth;
        case 'year':
          return transactionDate >= startOfYear;
        case 'all':
        default:
          return true;
      }
    });
  };

  // Calculer les gains de la période
  const calculatePeriodEarnings = () => {
    const filtered = getFilteredTransactions();
    const earnings = filtered
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const deliveries = filtered.filter(t => t.type === 'earning').length;

    return { earnings: earnings || 0, deliveries: deliveries || 0 };
  };

  const periodStats = calculatePeriodEarnings();
  const maxDeliveries = Math.max(...recentPerformance.map(m => m.deliveries));

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return "Aujourd'hui";
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'year': return 'Cette année';
      case 'all': return 'Tous les temps';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="stats-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Mes Statistiques</h1>
          <div style={{ width: '40px' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'white' }}>
          Chargement...
        </div>
      </div>
    );
  }

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

      {/* Filtres de période */}
      <div className="period-filters">
        {['today', 'week', 'month', 'year', 'all'].map((p) => (
          <button
            key={p}
            className={`period-btn ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p === 'today' ? 'Jour' : p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : p === 'year' ? 'Année' : 'Tout'}
          </button>
        ))}
      </div>

      {/* Section Gains de la période */}
      <div className="period-earnings-section">
        <h2>{getPeriodLabel()}</h2>
        <div className="period-earnings-grid">
          <div className="period-card earnings">
            <div className="period-icon">💰</div>
            <div className="period-value">+{periodStats.earnings.toLocaleString('fr-FR')} FCFA</div>
            <div className="period-label">Gains</div>
          </div>
          <div className="period-card deliveries">
            <div className="period-icon">📦</div>
            <div className="period-value">{periodStats.deliveries}</div>
            <div className="period-label">Livraisons</div>
          </div>
          <div className="period-card average">
            <div className="period-icon">📊</div>
            <div className="period-value">
              {periodStats.deliveries > 0 ? Math.round(periodStats.earnings / periodStats.deliveries).toLocaleString('fr-FR') : 0} FCFA
            </div>
            <div className="period-label">Moyenne/course</div>
          </div>
        </div>
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
            <div className="stat-row-label">Solde disponible</div>
            <div className="stat-row-value">{balance.toLocaleString('fr-FR')} FCFA</div>
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
    </div>
  );
}

export default Statistics;





