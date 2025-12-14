import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' ou 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    countryCode: '+225'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      if (!formData.email || !formData.password) {
        alert('Veuillez remplir tous les champs');
        return;
      }
    } else {
      if (!formData.phone || !formData.password) {
        alert('Veuillez remplir tous les champs');
        return;
      }
    }
    
    alert('Connexion réussie ! Bienvenue sur PharmaLivraison 🎉');
    navigate('/home');
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

        {/* Sélecteur Email/Téléphone */}
        <div className="login-method-selector">
          <button
            className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
            type="button"
          >
            📧 Email
          </button>
          <button
            className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginMethod('phone')}
            type="button"
          >
            📱 Téléphone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form-modern">
          {/* Champ Email ou Téléphone */}
          {loginMethod === 'email' ? (
            <div className="form-group-modern">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group-modern">
              <div className="input-wrapper phone-input">
                <span className="input-icon">📱</span>
                <select 
                  className="country-code"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                >
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>
                <input
                  type="tel"
                  placeholder="XX XX XX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  maxLength="14"
                />
              </div>
            </div>
          )}

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
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
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
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            className="login-btn-modern"
            style={{ background: COLORS.primary }}
          >
            Se connecter
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
            >
              <span className="social-icon">f</span>
            </button>
            <button 
              className="social-btn google"
              onClick={() => handleSocialLogin('Google')}
              type="button"
            >
              <span className="social-icon">G</span>
            </button>
            <button 
              className="social-btn apple"
              onClick={() => handleSocialLogin('Apple')}
              type="button"
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
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}

export default Login;
