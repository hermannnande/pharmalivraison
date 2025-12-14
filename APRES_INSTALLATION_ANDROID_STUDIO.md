# 🚀 Android Studio Installé - Prochaines Étapes

## ✅ Android Studio Installé avec Succès !

Maintenant, configurons tout pour lancer votre app **PharmaLivraison** ! 🎯

---

## 🎯 ÉTAPES RAPIDES (15 Minutes)

### 1️⃣ Créer un Émulateur Android (5 minutes)

**Ouvrez Android Studio :**

1. **Sur l'écran d'accueil**, cliquez sur **"More Actions"** (les 3 points)
2. Cliquez sur **"Virtual Device Manager"** (ou "Device Manager")
3. Cliquez sur **"Create Device"** (bouton avec +)

**Configuration :**

4. **Select Hardware** :
   - Choisissez **"Pixel 5"** 📱
   - Cliquez "**Next**"

5. **System Image** :
   - Choisissez **"Tiramisu"** (Android 13 - API 33)
   - OU **"UpsideDownCake"** (Android 14 - API 34)
   - Si pas téléchargé, cliquez sur **"Download"** à côté
   - Attendez le téléchargement (5-10 min)
   - Cliquez "**Next**"

6. **AVD Name** :
   - Nom : **"Pixel 5 API 33"** (ou laissez par défaut)
   - Cliquez "**Finish**"

7. ✅ **Émulateur créé !**

---

### 2️⃣ Démarrer l'Émulateur (2 minutes)

1. Dans **Device Manager**
2. Trouvez votre émulateur (Pixel 5 API 33)
3. Cliquez sur le bouton **▶️ (Play/Launch)**
4. **Attendez** 1-2 minutes
5. ✅ **L'émulateur Android démarre !**

**Vous verrez un téléphone virtuel s'afficher à l'écran** 📱

---

### 3️⃣ Configurer les Variables d'Environnement (5 minutes)

**Ouvrez PowerShell EN TANT QU'ADMINISTRATEUR :**

*(Clic droit sur PowerShell → "Exécuter en tant qu'administrateur")*

**Copiez-collez ces commandes :**

```powershell
# Définir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Ajouter les outils Android au PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools",
    "$env:LOCALAPPDATA\Android\Sdk\emulator",
    "$env:LOCALAPPDATA\Android\Sdk\tools",
    "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin"
)

foreach ($path in $androidPaths) {
    if ($currentPath -notlike "*$path*") {
        $currentPath += ";$path"
    }
}

[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'User')

Write-Host "✅ Variables configurées avec succès !" -ForegroundColor Green
Write-Host "⚠️  IMPORTANT: Fermez TOUS les PowerShell et rouvrez-en un nouveau !" -ForegroundColor Yellow
```

**⚠️ IMPORTANT : Fermez TOUS les PowerShell ouverts et ouvrez-en un NOUVEAU !**

---

### 4️⃣ Vérifier la Configuration

**Dans un NOUVEAU PowerShell (après avoir fermé et rouvert) :**

```powershell
adb devices
```

**Vous devriez voir :**
```
List of devices attached
emulator-5554   device
```

✅ **Parfait ! Tout est prêt !**

---

### 5️⃣ Lancer l'Application (3-5 minutes)

**Dans PowerShell, copiez-collez :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

**Attendez la compilation... ⏱️**

**Vous verrez :**
```
info Installing the app...
> Task :app:installDebug
BUILD SUCCESSFUL in 3m 45s
✅ Launching app...
```

**Sur l'émulateur :**
- 📱 L'app **PharmaLivraison** s'installe
- 🎨 L'app s'ouvre automatiquement
- ✅ **Écran de sélection de rôle apparaît !**

---

## 🎯 Premier Test

### Sur l'Émulateur :

**Test Client :**
1. Cliquez sur **"Client"** (bouton vert)
2. Cliquez sur "Se connecter"
3. Entrez :
   - Téléphone : `0707070707`
   - Mot de passe : `test123`
4. ✅ **Vous verrez la carte avec les 5 pharmacies d'Abidjan !** 🗺️

**Commander des Médicaments :**
1. Cliquez sur **"Commander des médicaments"**
2. Remplissez :
   - Description : `Doliprane, Efferalgan`
   - Adresse : `Cocody Riviera 3`
3. (Optionnel) Prenez une photo
4. Validez
5. ✅ **Commande créée !**

---

## 📊 Configuration Actuelle

| Service | Statut | URL |
|---------|--------|-----|
| **Backend API** | ✅ Running | http://localhost:5000 |
| **MongoDB** | ✅ Running | Port 27017 |
| **Dashboard Admin** | ✅ Running | http://localhost:3000 |
| **Émulateur** | ⏳ À lancer | Android Studio |
| **App Mobile** | ⏳ À installer | Build en cours |

---

## 🔐 Comptes de Test

| Rôle | Téléphone | Mot de passe |
|------|-----------|--------------|
| **Client** | 0707070707 | test123 |
| **Livreur** | 0708080808 | test123 |
| **Admin** | 0700000000 | admin123 |

---

## 💡 Astuces Émulateur

### Raccourcis Utiles

- **Ctrl + M** : Menu développeur React Native
- **R + R** : Recharger l'app
- **Ctrl + Shift + V** : Coller du texte
- **F2** : Rotation de l'écran

### Menu Développeur

Dans l'app, appuyez **Ctrl + M** pour :
- Reload : Recharger l'app
- Debug : Ouvrir le debugger
- Show Perf Monitor : Voir les performances

---

## 🐛 Problèmes Courants

### ❌ "adb: command not found"

**Solution :**
1. Vérifiez que vous avez fermé et rouvert PowerShell après config
2. Vérifiez : `echo $env:ANDROID_HOME`
3. Devrait afficher : `C:\Users\nande\AppData\Local\Android\Sdk`

### ❌ "No devices found"

**Solution :**
1. Vérifiez que l'émulateur est bien lancé
2. Dans Android Studio → Device Manager → ▶️ Launch
3. Attendez que l'émulateur soit complètement démarré
4. Relancez `npx react-native run-android`

### ❌ Build échoue

**Solution :**
```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

---

## 📱 Fonctionnalités à Tester

### Client :
- [ ] Carte des pharmacies avec GPS
- [ ] Commander des médicaments
- [ ] Upload photo d'ordonnance
- [ ] Voir historique commandes
- [ ] Suivi en temps réel

### Livreur :
- [ ] Toggle disponibilité
- [ ] Recevoir notifications
- [ ] Accepter commande
- [ ] Workflow complet (6 étapes)
- [ ] Entrer prix médicaments

---

## 🎊 Checklist Complète

**Avant de lancer l'app :**

- [ ] ✅ Android Studio installé
- [ ] ✅ Émulateur créé (Pixel 5 API 33)
- [ ] ✅ Émulateur lancé et démarré
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ PowerShell fermé et rouvert
- [ ] ✅ `adb devices` affiche l'émulateur
- [ ] ✅ Backend Docker en cours (`docker-compose ps`)
- [ ] ✅ Fichier `.env` configuré

**Tout est OK ? Lancez : `npx react-native run-android` ! 🚀**

---

## 🎯 Résumé des Commandes

### 1. Vérifier l'Émulateur
```powershell
adb devices
```

### 2. Lancer l'App
```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

### 3. Voir les Logs
```powershell
npx react-native log-android
```

---

## 🎉 DANS 15 MINUTES

Vous aurez :
- ✅ Émulateur Android fonctionnel
- ✅ App PharmaLivraison installée
- ✅ Carte des pharmacies visible
- ✅ Possibilité de tester tout le workflow
- ✅ Application complète et opérationnelle !

---

**🚀 Suivez les étapes ci-dessus et dans 15 minutes, votre app sera lancée ! 📱**

**💪 Vous y êtes presque ! Courage !**








