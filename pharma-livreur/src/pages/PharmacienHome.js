import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmacienHome.css';

function PharmacienHome() {
  const navigate = useNavigate();
  const [commandes] = useState([
    {
      id: 'CMD001',
      client: 'Jean Kouassi',
      medicaments: 'Doliprane 1000mg, Vitamine C',
      statut: 'En attente',
      montant: '5000 FCFA'
    },
    {
      id: 'CMD002',
      client: 'Marie Diallo',
      medicaments: 'Antibiotiques, Sirop',
      statut: 'En préparation',
      montant: '12000 FCFA'
    },
    {
      id: 'CMD003',
      client: 'Kofi Mensah',
      medicaments: 'Paracétamol, Bandages',
      statut: 'Prêt',
      montant: '3500 FCFA'
    }
  ]);

  const stats = {
    commandesToday: 15,
    revenue: '125000 FCFA',
    avgTime: '12 min'
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En attente': return '#FF9800';
      case 'En préparation': return '#2196F3';
      case 'Prêt': return '#4CAF50';
      default: return '#999';
    }
  };

  return (
    <div className="pharmacien-home">
      <header className="pharmacien-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Retour
        </button>
        <h1>💊 Tableau de Bord Pharmacien</h1>
        <div className="user-icon">👤</div>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h3>📦 Commandes Aujourd'hui</h3>
          <p className="stat-value">{stats.commandesToday}</p>
        </div>
        <div className="stat-card">
          <h3>💰 Revenu</h3>
          <p className="stat-value">{stats.revenue}</p>
        </div>
        <div className="stat-card">
          <h3>⏱️ Temps Moyen</h3>
          <p className="stat-value">{stats.avgTime}</p>
        </div>
      </div>

      <div className="commandes-section">
        <h2>Commandes en Cours</h2>
        <div className="commandes-list">
          {commandes.map((commande) => (
            <div key={commande.id} className="commande-card">
              <div className="commande-header">
                <h3>#{commande.id}</h3>
                <span
                  className="statut-badge"
                  style={{ backgroundColor: getStatusColor(commande.statut) }}
                >
                  {commande.statut}
                </span>
              </div>
              <div className="commande-info">
                <p><strong>Client:</strong> {commande.client}</p>
                <p><strong>Médicaments:</strong> {commande.medicaments}</p>
                <p><strong>Montant:</strong> {commande.montant}</p>
              </div>
              <div className="commande-actions">
                <button className="btn-accept">✅ Accepter</button>
                <button className="btn-ready">📦 Prêt</button>
                <button className="btn-details">Détails</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Fonctionnalités</h3>
        <ul>
          <li>✅ Recevoir les commandes en temps réel</li>
          <li>✅ Gérer l'inventaire des médicaments</li>
          <li>✅ Suivre les statistiques</li>
          <li>✅ Communication avec les livreurs</li>
        </ul>
      </div>
    </div>
  );
}

export default PharmacienHome;

