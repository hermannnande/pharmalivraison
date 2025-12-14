import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CONFIG } from '../config';
import socketService from '../services/socket';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  // Charger les commandes depuis l'API
  useEffect(() => {
    loadOrders();
    
    // Connecter Socket.IO pour les mises à jour en temps réel
    socketService.connect();
    
    // Écouter les mises à jour de statut
    socketService.on('order:accepted', (data) => {
      console.log('✅ Commande acceptée:', data);
      loadOrders(); // Recharger les commandes
    });
    
    socketService.on('delivery:status', (data) => {
      console.log('📦 Statut mis à jour:', data);
      updateOrderStatus(data.orderId, data.status);
    });
    
    return () => {
      // Nettoyer les listeners
      socketService.off('order:accepted');
      socketService.off('delivery:status');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${CONFIG.API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const allOrders = response.data.orders || [];
        setOrders(allOrders);
        
        // Séparer commandes actives et terminées
        const active = allOrders.filter(o => 
          ['pending', 'accepted', 'to-pharmacy', 'at-pharmacy', 'to-client'].includes(o.status)
        );
        const completed = allOrders.filter(o => 
          ['delivered', 'cancelled'].includes(o.status)
        );
        
        setActiveOrders(active);
        setCompletedOrders(completed);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Recharger pour mettre à jour les listes active/completed
    loadOrders();
  };

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
      case 'delivered': return '#4caf50';
      case 'to-pharmacy':
      case 'at-pharmacy':
      case 'to-client':
      case 'accepted': return '#ff9800';
      case 'pending': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'to-pharmacy': return 'Vers pharmacie';
      case 'at-pharmacy': return 'À la pharmacie';
      case 'to-client': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
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

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement...</p>
        </div>
      )}

      {/* Liste des commandes */}
      {!loading && (
        <div className="orders-container">
          {/* Commandes en cours */}
          {activeOrders.length > 0 && (
            <div className="orders-section">
              <h2 className="section-title">
                <span className="pulse-dot"></span>
                En cours ({activeOrders.length})
              </h2>
              <div className="orders-list">
                {activeOrders.map((order) => (
                  <div key={order.id} className="order-card active-order">
                    {/* En-tête de la commande */}
                    <div className="order-card-header">
                      <div className="order-info">
                        <div className="order-id-row">
                          {getTypeIcon(order.orderType || 'liste')}
                          <span className="order-id">{order.orderNumber || order.id}</span>
                        </div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')} à{' '}
                          {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div 
                        className="order-status-badge status-animated" 
                        style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                      >
                        {getStatusLabel(order.status)}
                      </div>
                    </div>

                    {/* Pharmacie */}
                    <div className="order-pharmacy">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M19.5 9.5C19.5 15.5 12 21 12 21C12 21 4.5 15.5 4.5 9.5C4.5 5.35786 7.85786 2 12 2C16.1421 2 19.5 5.35786 19.5 9.5Z" stroke="#4caf50" strokeWidth="2"/>
                        <circle cx="12" cy="9.5" r="2.5" fill="#4caf50"/>
                      </svg>
                      <span>{order.pharmacyName || 'Pharmacie'}</span>
                    </div>

                    {/* Bouton Suivre */}
                    <button 
                      className="track-order-btn"
                      onClick={() => navigate('/home', { state: { trackOrderId: order.id } })}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                      </svg>
                      Suivre sur la carte
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commandes terminées */}
          {completedOrders.length > 0 && (
            <div className="orders-section">
              <h2 className="section-title">Historique ({completedOrders.length})</h2>
              <div className="orders-list">
                {completedOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    {/* En-tête de la commande */}
                    <div className="order-card-header">
                      <div className="order-info">
                        <div className="order-id-row">
                          {getTypeIcon(order.orderType || 'liste')}
                          <span className="order-id">{order.orderNumber || order.id}</span>
                        </div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')} à{' '}
                          {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div 
                        className="order-status-badge" 
                        style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                      >
                        {getStatusLabel(order.status)}
                      </div>
                    </div>

                    {/* Pharmacie */}
                    <div className="order-pharmacy">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M19.5 9.5C19.5 15.5 12 21 12 21C12 21 4.5 15.5 4.5 9.5C4.5 5.35786 7.85786 2 12 2C16.1421 2 19.5 5.35786 19.5 9.5Z" stroke="#4caf50" strokeWidth="2"/>
                        <circle cx="12" cy="9.5" r="2.5" fill="#4caf50"/>
                      </svg>
                      <span>{order.pharmacyName || 'Pharmacie'}</span>
                    </div>

                    {/* Contenu de la commande */}
                    {order.status !== 'cancelled' && (
                      <>
                        {order.orderType === 'liste' && order.medicationList && (
                          <div className="order-items">
                            <div className="items-label">Médicaments :</div>
                            <p className="medication-list-text">{order.medicationList}</p>
                          </div>
                        )}

                        {order.orderType === 'symptomes' && order.symptoms && (
                          <div className="order-symptoms">
                            <span className="symptoms-label">Symptômes :</span>
                            <span>{order.symptoms}</span>
                          </div>
                        )}

                        {/* Infos supplémentaires */}
                        <div className="order-details">
                          <div className="detail-item">
                            <span className="detail-label">Frais de livraison :</span>
                            <span className="detail-value">{order.deliveryFee || 1000} FCFA</span>
                          </div>
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
            </div>
          )}

          {/* État vide */}
          {orders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Aucune commande</h3>
              <p>Vos commandes apparaîtront ici</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;





