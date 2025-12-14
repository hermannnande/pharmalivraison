# 📱 Guide Complet : Créer les APK Android

## ✅ Ce qui est déjà fait

- ✅ Capacitor installé dans les 2 apps
- ✅ Configuration Android créée
- ✅ Scripts de build automatiques créés
- ✅ Apps synchronisées

---

## 📋 Prérequis à installer (Une seule fois)

### 1. **Java JDK 11 ou supérieur**

**Télécharger** : https://adoptium.net/temurin/releases/?version=11

- Téléchargez le `.msi` Windows
- Installez-le (installation par défaut OK)
- Le JDK sera dans : `C:\Program Files\Eclipse Adoptium\jdk-11.x.x`

**Vérifier l'installation** :
```bash
java -version
```
Devrait afficher : `openjdk version "11.x.x"`

### 2. **Android Studio** (pour le SDK Android)

**Télécharger** : https://developer.android.com/studio

1. Installez Android Studio (toutes les options par défaut)
2. Au premier lancement, suivez le wizard :
   - Acceptez les licences
   - Téléchargez le SDK Android (API 33 recommandé)
3. **SDK installé dans** : `C:\Users\nande\AppData\Local\Android\Sdk`

### 3. **Configurer les variables d'environnement**

**Ouvrir les variables d'environnement Windows** :
1. Cherchez "variables d'environnement" dans le menu Démarrer
2. Cliquez sur "Modifier les variables d'environnement système"
3. Cliquez sur "Variables d'environnement..."

**Ajouter ces variables** :

- **JAVA_HOME**
  - Valeur : `C:\Program Files\Eclipse Adoptium\jdk-11.x.x` (remplacez x.x par votre version)

- **ANDROID_HOME**
  - Valeur : `C:\Users\nande\AppData\Local\Android\Sdk`

- **Path** (modifier la variable existante, ajouter ces lignes) :
  - `%JAVA_HOME%\bin`
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\tools`

4. **Redémarrer votre terminal** après ces modifications

**Vérifier** :
```bash
echo %JAVA_HOME%
echo %ANDROID_HOME%
```

---

## 🚀 Créer les APK (Une fois les prérequis installés)

### Méthode 1 : Scripts automatiques (Recommandé)

Double-cliquez sur :
- `build-client-apk.bat` pour l'app Client
- `build-livreur-apk.bat` pour l'app Livreur
- `build-all-apk.bat` pour les 2 en une fois

### Méthode 2 : Commandes manuelles

**App Client** :
```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-client"
npm run build
npx cap sync
cd android
gradlew assembleDebug
```
APK dans : `android\app\build\outputs\apk\debug\app-debug.apk`

**App Livreur** :
```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-livreur"
npm run build
npx cap sync
cd android
gradlew assembleDebug
```
APK dans : `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 📲 Installer les APK sur votre téléphone

### Méthode 1 : Via USB (Recommandé)

1. **Activer le débogage USB sur votre téléphone** :
   - Paramètres > À propos du téléphone
   - Appuyez 7 fois sur "Numéro de build"
   - Paramètres > Options développeur
   - Activez "Débogage USB"

2. **Connectez votre téléphone au PC**

3. **Installez avec ADB** :
```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-client\android\app\build\outputs\apk\debug"
adb install app-debug.apk

cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-livreur\android\app\build\outputs\apk\debug"
adb install app-debug.apk
```

### Méthode 2 : Via transfert de fichier

1. Copiez les APK sur votre téléphone (USB, Bluetooth, Drive, Email)
2. Sur le téléphone, ouvrez le fichier APK
3. Autorisez l'installation depuis sources inconnues
4. Installez

---

## ⚠️ Résolution de problèmes

### "JAVA_HOME is not set"
→ Configurez la variable d'environnement JAVA_HOME et redémarrez le terminal

### "SDK location not found"
→ Créez le fichier `local.properties` dans `android/` avec :
```
sdk.dir=C:\\Users\\nande\\AppData\\Local\\Android\\Sdk
```

### "Gradle build failed"
→ Vérifiez que vous avez au moins 4GB d'espace disque libre

### "Permission denied"
→ Exécutez le terminal en tant qu'administrateur

---

## 🎯 Prochaines étapes

1. **Installez les prérequis** (JDK + Android Studio)
2. **Configurez les variables d'environnement**
3. **Redémarrez votre terminal**
4. **Lancez** `build-all-apk.bat`
5. **Installez les APK** sur votre téléphone

Les APK seront dans :
- `pharma-client\apk\PharmaClient.apk`
- `pharma-livreur\apk\PharmaLivreur.apk`

---

## 💡 Alternative rapide : APK en ligne avec Expo

Si vous voulez éviter d'installer Android Studio, utilisez **Expo EAS** :

```bash
npm install -g eas-cli
eas login
cd pharma-client
eas build --platform android --profile preview
```

L'APK sera créé dans le cloud et téléchargeable en quelques minutes !

