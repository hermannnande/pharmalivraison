import React, { useState } from 'react';
import { createOrder } from '../services/api';
import socketService from '../services/socket';
import './OrderModal.css';

function OrderModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [medicationList, setMedicationList] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [forOther, setForOther] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOption) {
      alert('Veuillez choisir une option');
      return;
    }
    
    // Créer l'objet commande
    const orderData = {
      orderType: selectedOption,
      medicationList: selectedOption === 'liste' ? medicationList : '',
      symptoms: selectedOption === 'symptomes' ? symptoms : '',
      notes: notes,
      forOther: forOther,
      recipientName: forOther ? recipientName : '',
      recipientPhone: forOther ? recipientPhone : '',
      pharmacyId: '1', // TODO: Récupérer depuis la pharmacie sélectionnée
      deliveryAddress: 'Cocody Angré, 7ème Tranche', // TODO: Récupérer depuis le profil utilisateur
      deliveryLocation: { lat: 5.3650, lng: -4.0100 }, // TODO: GPS utilisateur
      pharmacyLocation: { lat: 5.3680, lng: -4.0120 }
    };

    try {
      // Envoyer la commande au backend
      console.log('📤 Envoi de la commande au backend...', orderData);
      const response = await createOrder(orderData);
      console.log('✅ Commande créée:', response);
      
      // Message de succès moderne
      const modal = document.createElement('div');
      modal.className = 'success-modal-custom';
      modal.innerHTML = `
        <div class="success-card-custom">
          <div class="success-icon-custom">✅</div>
          <h3>Commande envoyée !</h3>
          <p>Commande N° ${response.order.orderNumber}</p>
          <p>Un livreur proche de votre position va être assigné automatiquement.</p>
          <div class="success-loader"></div>
        </div>
      `;
      document.body.appendChild(modal);
      
      setTimeout(() => {
        modal.remove();
        onClose();
      }, 3000);
      
      // Reset
      setSelectedOption(null);
      setMedicationList('');
      setSymptoms('');
      setNotes('');
      setForOther(false);
      setRecipientName('');
      setRecipientPhone('');
    } catch (error) {
      console.error('❌ Erreur lors de la création de la commande:', error);
      alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
    }
  };

  const handlePhotoClick = () => {
    setSelectedOption('photo');
    // Simuler l'ouverture de la caméra ou galerie
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert('Photo sélectionnée : ' + file.name);
      }
    };
    input.click();
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Commander vos médicaments</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Location Info */}
        <div className="modal-location-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#2e7d32"/>
          </svg>
          <div>
            <p className="location-label">Livraison à votre position</p>
            <p className="location-value">Géolocalisé automatiquement 📍</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-step">
            {/* Title */}
            <p className="section-title">Comment souhaitez-vous commander ?</p>

            {/* Main Options - 3 Big Cards */}
            <div className="main-options">
              {/* Option 1: Photo */}
              <button
                type="button"
                className={`option-card ${selectedOption === 'photo' ? 'active' : ''}`}
                onClick={handlePhotoClick}
              >
                <div className="option-icon camera">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                    <circle cx="12" cy="12" r="2" fill="white"/>
                  </svg>
                </div>
                <div className="option-text">
                  <h3>Photo ordonnance</h3>
                  <p>Prenez ou importez une photo</p>
                </div>
                {selectedOption === 'photo' && (
                  <div className="option-check">✓</div>
                )}
              </button>

              {/* Option 2: List */}
              <button
                type="button"
                className={`option-card ${selectedOption === 'list' ? 'active' : ''}`}
                onClick={() => setSelectedOption('list')}
              >
                <div className="option-icon list">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="option-text">
                  <h3>Liste de médicaments</h3>
                  <p>Tapez les noms des médicaments</p>
                </div>
                {selectedOption === 'list' && (
                  <div className="option-check">✓</div>
                )}
              </button>

              {/* Option 3: Symptoms */}
              <button
                type="button"
                className={`option-card ${selectedOption === 'symptoms' ? 'active' : ''}`}
                onClick={() => setSelectedOption('symptoms')}
              >
                <div className="option-icon symptoms">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M11 7H13V9H11V7ZM12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="option-text">
                  <h3>Décrire mes symptômes</h3>
                  <p>Le pharmacien vous conseillera</p>
                </div>
                {selectedOption === 'symptoms' && (
                  <div className="option-check">✓</div>
                )}
              </button>
            </div>

            {/* Conditional Fields */}
            {selectedOption === 'list' && (
              <div className="form-group fade-in">
                <label>Liste des médicaments</label>
                <textarea
                  rows="4"
                  placeholder="Ex: Paracétamol 500mg, Vitamine C, Sirop contre la toux..."
                  value={medicationList}
                  onChange={(e) => setMedicationList(e.target.value)}
                  required
                />
              </div>
            )}

            {selectedOption === 'symptoms' && (
              <div className="form-group fade-in">
                <label>Décrivez vos symptômes</label>
                <textarea
                  rows="4"
                  placeholder="Ex: Maux de tête, fièvre depuis 2 jours, toux..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Commander pour un proche */}
            {selectedOption && (
              <div className="form-group fade-in">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={forOther}
                    onChange={(e) => setForOther(e.target.checked)}
                  />
                  <span>Commander pour un proche</span>
                </label>
              </div>
            )}

            {/* Détails du destinataire */}
            {forOther && (
              <div className="recipient-fields fade-in">
                <div className="form-group">
                  <label>Nom du destinataire</label>
                  <input
                    type="text"
                    placeholder="Ex: Marie Kouassi"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required={forOther}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone du destinataire</label>
                  <div className="phone-input-simple">
                    <span>+225</span>
                    <input
                      type="tel"
                      placeholder="XX XX XX XX XX"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      required={forOther}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedOption && (
              <div className="form-group fade-in">
                <label>Instructions spéciales (optionnel)</label>
                <textarea
                  rows="2"
                  placeholder="Ex: Allergies, préférences, urgence..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            )}

            {/* Estimation */}
            {selectedOption && (
              <div className="estimation-card fade-in">
                <h4>📊 Estimation</h4>
                <div className="estimation-row">
                  <span>Médicaments</span>
                  <strong>2 000 - 15 000 FCFA</strong>
                </div>
                <div className="estimation-row">
                  <span>Livraison</span>
                  <strong>1 000 FCFA</strong>
                </div>
                <div className="estimation-row highlight">
                  <span>Livraison estimée</span>
                  <strong>25 - 35 min</strong>
                </div>
                <p className="estimation-note">
                  * Prix final selon le montant réel à la pharmacie
                </p>
              </div>
            )}

            {/* Submit Button */}
            {selectedOption && (
              <button type="submit" className="btn-submit fade-in">
                Commander maintenant
              </button>
            )}
          </div>
        </form>

        {/* Info Footer */}
        <div className="modal-footer">
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#2e7d32"/>
            </svg>
            <span>Livraison sous 30 min</span>
          </div>
          <div className="info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#2e7d32"/>
            </svg>
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;

