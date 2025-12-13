import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Assistance.css';

const Assistance = () => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open('https://wa.me/2250709090909?text=Bonjour,%20j\'ai%20besoin%20d\'aide%20avec%20PharmaLivraison', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@pharmalivre.ci';
  };

  const handleCall = () => {
    window.location.href = 'tel:+2250709090909';
  };

  const faqItems = [
    {
      question: 'Comment passer une commande ?',
      answer: 'Cliquez sur "Commander" sur la page d\'accueil, choisissez votre méthode (photo ordonnance, liste médicaments ou symptômes), puis validez.'
    },
    {
      question: 'Combien de temps prend la livraison ?',
      answer: 'La livraison prend généralement entre 25 et 45 minutes selon votre localisation et la pharmacie sélectionnée.'
    },
    {
      question: 'Puis-je commander pour quelqu\'un d\'autre ?',
      answer: 'Oui ! Lors de la commande, cochez "Commander pour un proche" et renseignez ses coordonnées.'
    },
    {
      question: 'Comment suivre ma commande ?',
      answer: 'Une fois la commande passée, vous pouvez suivre votre livreur en temps réel sur une carte interactive.'
    },
    {
      question: 'Quels sont les moyens de paiement ?',
      answer: 'Nous acceptons le paiement en espèces à la livraison, Mobile Money (Orange Money, MTN Money, Moov Money) et carte bancaire.'
    },
    {
      question: 'Que faire en cas d\'urgence la nuit ?',
      answer: 'Utilisez le mode "Urgence pharmacie de garde" (bouton rouge) pour trouver les pharmacies ouvertes 24h/24.'
    }
  ];

  return (
    <div className="assistance-page">
      {/* Header */}
      <div className="assistance-header">
        <button className="back-btn-assistance" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="assistance-title">Assistance</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Contact Methods */}
      <div className="assistance-container">
        <div className="contact-section">
          <h3 className="section-title-assistance">Nous contacter</h3>
          <div className="contact-methods">
            <button className="contact-card whatsapp-card" onClick={handleWhatsApp}>
              <div className="contact-icon">💬</div>
              <div className="contact-info">
                <div className="contact-label">WhatsApp</div>
                <div className="contact-value">+225 07 09 09 09 09</div>
              </div>
            </button>

            <button className="contact-card phone-card" onClick={handleCall}>
              <div className="contact-icon">📞</div>
              <div className="contact-info">
                <div className="contact-label">Téléphone</div>
                <div className="contact-value">+225 07 09 09 09 09</div>
              </div>
            </button>

            <button className="contact-card email-card" onClick={handleEmail}>
              <div className="contact-icon">📧</div>
              <div className="contact-info">
                <div className="contact-label">Email</div>
                <div className="contact-value">support@pharmalivre.ci</div>
              </div>
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3 className="section-title-assistance">Questions fréquentes</h3>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <details key={index} className="faq-item">
                <summary className="faq-question">
                  {item.question}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div className="faq-answer">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="hours-section">
          <h3 className="section-title-assistance">Horaires du support</h3>
          <div className="hours-card">
            <div className="hours-item">
              <span className="hours-day">Lundi - Vendredi</span>
              <span className="hours-time">8h00 - 20h00</span>
            </div>
            <div className="hours-item">
              <span className="hours-day">Samedi</span>
              <span className="hours-time">9h00 - 18h00</span>
            </div>
            <div className="hours-item">
              <span className="hours-day">Dimanche</span>
              <span className="hours-time">10h00 - 16h00</span>
            </div>
            <div className="hours-note">
              Pour les urgences 24h/24, utilisez le mode "Pharmacie de garde"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistance;


