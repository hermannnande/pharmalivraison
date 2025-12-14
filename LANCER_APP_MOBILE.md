# 🚀 Guide Rapide - Lancer l'Application Mobile

## ⚠️ Situation Actuelle

Le backend fonctionne parfaitement avec Docker ✅, mais pour lancer l'application mobile React Native, vous avez besoin d'Android Studio.

---

## 📱 Option 1 : Installer Android Studio (RECOMMANDÉ)

### Étape 1 : Télécharger Android Studio

1. Aller sur : https://developer.android.com/studio
2. Télécharger **Android Studio** (gratuit)
3. Installer avec les options par défaut

### Étape 2 : Configuration Initiale

Lors du premier lancement d'Android Studio :

1. ✅ Accepter la licence
2. ✅ Installation Standard
3. ✅ Installer Android SDK
4. ✅ Installer Android Virtual Device (AVD)
5. ⏳ Attendre la fin du téléchargement (~2-3 GB)

### Étape 3 : Créer un Émulateur

1. Ouvrir Android Studio
2. Cliquer sur **"More Actions"** → **"Virtual Device Manager"**
3. Cliquer **"Create Device"**
4. Choisir **"Pixel 5"** ou autre appareil
5. Choisir **"Tiramisu"** (Android 13) ou **"UpsideDownCake"** (Android 14)
6. Cliquer **"Next"** puis **"Finish"**
7. Cliquer ▶️ pour démarrer l'émulateur

### Étape 4 : Configurer les Variables d'Environnement

**Ouvrir PowerShell en Administrateur** et exécuter :

```powershell
# Définir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Ajouter au PATH
$path = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools",
    "$env:LOCALAPPDATA\Android\Sdk\emulator",
    "$env:LOCALAPPDATA\Android\Sdk\tools",
    "$env:LOCALAPPDATA\Android\Sdk\tools\bin"
)
foreach ($p in $androidPaths) {
    if ($path -notlike "*$p*") {
        $path = "$path;$p"
    }
}
[System.Environment]::SetEnvironmentVariable('Path', $path, 'User')

Write-Host "✅ Variables d'environnement configurées !" -ForegroundColor Green
Write-Host "⚠️  Fermez et rouvrez PowerShell pour appliquer les changements" -ForegroundColor Yellow
```

### Étape 5 : Lancer l'Application

**Fermez et rouvrez PowerShell**, puis :

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"

# Vérifier qu'ADB fonctionne
adb devices

# Lancer l'application
npx react-native run-android
```

---

## 📱 Option 2 : Utiliser un Appareil Android Physique

Si vous avez un téléphone/tablette Android :

### Étape 1 : Activer le Mode Développeur

1. Aller dans **Paramètres** → **À propos du téléphone**
2. Taper 7 fois sur **"Numéro de build"**
3. Message : "Vous êtes maintenant développeur"

### Étape 2 : Activer le Débogage USB

1. Aller dans **Paramètres** → **Options pour développeurs**
2. Activer **"Débogage USB"**

### Étape 3 : Connecter le Téléphone

1. Brancher le téléphone avec un câble USB
2. Accepter l'autorisation de débogage USB sur le téléphone
3. Installer les drivers USB si Windows le demande

### Étape 4 : Vérifier la Connexion

```powershell
adb devices
```

Vous devriez voir votre appareil listé.

### Étape 5 : Modifier la Configuration

Dans `mobile/.env`, remplacer par **l'IP de votre ordinateur** :

```env
# Trouver votre IP
ipconfig
# Chercher "Adresse IPv4" (ex: 192.168.1.100)

# Modifier .env
API_URL=http://192.168.1.100:5000/api
SOCKET_URL=http://192.168.1.100:5000
```

### Étape 6 : Lancer sur l'Appareil

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

---

## 🌐 Option 3 : Tester le Backend Seulement (Sans Mobile)

Si vous voulez juste vérifier que le backend fonctionne, vous pouvez utiliser **Postman** ou **curl**.

### Installer Postman

1. Télécharger : https://www.postman.com/downloads/
2. Installer et ouvrir
3. Créer une nouvelle requête

### Tester l'API

**1. Test de Connexion :**
```
GET http://localhost:5000
```

**2. Login Client :**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "telephone": "0707070707",
  "motDePasse": "test123"
}
```

**3. Liste des Pharmacies :**
```
GET http://localhost:5000/api/pharmacies
```

**4. Pharmacies Ouvertes :**
```
GET http://localhost:5000/api/pharmacies/open/now?latitude=5.3599&longitude=-4.0083
```

---

## 🐛 Dépannage

### "adb not found"

**Solution** : Installez Android Studio ou ajoutez Android SDK au PATH.

### "No devices found"

**Solutions** :
1. Démarrer un émulateur dans Android Studio
2. Ou connecter un appareil physique avec USB
3. Vérifier avec `adb devices`

### "Build failed"

**Solutions** :
```powershell
cd mobile
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

### Metro Bundler ne démarre pas

**Solution** :
```powershell
cd mobile
npx react-native start --reset-cache
```

---

## 📊 État Actuel de Votre Projet

| Composant | Statut | Note |
|-----------|--------|------|
| **Backend API** | ✅ Fonctionne | http://localhost:5000 |
| **MongoDB** | ✅ Fonctionne | Données créées |
| **Code Mobile** | ✅ Prêt | Tout installé |
| **Android SDK** | ❌ Manquant | À installer |
| **Émulateur** | ❌ Non configuré | À créer |

---

## 🎯 Prochaines Étapes Recommandées

### Solution Rapide (1 heure)

1. **Télécharger Android Studio** (~15 min)
2. **Installer et configurer** (~20 min)
3. **Créer un émulateur** (~5 min)
4. **Configurer les variables** (~5 min)
5. **Lancer l'app** (~5 min)
6. **Tester !** 🎉

### Alternative Immédiate (5 min)

1. **Utiliser un appareil Android** que vous avez déjà
2. **Activer le débogage USB**
3. **Connecter et lancer**

---

## 💡 Pendant que Vous Installez

Vous pouvez :

1. **Tester le backend** avec Postman
2. **Lire la documentation** :
   - `FONCTIONNALITES.md` - Voir toutes les features
   - `TESTS.md` - Comprendre les scénarios de test
   - `STRUCTURE_PROJET.md` - Explorer l'architecture

3. **Explorer le code mobile** :
   - `mobile/src/screens/client/` - Interface client
   - `mobile/src/screens/livreur/` - Interface livreur
   - `mobile/App.js` - Point d'entrée

---

## 🎊 Résumé

**Ce Qui Fonctionne :**
- ✅ Backend complet avec Docker
- ✅ API REST fonctionnelle
- ✅ Base de données avec 5 pharmacies
- ✅ WebSocket temps réel
- ✅ Code mobile React Native prêt

**Ce Qu'il Manque :**
- ❌ Android Studio / SDK
- ❌ Émulateur ou appareil Android

**Temps Total pour Lancer :**
- Avec Android Studio : **~1 heure**
- Avec appareil physique : **~10 minutes**

---

## 📞 Aide Supplémentaire

### Documentation Android Studio
- https://developer.android.com/studio/install

### Documentation React Native
- https://reactnative.dev/docs/environment-setup

### Vidéos Tutoriels
- Chercher "Install Android Studio Windows" sur YouTube
- Chercher "React Native Setup" sur YouTube

---

**🎯 Choix Recommandé : Installer Android Studio**

C'est la solution la plus complète et vous permettra de développer facilement.

**📱 Alternative Rapide : Utiliser votre téléphone Android**

Si vous voulez tester rapidement l'application.

---

**Bon courage ! Une fois Android Studio installé, l'app se lancera automatiquement ! 🚀**








