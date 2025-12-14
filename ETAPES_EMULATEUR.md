# 📱 Créer l'Émulateur Android - Étapes Visuelles

## 🎯 Vous êtes sur l'écran d'accueil Android Studio

### Étape 1 : Accéder au Device Manager

**Cliquez sur "More Actions"** (en bas de la fenêtre)

Dans le menu qui s'ouvre, cherchez et cliquez sur :
- **"Virtual Device Manager"** ou **"Device Manager"** ou **"AVD Manager"**

---

## 📱 Créer l'Émulateur

### Étape 2 : Create Device

Dans la fenêtre Device Manager qui s'ouvre :

1. Cliquez sur **"Create Device"** (ou le bouton **+**)

---

### Étape 3 : Select Hardware

**Choisissez un appareil :**

1. Dans la catégorie **"Phone"**
2. Sélectionnez **"Pixel 5"** ou **"Pixel 6"**
3. Cliquez **"Next"**

---

### Étape 4 : System Image (Télécharger Android)

**Choisissez la version Android :**

Vous verrez une liste comme :
- **Tiramisu** (Android 13 - API 33) ⭐ RECOMMANDÉ
- **UpsideDownCake** (Android 14 - API 34)
- S (Android 12)

**Si une icône de téléchargement apparaît à côté :**
1. Cliquez sur **"Download"** (icône ⬇️)
2. Attendez le téléchargement (~1.5 GB, 5-10 minutes)
3. Le téléchargement se fait en arrière-plan

**Une fois téléchargé :**
- Sélectionnez **"Tiramisu"** (Android 13)
- Cliquez **"Next"**

---

### Étape 5 : Verify Configuration

**Paramètres finaux :**

- **AVD Name** : `Pixel_5_API_33` (ou laissez par défaut)
- **Startup orientation** : Portrait
- Laissez les autres options par défaut

Cliquez **"Finish"**

---

### Étape 6 : Lancer l'Émulateur

**Dans Device Manager :**

Vous verrez maintenant votre émulateur dans la liste :
```
Pixel 5 API 33
```

**Cliquez sur le bouton ▶️ (Play/Launch)** à droite

**Attendez 1-2 minutes...**

📱 **Un téléphone Android virtuel apparaît !**

---

## ✅ Émulateur Prêt !

Une fois l'émulateur démarré, vous verrez :
- 📱 Un écran de téléphone Android
- 🏠 L'écran d'accueil Android
- ✅ C'est prêt pour l'installation de votre app !

---

## 🚀 ENSUITE : Configurer les Variables

**Ouvrez PowerShell EN TANT QU'ADMINISTRATEUR** :

```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidPaths = @("$env:LOCALAPPDATA\Android\Sdk\platform-tools", "$env:LOCALAPPDATA\Android\Sdk\emulator")
foreach ($path in $androidPaths) { if ($currentPath -notlike "*$path*") { $currentPath += ";$path" } }
[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'User')
Write-Host "✅ Variables configurées !" -ForegroundColor Green
```

**Fermez et rouvrez PowerShell !**

---

## 🚀 ENFIN : Lancer l'App

**Dans un NOUVEAU PowerShell :**

```powershell
# Vérifier que l'émulateur est détecté
adb devices

# Lancer l'application
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

---

## ⏱️ Timeline

1. **Maintenant** : Créer émulateur (5 min + téléchargement)
2. **+10 min** : Lancer émulateur (2 min)
3. **+12 min** : Config variables (3 min)
4. **+15 min** : Lancer app (5 min)
5. **+20 min** : ✅ **APP FONCTIONNELLE !** 🎉

---

**🎯 ACTION : Cliquez sur "More Actions" → "Device Manager" ! 📱**








