import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LivreurDashboard.css';

const LivreurDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('waiting'); // waiting, in-progress, completed
  const [isAvailable, setIsAvailable] = useState(true); // Mode disponibilité
  const [orders, setOrders] = useState([
    {
      id: 'CMD-2025-001',
      clientName: 'Client Test',
      clientPhone: '+225 07 00 00 00 00',
      clientAddress: 'Cocody, 2 Plateaux',
      clientPosition: [5.3600, -4.0083],
      pharmacyName: 'Pharmacie du Plateau',
      pharmacyAddress: 'Boulevard de la République',
      pharmacyPosition: [5.3500, -4.0150],
      orderType: 'ordonnance',
      orderDetails: 'Photo d\'ordonnance',
      estimatedPrice: '12,500 FCFA',
      deliveryFee: '1,000 FCFA',
      estimatedTime: '25-35 min',
      status: 'waiting', // waiting, accepted, at-pharmacy, delivering, delivered
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      forOther: false,
      urgentOrder: false
    }
  ]);

  // const [showOrderDetails, setShowOrderDetails] = useState(null);

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'accepted' }
        : order
    ));
    setShowOrderDetails(null);
    // Naviguer vers la page de livraison
    navigate('/driver-delivery', { state: { orderId } });
  };

  const handleRejectOrder = (orderId) => {
    if (window.confirm('Refuser cette commande ?')) {
      setOrders(orders.filter(order => order.id !== orderId));
      setShowOrderDetails(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'waiting') return order.status === 'waiting';
    if (activeTab === 'in-progress') return ['accepted', 'at-pharmacy', 'delivering'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'delivered';
    return false;
  });

  const getOrderIcon = (type) => {
    switch (type) {
      case 'ordonnance':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#2196f3"/>
            <path d="M14 2V8H20" fill="#1976d2"/>
          </svg>
        );
      case 'liste':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7Z" fill="#ff9800"/>
          </svg>
        );
      case 'symptomes':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9c27b0"/>
            <path d="M12 6V14M12 18H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="livreur-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button className="menu-btn" onClick={() => navigate('/menu')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="header-info">
              <h1>Commandes</h1>
              <div className="status-toggle">
                <button 
                  className={`toggle-btn ${isAvailable ? 'online' : 'offline'}`}
                  onClick={() => setIsAvailable(!isAvailable)}
                >
                  {isAvailable ? '🟢 En ligne' : '🔴 Hors ligne'}
                </button>
              </div>
            </div>
          </div>
          <button className="notif-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {filteredOrders.length > 0 && <span className="notif-badge">{filteredOrders.length}</span>}
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'waiting' ? 'active' : ''}`}
            onClick={() => setActiveTab('waiting')}
          >
            En attente ({orders.filter(o => o.status === 'waiting').length})
          </button>
          <button 
            className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            En cours ({orders.filter(o => ['accepted', 'at-pharmacy', 'delivering'].includes(o.status)).length})
          </button>
          <button 
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Terminées ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'waiting' && '📦'}
              {activeTab === 'in-progress' && '🏍️'}
              {activeTab === 'completed' && '✅'}
            </div>
            <h3>
              {activeTab === 'waiting' && 'Aucune commande en attente'}
              {activeTab === 'in-progress' && 'Aucune livraison en cours'}
              {activeTab === 'completed' && 'Aucune commande terminée'}
            </h3>
            <p>Les nouvelles commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`order-card ${order.urgentOrder ? 'urgent' : ''}`}>
                {order.urgentOrder && (
                  <div className="urgent-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    URGENT
                  </div>
                )}

                <div className="order-header">
                  <div className="order-id-section">
                    {getOrderIcon(order.orderType)}
                    <div>
                      <div className="order-id">{order.id}</div>
                      <div className="order-time">{order.timestamp}</div>
                    </div>
                  </div>
                  {order.forOther && (
                    <span className="for-other-badge">Pour un proche</span>
                  )}
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="#2e7d32" strokeWidth="2"/>
                      <path d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div>
                      <strong>{order.clientName}</strong>
                      <span>{order.clientPhone}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21C12 21 4 15 4 9C4 5.68629 6.68629 3 10 3H14C17.3137 3 20 5.68629 20 9C20 15 12 21 12 21Z" stroke="#ff9800" strokeWidth="2"/>
                      <circle cx="12" cy="9" r="2" fill="#ff9800"/>
                    </svg>
                    <div>
                      <strong>{order.clientAddress}</strong>
                    </div>
                  </div>

                  <div className="detail-row">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19.5 9.5C19.5 15.5 12 21 12 21C12 21 4.5 15.5 4.5 9.5C4.5 5.35786 7.85786 2 12 2C16.1421 2 19.5 5.35786 19.5 9.5Z" stroke="#4caf50" strokeWidth="2"/>
                      <circle cx="12" cy="9.5" r="2.5" fill="#4caf50"/>
                    </svg>
                    <div>
                      <strong>{order.pharmacyName}</strong>
                      <span>{order.pharmacyAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-item">
                    <span>💰 Prix estimé</span>
                    <strong>{order.estimatedPrice}</strong>
                  </div>
                  <div className="summary-item">
                    <span>🚚 Livraison</span>
                    <strong>{order.deliveryFee}</strong>
                  </div>
                  <div className="summary-item">
                    <span>⏱️ Temps</span>
                    <strong>{order.estimatedTime}</strong>
                  </div>
                </div>

                {activeTab === 'waiting' && (
                  <div className="order-actions">
                    <button 
                      className="btn-reject"
                      onClick={() => handleRejectOrder(order.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Refuser
                    </button>
                    <button 
                      className="btn-accept"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Accepter
                    </button>
                  </div>
                )}

                {activeTab === 'in-progress' && (
                  <button 
                    className="btn-view"
                    onClick={() => navigate('/driver-delivery', { state: { orderId: order.id } })}
                  >
                    Voir la livraison
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivreurDashboard;

