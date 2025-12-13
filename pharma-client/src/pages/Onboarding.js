import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../config';
import './Onboarding.css';

function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: '🏥',
      title: 'Fais-toi livrer tes médicaments sans te déplacer',
      subtitle: 'Abidjan, Côte d\'Ivoire',
      illustration: true
    },
    {
      icon: '🚚',
      title: 'Comment cela fonctionne',
      steps: [
        {
          icon: '📍',
          title: 'Indiquez votre localisation',
          description: 'Nous trouvons les pharmacies près de vous'
        },
        {
          icon: '📋',
          title: 'Entrez ou importez votre ordonnance',
          description: 'Photo ou liste de médicaments'
        },
        {
          icon: '🏍️',
          title: 'Votre commande est livrée',
          description: 'Suivez votre livreur en temps réel'
        }
      ]
    },
    {
      icon: '✨',
      title: 'Pourquoi choisir notre app ?',
      features: [
        {
          icon: '✓',
          title: 'Pharmacies vérifiées',
          description: 'Toutes nos pharmacies sont certifiées'
        },
        {
          icon: '⏱️',
          title: 'Livraison rapide',
          description: 'Recevez vos médicaments en moins de 30 min'
        },
        {
          icon: '🔒',
          title: 'Paiement sécurisé',
          description: 'Vos transactions sont 100% sécurisées'
        }
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Marquer l'onboarding comme vu
      localStorage.setItem('onboardingSeen', 'true');
      navigate('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSeen', 'true');
    navigate('/login');
  };

  const slide = slides[currentSlide];

  return (
    <div className="onboarding-page">
      <button className="skip-btn" onClick={handleSkip}>
        Passer
      </button>

      <div className="onboarding-content">
        {currentSlide === 0 ? (
          <div className="onboarding-icon-custom">
            <div className="delivery-logo">
              <div className="cross-icon">✚</div>
              <div className="delivery-icons">
                <span className="delivery-icon-small">🏥</span>
                <span className="delivery-icon-small">📦</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="onboarding-icon">
            <div className="icon-circle" style={{ background: COLORS.primary }}>
              {slide.icon}
            </div>
          </div>
        )}

        <h1 className="onboarding-title">{slide.title}</h1>
        {slide.subtitle && (
          <p className="onboarding-subtitle">{slide.subtitle}</p>
        )}

        {/* Slide 1 - Features */}
        {slide.features && (
          <div className="features-container">
            {slide.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                <div className="feature-text">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slide 2 - Illustration */}
        {slide.illustration && (
          <div className="illustration-container">
            <div className="delivery-illustration">
              <div className="house">🏠</div>
              <div className="delivery-person">
                <span className="person">👨‍⚕️</span>
                <span className="scooter">🛵</span>
              </div>
              <div className="pharmacy">🏥</div>
              <div className="package">📦</div>
            </div>
          </div>
        )}

        {/* Slide 3 - Steps */}
        {slide.steps && (
          <div className="steps-container">
            {slide.steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-icon-wrapper">
                  <div className="step-icon">{step.icon}</div>
                </div>
                <div className="step-text">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination dots */}
        <div className="pagination-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              style={{
                background: index === currentSlide ? COLORS.primary : '#E0E0E0'
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          className="next-btn"
          onClick={handleNext}
          style={{ background: COLORS.primary }}
        >
          {currentSlide < slides.length - 1 ? 'Suivant' : 'Commencer'}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
