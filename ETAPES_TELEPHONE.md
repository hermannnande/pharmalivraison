# 📱 ÉTAPES POUR TESTER SUR VOTRE TÉLÉPHONE

## ✅ Configuration Automatique Terminée !

J'ai configuré l'application avec votre IP : **192.168.1.5**

---

## 🚀 Étapes à Suivre MAINTENANT

### 1️⃣ Sur Votre Téléphone Android

#### A. Activer le Mode Développeur
1. **Ouvrir Paramètres**
2. **Aller dans** "À propos du téléphone"
3. **Taper 7 fois** sur "Numéro de build"
4. ✅ Message : "Vous êtes développeur"

#### B. Activer le Débogage USB
1. **Retour aux Paramètres**
2. **Chercher** "Options pour développeurs"
3. **Activer** "Débogage USB"

#### C. Connecter le Téléphone
1. **Brancher** le câble USB à l'ordinateur
2. **Sur le téléphone** : Autoriser le débogage USB
3. **Cocher** "Toujours autoriser"
4. ✅ Téléphone connecté

---

### 2️⃣ Sur Votre Ordinateur (PowerShell)

#### Vérifier la Connexion du Téléphone

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native doctor
```

#### Lancer l'Application sur le Téléphone

```powershell
npx react-native run-android
```

**Attendez 3-5 minutes** que l'app compile et s'installe !

---

## 📋 Checklist Rapide

**Avant de lancer l'app :**

- [ ] ✅ Backend Docker en cours : `docker-compose ps`
- [ ] 📱 Mode développeur activé sur le téléphone
- [ ] 🔌 Débogage USB activé
- [ ] 🔗 Téléphone branché et autorisé
- [ ] 🌐 Téléphone et PC sur le même WiFi
- [ ] ⚙️ Fichier `.env` configuré avec IP `192.168.1.5` ✅

---

## 🎯 Une Fois l'App Installée

### Tester en tant que Client

1. **L'app s'ouvre** automatiquement
2. **Choisir** "Client" (bouton vert)
3. **Cliquer** "Se connecter"
4. **Entrer** :
   - Téléphone : `0707070707`
   - Mot de passe : `test123`
5. ✅ **Voir** la carte avec les 5 pharmacies !

### Commander des Médicaments

1. **Cliquer** "Commander des médicaments"
2. **Remplir** :
   - Description : `Doliprane 1000mg, Efferalgan`
   - Adresse : Votre adresse
3. **(Optionnel)** Prendre photo d'ordonnance
4. **Valider**
5. ✅ Commande créée !

---

## 🏍️ Tester en tant que Livreur

1. **Se déconnecter**
2. **Choisir** "Livreur" (bouton orange)
3. **Se connecter** :
   - Téléphone : `0708080808`
   - Mot de passe : `test123`
4. **Activer** le toggle "Disponible"
5. ✅ Voir les commandes disponibles
6. **Accepter** une commande

---

## 🔧 Commandes Utiles

### Voir les Logs en Temps Réel
```powershell
npx react-native log-android
```

### Recompiler et Réinstaller
```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

### En cas de Problème
```powershell
# Nettoyer le cache
npx react-native start --reset-cache

# Nouveau terminal
npx react-native run-android
```

---

## 🐛 Problèmes Courants

### ❌ "No devices found"

**Solutions :**
1. Vérifier que le téléphone est bien connecté
2. Sur le téléphone :
   - Dérouler la barre de notifications
   - Cliquer sur "Chargement USB"
   - Choisir "Transfert de fichiers"
3. Réessayer

### ❌ "Unable to connect to development server"

**Solutions :**
1. Vérifier que le backend tourne : `docker-compose ps`
2. Vérifier que téléphone et PC sont sur le même WiFi
3. Secouer le téléphone → Dev Settings → Change Bundle Location
4. Entrer : `192.168.1.5:8081`

### ❌ "Network request failed"

**Solutions :**
1. Vérifier l'IP dans le fichier `.env` : **192.168.1.5**
2. Vérifier que le backend est accessible :
   - Ouvrir un navigateur sur le téléphone
   - Aller sur `http://192.168.1.5:5000`
   - Vous devriez voir la réponse de l'API
3. Désactiver temporairement le pare-feu Windows

---

## ⏱️ Temps Estimé

| Étape | Temps |
|-------|-------|
| Activer mode développeur | 1 min |
| Activer débogage USB | 1 min |
| Connecter téléphone | 1 min |
| Compilation et installation | 3-5 min |
| **TOTAL** | **6-8 minutes** |

---

## 🎊 Après l'Installation

Une fois l'app installée sur votre téléphone :

✅ **Elle reste installée** - Pas besoin de réinstaller
✅ **Fonctionne hors ligne** - Sauf connexion au backend
✅ **Mises à jour rapides** - Juste relancer `run-android`

---

## 📸 Fonctionnalités à Tester

### En tant que Client :

- [ ] Voir la carte des pharmacies
- [ ] Commander des médicaments
- [ ] Prendre photo d'ordonnance
- [ ] Voir l'historique des commandes
- [ ] Suivre une commande en temps réel

### En tant que Livreur :

- [ ] Activer/Désactiver disponibilité
- [ ] Voir les commandes disponibles
- [ ] Accepter une commande
- [ ] Suivre le workflow complet
- [ ] Entrer le prix des médicaments
- [ ] Marquer comme livré

---

## 🌐 Configuration Actuelle

```
Backend API : http://192.168.1.5:5000
API Endpoint : http://192.168.1.5:5000/api
Socket.io : http://192.168.1.5:5000
```

**Votre téléphone se connectera directement à votre ordinateur !**

---

## 💡 Astuce Pro

Une fois l'app installée, pour recharger rapidement :

1. **Secouer le téléphone** 📱
2. **Cliquer** "Reload"

Ou appuyer **deux fois sur R** dans le terminal Metro Bundler !

---

## 🚀 Commande Finale

**Copiez-collez dans PowerShell :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

**Puis attendez que l'app s'installe sur votre téléphone ! 🎉**

---

**Temps Total : 8 minutes maximum ⏱️**

**Difficulté : Facile 🟢**

**Let's go ! 🚀**








