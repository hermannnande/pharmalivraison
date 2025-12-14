import React from 'react';
import './CourierSearchRadar.css';

function CourierSearchRadar({ isSearching, currentRadius, pharmacyName, searchType, onClose }) {
  if (!isSearching) return null;

  const isPharmacySearch = searchType === 'pharmacy';
  const title = isPharmacySearch ? '🔍 Recherche de pharmacie' : '🔍 Recherche de livreur';
  const subtitle = isPharmacySearch 
    ? 'Pharmacie ouverte la plus proche' 
    : `Autour de ${pharmacyName || 'la pharmacie'}`;

  return (
    <div className="courier-search-radar">
      <div className="radar-container">
        {/* Cercles du radar */}
        <div className="radar-circle radar-circle-1"></div>
        <div className="radar-circle radar-circle-2"></div>
        <div className="radar-circle radar-circle-3"></div>
        
        {/* Rayon animé */}
        <div className="radar-beam"></div>
        
        {/* Centre (client ou pharmacie) */}
        <div className="radar-center">{isPharmacySearch ? '📍' : '🏥'}</div>
        
        {/* Points simulés */}
        <div className="radar-dot" style={{ top: '30%', left: '60%' }}></div>
        <div className="radar-dot" style={{ top: '60%', left: '30%' }}></div>
        <div className="radar-dot" style={{ top: '70%', left: '70%' }}></div>
      </div>

      <div className="radar-info">
        <h2 className="radar-title">{title}</h2>
        <p className="radar-subtitle">
          {subtitle}
        </p>
        <p className="radar-radius">
          Rayon : {currentRadius || 5} km
        </p>
        <p className="radar-status">
          Recherche en cours...
        </p>
        
        {/* Loader animé */}
        <div className="radar-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default CourierSearchRadar;

