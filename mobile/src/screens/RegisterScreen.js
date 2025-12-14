import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation, route }) => {
  const { role } = route.params || { role: 'client' };
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    motDePasse: '',
    confirmPassword: '',
    adresse: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.nom || !formData.prenom || !formData.telephone || !formData.motDePasse) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.motDePasse !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.motDePasse.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    const result = await register({
      ...formData,
      role
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erreur', result.message);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getRoleColor = () => {
    switch (role) {
      case 'client':
        return '#00B386';
      case 'livreur':
        return '#FF6B35';
      case 'pharmacie':
        return '#4ECDC4';
      default:
        return '#00B386';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>
              En tant que {role === 'client' ? 'Client' : role === 'livreur' ? 'Livreur' : 'Pharmacie'}
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={formData.nom}
              onChangeText={(value) => updateField('nom', value)}
            />

            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre prénom"
              value={formData.prenom}
              onChangeText={(value) => updateField('prenom', value)}
            />

            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 0707070707"
              value={formData.telephone}
              onChangeText={(value) => updateField('telephone', value)}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="email@exemple.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre adresse"
              value={formData.adresse}
              onChangeText={(value) => updateField('adresse', value)}
            />

            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 caractères"
              value={formData.motDePasse}
              onChangeText={(value) => updateField('motDePasse', value)}
              secureTextEntry
            />

            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: getRoleColor() }]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>
                Déjà un compte ? <Text style={[styles.linkTextBold, { color: getRoleColor() }]}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 20
  },
  header: {
    marginTop: 20,
    marginBottom: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  form: {
    flex: 1,
    paddingBottom: 30
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  button: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  linkText: {
    fontSize: 14,
    color: '#666'
  },
  linkTextBold: {
    fontWeight: 'bold'
  }
});

export default RegisterScreen;








