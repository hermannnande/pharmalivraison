import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedAddresses.css';

const SavedAddresses = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Domicile',
      address: 'Rue des Jardins, Cocody, 2 Plateaux',
      lat: 5.3600,
      lng: -4.0083,
      isDefault: true
    },
    {
      id: 2,
      label: 'Bureau',
      address: 'Boulevard Lagunaire, Plateau',
      lat: 5.3167,
      lng: -4.0167,
      isDefault: false
    },
    {
      id: 3,
      label: 'Chez Maman',
      address: 'Avenue 7, Marcory Zone 4',
      lat: 5.2833,
      lng: -3.9833,
      isDefault: false
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    isDefault: false
  });

  const handleAddAddress = () => {
    if (!newAddress.label.trim() || !newAddress.address.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const address = {
      id: Date.now(),
      ...newAddress,
      lat: 5.3600 + (Math.random() - 0.5) * 0.1,
      lng: -4.0083 + (Math.random() - 0.5) * 0.1
    };

    // Si c'est l'adresse par défaut, retirer le statut des autres
    let updatedAddresses = addresses;
    if (newAddress.isDefault) {
      updatedAddresses = addresses.map(a => ({ ...a, isDefault: false }));
    }

    setAddresses([address, ...updatedAddresses]);
    setShowAddModal(false);
    setNewAddress({
      label: '',
      address: '',
      isDefault: false
    });
  };

  const setAsDefault = (id) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const deleteAddress = (id) => {
    const address = addresses.find(a => a.id === id);
    if (address?.isDefault) {
      alert('Impossible de supprimer l\'adresse par défaut. Définissez d\'abord une autre adresse par défaut.');
      return;
    }

    if (window.confirm('Supprimer cette adresse ?')) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const getLabelIcon = (label) => {
    const lowercaseLabel = label.toLowerCase();
    if (lowercaseLabel.includes('domicile') || lowercaseLabel.includes('maison')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21V12H15V21" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (lowercaseLabel.includes('bureau') || lowercaseLabel.includes('travail')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2196f3" strokeWidth="2"/>
          <path d="M3 9H21M9 3V21" stroke="#2196f3" strokeWidth="2"/>
        </svg>
      );
    } else {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 21C12 21 4 15 4 9C4 5.68629 6.68629 3 10 3H14C17.3137 3 20 5.68629 20 9C20 15 12 21 12 21Z" stroke="#ff9800" strokeWidth="2"/>
          <circle cx="12" cy="9" r="2" fill="#ff9800"/>
        </svg>
      );
    }
  };

  return (
    <div className="addresses-page">
      {/* Header */}
      <div className="addresses-header">
        <button className="back-btn-addresses" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="addresses-title">Mes adresses</h1>
        <button className="add-address-btn" onClick={() => setShowAddModal(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Liste des adresses */}
      <div className="addresses-container">
        {addresses.length === 0 ? (
          <div className="empty-state-addresses">
            <div className="empty-icon-addresses">📍</div>
            <h3>Aucune adresse enregistrée</h3>
            <p>Ajoutez vos adresses favorites pour commander plus rapidement</p>
            <button className="empty-add-btn-address" onClick={() => setShowAddModal(true)}>
              Ajouter une adresse
            </button>
          </div>
        ) : (
          <div className="addresses-list">
            {addresses.map((address) => (
              <div key={address.id} className="address-card">
                <div className="address-main">
                  <div className="address-icon">
                    {getLabelIcon(address.label)}
                  </div>
                  <div className="address-info">
                    <div className="address-label-row">
                      <span className="address-label">{address.label}</span>
                      {address.isDefault && (
                        <span className="default-badge">Par défaut</span>
                      )}
                    </div>
                    <div className="address-text">{address.address}</div>
                  </div>
                </div>

                <div className="address-actions">
                  {!address.isDefault && (
                    <button 
                      className="set-default-btn"
                      onClick={() => setAsDefault(address.id)}
                      title="Définir par défaut"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                  <button 
                    className="delete-address-btn"
                    onClick={() => deleteAddress(address.id)}
                    title="Supprimer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="modal-overlay-addresses" onClick={() => setShowAddModal(false)}>
          <div className="modal-card-addresses" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-addresses">
              <h2>Nouvelle adresse</h2>
              <button className="close-modal-btn-addr" onClick={() => setShowAddModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body-addresses">
              {/* Libellé */}
              <div className="form-group-addresses">
                <label>Libellé</label>
                <input
                  type="text"
                  placeholder="Ex: Domicile, Bureau, Famille..."
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                />
              </div>

              {/* Adresse */}
              <div className="form-group-addresses">
                <label>Adresse complète</label>
                <textarea
                  placeholder="Ex: Rue des Jardins, Cocody, 2 Plateaux, Abidjan"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  rows="3"
                />
              </div>

              {/* Par défaut */}
              <div className="form-group-addresses checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  />
                  <span>Définir comme adresse par défaut</span>
                </label>
              </div>

              <div className="address-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#2196f3" strokeWidth="2"/>
                  <path d="M12 16V12M12 8H12.01" stroke="#2196f3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>L'adresse par défaut sera utilisée automatiquement pour vos commandes.</span>
              </div>
            </div>

            <div className="modal-footer-addresses">
              <button className="cancel-btn-addresses" onClick={() => setShowAddModal(false)}>
                Annuler
              </button>
              <button className="save-btn-addresses" onClick={handleAddAddress}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;





