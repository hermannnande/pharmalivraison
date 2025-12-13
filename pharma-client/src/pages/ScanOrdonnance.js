import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScanOrdonnance.css';

function ScanOrdonnance() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [detectedMeds, setDetectedMeds] = useState([]);

  const handleScan = () => {
    setScanning(true);
    
    // Simuler la capture photo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simuler l'analyse IA (2 secondes)
        setTimeout(() => {
          setScanning(false);
          setScanned(true);
          
          // Résultats IA simulés
          setDetectedMeds([
            { 
              name: 'Doliprane 1000mg', 
              quantity: 2, 
              dosage: '1 comprimé 3x/jour',
              price: 2500,
              available: true
            },
            { 
              name: 'Amoxicilline 500mg', 
              quantity: 3, 
              dosage: '1 gélule 2x/jour',
              price: 4500,
              available: true
            },
            { 
              name: 'Vitamine C 1000mg', 
              quantity: 1, 
              dosage: '1 comprimé/jour',
              price: 3500,
              available: true
            }
          ]);
        }, 2000);
      }
    };
    
    input.click();
  };

  const totalPrice = detectedMeds.reduce((sum, med) => sum + (med.price * med.quantity), 0);

  const handleOrder = () => {
    alert('Commande envoyée avec les médicaments détectés ! 🎉');
    navigate('/home');
  };

  return (
    <div className="scan-page">
      {/* Header */}
      <div className="scan-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Scanner Ordonnance</h1>
        <div style={{ width: '44px' }}></div>
      </div>

      {!scanning && !scanned && (
        <div className="scan-intro">
          <div className="scan-icon">📸</div>
          <h2>Scan IA Intelligent</h2>
          <p>Notre intelligence artificielle analyse votre ordonnance et détecte automatiquement tous les médicaments</p>
          
          <div className="scan-features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Détection automatique</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Analyse en 2 secondes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>Prix en temps réel</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Vérification disponibilité</span>
            </div>
          </div>

          <button className="btn-scan" onClick={handleScan}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Prendre une photo
          </button>

          <button className="btn-gallery" onClick={handleScan}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
            </svg>
            Choisir depuis la galerie
          </button>
        </div>
      )}

      {scanning && (
        <div className="scan-analyzing">
          <div className="loader-container">
            <div className="scanner-line"></div>
            <div className="scan-animation">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M3 9V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V9" stroke="#3b82f6" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <h2>Analyse en cours...</h2>
          <p>Notre IA lit votre ordonnance</p>
          <div className="progress-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      {scanned && detectedMeds.length > 0 && (
        <div className="scan-results">
          <div className="results-header">
            <div className="success-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#10b981"/>
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{detectedMeds.length} médicaments détectés</span>
            </div>
          </div>

          <div className="meds-list">
            {detectedMeds.map((med, index) => (
              <div key={index} className="med-card">
                <div className="med-icon">💊</div>
                <div className="med-info">
                  <h3>{med.name}</h3>
                  <p className="med-dosage">📋 {med.dosage}</p>
                  <p className="med-quantity">Quantité : {med.quantity} boîte(s)</p>
                </div>
                <div className="med-right">
                  <div className="med-price">{(med.price * med.quantity).toLocaleString()} FCFA</div>
                  <div className={`med-status ${med.available ? 'available' : 'unavailable'}`}>
                    {med.available ? '✅ Disponible' : '❌ Indisponible'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-card">
            <div className="total-row">
              <span>Sous-total</span>
              <strong>{totalPrice.toLocaleString()} FCFA</strong>
            </div>
            <div className="total-row">
              <span>Frais de livraison</span>
              <strong>1,000 FCFA</strong>
            </div>
            <div className="total-row final">
              <span>TOTAL</span>
              <strong>{(totalPrice + 1000).toLocaleString()} FCFA</strong>
            </div>
          </div>

          <button className="btn-order" onClick={handleOrder}>
            Commander maintenant
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="btn-rescan" onClick={() => {
            setScanned(false);
            setDetectedMeds([]);
          }}>
            Rescanner une autre ordonnance
          </button>
        </div>
      )}
    </div>
  );
}

export default ScanOrdonnance;


