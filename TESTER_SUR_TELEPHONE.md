# 📱 Guide : Tester l'App sur Votre Téléphone Android

## 🚀 Configuration Rapide (10 Minutes)

### Étape 1 : Activer le Mode Développeur sur Votre Téléphone

1. **Ouvrez Paramètres** sur votre téléphone
2. **Allez dans** "À propos du téléphone" ou "Informations système"
3. **Trouvez** "Numéro de build" ou "Version de build"
4. **Tapez 7 fois** sur "Numéro de build"
5. ✅ Message : "Vous êtes maintenant développeur !"

---

### Étape 2 : Activer le Débogage USB

1. **Retournez** dans les Paramètres principaux
2. **Cherchez** "Options pour développeurs" ou "Developer Options"
3. **Activez** "Options pour développeurs" (toggle en haut)
4. **Activez** "Débogage USB"
5. ✅ Le débogage USB est maintenant actif

---

### Étape 3 : Connecter Votre Téléphone à l'Ordinateur

1. **Branchez** votre téléphone avec un câble USB
2. **Sur votre téléphone**, une popup apparaît :
   - "Autoriser le débogage USB ?"
   - **Cochez** "Toujours autoriser depuis cet ordinateur"
   - **Cliquez** "OK" ou "Autoriser"
3. ✅ Votre téléphone est maintenant connecté

---

### Étape 4 : Vérifier la Connexion

**Ouvrez PowerShell et tapez :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android --deviceId
```

Vous devriez voir votre appareil listé !

---

### Étape 5 : Trouver l'IP de Votre Ordinateur

**Dans PowerShell, tapez :**

```powershell
ipconfig
```

**Cherchez** "Adresse IPv4" dans la section WiFi ou Ethernet :
```
Adresse IPv4. . . . . . . . : 192.168.1.100
```

**Notez cette adresse !** (exemple : `192.168.1.100`)

---

### Étape 6 : Modifier la Configuration Mobile

**Modifiez le fichier `mobile/.env` :**

```env
# Remplacez 10.0.2.2 par l'IP de votre ordinateur
API_URL=http://192.168.1.100:5000/api
SOCKET_URL=http://192.168.1.100:5000
GOOGLE_MAPS_API_KEY=AIzaSyDemoKey123456789
```

⚠️ **Remplacez `192.168.1.100` par VOTRE IP trouvée à l'étape 5 !**

---

### Étape 7 : Lancer l'Application sur Votre Téléphone

**Dans PowerShell :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

**Attendez 2-5 minutes** que l'application :
- ✅ Compile
- ✅ S'installe sur votre téléphone
- ✅ S'ouvre automatiquement

---

## 🎯 Test de l'Application

### Une Fois l'App Ouverte sur Votre Téléphone

1. **Vous verrez** l'écran de sélection de rôle :
   - 👤 Client (vert)
   - 🏍️ Livreur (orange)
   - 💊 Pharmacie (turquoise)

2. **Testez en tant que Client** :
   - Cliquez sur "Client"
   - Cliquez sur "Se connecter"
   - Téléphone : `0707070707`
   - Mot de passe : `test123`
   - ✅ Vous verrez la carte avec les pharmacies !

3. **Testez la Commande** :
   - Cliquez sur "Commander des médicaments"
   - Remplissez le formulaire
   - Prenez une photo d'ordonnance (facultatif)
   - Validez !

---

## 🏍️ Tester en tant que Livreur

1. **Déconnectez-vous**
2. **Choisissez "Livreur"**
3. **Connectez-vous** :
   - Téléphone : `0708080808`
   - Mot de passe : `test123`
4. **Activez** "Disponible"
5. **Acceptez** une commande
6. **Suivez** le workflow de livraison

---

## 🐛 Problèmes Possibles

### ❌ "adb: command not found"

**Solution :** Installez ADB minimal :

```powershell
# Télécharger ADB Platform Tools
# https://developer.android.com/studio/releases/platform-tools
```

Ou utilisez :
```powershell
npx @react-native-community/cli run-android
```

### ❌ "No devices found"

**Solutions :**
1. Vérifiez que le câble USB fonctionne (essayez un autre)
2. Sur le téléphone, changez le mode USB :
   - Déroulez la barre de notifications
   - Cliquez sur "Chargement USB"
   - Sélectionnez "Transfert de fichiers" ou "MTP"
3. Réautorisez le débogage USB

### ❌ "Unable to connect to backend"

**Solution :** Vérifiez que :
1. Backend Docker tourne : `docker-compose ps`
2. Votre téléphone et PC sont sur le **même WiFi**
3. L'IP dans `.env` est correcte
4. Le pare-feu Windows autorise les connexions sur le port 5000

### ❌ L'app se ferme immédiatement

**Solution :**
```powershell
cd mobile
npx react-native start --reset-cache
# Nouveau terminal
npx react-native run-android
```

---

## 🔥 Rechargement à Chaud (Hot Reload)

Une fois l'app installée, **secouez votre téléphone** pour ouvrir le menu développeur :

- **Reload** : Recharger l'app
- **Debug** : Ouvrir le debugger
- **Enable Hot Reloading** : Activer le rechargement auto

Ou appuyez deux fois sur **R** pour recharger !

---

## 📊 Vérifier que Tout Fonctionne

### Checklist Complète

- [ ] Mode développeur activé
- [ ] Débogage USB activé
- [ ] Téléphone connecté et autorisé
- [ ] Téléphone et PC sur même WiFi
- [ ] IP de l'ordinateur trouvée
- [ ] Fichier `.env` modifié avec la bonne IP
- [ ] Backend Docker en cours d'exécution
- [ ] Application compilée et installée
- [ ] Application s'ouvre sur le téléphone
- [ ] Connexion réussie (client ou livreur)
- [ ] Carte des pharmacies visible

---

## 🎯 Workflow de Test Complet

### Test 1 : Client Commande un Médicament (Votre Téléphone)

1. Ouvrir l'app
2. Choisir "Client"
3. Se connecter : `0707070707` / `test123`
4. Voir les 5 pharmacies sur la carte
5. Cliquer "Commander des médicaments"
6. Remplir :
   - Description : `Doliprane, Efferalgan`
   - Adresse : Votre adresse réelle
7. (Optionnel) Prendre photo d'ordonnance
8. Valider
9. ✅ Voir la commande dans "Mes commandes"

### Test 2 : Livreur Accepte la Commande (Deuxième Téléphone ou Émulateur)

1. Ouvrir l'app sur un autre appareil
2. Choisir "Livreur"
3. Se connecter : `0708080808` / `test123`
4. Activer "Disponible"
5. Voir la nouvelle commande
6. Accepter
7. Suivre le workflow :
   - Aller à la pharmacie
   - Arrivé à la pharmacie
   - Commencer l'achat
   - Entrer le prix : `8500`
   - Aller chez le client
   - Marquer comme livré
8. ✅ Sur le téléphone client, voir les mises à jour en temps réel !

---

## 💡 Astuces

### Pour Développer Plus Vite

1. **Activer Fast Refresh** :
   - Secouez le téléphone
   - Enable Fast Refresh
   - Les modifications s'appliquent automatiquement !

2. **Voir les Logs** :
   ```powershell
   npx react-native log-android
   ```

3. **Nettoyer et Rebuild** :
   ```powershell
   cd mobile/android
   ./gradlew clean
   cd ../..
   npx react-native run-android
   ```

---

## 🌐 Configuration Réseau

### Votre Téléphone et PC Doivent Être sur le Même Réseau WiFi

**Vérification :**
- PC : `ipconfig` → Adresse IPv4 commence par `192.168.x.x`
- Téléphone : Paramètres → WiFi → Même réseau que le PC

**Si vous utilisez un câble et pas de WiFi commun :**
Utilisez le reverse proxy d'adb :
```powershell
adb reverse tcp:5000 tcp:5000
```

Puis dans `.env` :
```env
API_URL=http://localhost:5000/api
```

---

## 📸 Captures d'Écran

### Prenez des Screenshots de votre App !

**Sur Android** :
- Bouton Power + Volume Bas

Les captures seront dans la galerie de votre téléphone.

---

## 🎊 Félicitations !

Une fois que tout fonctionne, vous aurez :

- ✅ Application installée sur votre téléphone
- ✅ Connexion au backend
- ✅ Carte des pharmacies visible
- ✅ Commande de médicaments fonctionnelle
- ✅ Upload de photos
- ✅ Navigation fluide

**Vous pouvez montrer l'app à vos amis, investisseurs, clients ! 📱🚀**

---

## 🔄 Pour les Prochaines Sessions

Une fois l'app installée, vous n'avez plus besoin de la réinstaller !

**Pour tester à nouveau :**
1. Démarrer le backend : `docker-compose up -d`
2. Ouvrir l'app sur votre téléphone
3. C'est tout ! 🎉

**Pour mettre à jour l'app après modifications :**
```powershell
cd mobile
npx react-native run-android
```

---

**Temps Total Estimé : 10-15 minutes ⏱️**

**Difficulté : Facile 🟢**

**Bonne chance ! 🚀**








