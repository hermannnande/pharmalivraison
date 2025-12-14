# 🚀 PHARMALIVRAISON - GUIDE DE DÉPLOIEMENT

## 📋 TABLE DES MATIÈRES

1. [Architecture du projet](#architecture)
2. [Prérequis](#prerequis)
3. [Configuration locale](#configuration-locale)
4. [Déploiement Backend](#deploiement-backend)
5. [Déploiement Apps](#deploiement-apps)
6. [Tests](#tests)
7. [Identifiants de test](#identifiants)

---

## 🏗️ ARCHITECTURE DU PROJET

```
pharmarcie delivery/
├── backend-api/           # API Node.js + Express + Socket.IO
│   ├── src/
│   │   ├── server.js     # Serveur principal
│   │   ├── data.js       # Données en mémoire (remplacer par MongoDB en prod)
│   │   └── .env          # Variables d'environnement
│   └── package.json
│
├── pharma-client/        # Application Client (React)
│   ├── src/
│   │   ├── pages/        # Pages de l'app
│   │   ├── services/     # Services API et Socket.IO
│   │   └── config.js     # Configuration
│   ├── public/
│   └── package.json
│
└── pharma-livreur/       # Application Livreur (React)
    ├── src/
    │   ├── pages/        # Pages de l'app
    │   ├── services/     # Services API et Socket.IO
    │   └── config.js     # Configuration
    ├── public/
    └── package.json
```

---

## ✅ PRÉREQUIS

- **Node.js** : v16+ (recommandé v18)
- **npm** : v8+
- **Git** : pour le déploiement
- **Compte Heroku/Railway/Render** : pour le backend
- **Compte Netlify/Vercel** : pour les apps web (optionnel)

---

## 💻 CONFIGURATION LOCALE

### 1. Backend API

```bash
cd backend-api
npm install
```

**Créer le fichier `.env` :**

```env
PORT=5000
JWT_SECRET=votre-secret-jwt-super-securise-123456
NODE_ENV=development
```

**Démarrer le backend :**

```bash
node src/server.js
```

Le backend sera accessible sur : `http://localhost:5000`

### 2. App Client

```bash
cd pharma-client
npm install
npm start
```

L'app sera accessible sur : `http://localhost:3000`

### 3. App Livreur

```bash
cd pharma-livreur
npm install
npm start
```

L'app sera accessible sur : `http://localhost:3001`

---

## 🌐 DÉPLOIEMENT BACKEND

### Option A : Heroku

#### 1. Installer Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### 2. Créer l'application

```bash
cd backend-api
heroku create pharmalivraison-api
```

#### 3. Configurer les variables d'environnement

```bash
heroku config:set JWT_SECRET=votre-secret-jwt-super-securise-123456
heroku config:set NODE_ENV=production
```

#### 4. Créer un Procfile

**Créer `backend-api/Procfile` :**

```
web: node src/server.js
```

#### 5. Déployer

```bash
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a pharmalivraison-api
git push heroku master
```

#### 6. Vérifier le déploiement

```bash
heroku logs --tail
heroku open
```

### Option B : Railway

#### 1. Créer un compte sur Railway.app

#### 2. Nouveau projet

- Cliquer sur "New Project"
- Sélectionner "Deploy from GitHub"
- Connecter votre dépôt

#### 3. Configuration

- Railway détectera automatiquement Node.js
- Ajouter les variables d'environnement :
  - `JWT_SECRET` : votre-secret-jwt
  - `PORT` : 5000

#### 4. Déploiement automatique

Railway déploie automatiquement à chaque push.

### Option C : Render

#### 1. Créer un compte sur Render.com

#### 2. Nouveau Web Service

- Cliquer sur "New +"
- Sélectionner "Web Service"
- Connecter votre dépôt

#### 3. Configuration

```
Build Command: npm install
Start Command: node src/server.js
```

#### 4. Variables d'environnement

Ajouter dans l'onglet "Environment" :
- `JWT_SECRET` : votre-secret-jwt
- `NODE_ENV` : production

---

## 📱 DÉPLOIEMENT APPS

### Option A : APK Android (avec Capacitor)

#### 1. Installer Capacitor

```bash
# Pour l'app Client
cd pharma-client
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init

# Pour l'app Livreur
cd pharma-livreur
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
```

#### 2. Mettre à jour l'URL de l'API

**Dans `src/services/api.js` :**

```javascript
const API_URL = 'https://votre-backend.herokuapp.com/api';
```

#### 3. Build et génération APK

```bash
# Build
npm run build

# Ajouter Android
npx cap add android

# Copier les assets
npx cap copy android

# Ouvrir dans Android Studio
npx cap open android
```

Dans Android Studio :
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- L'APK sera dans `android/app/build/outputs/apk/debug/`

### Option B : Web Hosting (Netlify/Vercel)

#### Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

#### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Build et deploy
vercel --prod
```

---

## 🧪 TESTS

### Test du Backend

```bash
# Test endpoint health
curl http://localhost:5000/api/health

# Test login client
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+22507070707", "password": "password123"}'

# Test login livreur
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+22508080808", "password": "password123"}'
```

### Test des Apps

#### App Client

1. Ouvrir `http://localhost:3000`
2. Se connecter avec :
   - Téléphone : `07070707`
   - Mot de passe : `password123`
3. Vérifier la navigation :
   - Page d'accueil
   - Pharmacies
   - Commandes
   - Suivi temps réel

#### App Livreur

1. Ouvrir `http://localhost:3001`
2. Se connecter avec :
   - Téléphone : `08080808`
   - Mot de passe : `password123`
3. Vérifier la navigation :
   - Dashboard
   - Livraisons
   - Portefeuille
   - Statistiques

---

## 🔐 IDENTIFIANTS DE TEST

### Client

- **Téléphone :** +22507070707 (ou 07070707)
- **Email :** client@test.com
- **Mot de passe :** password123
- **Rôle :** client

### Livreur

- **Téléphone :** +22508080808 (ou 08080808)
- **Email :** livreur@test.com
- **Mot de passe :** password123
- **Rôle :** driver

### Pharmacien

- **Téléphone :** +22509090909 (ou 09090909)
- **Email :** pharmacien@test.com
- **Mot de passe :** password123
- **Rôle :** pharmacist

---

## 📡 ENDPOINTS API

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Pharmacies

- `GET /api/pharmacies` - Liste des pharmacies
- `GET /api/pharmacies/:id` - Détails d'une pharmacie

### Médicaments

- `GET /api/medications` - Liste des médicaments
- `GET /api/medications/pharmacy/:pharmacyId` - Médicaments d'une pharmacie

### Commandes

- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut

### Livraisons

- `GET /api/deliveries` - Liste des livraisons
- `POST /api/deliveries/:id/accept` - Accepter une livraison
- `PUT /api/deliveries/:id/location` - Mettre à jour la position
- `POST /api/deliveries/:id/complete` - Terminer une livraison

### Portefeuille (Livreur)

- `GET /api/wallet/balance` - Solde du portefeuille
- `GET /api/wallet/transactions` - Historique des transactions
- `POST /api/wallet/withdraw` - Demande de retrait

### Notifications

- `GET /api/notifications` - Liste des notifications
- `PUT /api/notifications/:id/read` - Marquer comme lu

---

## 🔄 SOCKET.IO (Temps Réel)

### Événements Client → Serveur

- `user:register` - Enregistrer un utilisateur
- `driver:location` - Mettre à jour la position du livreur
- `message:send` - Envoyer un message

### Événements Serveur → Client

- `location:update` - Mise à jour de position
- `new:order` - Nouvelle commande
- `new:notification` - Nouvelle notification
- `order:*:status` - Changement de statut de commande
- `message:received` - Nouveau message

---

## 🚀 PROCHAINES ÉTAPES (PRODUCTION)

### 1. Base de données

Remplacer `data.js` par MongoDB :

```bash
npm install mongoose
```

**Créer les modèles :**
- User
- Pharmacy
- Medication
- Order
- Delivery
- Transaction

### 2. Sécurité

- Hasher les mots de passe avec `bcrypt`
- Validation des entrées avec `joi`
- Rate limiting avec `express-rate-limit`
- HTTPS obligatoire
- CORS configuré correctement

### 3. Paiement

Intégrer :
- Orange Money API
- MTN Mobile Money API
- Moov Money API
- Stripe (cartes bancaires)

### 4. Notifications

Intégrer :
- Firebase Cloud Messaging (Push)
- Twilio (SMS)
- SendGrid (Email)

### 5. GPS

Intégrer :
- Google Maps API
- Calcul d'itinéraire
- Estimation temps réel

### 6. Monitoring

- Sentry (erreurs)
- LogRocket (session replay)
- Google Analytics (statistiques)

---

## 📞 SUPPORT

Pour toute question :
- **Email :** support@pharmalivraison.ci
- **Téléphone :** +225 XX XX XX XX XX

---

## 📝 LICENCE

© 2024 PharmaLivraison - Tous droits réservés




