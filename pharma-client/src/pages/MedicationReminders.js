import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicationReminders.css';

const MedicationReminders = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medName: 'Paracétamol 500mg',
      times: ['08:00', '14:00', '20:00'],
      duration: 7,
      startDate: '2025-12-10',
      isActive: true
    },
    {
      id: 2,
      medName: 'Amoxicilline 1g',
      times: ['09:00', '21:00'],
      duration: 10,
      startDate: '2025-12-08',
      isActive: true
    },
    {
      id: 3,
      medName: 'Vitamine C',
      times: ['07:30'],
      duration: 30,
      startDate: '2025-12-01',
      isActive: false
    }
  ]);

  const [newReminder, setNewReminder] = useState({
    medName: '',
    times: ['08:00'],
    duration: 7,
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleAddReminder = () => {
    if (!newReminder.medName.trim()) {
      alert('Veuillez entrer le nom du médicament');
      return;
    }

    const reminder = {
      id: Date.now(),
      ...newReminder,
      isActive: true
    };

    setReminders([reminder, ...reminders]);
    setShowAddModal(false);
    setNewReminder({
      medName: '',
      times: ['08:00'],
      duration: 7,
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const deleteReminder = (id) => {
    if (window.confirm('Supprimer ce rappel ?')) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  const addTimeSlot = () => {
    setNewReminder({
      ...newReminder,
      times: [...newReminder.times, '12:00']
    });
  };

  const updateTimeSlot = (index, value) => {
    const newTimes = [...newReminder.times];
    newTimes[index] = value;
    setNewReminder({ ...newReminder, times: newTimes });
  };

  const removeTimeSlot = (index) => {
    if (newReminder.times.length > 1) {
      const newTimes = newReminder.times.filter((_, i) => i !== index);
      setNewReminder({ ...newReminder, times: newTimes });
    }
  };

  return (
    <div className="reminders-page">
      {/* Header */}
      <div className="reminders-header">
        <button className="back-btn-reminders" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="reminders-title">Rappels médicaments</h1>
        <button className="add-reminder-btn" onClick={() => setShowAddModal(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Liste des rappels */}
      <div className="reminders-container">
        {reminders.length === 0 ? (
          <div className="empty-state-reminders">
            <div className="empty-icon-reminders">⏰</div>
            <h3>Aucun rappel</h3>
            <p>Créez des rappels pour ne jamais oublier vos médicaments</p>
            <button className="empty-add-btn" onClick={() => setShowAddModal(true)}>
              Créer un rappel
            </button>
          </div>
        ) : (
          <div className="reminders-list">
            {reminders.map((reminder) => (
              <div key={reminder.id} className={`reminder-card ${!reminder.isActive ? 'inactive' : ''}`}>
                <div className="reminder-main">
                  <div className="reminder-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M19.5 9.5C19.5 15.5 12 21 12 21C12 21 4.5 15.5 4.5 9.5C4.5 5.35786 7.85786 2 12 2C16.1421 2 19.5 5.35786 19.5 9.5Z" fill={reminder.isActive ? '#4caf50' : '#bdbdbd'}/>
                      <circle cx="12" cy="9.5" r="4" fill="white"/>
                      <path d="M12 7V10L14 11.5" stroke={reminder.isActive ? '#4caf50' : '#bdbdbd'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="reminder-info">
                    <div className="reminder-name">{reminder.medName}</div>
                    <div className="reminder-times">
                      {reminder.times.map((time, index) => (
                        <span key={index} className="time-badge">{time}</span>
                      ))}
                    </div>
                    <div className="reminder-duration">
                      Pendant {reminder.duration} jours • Depuis le {reminder.startDate}
                    </div>
                  </div>
                </div>

                <div className="reminder-actions">
                  <button 
                    className={`toggle-btn ${reminder.isActive ? 'active' : ''}`}
                    onClick={() => toggleReminder(reminder.id)}
                  >
                    {reminder.isActive ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4caf50"/>
                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#bdbdbd"/>
                      </svg>
                    )}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteReminder(reminder.id)}
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
        <div className="modal-overlay-reminders" onClick={() => setShowAddModal(false)}>
          <div className="modal-card-reminders" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-reminders">
              <h2>Nouveau rappel</h2>
              <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body-reminders">
              {/* Nom du médicament */}
              <div className="form-group-reminders">
                <label>Nom du médicament</label>
                <input
                  type="text"
                  placeholder="Ex: Paracétamol 500mg"
                  value={newReminder.medName}
                  onChange={(e) => setNewReminder({ ...newReminder, medName: e.target.value })}
                />
              </div>

              {/* Heures de prise */}
              <div className="form-group-reminders">
                <label>Heures de prise</label>
                {newReminder.times.map((time, index) => (
                  <div key={index} className="time-input-row">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                    />
                    {newReminder.times.length > 1 && (
                      <button 
                        className="remove-time-btn"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button className="add-time-btn" onClick={addTimeSlot}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Ajouter une heure
                </button>
              </div>

              {/* Durée */}
              <div className="form-group-reminders">
                <label>Durée du traitement (jours)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={newReminder.duration}
                  onChange={(e) => setNewReminder({ ...newReminder, duration: parseInt(e.target.value) })}
                />
              </div>

              {/* Date de début */}
              <div className="form-group-reminders">
                <label>Date de début</label>
                <input
                  type="date"
                  value={newReminder.startDate}
                  onChange={(e) => setNewReminder({ ...newReminder, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer-reminders">
              <button className="cancel-btn-reminders" onClick={() => setShowAddModal(false)}>
                Annuler
              </button>
              <button className="save-btn-reminders" onClick={handleAddReminder}>
                Créer le rappel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationReminders;





