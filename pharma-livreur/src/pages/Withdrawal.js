import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Withdrawal.css';

function Withdrawal() {
  const navigate = useNavigate();
  const [balance] = useState(125000); // Solde disponible
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mobile'); // mobile, bank, cash
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const minWithdrawal = 5000;
  const maxWithdrawal = balance;

  const quickAmounts = [10000, 25000, 50000, 100000];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseInt(amount);

    // Validation
    if (!amount || withdrawAmount < minWithdrawal) {
      setError(`Le montant minimum est ${minWithdrawal.toLocaleString('fr-FR')} FCFA`);
      return;
    }

    if (withdrawAmount > maxWithdrawal) {
      setError('Solde insuffisant');
      return;
    }

    if (method === 'mobile' && !phoneNumber) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setLoading(true);
    setError('');

    // Simulation de retrait
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/wallet');
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="withdrawal-page">
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h2>Retrait réussi !</h2>
          <p>Votre demande de retrait de</p>
          <div className="success-amount">{parseInt(amount).toLocaleString('fr-FR')} FCFA</div>
          <p className="success-subtitle">a été envoyée avec succès</p>
          <p className="success-note">Vous recevrez votre argent sous 24-48h</p>
        </div>
      </div>
    );
  }

  return (
    <div className="withdrawal-page">
      {/* Header */}
      <div className="withdrawal-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1>Retrait d'argent</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Balance Card */}
      <div className="balance-card-withdrawal">
        <div className="balance-icon">💰</div>
        <div className="balance-label">Solde disponible</div>
        <div className="balance-amount">{balance.toLocaleString('fr-FR')} FCFA</div>
      </div>

      {/* Amount Input */}
      <div className="withdrawal-section">
        <h3>Montant à retirer</h3>
        <div className="amount-input-group">
          <input
            type="number"
            className="amount-input"
            placeholder="Entrez le montant"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
          />
          <span className="amount-currency">FCFA</span>
        </div>
        <div className="amount-info">
          Minimum: {minWithdrawal.toLocaleString('fr-FR')} FCFA
        </div>

        {/* Quick Amounts */}
        <div className="quick-amounts">
          {quickAmounts.map((value) => (
            <button
              key={value}
              className={`quick-amount-btn ${parseInt(amount) === value ? 'active' : ''}`}
              onClick={() => handleQuickAmount(value)}
              disabled={value > balance}
            >
              {(value / 1000)}k
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawal Method */}
      <div className="withdrawal-section">
        <h3>Méthode de retrait</h3>
        <div className="method-list">
          <div 
            className={`method-item ${method === 'mobile' ? 'active' : ''}`}
            onClick={() => setMethod('mobile')}
          >
            <div className="method-icon">📱</div>
            <div className="method-info">
              <div className="method-name">Mobile Money</div>
              <div className="method-desc">Orange, MTN, Moov</div>
            </div>
            <div className="method-check">
              {method === 'mobile' && '✓'}
            </div>
          </div>

          <div 
            className={`method-item ${method === 'bank' ? 'active' : ''}`}
            onClick={() => setMethod('bank')}
          >
            <div className="method-icon">🏦</div>
            <div className="method-info">
              <div className="method-name">Virement bancaire</div>
              <div className="method-desc">Vers votre compte</div>
            </div>
            <div className="method-check">
              {method === 'bank' && '✓'}
            </div>
          </div>

          <div 
            className={`method-item ${method === 'cash' ? 'active' : ''}`}
            onClick={() => setMethod('cash')}
          >
            <div className="method-icon">💵</div>
            <div className="method-info">
              <div className="method-name">Espèces</div>
              <div className="method-desc">Retrait au bureau</div>
            </div>
            <div className="method-check">
              {method === 'cash' && '✓'}
            </div>
          </div>
        </div>
      </div>

      {/* Phone Number (for Mobile Money) */}
      {method === 'mobile' && (
        <div className="withdrawal-section">
          <h3>Numéro de téléphone</h3>
          <input
            type="tel"
            className="phone-input"
            placeholder="+225 07 XX XX XX XX"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setError('');
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Withdraw Button */}
      <div className="withdrawal-actions">
        <button 
          className="withdraw-btn"
          onClick={handleWithdraw}
          disabled={loading || !amount}
        >
          {loading ? (
            <span>Traitement en cours...</span>
          ) : (
            <>
              <span>Retirer</span>
              {amount && <span className="btn-amount">{parseInt(amount).toLocaleString('fr-FR')} FCFA</span>}
            </>
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="withdrawal-info">
        <div className="info-title">ℹ️ Informations</div>
        <ul className="info-list">
          <li>Les retraits sont traités sous 24-48h</li>
          <li>Frais de retrait: 0% (gratuit)</li>
          <li>Montant minimum: 5 000 FCFA</li>
          <li>Vérifiez vos coordonnées avant de valider</li>
        </ul>
      </div>
    </div>
  );
}

export default Withdrawal;

