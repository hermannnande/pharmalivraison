import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pharmalivraison.livreur',
  appName: 'PharmaLivreur',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1976d2",
      showSpinner: false
    },
    Geolocation: {
      requestPermission: true
    }
  }
};

export default config;
