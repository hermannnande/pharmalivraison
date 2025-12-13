import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, PHARMACIES_DEMO } from '../config';
import './OrderFlow.css';

function OrderFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState('location'); // location, pharmacy, medicine, delivery
  const [userLocation, setUserLocation] = useState({
    address: '123, Rue Cocody, Abidjan',
    city: 'Cocody, Abidjan'
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [medicineInput, setMedicineInput] = useState('');
  const [medicineDescription, setMedicineDescription] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [showMedicineInput, setShowMedicineInput] = useState(false);
  const [nearestDelivery, setNearestDelivery] = useState({
    name: 'Jean',
    status: 'Prêt à livrer',
    time: '5-8 min'
  });

  // Pharmacie la plus proche ouverte
  const nearestPharmacy = PHARMACIES_DEMO.filter(p => p.estOuverte)[0];

  const handleLocate = () => {
    alert('📍 Géolocalisation activée ! Position actualisée.');
    setStep('pharmacy');
  };

  const handleSelectPharmacy = () => {
    setSelectedPharmacy(nearestPharmacy);
    setStep('medicine');
    setShowMedicineInput(true);
  };

  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
      alert('✅ Ordonnance importée : ' + file.name);
    }
  };

  const handleLaunchOrder = () => {
    if (!medicineInput && !prescriptionFile && !medicineDescription) {
      alert('⚠️ Veuillez entrer des médicaments ou importer une ordonnance');
      return;
    }

    setStep('delivery');
    setTimeout(() => {
      alert('🎉 Commande lancée avec succès ! Le livreur ' + nearestDelivery.name + ' a accepté votre commande !');
      navigate('/order-tracking', { 
        state: { 
          pharmacie: selectedPharmacy || nearestPharmacy,
          medicines: medicineInput,
          deliveryPerson: nearestDelivery
        } 
      });
    }, 1500);
  };

  return (
    <div className="order-flow">
      {/* HEADER SECTION */}
      <div className="flow-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="header-content">
          <div className="location-badge">
            <span className="location-icon">📍</span>
            <span>{userLocation.city}</span>
          </div>
          <div className="pharmacy-status-badge" style={{ background: COLORS.primary }}>
            Pharmacie ouverte à proximité
          </div>
        </div>
        <div className="mini-map">
          <span style={{ fontSize: '2rem' }}>🗺️</span>
        </div>
      </div>

      <div className="flow-content">
        {/* PATIENT LOCATION CARD */}
        <div className="section-card">
          <h3 className="section-title">PATIENT LOCATION CARD</h3>
          <div className="card-content">
            <div className="location-info">
              <div className="icon-circle" style={{ background: '#DBEAFE' }}>
                <span style={{ fontSize: '1.5rem' }}>🏠</span>
              </div>
              <div className="info-text">
                <h4>Votre localisation</h4>
                <p>{userLocation.address}</p>
              </div>
            </div>
            <button 
              className="action-btn-green"
              onClick={handleLocate}
              style={{ background: COLORS.primary }}
            >
              Localiser
            </button>
          </div>
        </div>

        {/* NEARBY PHARMACY CARD */}
        {step !== 'location' && (
          <div className="section-card">
            <h3 className="section-title">NEARBY PHARMACY CARD</h3>
            <div className="card-content">
              <div className="pharmacy-info">
                <div className="pharmacy-icon-large">
                  <span style={{ fontSize: '2.5rem' }}>🏥</span>
                </div>
                <div className="pharmacy-details">
                  <h4>Pharmacie la plus proche</h4>
                  <h3>{nearestPharmacy.nom}</h3>
                  <div className="pharmacy-badges">
                    <span className="badge-open" style={{ background: '#D1FAE5', color: COLORS.primary }}>
                      Ouverte
                    </span>
                    <span className="distance-badge">{nearestPharmacy.distance}</span>
                  </div>
                </div>
              </div>
              {!selectedPharmacy && (
                <button 
                  className="action-btn-green"
                  onClick={handleSelectPharmacy}
                  style={{ background: COLORS.primary }}
                >
                  Sélectionner
                </button>
              )}
            </div>
          </div>
        )}

        {/* MEDICINE INPUT SECTION */}
        {showMedicineInput && (
          <div className="section-card">
            <h3 className="section-title">MEDICINE INPUT SECTION</h3>
            <div className="medicine-input-buttons">
              <button 
                className="medicine-option-btn outlined"
                onClick={() => setShowMedicineInput(true)}
              >
                <span className="btn-icon">📋</span>
                <span>Entrer les médicaments</span>
              </button>
              <label className="medicine-option-btn filled" style={{ background: COLORS.primary }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePrescriptionUpload}
                  style={{ display: 'none' }}
                />
                <span className="btn-icon">📷</span>
                <span>Importer ordonnance</span>
              </label>
            </div>

            <div className="medicine-text-input">
              <label>Noms des médicaments</label>
              <input
                type="text"
                placeholder="Paracetamol, Antibiotiques, Vitamines"
                value={medicineInput}
                onChange={(e) => setMedicineInput(e.target.value)}
              />
            </div>

            <div className="medicine-text-input">
              <label>Ou décrivez votre besoin</label>
              <textarea
                placeholder="Ex: Je tousse beaucoup depuis 3 jours..."
                rows="3"
                value={medicineDescription}
                onChange={(e) => setMedicineDescription(e.target.value)}
              />
            </div>

            {prescriptionFile && (
              <div className="file-uploaded">
                ✅ Ordonnance uploadée : {prescriptionFile.name}
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTON */}
        {showMedicineInput && (
          <div className="section-card action-section">
            <h3 className="section-title">ACTION BUTTON</h3>
            <button 
              className="launch-order-btn"
              onClick={handleLaunchOrder}
              style={{ background: COLORS.primary }}
            >
              Lancer la commande
            </button>
          </div>
        )}

        {/* DELIVERY INFO CARD */}
        {step === 'delivery' || selectedPharmacy && (
          <div className="section-card">
            <h3 className="section-title">DELIVERY INFO CARD</h3>
            <div className="card-content delivery-card">
              <div className="delivery-info">
                <div className="delivery-icon-large">
                  <span style={{ fontSize: '2.5rem' }}>🏍️</span>
                </div>
                <div className="delivery-details">
                  <p className="delivery-label">Livreur le plus proche</p>
                  <h3>{nearestDelivery.name}</h3>
                  <p className="delivery-status">{nearestDelivery.status}</p>
                </div>
              </div>
              <div className="delivery-time">
                {nearestDelivery.time}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flow-footer">
          <h3 className="section-title">FOOTER</h3>
          <p className="footer-message">
            Votre commande sera livrée en moins de 30 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderFlow;

