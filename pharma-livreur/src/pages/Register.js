import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }

    // Pour l'instant, on simule une inscription réussie
    alert('Compte créé avec succès ! 🎉 Bienvenue sur PharmaLivraison !');
    navigate('/role');
  };

  return (
    <div className="auth-page">
      <button className="back-btn-auth" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-circle" style={{ background: COLORS.primary }}>
            🏥
          </div>
          <h1>PharmaLivraison</h1>
        </div>

        <div className="auth-form-container">
          <h2>Créer un compte</h2>
          <p className="auth-subtitle">Rejoignez-nous pour commander vos médicaments</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  placeholder="Kouassi"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                placeholder="+225 XX XX XX XX XX"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="votreemail@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={8}
              />
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="Répétez votre mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              style={{ background: COLORS.primary }}
            >
              Créer mon compte
            </button>
          </form>

          <div className="auth-footer">
            <p>Vous avez déjà un compte ?</p>
            <button
              className="auth-switch-btn"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

