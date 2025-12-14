import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wallet.css';

function Wallet() {
  const navigate = useNavigate();
  
  const [walletData] = useState({
    today: 15000,
    week: 85000,
    month: 340000,
    total: 1250000,
    pending: 5000
  });

  const [transactions] = useState([
    { id: 'CMD-001', date: '13/12/2025 07:30', amount: 1000, type: 'livraison', status: 'payé' },
    { id: 'CMD-002', date: '13/12/2025 08:15', amount: 1500, type: 'livraison', status: 'payé' },
    { id: 'CMD-003', date: '13/12/2025 09:45', amount: 2000, type: 'bonus', status: 'payé' },
    { id: 'CMD-004', date: '13/12/2025 10:20', amount: 1200, type: 'livraison', status: 'payé' },
    { id: 'CMD-005', date: '13/12/2025 11:00', amount: 800, type: 'livraison', status: 'payé' },
    { id: 'RET-001', date: '12/12/2025 18:00', amount: -50000, type: 'retrait', status: 'validé' },
    { id: 'CMD-006', date: '12/12/2025 15:30', amount: 1000, type: 'livraison', status: 'payé' },
    { id: 'BONUS-001', date: '11/12/2025', amount: 5000, type: 'bonus', status: 'payé' }
  ]);

  const [weeklyData] = useState([
    { day: 'Lun', amount: 12000 },
    { day: 'Mar', amount: 15000 },
    { day: 'Mer', amount: 13000 },
    { day: 'Jeu', amount: 18000 },
    { day: 'Ven', amount: 14000 },
    { day: 'Sam', amount: 8000 },
    { day: 'Dim', amount: 5000 }
  ]);

  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(Math.abs(amount)) + ' FCFA';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'livraison': return '🏍️';
      case 'bonus': return '🎁';
      case 'retrait': return '💸';
      default: return '💰';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'livraison': return '#2196f3';
      case 'bonus': return '#4caf50';
      case 'retrait': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <div className="wallet-page">
      {/* Header */}
      <div className="wallet-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Mon Portefeuille</h1>
        <button className="withdraw-btn" onClick={() => navigate('/withdrawal')}>
          💸
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Solde disponible</div>
        <div className="balance-amount">{formatAmount(walletData.month)}</div>
        <div className="balance-pending">
          En attente : {formatAmount(walletData.pending)}
        </div>
        <button className="btn-withdraw-main" onClick={() => navigate('/withdrawal')}>
          Demander un retrait
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Period Cards */}
      <div className="period-cards">
        <div className="period-card">
          <div className="period-icon">📅</div>
          <div className="period-info">
            <div className="period-label">Aujourd'hui</div>
            <div className="period-amount">{formatAmount(walletData.today)}</div>
          </div>
        </div>
        <div className="period-card">
          <div className="period-icon">📆</div>
          <div className="period-info">
            <div className="period-label">Cette semaine</div>
            <div className="period-amount">{formatAmount(walletData.week)}</div>
          </div>
        </div>
        <div className="period-card">
          <div className="period-icon">🏆</div>
          <div className="period-info">
            <div className="period-label">Total gagné</div>
            <div className="period-amount">{formatAmount(walletData.total)}</div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="chart-section">
        <h2>Gains de la semaine</h2>
        <div className="chart-container">
          {weeklyData.map((day, index) => (
            <div key={index} className="chart-bar-container">
              <div 
                className="chart-bar"
                style={{ 
                  height: `${(day.amount / maxAmount) * 100}%`,
                  background: day.day === 'Ven' ? 'linear-gradient(135deg, #4caf50, #66bb6a)' : 'linear-gradient(135deg, #2196f3, #42a5f5)'
                }}
              >
                <div className="chart-value">{(day.amount / 1000).toFixed(0)}k</div>
              </div>
              <div className="chart-label">{day.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="transactions-section">
        <h2>Historique des transactions</h2>
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon" style={{ background: getTypeColor(transaction.type) + '20', color: getTypeColor(transaction.type) }}>
                {getTypeIcon(transaction.type)}
              </div>
              <div className="transaction-info">
                <div className="transaction-id">{transaction.id}</div>
                <div className="transaction-date">{transaction.date}</div>
              </div>
              <div className="transaction-right">
                <div className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                </div>
                <div className={`transaction-status ${transaction.status}`}>
                  {transaction.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wallet;





