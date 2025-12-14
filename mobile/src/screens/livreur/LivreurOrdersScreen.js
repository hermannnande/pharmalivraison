import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const LivreurOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('en_cours'); // en_cours, historique

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus, additionalData = {}) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, {
        statut: newStatus,
        ...additionalData
      });
      fetchOrders();
      Alert.alert('Succès', 'Statut mis à jour');
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'livreur_assigne': 'en_route_pharmacie',
      'en_route_pharmacie': 'a_la_pharmacie',
      'a_la_pharmacie': 'achat_en_cours',
      'achat_en_cours': 'en_route_client',
      'en_route_client': 'livre'
    };
    return statusFlow[currentStatus];
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'livreur_assigne': 'Aller à la pharmacie',
      'en_route_pharmacie': 'Arrivé à la pharmacie',
      'a_la_pharmacie': 'Commencer l\'achat',
      'achat_en_cours': 'Aller chez le client',
      'en_route_client': 'Marquer comme livré',
      'livre': 'Livré ✓'
    };
    return statusTexts[status] || 'Mettre à jour';
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'en_cours') {
      return !['livre', 'annulee'].includes(order.statut);
    } else {
      return ['livre', 'annulee'].includes(order.statut);
    }
  });

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{item.numeroCommande}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.statut === 'livre' ? '#27ae60' : '#3498db' }
        ]}>
          <Text style={styles.statusText}>
            {item.statut === 'livre' ? 'Livré' : 'En cours'}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Client info */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Icon name="account" size={18} color="#333" />
          <Text style={styles.infoText}>
            {item.client.prenom} {item.client.nom}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(item.client.telephone)}>
          <Icon name="phone" size={24} color="#00B386" />
        </TouchableOpacity>
      </View>

      {/* Delivery address */}
      <View style={styles.addressSection}>
        <Icon name="map-marker" size={18} color="#666" />
        <Text style={styles.addressText}>{item.adresseLivraison.adresse}</Text>
      </View>

      {/* Pharmacy info */}
      {item.pharmacie && (
        <View style={styles.pharmacieSection}>
          <Icon name="hospital-box" size={18} color="#00B386" />
          <Text style={styles.pharmacieText}>{item.pharmacie.nom}</Text>
        </View>
      )}

      {/* Price */}
      {item.prix.total > 0 && (
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Montant à collecter:</Text>
          <Text style={styles.priceValue}>{item.prix.total} FCFA</Text>
        </View>
      )}

      {/* Action button */}
      {item.statut !== 'livre' && item.statut !== 'annulee' && (
        <>
          {item.statut === 'achat_en_cours' ? (
            <TouchableOpacity
              style={styles.inputPriceButton}
              onPress={() => {
                Alert.prompt(
                  'Prix des médicaments',
                  'Entrez le prix total des médicaments achetés',
                  [
                    { text: 'Annuler', style: 'cancel' },
                    {
                      text: 'Valider',
                      onPress: (prix) => {
                        if (prix && !isNaN(prix)) {
                          handleUpdateStatus(
                            item._id,
                            getNextStatus(item.statut),
                            { prixMedicaments: parseInt(prix) }
                          );
                        }
                      }
                    }
                  ],
                  'plain-text',
                  '',
                  'numeric'
                );
              }}>
              <Text style={styles.actionButtonText}>Entrer le prix et continuer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateStatus(item._id, getNextStatus(item.statut))}>
              <Text style={styles.actionButtonText}>
                {getStatusText(item.statut)}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes livraisons</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'en_cours' && styles.activeTab]}
          onPress={() => setActiveTab('en_cours')}>
          <Text style={[styles.tabText, activeTab === 'en_cours' && styles.activeTabText]}>
            En cours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'historique' && styles.activeTab]}
          onPress={() => setActiveTab('historique')}>
          <Text style={[styles.tabText, activeTab === 'historique' && styles.activeTabText]}>
            Historique
          </Text>
        </TouchableOpacity>
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="package-variant" size={80} color="#ddd" />
          <Text style={styles.emptyText}>
            {activeTab === 'en_cours' ? 'Aucune livraison en cours' : 'Aucun historique'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6B35']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 10
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#FF6B35'
  },
  tabText: {
    fontSize: 16,
    color: '#999'
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold'
  },
  listContent: {
    padding: 15
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    fontWeight: '600'
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 10
  },
  pharmacieSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f9f6',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 5
  },
  pharmacieText: {
    fontSize: 14,
    color: '#00B386',
    marginLeft: 10,
    fontWeight: '600'
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 10
  },
  priceLabel: {
    fontSize: 14,
    color: '#333'
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  },
  inputPriceButton: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    marginTop: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20
  }
});

export default LivreurOrdersScreen;








