import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente':
        return '#FFA500';
      case 'livreur_assigne':
        return '#4ECDC4';
      case 'en_route_pharmacie':
        return '#3498db';
      case 'a_la_pharmacie':
        return '#9b59b6';
      case 'achat_en_cours':
        return '#e74c3c';
      case 'en_route_client':
        return '#1abc9c';
      case 'livre':
        return '#27ae60';
      case 'annulee':
        return '#95a5a6';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'livreur_assigne':
        return 'Livreur assigné';
      case 'en_route_pharmacie':
        return 'En route vers pharmacie';
      case 'a_la_pharmacie':
        return 'À la pharmacie';
      case 'achat_en_cours':
        return 'Achat en cours';
      case 'en_route_client':
        return 'En livraison';
      case 'livre':
        return 'Livré';
      case 'annulee':
        return 'Annulée';
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        // Navigation vers détails commande
        // navigation.navigate('OrderDetails', { orderId: item._id });
      }}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>#{item.numeroCommande}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) }]}>
          <Text style={styles.statusText}>{getStatusText(item.statut)}</Text>
        </View>
      </View>

      <Text style={styles.orderDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.orderFooter}>
        <View style={styles.orderInfo}>
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.orderAddress} numberOfLines={1}>
            {item.adresseLivraison.adresse}
          </Text>
        </View>

        <View style={styles.orderPrice}>
          {item.prix.total > 0 ? (
            <Text style={styles.priceText}>{item.prix.total} FCFA</Text>
          ) : (
            <Text style={styles.priceText}>Prix à définir</Text>
          )}
        </View>
      </View>

      {item.livreur && (
        <View style={styles.deliveryInfo}>
          <Icon name="motorbike" size={16} color="#00B386" />
          <Text style={styles.deliveryText}>
            Livreur: {item.livreur.prenom} {item.livreur.nom}
          </Text>
        </View>
      )}

      <Text style={styles.orderDate}>
        {new Date(item.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B386" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes commandes</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="package-variant" size={80} color="#ddd" />
          <Text style={styles.emptyText}>Aucune commande</Text>
          <Text style={styles.emptySubtext}>
            Commencez par commander des médicaments
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00B386']}
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
  listContent: {
    padding: 15
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  orderNumber: {
    fontSize: 16,
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
  orderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  orderAddress: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    flex: 1
  },
  orderPrice: {
    marginLeft: 10
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B386'
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f9f6',
    borderRadius: 8
  },
  deliveryText: {
    fontSize: 13,
    color: '#00B386',
    marginLeft: 8,
    fontWeight: '600'
  },
  orderDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 10,
    textAlign: 'center'
  }
});

export default OrdersScreen;








