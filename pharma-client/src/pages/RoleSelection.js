import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './RoleSelection.css';

function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'client',
      title: 'Client',
      icon: '👤',
      description: 'Commander mes médicaments',
      color: COLORS.primary,
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      path: '/client'
    },
    {
      id: 'pharmacien',
      title: 'Pharmacien',
      icon: '💊',
      description: 'Gérer ma pharmacie',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      path: '/pharmacien'
    },
    {
      id: 'livreur',
      title: 'Livreur',
      icon: '🏍️',
      description: 'Effectuer des livraisons',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      path: '/livreur'
    }
  ];

  return (
    <div className="role-selection-modern">
      <button className="back-to-welcome" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <div className="role-container-modern">
        <div className="logo-modern">
          <div className="logo-icon">🏥</div>
          <h1>PharmaLivraison</h1>
          <p>Choisissez comment vous souhaitez utiliser l'application</p>
        </div>

        <div className="roles-grid-modern">
          {roles.map((role) => (
            <div
              key={role.id}
              className="role-card-modern"
              onClick={() => navigate(role.path)}
            >
              <div
                className="role-card-inner"
                style={{ background: role.gradient }}
              >
                <div className="role-icon-modern">{role.icon}</div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <div className="role-arrow">→</div>
              </div>
            </div>
          ))}
        </div>

        <div className="role-footer">
          <p>Sélectionnez votre profil pour commencer</p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
