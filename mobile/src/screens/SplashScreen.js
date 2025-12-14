import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 PharmaLivraison</Text>
      <Text style={styles.subtitle}>Abidjan</Text>
      <ActivityIndicator size="large" color="#00B386" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00B386',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40
  },
  loader: {
    marginTop: 20
  }
});

export default SplashScreen;








