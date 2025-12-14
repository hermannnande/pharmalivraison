import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';

const LivreurProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const getVehicleIcon = (vehicule) => {
    switch (vehicule) {
      case 'moto':
        return 'motorbike';
      case 'voiture':
        return 'car';
      case 'velo':
        return 'bicycle';
      case 'scooter':
        return 'scooter';
      default:
        return 'motorbike';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Icon name="account-circle" size={80} color="#FF6B35" />
          </View>
          <Text style={styles.name}>{user?.prenom} {user?.nom}</Text>
          <Text style={styles.phone}>{user?.telephone}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.livreurInfo?.nombreLivraisons || 0}</Text>
              <Text style={styles.statLabel}>Livraisons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {user?.livreurInfo?.note?.toFixed(1) || '5.0'}</Text>
              <Text style={styles.statLabel}>Note</Text>
            </View>
          </View>
        </View>

        {/* Vehicle info */}
        {user?.livreurInfo?.vehicule && (
          <View style={styles.vehicleCard}>
            <Icon
              name={getVehicleIcon(user.livreurInfo.vehicule)}
              size={40}
              color="#FF6B35"
            />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleType}>
                {user.livreurInfo.vehicule.charAt(0).toUpperCase() + user.livreurInfo.vehicule.slice(1)}
              </Text>
              {user.livreurInfo.immatriculation && (
                <Text style={styles.vehiclePlate}>{user.livreurInfo.immatriculation}</Text>
              )}
            </View>
            {user.livreurInfo.documentsVerifies && (
              <Icon name="check-circle" size={24} color="#27ae60" />
            )}
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="account-edit" size={24} color="#666" />
              <Text style={styles.menuItemText}>Modifier le profil</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="cash-multiple" size={24} color="#666" />
              <Text style={styles.menuItemText}>Gains</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="file-document" size={24} color="#666" />
              <Text style={styles.menuItemText}>Documents</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="help-circle" size={24} color="#666" />
              <Text style={styles.menuItemText}>Aide & Support</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#e74c3c" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  profileImageContainer: {
    marginBottom: 15
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee'
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 15
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden'
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 18,
    borderRadius: 15
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 10
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  footerText: {
    fontSize: 12,
    color: '#999'
  }
});

export default LivreurProfileScreen;








