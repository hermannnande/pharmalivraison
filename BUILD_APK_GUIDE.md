# 📱 Guide de création des APK Android

## Option 1 : Utiliser Expo (Le plus simple) ⭐ RECOMMANDÉ

### Installation d'Expo

1. **Installer EAS CLI globalement**
```bash
npm install -g eas-cli
```

2. **Se connecter à Expo**
```bash
eas login
```
Si vous n'avez pas de compte, créez-en un sur https://expo.dev

### Pour l'App Client

```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-client"

# Installer Expo
npm install expo

# Créer app.json pour Expo
```

Créer le fichier `app.json` :
```json
{
  "expo": {
    "name": "PharmaClient",
    "slug": "pharma-client",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./public/logo192.png",
    "splash": {
      "image": "./public/logo192.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.pharmalivraison.client",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./public/logo192.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

```bash
# Build APK
eas build --platform android --profile preview
```

### Pour l'App Livreur

```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-livreur"

# Installer Expo
npm install expo
```

Créer le fichier `app.json` :
```json
{
  "expo": {
    "name": "PharmaLivreur",
    "slug": "pharma-livreur",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./public/logo192.png",
    "splash": {
      "image": "./public/logo192.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.pharmalivraison.livreur",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./public/logo192.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

```bash
# Build APK
eas build --platform android --profile preview
```

---

## Option 2 : Utiliser Capacitor (Plus personnalisable)

### Installation

```bash
# App Client
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-client"
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialiser
npx cap init "PharmaClient" "com.pharmalivraison.client" --web-dir=build

# Build React
npm run build

# Ajouter Android
npx cap add android

# Synchroniser
npx cap sync

# Ouvrir dans Android Studio
npx cap open android
```

### Dans Android Studio :
1. Cliquez sur **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Une fois terminé, cliquez sur **locate** pour trouver l'APK
3. L'APK sera dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### Répéter pour l'App Livreur

```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-livreur"
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "PharmaLivreur" "com.pharmalivraison.livreur" --web-dir=build
npm run build
npx cap add android
npx cap sync
npx cap open android
```

---

## Option 3 : Tester directement avec Expo Go (Le plus rapide) 🚀

Sans créer d'APK, testez immédiatement :

1. **Installer Expo Go sur votre téléphone**
   - Android : https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS : https://apps.apple.com/app/expo-go/id982107779

2. **Lancer en mode développement**

```bash
# App Client
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-client"
npm install expo
npx expo start
```

3. **Scanner le QR code** avec Expo Go sur votre téléphone

4. **Répéter pour App Livreur**

```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-livreur"
npm install expo
npx expo start
```

---

## 📋 Prérequis pour Android Studio

Si vous choisissez l'Option 2 (Capacitor) :

1. **Télécharger Android Studio** : https://developer.android.com/studio
2. **Installer le SDK Android** (via Android Studio)
3. **Configurer les variables d'environnement** :
   - `ANDROID_HOME` = chemin vers Android SDK
   - `JAVA_HOME` = chemin vers JDK

---

## 🎯 Recommandation

**Pour tester rapidement** → Utilisez **Option 3 (Expo Go)**
**Pour créer des APK** → Utilisez **Option 1 (Expo EAS)**
**Pour plus de contrôle** → Utilisez **Option 2 (Capacitor + Android Studio)**

---

## 📦 Transfert de l'APK sur téléphone

Une fois l'APK créé :

1. **Via USB** :
   - Connectez votre téléphone en mode débogage USB
   - Copiez l'APK sur votre téléphone
   - Ouvrez-le et installez

2. **Via Email/Drive** :
   - Envoyez-vous l'APK par email
   - Ou uploadez sur Google Drive
   - Téléchargez sur téléphone et installez

3. **Via ADB** :
```bash
adb install app-debug.apk
```

---

## ⚠️ Activer les sources inconnues

Sur Android :
1. Paramètres > Sécurité
2. Activer "Sources inconnues" ou "Installer des applications inconnues"
3. Autoriser l'installation depuis votre navigateur/gestionnaire de fichiers

---

## 🔑 Configuration des API Keys

N'oubliez pas de configurer les API keys dans les fichiers de configuration avant de build :

- Google Maps API Key
- Backend URL (Railway)
- Socket.IO URL

Modifiez `src/config.js` dans chaque app avant de builder.

