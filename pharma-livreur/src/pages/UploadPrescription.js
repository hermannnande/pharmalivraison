import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './UploadPrescription.css';

function UploadPrescription() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (uploadedFile) {
      alert('Ordonnance envoyée ! Un pharmacien va vérifier votre ordonnance et préparer votre commande.');
      navigate('/order-tracking');
    } else {
      alert('Veuillez d\'abord uploader votre ordonnance');
    }
  };

  return (
    <div className="upload-prescription">
      <header className="upload-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Mon ordonnance</h1>
        <div></div>
      </header>

      <div className="upload-content">
        <div className="upload-icon-header">
          <div className="prescription-icon">📋</div>
        </div>

        <h2>Commander avec ordonnance</h2>
        <p className="upload-description">
          Prenez une photo ou importez votre ordonnance pour commander vos médicaments
        </p>

        {!previewUrl ? (
          <div className="upload-actions">
            <label className="upload-btn camera-btn" style={{ background: COLORS.primary }}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <span className="btn-icon">📷</span>
              <span>Prendre en photo mon ordonnance</span>
            </label>

            <label className="upload-btn gallery-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <span className="btn-icon">🖼️</span>
              <span>Importer une photo depuis la galerie</span>
            </label>
          </div>
        ) : (
          <div className="preview-section">
            <div className="preview-image">
              <img src={previewUrl} alt="Ordonnance" />
              <button
                className="remove-btn"
                onClick={() => {
                  setUploadedFile(null);
                  setPreviewUrl(null);
                }}
              >
                ✕
              </button>
            </div>
            <p className="file-name">✅ {uploadedFile.name}</p>
          </div>
        )}

        <div className="prescription-illustration">
          <div className="illustration-box">
            <div className="rx-symbol">Rx</div>
            <div className="prescription-lines">
              <div className="line"></div>
              <div className="line short"></div>
              <div className="line"></div>
              <div className="line short"></div>
            </div>
            <div className="camera-badge">📷</div>
          </div>
        </div>

        {uploadedFile && (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            style={{ background: COLORS.primary }}
          >
            Envoyer ma demande
          </button>
        )}

        <div className="info-section">
          <h3>💡 Comment ça marche ?</h3>
          <ul>
            <li>Prenez une photo claire de votre ordonnance</li>
            <li>Notre pharmacien vérifie votre ordonnance</li>
            <li>Les médicaments sont préparés</li>
            <li>Un livreur vous apporte votre commande</li>
            <li>Paiement à la livraison</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadPrescription;

