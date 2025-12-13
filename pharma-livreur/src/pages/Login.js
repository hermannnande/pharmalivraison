import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import { loginDriver } from '../services/api';
import socketService from '../services/socket';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'email' ou 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    countryCode: '+225'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Vérifier que les champs sont remplis
      if (!formData.phone || !formData.password) {
        setError('Veuillez remplir tous les champs');
        setLoading(false);
        return;
      }

      // Formater le numéro de téléphone (format simple: +22508080808)
      let phone = formData.phone.replace(/\s/g, ''); // Retirer les espaces
      
      // Ajouter l'indicatif si pas déjà présent
      if (!phone.startsWith('+')) {
        phone = formData.countryCode + phone;
      }
      
      console.log('🔐 Tentative de connexion livreur:', phone);
      
      // Appeler l'API de connexion
      const response = await loginDriver(phone, formData.password);
      
      // Vérifier que c'est bien un livreur
      if (response.user.role !== 'driver') {
        setError('Cette application est réservée aux livreurs');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }
      
      // Connecter au Socket.IO
      socketService.connect();
      
      // Rediriger vers le dashboard livreur
      navigate('/livreur-dashboard');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Identifiants incorrects');
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Connexion via ${provider} - Fonctionnalité à venir !`);
    // navigate('/home');
  };

  return (
    <div className="login-page-modern">
      {/* Logo et titre en haut */}
      <div className="login-header">
        <div className="login-logo">
          <div className="logo-icon">
            <span className="cross">✚</span>
            <span className="truck">🚚</span>
          </div>
        </div>
        <h1 className="app-tagline">Votre pharmacie à domicile</h1>
      </div>

      {/* Carte de connexion */}
      <div className="login-card">
        <h2 className="login-title">Connectez-vous</h2>
        <p className="login-subtitle">Entrez vos identifiants pour continuer</p>

        <form onSubmit={handleSubmit} className="login-form-modern">
          {/* Message d'erreur */}
          {error && (
            <div className="error-message" style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Identifiants test */}
          <div style={{
            background: '#e8f5e9',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '13px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#2e7d32' }}>
              🏍️ Test Livreur:
            </div>
            <div style={{ color: '#555' }}>
              📱 +225 08 08 08 08 08<br />
              🔒 password123
            </div>
          </div>

          {/* Champ Téléphone */}
          <div className="form-group-modern">
            <div className="input-wrapper phone-input">
              <span className="input-icon">📱</span>
              <select 
                className="country-code"
                value={formData.countryCode}
                onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                disabled={loading}
              >
                <option value="+225">🇨🇮 +225</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input
                type="tel"
                placeholder="08 08 08 08 08"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                maxLength="14"
                disabled={loading}
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="form-group-modern">
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Mot de passe oublié */}
          <div className="forgot-password-modern">
            <button 
              type="button" 
              onClick={() => alert('Fonctionnalité à venir !')}
              disabled={loading}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            className="login-btn-modern"
            style={{ 
              background: loading ? '#ccc' : COLORS.primary,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Connexion sociale */}
        <div className="social-login-section">
          <div className="divider-text">Ou connectez-vous avec</div>
          
          <div className="social-buttons">
            <button 
              className="social-btn facebook"
              onClick={() => handleSocialLogin('Facebook')}
              type="button"
              disabled={loading}
            >
              <span className="social-icon">f</span>
            </button>
            <button 
              className="social-btn google"
              onClick={() => handleSocialLogin('Google')}
              type="button"
              disabled={loading}
            >
              <span className="social-icon">G</span>
            </button>
            <button 
              className="social-btn apple"
              onClick={() => handleSocialLogin('Apple')}
              type="button"
              disabled={loading}
            >
              <span className="social-icon"></span>
            </button>
          </div>

          <p className="terms-text">
            En continuant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>

      {/* Créer un compte */}
      <div className="signup-section">
        <button
          className="signup-btn"
          onClick={() => alert('Inscription - Fonctionnalité à venir !')}
          type="button"
          disabled={loading}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}

export default Login;
