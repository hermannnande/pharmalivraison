import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();

  // Données de démonstration
  const [orders] = useState([
    {
      id: 'CMD-2025-001',
      date: '2025-12-10',
      time: '14:30',
      type: 'ordonnance',
      status: 'Livrée',
      pharmacy: 'Pharmacie du Plateau',
      total: 12500,
      items: ['Paracétamol 500mg', 'Amoxicilline 1g', 'Vitamine C'],
      imageUrl: '/ordonnance-1.jpg',
      deliveryTime: '35 min'
    },
    {
      id: 'CMD-2025-002',
      date: '2025-12-08',
      time: '09:15',
      type: 'liste',
      status: 'Livrée',
      pharmacy: 'Pharmacie de la Gare',
      total: 8700,
      items: ['Doliprane', 'Efferalgan', 'Sirop toux'],
      deliveryTime: '28 min'
    },
    {
      id: 'CMD-2025-003',
      date: '2025-12-05',
      time: '18:45',
      type: 'symptomes',
      status: 'Livrée',
      pharmacy: 'Pharmacie des 2 Plateaux',
      total: 15200,
      items: ['Traitement fièvre', 'Anti-inflammatoire'],
      symptoms: 'Fièvre + maux de tête',
      deliveryTime: '42 min'
    },
    {
      id: 'CMD-2025-004',
      date: '2025-12-01',
      time: '11:20',
      type: 'ordonnance',
      status: 'Annulée',
      pharmacy: 'Pharmacie Cocody',
      total: 0,
      items: [],
      imageUrl: '/ordonnance-2.jpg'
    }
  ]);

  const handleReorder = (order) => {
    // Rediriger vers la page d'accueil avec les données pré-remplies
    alert(`Commander à nouveau : ${order.id}\n\nType: ${order.type}\nPharmacie: ${order.pharmacy}`);
    navigate('/home', { 
      state: { 
        reorder: true, 
        orderData: order 
      } 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livrée': return '#4caf50';
      case 'En cours': return '#ff9800';
      case 'Annulée': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ordonnance':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#2196f3"/>
            <path d="M14 2V8H20" fill="#1976d2"/>
          </svg>
        );
      case 'liste':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7Z" fill="#ff9800"/>
          </svg>
        );
      case 'symptomes':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9c27b0"/>
            <path d="M12 6V14M12 18H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="order-history-page">
      {/* Header */}
      <div className="history-header">
        <button className="back-btn-history" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="history-title">Mes commandes</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Liste des commandes */}
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Aucune commande</h3>
            <p>Vos commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                {/* En-tête de la commande */}
                <div className="order-card-header">
                  <div className="order-info">
                    <div className="order-id-row">
                      {getTypeIcon(order.type)}
                      <span className="order-id">{order.id}</span>
                    </div>
                    <div className="order-date">{order.date} à {order.time}</div>
                  </div>
                  <div 
                    className="order-status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Pharmacie */}
                <div className="order-pharmacy">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M19.5 9.5C19.5 15.5 12 21 12 21C12 21 4.5 15.5 4.5 9.5C4.5 5.35786 7.85786 2 12 2C16.1421 2 19.5 5.35786 19.5 9.5Z" stroke="#4caf50" strokeWidth="2"/>
                    <circle cx="12" cy="9.5" r="2.5" fill="#4caf50"/>
                  </svg>
                  <span>{order.pharmacy}</span>
                </div>

                {/* Contenu de la commande */}
                {order.status !== 'Annulée' && (
                  <>
                    {order.type === 'ordonnance' && order.imageUrl && (
                      <div className="order-prescription">
                        <div className="prescription-preview">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#2196f3" strokeWidth="2"/>
                            <path d="M8 11H16M8 15H13" stroke="#2196f3" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span>Ordonnance médicale</span>
                        </div>
                      </div>
                    )}

                    {order.items && order.items.length > 0 && (
                      <div className="order-items">
                        <div className="items-label">Médicaments :</div>
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {order.symptoms && (
                      <div className="order-symptoms">
                        <span className="symptoms-label">Symptômes :</span>
                        <span>{order.symptoms}</span>
                      </div>
                    )}

                    {/* Infos supplémentaires */}
                    <div className="order-details">
                      <div className="detail-item">
                        <span className="detail-label">Total :</span>
                        <span className="detail-value total-price">{order.total.toLocaleString()} FCFA</span>
                      </div>
                      {order.deliveryTime && (
                        <div className="detail-item">
                          <span className="detail-label">Livré en :</span>
                          <span className="detail-value">{order.deliveryTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Bouton Commander à nouveau */}
                    <button 
                      className="reorder-btn"
                      onClick={() => handleReorder(order)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 12L7 9M4 12L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Commander à nouveau
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;





