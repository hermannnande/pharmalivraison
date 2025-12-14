import React from 'react';
import './CourierSearchRadar.css';

function CourierSearchRadar({ isSearching, currentRadius, pharmacyName, onClose }) {
  if (!isSearching) return null;

  return (
    <div className="courier-search-radar">
      <div className="radar-container">
        {/* Cercles du radar */}
        <div className="radar-circle radar-circle-1"></div>
        <div className="radar-circle radar-circle-2"></div>
        <div className="radar-circle radar-circle-3"></div>
        
        {/* Rayon animé */}
        <div className="radar-beam"></div>
        
        {/* Centre (pharmacie) */}
        <div className="radar-center"></div>
        
        {/* Points de livreurs simulés */}
        <div className="radar-dot" style={{ top: '30%', left: '60%' }}></div>
        <div className="radar-dot" style={{ top: '60%', left: '30%' }}></div>
        <div className="radar-dot" style={{ top: '70%', left: '70%' }}></div>
      </div>

      <div className="radar-info">
        <h2 className="radar-title">🔍 Recherche de livreur</h2>
        <p className="radar-subtitle">
          Autour de <strong>{pharmacyName || 'la pharmacie'}</strong>
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

