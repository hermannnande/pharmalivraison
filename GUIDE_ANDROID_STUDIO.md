# 🎯 Guide Complet - Android Studio Pour PharmaLivraison

## 📥 Installation d'Android Studio (30 Minutes)

### Étape 1 : Télécharger Android Studio

**Lien de téléchargement :**
👉 https://developer.android.com/studio

1. Cliquez sur **"Download Android Studio"**
2. Acceptez les conditions
3. Téléchargez le fichier (environ 1 GB)

---

### Étape 2 : Installer Android Studio

1. **Double-cliquez** sur le fichier téléchargé
2. **Suivez l'assistant d'installation** :
   - ✅ Cliquez "Next"
   - ✅ Laissez tout par défaut
   - ✅ Cliquez "Install"
3. **Attendez** l'installation (5-10 minutes)
4. **Cliquez** "Finish"

---

### Étape 3 : Configuration Initiale

**Au premier lancement :**

1. **Welcome Screen** → Cliquez "Next"

2. **Install Type** → Choisissez **"Standard"** → Next

3. **Select UI Theme** → Choisissez votre thème → Next

4. **Verify Settings** → Cliquez "Finish"

5. **Téléchargement des Composants** (10-15 minutes)
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - ⏳ Attendez que tout se télécharge (~2-3 GB)

6. **Cliquez** "Finish" quand c'est terminé

---

### Étape 4 : Créer un Émulateur Android

1. **Sur l'écran d'accueil** Android Studio
2. Cliquez sur **"More Actions"** (3 points)
3. Cliquez sur **"Virtual Device Manager"**
4. Cliquez sur **"Create Device"**

**Configuration de l'émulateur :**

5. **Select Hardware** :
   - Choisissez **"Pixel 5"** ou **"Pixel 6"**
   - Cliquez "Next"

6. **System Image** :
   - Choisissez **"Tiramisu"** (Android 13) ou **"UpsideDownCake"** (Android 14)
   - Cliquez sur **"Download"** à côté du nom
   - Attendez le téléchargement (5 minutes)
   - Cliquez "Next"

7. **Verify Configuration** :
   - Nom : Pixel 5 API 33 (ou autre)
   - Cliquez "Finish"

8. **L'émulateur est créé !** ✅

---

### Étape 5 : Démarrer l'Émulateur

1. Dans **Virtual Device Manager**
2. Cliquez sur le bouton **▶️ Play** à côté de votre émulateur
3. **Attendez** que l'émulateur démarre (1-2 minutes)
4. ✅ Vous voyez un téléphone Android virtuel !

---

### Étape 6 : Configurer les Variables d'Environnement

**Ouvrez PowerShell EN TANT QU'ADMINISTRATEUR :**

```powershell
# Définir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Ajouter au PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools",
    "$env:LOCALAPPDATA\Android\Sdk\emulator",
    "$env:LOCALAPPDATA\Android\Sdk\tools",
    "$env:LOCALAPPDATA\Android\Sdk\tools\bin"
)

foreach ($path in $androidPaths) {
    if ($currentPath -notlike "*$path*") {
        $currentPath = "$currentPath;$path"
    }
}

[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'User')

Write-Host "✅ Variables d'environnement configurées !" -ForegroundColor Green
Write-Host "⚠️  Fermez et rouvrez PowerShell" -ForegroundColor Yellow
```

**Fermez TOUS les PowerShell et rouvrez-en un nouveau !**

---

### Étape 7 : Vérifier l'Installation

**Dans un NOUVEAU PowerShell :**

```powershell
adb devices
```

**Vous devriez voir :**
```
List of devices attached
emulator-5554   device
```

✅ **C'est bon ! Android Studio est prêt !**

---

## 🚀 LANCER L'APPLICATION

### Configuration pour Émulateur

**Modifiez `mobile/.env` :**

```env
# Pour émulateur Android
API_URL=http://10.0.2.2:5000/api
SOCKET_URL=http://10.0.2.2:5000
GOOGLE_MAPS_API_KEY=AIzaSyDemoKey123456789
```

> **Note** : `10.0.2.2` est l'adresse localhost pour l'émulateur

---

### Lancer l'App sur l'Émulateur

**Ouvrez PowerShell et copiez-collez :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

**Attendez 3-5 minutes !**

---

## 🎯 Résultat Final

**Sur l'émulateur, vous verrez :**

1. 📱 L'app **PharmaLivraison** s'installe
2. 🎨 L'app s'ouvre automatiquement
3. ✅ Écran de sélection de rôle apparaît
4. 🎉 **C'est prêt !**

---

## 🧪 Test Complet

### Test 1 : Client

```
1. Choisir "Client" (vert)
2. Se connecter : 0707070707 / test123
3. ✅ Voir la carte avec 5 pharmacies
4. Commander des médicaments
5. Upload ordonnance (avec photos émulateur)
```

### Test 2 : Livreur

```
1. Se déconnecter
2. Choisir "Livreur" (orange)
3. Se connecter : 0708080808 / test123
4. Activer "Disponible"
5. Accepter une commande
6. Suivre le workflow
```

---

## ⏱️ Temps Total

| Étape | Temps |
|-------|-------|
| Téléchargement Android Studio | 5-10 min |
| Installation | 10 min |
| Configuration initiale | 15 min |
| Téléchargement SDK | 10-15 min |
| Créer émulateur | 5 min |
| Démarrer émulateur | 2 min |
| **Lancer l'app** | **3-5 min** |
| **TOTAL** | **~1 heure** |

---

## 💡 Astuces

### Raccourcis Émulateur

- **Ctrl + M** : Ouvrir le menu dev
- **R + R** : Reload l'app
- **Ctrl + Shift + V** : Paste dans l'émulateur
- **F2** : Rotation écran

### Commandes Utiles

```powershell
# Voir les appareils
adb devices

# Voir les logs
npx react-native log-android

# Nettoyer et rebuild
cd mobile/android
./gradlew clean
cd ../..
npx react-native run-android
```

---

## 🐛 Problèmes Courants

### "ANDROID_HOME not set"

**Solution :**
1. Vérifier la variable : `echo $env:ANDROID_HOME`
2. Devrait afficher : `C:\Users\nande\AppData\Local\Android\Sdk`
3. Si vide, refaire l'étape 6

### "SDK location not found"

**Solution :**
```powershell
# Vérifier que le SDK existe
Test-Path "$env:LOCALAPPDATA\Android\Sdk"
```

### "Emulator not found"

**Solution :**
1. Ouvrir Android Studio
2. Tools → Device Manager
3. Démarrer l'émulateur manuellement
4. Relancer `npx react-native run-android`

---

## 📦 Fichiers à Télécharger

### Android Studio
- **Site** : https://developer.android.com/studio
- **Taille** : ~1 GB
- **Gratuit** : Oui

### Composants SDK (automatique)
- **Android SDK** : ~500 MB
- **System Image** : ~1.5 GB
- **Build Tools** : ~100 MB

**Total à télécharger : ~3 GB**

---

## 🎯 Après l'Installation

Une fois Android Studio configuré, vous pourrez :

- ✅ Développer facilement
- ✅ Déboguer l'app
- ✅ Tester sur plusieurs appareils virtuels
- ✅ Modifier le code en direct (Hot Reload)
- ✅ Voir les logs et erreurs

---

## 🎊 Récapitulatif

### Installation Android Studio

**Durée** : ~1 heure (la première fois)
**Difficulté** : Moyenne 🟡
**Avantage** : Environnement complet de développement

### Lancer sur Téléphone

**Durée** : ~10 minutes
**Difficulté** : Facile 🟢
**Avantage** : Test immédiat sur vrai appareil

---

## 📚 Ressources

- **Documentation Android Studio** : https://developer.android.com/studio/intro
- **Documentation React Native** : https://reactnative.dev/docs/environment-setup
- **Tutoriel vidéo** : Cherchez "Android Studio Setup Windows" sur YouTube

---

## 🚀 PROCHAINES ÉTAPES

### Maintenant :
1. **Télécharger** Android Studio
2. **Installer** et configurer
3. **Créer** un émulateur

### Dans 1 Heure :
4. **Lancer** l'émulateur
5. **Compiler** l'app
6. **Tester** sur l'émulateur !

---

**Bon courage ! Dans 1 heure vous aurez tout configuré ! 💪**

**📥 Commencez par télécharger : https://developer.android.com/studio 🚀**








