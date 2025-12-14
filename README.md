# 🏥 PHARMALIVRAISON - Plateforme de Livraison de Médicaments

> Application complète de livraison de médicaments en Côte d'Ivoire avec système de tracking GPS en temps réel.

---

## 📱 APPLICATIONS

### 1. **App Client** 
Permet aux utilisateurs de :
- 🔍 Rechercher des pharmacies à proximité
- 💊 Commander des médicaments
- 📸 Scanner une ordonnance (IA)
- 📍 Suivre la livraison en temps réel
- 💳 Payer (Mobile Money, Cash)
- 🚨 Mode urgence avec pharmacies de garde

### 2. **App Livreur**
Permet aux livreurs de :
- 📦 Accepter des livraisons
- 🗺️ Navigation GPS optimisée
- 💰 Portefeuille intégré avec suivi des gains
- 📊 Statistiques détaillées
- 🎯 Système de niveaux (Bronze, Silver, Gold, Platinum)
- 💬 Chat avec client/pharmacie
- 🆘 Bouton SOS d'urgence

### 3. **Backend API**
- 🔐 Authentification JWT
- 📡 Socket.IO pour temps réel
- 🗄️ Base de données (mémoire → MongoDB en prod)
- 📮 Notifications intelligentes
- 💸 Gestion des transactions

---

## 🎯 FONCTIONNALITÉS PRINCIPALES

### ✅ Implémentées

#### Client
- [x] Authentification (téléphone/email)
- [x] Recherche de pharmacies
- [x] Commande de médicaments
- [x] Suivi temps réel PRO (GPS, ETA, photo livreur, plaque moto)
- [x] Scan ordonnance IA
- [x] Mode urgence (pharmacies de garde, SAMU)
- [x] Notifications intelligentes
- [x] Historique des commandes
- [x] Paiement Mobile Money / Cash

#### Livreur
- [x] Authentification
- [x] Dashboard avec statistiques
- [x] Acceptation de livraisons
- [x] Navigation GPS avancée
- [x] Portefeuille intégré
- [x] Historique des gains
- [x] Système de niveaux et badges
- [x] Chat client/pharmacie
- [x] Bouton SOS urgence
- [x] Mode disponibilité
- [x] Demande de retrait

#### Backend
- [x] API REST complète
- [x] Authentication JWT
- [x] Socket.IO temps réel
- [x] Gestion des utilisateurs
- [x] Gestion des pharmacies
- [x] Gestion des médicaments
- [x] Gestion des commandes
- [x] Gestion des livraisons
- [x] Système de portefeuille
- [x] Notifications

### 🔜 À Venir (Production)

- [ ] Base de données MongoDB
- [ ] Paiement Orange Money / MTN / Moov
- [ ] Notifications push Firebase
- [ ] SMS Twilio
- [ ] Email SendGrid
- [ ] Google Maps API complet
- [ ] Reconnaissance IA ordonnances
- [ ] Assurance livraison
- [ ] Programme de fidélité
- [ ] App Pharmacien complète

---

## 🚀 DÉMARRAGE RAPIDE

### Prérequis

- Node.js v16+
- npm v8+

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/pharmalivraison.git
cd pharmalivraison

# 2. Backend API
cd backend-api
npm install
echo "PORT=5000
JWT_SECRET=secret-dev-key" > .env
node src/server.js

# 3. App Client (nouveau terminal)
cd pharma-client
npm install
npm start

# 4. App Livreur (nouveau terminal)
cd pharma-livreur
npm install
npm start
```

### Accès aux applications

- **Backend API :** http://localhost:5000
- **App Client :** http://localhost:3000
- **App Livreur :** http://localhost:3001

### Identifiants de test

**Client :**
- Téléphone : `07070707`
- Mot de passe : `password123`

**Livreur :**
- Téléphone : `08080808`
- Mot de passe : `password123`

---

## 📂 STRUCTURE DU PROJET

```
pharmarcie delivery/
│
├── backend-api/              # Backend Node.js + Express + Socket.IO
│   ├── src/
│   │   ├── server.js        # Serveur principal
│   │   ├── data.js          # Données en mémoire
│   │   └── .env             # Variables d'environnement
│   └── package.json
│
├── pharma-client/           # Application Client React
│   ├── public/
│   ├── src/
│   │   ├── pages/          # Pages de l'application
│   │   │   ├── Login.js
│   │   │   ├── ClientHomeUltra.js
│   │   │   ├── LiveTrackingPro.js
│   │   │   ├── EmergencyMode.js
│   │   │   └── ...
│   │   ├── services/       # Services API et Socket.IO
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── config.js       # Configuration
│   │   └── App.js
│   └── package.json
│
├── pharma-livreur/          # Application Livreur React
│   ├── public/
│   ├── src/
│   │   ├── pages/          # Pages de l'application
│   │   │   ├── Login.js
│   │   │   ├── LivreurDashboard.js
│   │   │   ├── DriverDelivery.js
│   │   │   ├── Wallet.js
│   │   │   ├── Statistics.js
│   │   │   └── ...
│   │   ├── services/       # Services API et Socket.IO
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── config.js       # Configuration
│   │   └── App.js
│   └── package.json
│
├── DEPLOIEMENT.md           # Guide de déploiement
└── README.md                # Ce fichier
```

---

## 🛠️ TECHNOLOGIES UTILISÉES

### Frontend

- **React 18** - Framework UI
- **React Router DOM 6** - Navigation
- **Axios** - Requêtes HTTP
- **Socket.IO Client** - Temps réel
- **Capacitor** - Build mobile (APK)
- **CSS3** - Styling moderne

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - Temps réel
- **JWT** - Authentification
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Variables d'environnement

### À intégrer (Production)

- **MongoDB** - Base de données
- **Mongoose** - ODM MongoDB
- **bcrypt** - Hashage mots de passe
- **joi** - Validation
- **Firebase** - Notifications push
- **Twilio** - SMS
- **SendGrid** - Email
- **Google Maps API** - Cartographie
- **Stripe/Mobile Money** - Paiement

---

## 📡 API ENDPOINTS

### Authentification
```
POST   /api/auth/login       # Connexion
POST   /api/auth/register    # Inscription
```

### Pharmacies
```
GET    /api/pharmacies       # Liste des pharmacies
GET    /api/pharmacies/:id   # Détails d'une pharmacie
```

### Médicaments
```
GET    /api/medications                      # Liste des médicaments
GET    /api/medications/pharmacy/:pharmacyId # Médicaments d'une pharmacie
```

### Commandes
```
GET    /api/orders              # Liste des commandes
POST   /api/orders              # Créer une commande
GET    /api/orders/:id          # Détails d'une commande
PUT    /api/orders/:id/status   # Mettre à jour le statut
```

### Livraisons
```
GET    /api/deliveries                # Liste des livraisons
POST   /api/deliveries/:id/accept     # Accepter une livraison
PUT    /api/deliveries/:id/location   # Mettre à jour la position
POST   /api/deliveries/:id/complete   # Terminer une livraison
```

### Portefeuille
```
GET    /api/wallet/balance       # Solde
GET    /api/wallet/transactions  # Historique
POST   /api/wallet/withdraw      # Demande de retrait
```

### Notifications
```
GET    /api/notifications        # Liste des notifications
PUT    /api/notifications/:id/read # Marquer comme lu
```

---

## 🔐 SÉCURITÉ

### Actuellement (Développement)

- ✅ JWT pour l'authentification
- ✅ CORS configuré
- ✅ Validation basique des entrées
- ⚠️ Mots de passe en clair (à changer)

### À implémenter (Production)

- 🔒 Hashage bcrypt des mots de passe
- 🔒 HTTPS obligatoire
- 🔒 Rate limiting
- 🔒 Validation stricte avec joi
- 🔒 Sanitization des entrées
- 🔒 Helmet.js pour les headers
- 🔒 CSRF protection

---

## 📊 DONNÉES DE TEST

### Utilisateurs

**Client Jean Kouassi**
- ID : 1
- Téléphone : +22507070707
- Email : client@test.com
- Rôle : client

**Livreur Mohamed Diallo**
- ID : 2
- Téléphone : +22508080808
- Email : livreur@test.com
- Rôle : driver
- Rating : 4.9 ⭐
- Livraisons : 342
- Niveau : Gold 🥇

**Pharmacienne Aïcha Traoré**
- ID : 3
- Téléphone : +22509090909
- Email : pharmacien@test.com
- Rôle : pharmacist

### Pharmacies

1. **Pharmacie Cocody Angré**
   - Ouverte : Oui
   - Rating : 4.7 ⭐
   - Frais livraison : 1000 FCFA

2. **Pharmacie de la Paix**
   - 24h/24 : Oui
   - De garde : Oui
   - Rating : 4.9 ⭐
   - Frais livraison : 1500 FCFA

3. **Pharmacie Abobo Gare**
   - Ouverte : Oui
   - Rating : 4.5 ⭐
   - Frais livraison : 2000 FCFA

---

## 🎨 DESIGN

### Principes

- ✨ Interface moderne et fluide
- 🎯 UX intuitive
- 📱 Mobile-first
- 🎨 Couleurs professionnelles (pas de dégradés)
- ⚡ Animations subtiles
- 🌈 Glassmorphism pour les cartes

### Palette de couleurs

**App Client**
- Primaire : #0066CC (Bleu médical)
- Secondaire : #00C853 (Vert succès)
- Accent : #FF6B6B (Rouge urgence)

**App Livreur**
- Primaire : #2563EB (Bleu professionnel)
- Secondaire : #10B981 (Vert gains)
- Accent : #F59E0B (Or badges)

---

## 📱 GÉNÉRATION APK

### Avec Capacitor

```bash
# 1. Build de l'app
npm run build

# 2. Ajouter Android
npx cap add android

# 3. Copier les assets
npx cap copy android

# 4. Ouvrir dans Android Studio
npx cap open android

# 5. Build APK dans Android Studio
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

L'APK sera dans : `android/app/build/outputs/apk/debug/`

---

## 🚀 DÉPLOIEMENT

Voir le fichier [DEPLOIEMENT.md](./DEPLOIEMENT.md) pour les instructions complètes de déploiement sur :

- **Backend :** Heroku / Railway / Render
- **Apps :** Netlify / Vercel / APK

---

## 🧪 TESTS

### Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Login client
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+22507070707", "password": "password123"}'
```

### Apps

1. **App Client**
   - Connexion → 07070707 / password123
   - Recherche pharmacies
   - Création commande
   - Suivi temps réel

2. **App Livreur**
   - Connexion → 08080808 / password123
   - Accepter livraison
   - Navigation
   - Portefeuille

---

## 📈 ROADMAP

### Phase 1 : MVP ✅ (Terminé)
- [x] Backend API complet
- [x] App Client avec fonctionnalités principales
- [x] App Livreur avec portefeuille
- [x] Socket.IO temps réel
- [x] APK Android

### Phase 2 : Production 🔄 (En cours)
- [ ] MongoDB
- [ ] Paiement Mobile Money
- [ ] Notifications push
- [ ] Google Maps API
- [ ] Déploiement serveurs

### Phase 3 : Expansion 🔮 (À venir)
- [ ] App Pharmacien complète
- [ ] Reconnaissance IA ordonnances
- [ ] Programme de fidélité
- [ ] Analytics avancés
- [ ] App iOS

---

## 👥 ÉQUIPE

Développé avec ❤️ en Côte d'Ivoire

---

## 📞 CONTACT

- **Email :** support@pharmalivraison.ci
- **Téléphone :** +225 XX XX XX XX XX
- **Site web :** www.pharmalivraison.ci (à venir)

---

## 📝 LICENCE

© 2024 PharmaLivraison - Tous droits réservés

---

## 🙏 REMERCIEMENTS

Merci d'utiliser PharmaLivraison ! 🚀




