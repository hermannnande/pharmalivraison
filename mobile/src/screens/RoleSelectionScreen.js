import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏥 PharmaLivraison</Text>
        <Text style={styles.subtitle}>Bienvenue à Abidjan</Text>

        <Text style={styles.question}>Je suis un(e) :</Text>

        <TouchableOpacity
          style={[styles.roleButton, styles.clientButton]}
          onPress={() => navigation.navigate('Login', { role: 'client' })}>
          <Text style={styles.roleIcon}>👤</Text>
          <Text style={styles.roleTitle}>Client</Text>
          <Text style={styles.roleDescription}>
            Je veux commander des médicaments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, styles.livreurButton]}
          onPress={() => navigation.navigate('Login', { role: 'livreur' })}>
          <Text style={styles.roleIcon}>🏍️</Text>
          <Text style={styles.roleTitle}>Livreur</Text>
          <Text style={styles.roleDescription}>
            Je veux livrer des médicaments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, styles.pharmacieButton]}
          onPress={() => navigation.navigate('Login', { role: 'pharmacie' })}>
          <Text style={styles.roleIcon}>💊</Text>
          <Text style={styles.roleTitle}>Pharmacie</Text>
          <Text style={styles.roleDescription}>
            Je suis une pharmacie
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00B386',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30
  },
  roleButton: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  clientButton: {
    backgroundColor: '#00B386'
  },
  livreurButton: {
    backgroundColor: '#FF6B35'
  },
  pharmacieButton: {
    backgroundColor: '#4ECDC4'
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 10
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  roleDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  }
});

export default RoleSelectionScreen;








