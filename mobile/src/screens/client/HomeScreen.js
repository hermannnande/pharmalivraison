import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  PermissionsAndroid,
  Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  
  // Formulaire de commande
  const [orderForm, setOrderForm] = useState({
    description: '',
    adresse: '',
    instructions: ''
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchNearbyPharmacies(latitude, longitude);
      },
      (error) => {
        console.error(error);
        // Position par défaut (Abidjan)
        const defaultLocation = { latitude: 5.316667, longitude: -4.033333 };
        setLocation(defaultLocation);
        fetchNearbyPharmacies(defaultLocation.latitude, defaultLocation.longitude);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchNearbyPharmacies = async (latitude, longitude) => {
    try {
      const response = await axios.get(`${API_URL}/pharmacies/open/now`, {
        params: {
          latitude,
          longitude,
          rayon: 10000 // 10km
        }
      });

      setPharmacies(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = () => {
    Alert.alert(
      'Ajouter une ordonnance',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: () => {
            launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.assets && response.assets[0]) {
                setSelectedPrescription(response.assets[0]);
              }
            });
          }
        },
        {
          text: 'Choisir de la galerie',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
              if (response.assets && response.assets[0]) {
                setSelectedPrescription(response.assets[0]);
              }
            });
          }
        },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const handleCreateOrder = async () => {
    if (!orderForm.description.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire les médicaments dont vous avez besoin');
      return;
    }

    if (!orderForm.adresse.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer votre adresse de livraison');
      return;
    }

    try {
      setLoading(true);

      // TODO: Upload de l'image d'ordonnance si présente
      let ordonnanceUrl = null;
      
      const orderData = {
        description: orderForm.description,
        adresseLivraison: {
          adresse: orderForm.adresse,
          location: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          },
          instructions: orderForm.instructions
        },
        ordonnanceUrl
      };

      const response = await axios.post(`${API_URL}/orders`, orderData);

      Alert.alert(
        'Commande créée !',
        'Nous recherchons un livreur disponible...',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              navigation.navigate('Orders');
              // Réinitialiser le formulaire
              setOrderForm({ description: '', adresse: '', instructions: '' });
              setSelectedPrescription(null);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B386" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.prenom} {user?.nom}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Carte */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}>
        {/* Position de l'utilisateur */}
        <Marker
          coordinate={location}
          title="Ma position"
          pinColor="blue"
        />

        {/* Pharmacies */}
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy._id}
            coordinate={{
              latitude: pharmacy.location.coordinates[1],
              longitude: pharmacy.location.coordinates[0]
            }}
            title={pharmacy.nom}
            description={pharmacy.adresse}>
            <Icon name="hospital-box" size={40} color="#00B386" />
          </Marker>
        ))}
      </MapView>

      {/* Bouton Commander */}
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="pill" size={24} color="#fff" />
        <Text style={styles.orderButtonText}>Commander des médicaments</Text>
      </TouchableOpacity>

      {/* Stats pharmacies */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          🏥 {pharmacies.length} pharmacie(s) ouverte(s) à proximité
        </Text>
      </View>

      {/* Modal de commande */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouvelle commande</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Description des médicaments *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Doliprane 1000mg, Amoxicilline..."
              value={orderForm.description}
              onChangeText={(text) => setOrderForm({ ...orderForm, description: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Adresse de livraison *</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre adresse complète"
              value={orderForm.adresse}
              onChangeText={(text) => setOrderForm({ ...orderForm, adresse: text })}
            />

            <Text style={styles.label}>Instructions (facultatif)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2ème étage, porte bleue..."
              value={orderForm.instructions}
              onChangeText={(text) => setOrderForm({ ...orderForm, instructions: text })}
            />

            <Text style={styles.label}>Ordonnance (facultatif)</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handleSelectImage}>
              {selectedPrescription ? (
                <View>
                  <Image
                    source={{ uri: selectedPrescription.uri }}
                    style={styles.prescriptionImage}
                  />
                  <Text style={styles.imageButtonText}>Changer l'image</Text>
                </View>
              ) : (
                <>
                  <Icon name="camera" size={40} color="#00B386" />
                  <Text style={styles.imageButtonText}>
                    Prendre en photo ou importer une ordonnance
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Frais de livraison:</Text>
              <Text style={styles.priceValue}>1000 FCFA</Text>
            </View>
            <Text style={styles.priceNote}>
              + Prix des médicaments (à payer au livreur)
            </Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateOrder}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Valider la commande</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
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
  greeting: {
    fontSize: 14,
    color: '#666'
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  notificationButton: {
    padding: 10
  },
  map: {
    flex: 1
  },
  orderButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#00B386',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
  },
  statsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  statsText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  imageButton: {
    borderWidth: 2,
    borderColor: '#00B386',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 14,
    color: '#00B386',
    textAlign: 'center'
  },
  prescriptionImage: {
    width: 200,
    height: 200,
    borderRadius: 10
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f9f6',
    borderRadius: 10
  },
  priceLabel: {
    fontSize: 16,
    color: '#333'
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00B386'
  },
  priceNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5
  },
  submitButton: {
    backgroundColor: '#00B386',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default HomeScreen;








