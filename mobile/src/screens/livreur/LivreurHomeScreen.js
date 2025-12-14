import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL, SOCKET_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';

const LivreurHomeScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [disponible, setDisponible] = useState(user?.livreurInfo?.disponible || false);
  const [commandes, setCommandes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connexion Socket.io
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Écouter les nouvelles commandes
    newSocket.on('nouvelle-commande', (data) => {
      Alert.alert(
        '🔔 Nouvelle commande !',
        `Commande de ${data.client.prenom} ${data.client.nom}`,
        [
          { text: 'Voir', onPress: () => fetchCommandes() }
        ]
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (disponible) {
      fetchCommandes();
    }
  }, [disponible]);

  const fetchCommandes = async () => {
    try {
      // Récupérer les commandes en attente
      const response = await axios.get(`${API_URL}/orders`);
      const commandesEnAttente = response.data.data.filter(
        order => order.statut === 'en_attente'
      );
      setCommandes(commandesEnAttente);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleDisponibilite = async () => {
    try {
      const newStatus = !disponible;
      await axios.put(`${API_URL}/deliveries/availability`, {
        disponible: newStatus
      });

      setDisponible(newStatus);
      updateUser({ livreurInfo: { ...user.livreurInfo, disponible: newStatus } });

      if (newStatus) {
        fetchCommandes();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la disponibilité');
    }
  };

  const handleAcceptOrder = (orderId) => {
    Alert.alert(
      'Accepter la commande',
      'Voulez-vous accepter cette livraison ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: async () => {
            try {
              await axios.put(`${API_URL}/orders/${orderId}/assign`);
              Alert.alert('Succès', 'Commande acceptée !');
              fetchCommandes();
              navigation.navigate('LivreurOrders');
            } catch (error) {
              Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de l\'acceptation');
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommandes();
  };

  const renderCommandeItem = ({ item }) => (
    <View style={styles.commandeCard}>
      <View style={styles.commandeHeader}>
        <Text style={styles.commandeNumber}>#{item.numeroCommande}</Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.prix.livraison} FCFA</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.locationRow}>
        <Icon name="map-marker" size={16} color="#666" />
        <Text style={styles.address} numberOfLines={1}>
          {item.adresseLivraison.adresse}
        </Text>
      </View>

      {item.ordonnance && (
        <View style={styles.prescriptionBadge}>
          <Icon name="file-document" size={16} color="#4ECDC4" />
          <Text style={styles.prescriptionText}>Ordonnance fournie</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptOrder(item._id)}>
        <Text style={styles.acceptButtonText}>Accepter cette livraison</Text>
      </TouchableOpacity>

      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Commandes disponibles</Text>
          <Text style={styles.subtitle}>
            {disponible ? '🟢 Vous êtes disponible' : '🔴 Vous êtes indisponible'}
          </Text>
        </View>
        <Switch
          value={disponible}
          onValueChange={toggleDisponibilite}
          trackColor={{ false: '#ccc', true: '#FF6B35' }}
          thumbColor={disponible ? '#fff' : '#f4f3f4'}
        />
      </View>

      {!disponible ? (
        <View style={styles.inactiveContainer}>
          <Icon name="sleep" size={80} color="#ddd" />
          <Text style={styles.inactiveTitle}>Mode hors ligne</Text>
          <Text style={styles.inactiveText}>
            Activez votre disponibilité pour recevoir des commandes
          </Text>
        </View>
      ) : commandes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="package-variant-closed" size={80} color="#ddd" />
          <Text style={styles.emptyTitle}>Aucune commande disponible</Text>
          <Text style={styles.emptyText}>
            Nous vous notifierons dès qu'une nouvelle commande arrive
          </Text>
        </View>
      ) : (
        <FlatList
          data={commandes}
          renderItem={renderCommandeItem}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  listContent: {
    padding: 15
  },
  commandeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  commandeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  commandeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  priceBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  address: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
    flex: 1
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 12
  },
  prescriptionText: {
    fontSize: 12,
    color: '#4ECDC4',
    marginLeft: 5,
    fontWeight: '600'
  },
  acceptButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    textAlign: 'right'
  },
  inactiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  inactiveTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10
  },
  inactiveText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10
  },
  emptyText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center'
  }
});

export default LivreurHomeScreen;








