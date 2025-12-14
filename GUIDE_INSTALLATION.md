# 📋 Guide d'Installation - PharmaLivraison Abidjan

## 🔧 Prérequis

### Logiciels nécessaires
- **Node.js** (v16 ou supérieur) - [Télécharger](https://nodejs.org/)
- **MongoDB** - [Télécharger](https://www.mongodb.com/try/download/community)
- **Android Studio** (pour Android) - [Télécharger](https://developer.android.com/studio)
- **Xcode** (pour iOS, Mac uniquement) - App Store
- **React Native CLI** : `npm install -g react-native-cli`
- **Git** - [Télécharger](https://git-scm.com/)

## 📦 Installation du Backend

### 1. Accéder au dossier backend
```bash
cd backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos informations :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pharmalivraison
JWT_SECRET=votre_secret_jwt_super_securise
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
GOOGLE_MAPS_API_KEY=votre_google_maps_api_key
DEFAULT_DELIVERY_FEE=1000
```

### 4. Démarrer MongoDB
```bash
# Sur Windows
mongod

# Sur Mac/Linux
sudo systemctl start mongod
```

### 5. Démarrer le serveur backend
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## 📱 Installation de l'Application Mobile

### 1. Accéder au dossier mobile
```bash
cd mobile
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Android

#### a. Installer les dépendances Android
Ouvrez Android Studio et installez :
- Android SDK
- Android SDK Platform
- Android Virtual Device (AVD)

#### b. Configurer les variables d'environnement
Ajoutez à votre fichier de profil (`~/.bashrc`, `~/.zshrc`, etc.) :

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # Mac
# ou
export ANDROID_HOME=$HOME/Android/Sdk  # Linux
# ou
export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk  # Windows

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### c. Créer un fichier .env
Créez `.env` dans le dossier mobile :
```env
API_URL=http://10.0.2.2:5000/api
GOOGLE_MAPS_API_KEY=votre_google_maps_api_key
```

**Note** : `10.0.2.2` est l'adresse localhost pour l'émulateur Android.

### 4. Configuration iOS (Mac uniquement)

#### a. Installer les pods
```bash
cd ios
pod install
cd ..
```

#### b. Configurer .env pour iOS
Modifiez `.env` :
```env
API_URL=http://localhost:5000/api
GOOGLE_MAPS_API_KEY=votre_google_maps_api_key
```

### 5. Démarrer l'application

#### Pour Android :
```bash
# Démarrer Metro Bundler
npm start

# Dans un nouveau terminal, lancer l'app
npx react-native run-android
```

#### Pour iOS (Mac uniquement) :
```bash
# Démarrer Metro Bundler
npm start

# Dans un nouveau terminal, lancer l'app
npx react-native run-ios
```

## 🗺️ Configuration de Google Maps

### 1. Obtenir une clé API Google Maps

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez les APIs :
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
   - Places API
4. Créez des identifiants (API Key)
5. Copiez la clé dans votre fichier `.env`

### 2. Configuration Android

Ajoutez dans `mobile/android/app/src/main/AndroidManifest.xml` :

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="VOTRE_GOOGLE_MAPS_API_KEY"/>
</application>
```

### 3. Configuration iOS

Ajoutez dans `mobile/ios/PharmaLivraison/AppDelegate.mm` :

```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"VOTRE_GOOGLE_MAPS_API_KEY"];
  // ... reste du code
}
```

## ☁️ Configuration Cloudinary (Upload d'images)

### 1. Créer un compte Cloudinary
1. Allez sur [cloudinary.com](https://cloudinary.com/)
2. Créez un compte gratuit
3. Récupérez vos identifiants dans le Dashboard

### 2. Configurer dans le backend
Ajoutez dans `backend/.env` :
```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

## 🧪 Tester l'application

### Créer des utilisateurs de test

Vous pouvez utiliser ces comptes de test ou en créer de nouveaux via l'app :

**Client :**
- Téléphone : `0707070707`
- Mot de passe : `test123`

**Livreur :**
- Téléphone : `0708080808`
- Mot de passe : `test123`

### Ajouter des pharmacies de test

Utilisez un outil comme Postman ou Insomnia pour créer des pharmacies :

```http
POST http://localhost:5000/api/pharmacies
Authorization: Bearer <token_utilisateur_pharmacie>
Content-Type: application/json

{
  "nom": "Pharmacie Test",
  "telephone": "0709090909",
  "adresse": "Cocody, Abidjan",
  "commune": "Cocody",
  "location": {
    "type": "Point",
    "coordinates": [-4.0083, 5.3599]
  },
  "ouvert24h": true
}
```

## 🐛 Résolution de problèmes courants

### Problème : Metro Bundler ne démarre pas
```bash
# Nettoyer le cache
npx react-native start --reset-cache
```

### Problème : L'app Android ne se connecte pas au backend
- Vérifiez que vous utilisez `10.0.2.2` dans l'URL de l'API
- Désactivez temporairement le pare-feu
- Vérifiez que le backend est bien démarré

### Problème : Erreur de build Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Problème : Erreur de pods iOS
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Problème : MongoDB ne démarre pas
```bash
# Vérifier le statut
sudo systemctl status mongod

# Redémarrer MongoDB
sudo systemctl restart mongod
```

## 📚 Ressources supplémentaires

- [Documentation React Native](https://reactnative.dev/)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Socket.io](https://socket.io/docs/)
- [Documentation React Navigation](https://reactnavigation.org/)

## 🎯 Prochaines étapes

1. ✅ Backend configuré et fonctionnel
2. ✅ Application mobile installée
3. 📝 Créer des comptes de test
4. 🗺️ Ajouter des pharmacies
5. 🚀 Tester une commande complète

## 💡 Conseils

- Utilisez un émulateur Android avec Play Services pour Google Maps
- Testez d'abord sur émulateur avant un appareil physique
- Gardez MongoDB, le backend et Metro Bundler en cours d'exécution
- Consultez les logs pour déboguer (`npx react-native log-android` ou `npx react-native log-ios`)

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend et de l'app mobile
2. Assurez-vous que toutes les dépendances sont installées
3. Vérifiez que MongoDB est bien démarré
4. Vérifiez vos variables d'environnement

Bon développement ! 🚀








