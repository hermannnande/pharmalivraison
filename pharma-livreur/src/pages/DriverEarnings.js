import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions, getWalletBalance } from '../services/api';
import './DriverEarnings.css';

const DriverEarnings = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today'); // today, week, month, year

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
        default:
          return true;
      }
    });
  };

  // Calculer les gains de la période
  const calculateEarnings = () => {
    const filtered = getFilteredTransactions();
    const earnings = filtered
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const withdrawals = filtered
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return { 
      earnings: earnings || 0, 
      withdrawals: withdrawals || 0, 
      deliveries: filtered.filter(t => t.type === 'earning').length 
    };
  };

  const stats = calculateEarnings();
  const filteredTransactions = getFilteredTransactions();
  
  // Valeurs sécurisées pour l'affichage
  const safeBalance = balance || 0;
  const safeEarnings = stats.earnings || 0;
  const safeDeliveries = stats.deliveries || 0;

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return "Aujourd'hui";
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'year': return 'Cette année';
      default: return '';
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `Aujourd'hui ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Hier ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="earnings-page">
        <div className="loader">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="earnings-page">
      {/* Header */}
      <div className="earnings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1>Mes gains</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Solde actuel */}
      <div className="balance-card">
        <div className="balance-label">Solde disponible</div>
        <div className="balance-amount">{safeBalance.toLocaleString('fr-FR')} FCFA</div>
        <button className="withdraw-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Retirer
        </button>
      </div>

      {/* Filtres de période */}
      <div className="period-filters">
        {['today', 'week', 'month', 'year'].map((p) => (
          <button
            key={p}
            className={`period-btn ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p === 'today' ? 'Jour' : p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
          </button>
        ))}
      </div>

      {/* Statistiques de la période */}
      <div className="period-stats">
        <h2>{getPeriodLabel()}</h2>
        <div className="stats-grid">
          <div className="stat-card earnings">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">+{safeEarnings.toLocaleString('fr-FR')} FCFA</div>
              <div className="stat-label">Gains</div>
            </div>
          </div>
          <div className="stat-card deliveries">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{safeDeliveries}</div>
              <div className="stat-label">Livraisons</div>
            </div>
          </div>
          <div className="stat-card average">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {safeDeliveries > 0 ? Math.round(safeEarnings / safeDeliveries).toLocaleString('fr-FR') : 0} FCFA
              </div>
              <div className="stat-label">Moyenne/course</div>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des transactions */}
      <div className="transactions-section">
        <h3>Historique</h3>
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Aucune transaction pour cette période</p>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-icon">
                  {transaction.type === 'earning' ? '💰' : '📤'}
                </div>
                <div className="transaction-info">
                  <div className="transaction-title">{transaction.description}</div>
                  <div className="transaction-date">{formatDate(transaction.date)}</div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'earning' ? '+' : '-'}
                  {(transaction.amount || 0).toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverEarnings;

