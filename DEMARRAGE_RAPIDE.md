# ⚡ Démarrage Rapide - PharmaLivraison Abidjan

## 🚀 En 5 Minutes !

### Prérequis
- Node.js installé
- MongoDB installé et lancé
- Android Studio ou Xcode

---

## 📝 Étape par Étape

### 1️⃣ Cloner le Projet
```bash
git clone https://github.com/votre-username/pharmalivraison.git
cd pharmarcie-delivery
```

### 2️⃣ Installer les Dépendances

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npm install
```

### 3️⃣ Configurer les Variables d'Environnement

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Éditez `backend/.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pharmalivraison
JWT_SECRET=mon_secret_super_securise_123456
DEFAULT_DELIVERY_FEE=1000
```

**Mobile (.env):**
```bash
cd mobile
# Créer le fichier .env
```

Éditez `mobile/.env` :
```env
API_URL=http://10.0.2.2:5000/api
```

### 4️⃣ Démarrer MongoDB
```bash
# Terminal séparé
mongod
```

### 5️⃣ Créer les Données de Test
```bash
cd backend
npm run seed
```

Vous verrez :
```
✅ Connecté à MongoDB
✅ 3 clients créés
✅ 3 livreurs créés
✅ 5 pharmacies créées
✅ 3 commandes créées

👤 Comptes de test:
📱 CLIENT: 0707070707 / test123
🏍️  LIVREUR: 0708080808 / test123
```

### 6️⃣ Démarrer le Backend
```bash
# Terminal 1
cd backend
npm run dev
```

Attendez :
```
✅ Connecté à MongoDB
🚀 Serveur démarré sur le port 5000
```

### 7️⃣ Démarrer l'App Mobile

**Terminal 2 - Metro Bundler:**
```bash
cd mobile
npm start
```

**Terminal 3 - Android:**
```bash
cd mobile
npx react-native run-android
```

**Ou pour iOS (Mac):**
```bash
cd mobile
npx react-native run-ios
```

### 8️⃣ Tester l'Application

1. **L'app s'ouvre** ✅
2. **Choisir "Client"**
3. **Se connecter avec:**
   - Téléphone: `0707070707`
   - Mot de passe: `test123`
4. **Voir la carte** avec les pharmacies ✅
5. **Commander des médicaments** ✅

---

## 🎯 Commandes Utiles

### Backend
```bash
npm run dev          # Démarrer en mode développement
npm run seed         # Créer données de test
npm start            # Démarrer en mode production
```

### Mobile
```bash
npm start                      # Metro Bundler
npx react-native run-android   # Lancer Android
npx react-native run-ios       # Lancer iOS
npx react-native log-android   # Logs Android
npx react-native log-ios       # Logs iOS

# Nettoyer le cache si problème
npx react-native start --reset-cache
```

---

## 🧪 Test Rapide

### Scénario Client
```bash
1. Login: 0707070707 / test123
2. Cliquer "Commander des médicaments"
3. Remplir:
   - Description: Doliprane
   - Adresse: Cocody Riviera
4. Valider
5. ✅ Voir la commande dans "Commandes"
```

### Scénario Livreur
```bash
1. Login: 0708080808 / test123
2. Activer "Disponible"
3. Voir la commande créée
4. Cliquer "Accepter"
5. ✅ Suivre le workflow
```

---

## 🐛 Problèmes Courants

### Erreur MongoDB
```bash
# Vérifier si MongoDB tourne
# Mac/Linux:
sudo systemctl status mongod

# Windows:
net start MongoDB
```

### Erreur "Metro Bundler"
```bash
cd mobile
npx react-native start --reset-cache
```

### Erreur "Command not found: adb"
```bash
# Vérifier ANDROID_HOME
echo $ANDROID_HOME

# Ajouter dans .bashrc/.zshrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Backend ne démarre pas
```bash
# Vérifier le port 5000
lsof -i :5000
# Ou changer le port dans .env
```

---

## 📱 Comptes de Test

| Rôle | Téléphone | Mot de passe |
|------|-----------|--------------|
| Client | 0707070707 | test123 |
| Livreur | 0708080808 | test123 |
| Pharmacie | 0702020202 | test123 |

---

## 📂 Structure Rapide

```
pharmarcie-delivery/
├── backend/          → API Node.js
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── .env
│
└── mobile/           → App React Native
    ├── src/
    │   ├── screens/
    │   ├── navigation/
    │   └── context/
    └── App.js
```

---

## 🔗 Liens Utiles

- 📖 **Documentation complète** : `README.md`
- 🛠️ **Installation détaillée** : `GUIDE_INSTALLATION.md`
- ✨ **Fonctionnalités** : `FONCTIONNALITES.md`
- 🧪 **Tests** : `TESTS.md`

---

## ✅ Checklist de Démarrage

- [ ] Node.js installé
- [ ] MongoDB installé et lancé
- [ ] Dépendances backend installées
- [ ] Dépendances mobile installées
- [ ] Fichiers .env configurés
- [ ] Données de test créées
- [ ] Backend démarré (port 5000)
- [ ] Metro Bundler lancé
- [ ] App mobile ouverte
- [ ] Test de connexion réussi

---

## 🎉 Félicitations !

Si tout fonctionne, vous avez maintenant :
- ✅ Une API backend fonctionnelle
- ✅ Une app mobile opérationnelle
- ✅ Des données de test
- ✅ Connexion temps réel (Socket.io)
- ✅ Géolocalisation active

**Vous pouvez maintenant tester toutes les fonctionnalités !**

---

## 💡 Prochaines Étapes

1. 📖 Lire la documentation complète
2. 🧪 Tester tous les scénarios
3. 🎨 Personnaliser l'UI
4. 🔧 Configurer Google Maps API
5. ☁️ Configurer Cloudinary
6. 🚀 Déployer en production

---

## 🆘 Besoin d'Aide ?

1. Consulter `GUIDE_INSTALLATION.md` pour plus de détails
2. Consulter `TESTS.md` pour les scénarios de test
3. Vérifier les logs du backend et de l'app

---

**Temps estimé : 5-10 minutes** ⏱️

**Bon développement ! 🚀**








