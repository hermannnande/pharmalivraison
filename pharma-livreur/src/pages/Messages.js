import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

function Messages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // all, support, clients
  
  const [conversations] = useState([
    {
      id: 1,
      type: 'client',
      name: 'Jean Kouassi',
      lastMessage: 'Merci pour la livraison rapide !',
      time: '14:30',
      unread: 2,
      avatar: '👤',
      orderNumber: 'CMD003'
    },
    {
      id: 2,
      type: 'support',
      name: 'Support Pharmacie',
      lastMessage: 'Votre demande a été traitée',
      time: 'Hier',
      unread: 0,
      avatar: '💊',
      orderNumber: null
    },
    {
      id: 3,
      type: 'client',
      name: 'Marie Diallo',
      lastMessage: 'Vous êtes arrivé ?',
      time: '12/12',
      unread: 0,
      avatar: '👤',
      orderNumber: 'CMD002'
    },
    {
      id: 4,
      type: 'support',
      name: 'Assistance technique',
      lastMessage: 'Bienvenue sur la plateforme',
      time: '10/12',
      unread: 0,
      avatar: '🛠️',
      orderNumber: null
    }
  ]);

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'all') return true;
    if (activeTab === 'support') return conv.type === 'support';
    if (activeTab === 'clients') return conv.type === 'client';
    return true;
  });

  const handleConversationClick = (conv) => {
    navigate(`/chat/${conv.id}`, { state: { conversation: conv } });
  };

  return (
    <div className="messages-page">
      {/* Header */}
      <div className="messages-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1>Messages</h1>
        <button className="new-message-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="messages-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tous
          {conversations.filter(c => c.unread > 0).length > 0 && (
            <span className="tab-badge">{conversations.filter(c => c.unread > 0).length}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Clients
          {conversations.filter(c => c.type === 'client' && c.unread > 0).length > 0 && (
            <span className="tab-badge">{conversations.filter(c => c.type === 'client' && c.unread > 0).length}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Support
        </button>
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>Aucun message</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`conversation-item ${conv.unread > 0 ? 'unread' : ''}`}
              onClick={() => handleConversationClick(conv)}
            >
              <div className="conversation-avatar">{conv.avatar}</div>
              <div className="conversation-content">
                <div className="conversation-header">
                  <div className="conversation-name">{conv.name}</div>
                  <div className="conversation-time">{conv.time}</div>
                </div>
                <div className="conversation-preview">
                  <div className="conversation-message">{conv.lastMessage}</div>
                  {conv.unread > 0 && (
                    <div className="conversation-badge">{conv.unread}</div>
                  )}
                </div>
                {conv.orderNumber && (
                  <div className="conversation-order">📦 {conv.orderNumber}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="messages-quick-actions">
        <button className="quick-action-btn">
          <span className="quick-action-icon">💊</span>
          <span className="quick-action-label">Contacter pharmacie</span>
        </button>
        <button className="quick-action-btn">
          <span className="quick-action-icon">🆘</span>
          <span className="quick-action-label">Support urgent</span>
        </button>
      </div>
    </div>
  );
}

export default Messages;

