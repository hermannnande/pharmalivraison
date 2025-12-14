# 📂 Structure du Projet - PharmaLivraison Abidjan

```
pharmarcie-delivery/
│
├── 📁 backend/                          # API Backend Node.js
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── cloudinary.js           # Configuration Cloudinary
│   │   │
│   │   ├── 📁 controllers/             # Contrôleurs (logique métier)
│   │   │   ├── auth.controller.js      # Authentification
│   │   │   ├── pharmacy.controller.js  # Gestion pharmacies
│   │   │   └── order.controller.js     # Gestion commandes
│   │   │
│   │   ├── 📁 middleware/              # Middlewares Express
│   │   │   └── auth.middleware.js      # JWT & autorisation
│   │   │
│   │   ├── 📁 models/                  # Modèles MongoDB
│   │   │   ├── User.model.js          # Utilisateurs (clients, livreurs)
│   │   │   ├── Pharmacy.model.js      # Pharmacies
│   │   │   └── Order.model.js         # Commandes
│   │   │
│   │   ├── 📁 routes/                  # Routes API
│   │   │   ├── auth.routes.js         # /api/auth/*
│   │   │   ├── user.routes.js         # /api/users/*
│   │   │   ├── pharmacy.routes.js     # /api/pharmacies/*
│   │   │   ├── order.routes.js        # /api/orders/*
│   │   │   └── delivery.routes.js     # /api/deliveries/*
│   │   │
│   │   └── server.js                   # Point d'entrée serveur
│   │
│   ├── .env.example                    # Variables d'environnement exemple
│   ├── .gitignore
│   └── package.json
│
├── 📁 mobile/                           # Application React Native
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── api.js                  # Configuration API & Socket
│   │   │
│   │   ├── 📁 context/
│   │   │   └── AuthContext.js         # Context d'authentification
│   │   │
│   │   ├── 📁 navigation/
│   │   │   ├── ClientNavigator.js     # Navigation client (tabs)
│   │   │   └── LivreurNavigator.js    # Navigation livreur (tabs)
│   │   │
│   │   ├── 📁 screens/
│   │   │   ├── SplashScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── RoleSelectionScreen.js
│   │   │   │
│   │   │   ├── 📁 client/              # Écrans client
│   │   │   │   ├── HomeScreen.js       # Carte + nouvelle commande
│   │   │   │   ├── OrdersScreen.js     # Liste des commandes
│   │   │   │   └── ProfileScreen.js    # Profil
│   │   │   │
│   │   │   └── 📁 livreur/             # Écrans livreur
│   │   │       ├── LivreurHomeScreen.js      # Commandes disponibles
│   │   │       ├── LivreurOrdersScreen.js    # Gestion livraisons
│   │   │       └── LivreurProfileScreen.js   # Profil
│   │   │
│   │   └── 📁 components/              # Composants réutilisables (à créer)
│   │
│   ├── App.js                          # Point d'entrée application
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   │
│   ├── 📁 android/                     # Configuration Android
│   └── 📁 ios/                         # Configuration iOS
│
├── 📄 README.md                        # Documentation principale
├── 📄 GUIDE_INSTALLATION.md           # Guide d'installation détaillé
├── 📄 FONCTIONNALITES.md              # Liste des fonctionnalités
├── 📄 STRUCTURE_PROJET.md             # Ce fichier
├── 📄 package.json                     # Scripts racine
└── 📄 .gitignore

```

## 📋 Détails des Fichiers Importants

### Backend

#### `server.js`
Point d'entrée du serveur. Configure Express, MongoDB, Socket.io et les routes.

#### `models/User.model.js`
Schéma utilisateur avec :
- Informations personnelles
- Authentification (mot de passe hashé)
- Géolocalisation
- Informations spécifiques livreur

#### `models/Pharmacy.model.js`
Schéma pharmacie avec :
- Informations de contact
- Géolocalisation (GeoJSON)
- Horaires d'ouverture
- Statuts (24h, de garde)

#### `models/Order.model.js`
Schéma commande avec :
- Relations (client, livreur, pharmacie)
- Workflow de statuts
- Prix et paiement
- Historique des actions

#### `controllers/*.controller.js`
Logique métier pour chaque ressource :
- Validation
- Traitement des requêtes
- Réponses

#### `routes/*.routes.js`
Définition des endpoints API avec :
- Méthodes HTTP
- Middlewares d'authentification
- Protection par rôle

#### `middleware/auth.middleware.js`
- Vérification des tokens JWT
- Autorisation par rôle

### Mobile

#### `App.js`
Configuration de l'app :
- Navigation
- Providers (Auth, Paper)
- Routing basé sur l'authentification

#### `context/AuthContext.js`
Gestion de l'état d'authentification :
- Login/Logout
- Stockage du token
- Récupération utilisateur

#### `screens/client/HomeScreen.js`
Écran principal client :
- Carte Google Maps
- Localisation GPS
- Affichage pharmacies
- Formulaire de commande
- Upload d'ordonnance

#### `screens/client/OrdersScreen.js`
Liste des commandes client :
- Filtrage par statut
- Détails des commandes
- Refresh

#### `screens/livreur/LivreurHomeScreen.js`
Commandes disponibles :
- Switch disponibilité
- Notifications temps réel
- Liste des commandes en attente
- Acceptation de commandes

#### `screens/livreur/LivreurOrdersScreen.js`
Gestion des livraisons :
- Workflow complet
- Mise à jour de statut
- Saisie du prix
- Contact client

## 🔄 Flux de Données

### Commande Client → Livraison

```
1. Client crée commande (HomeScreen)
   ↓
2. Backend enregistre (POST /api/orders)
   ↓
3. Socket.io notifie les livreurs
   ↓
4. Livreur accepte (LivreurHomeScreen)
   ↓
5. Backend assigne livreur (PUT /api/orders/:id/assign)
   ↓
6. Socket.io notifie le client
   ↓
7. Livreur suit le workflow (LivreurOrdersScreen)
   ↓
8. Chaque statut est mis à jour via API
   ↓
9. Client voit le suivi en temps réel (OrdersScreen)
   ↓
10. Livraison terminée
```

### Authentification

```
1. User entre identifiants (LoginScreen)
   ↓
2. API vérifie (POST /api/auth/login)
   ↓
3. Token JWT généré
   ↓
4. Token stocké (AsyncStorage)
   ↓
5. Navigation vers l'app appropriée
   ↓
6. Token inclus dans toutes les requêtes (Authorization header)
```

## 🗂️ Organisation du Code

### Backend
- **Modèles** : Définition des schémas MongoDB
- **Contrôleurs** : Logique métier
- **Routes** : Endpoints API
- **Middleware** : Authentification, validation
- **Config** : Configuration services externes

### Mobile
- **Screens** : Pages de l'application
- **Navigation** : Configuration des navigateurs
- **Context** : État global (Auth)
- **Config** : URLs API, constantes

## 📦 Modules NPM Principaux

### Backend
```json
{
  "express": "Serveur HTTP",
  "mongoose": "ODM MongoDB",
  "socket.io": "WebSocket temps réel",
  "jsonwebtoken": "Authentification JWT",
  "bcryptjs": "Hachage mots de passe",
  "cloudinary": "Stockage images",
  "cors": "CORS policy"
}
```

### Mobile
```json
{
  "react-native": "Framework mobile",
  "react-navigation": "Navigation",
  "react-native-maps": "Cartes Google Maps",
  "axios": "Requêtes HTTP",
  "socket.io-client": "WebSocket client",
  "react-native-image-picker": "Upload images",
  "@react-native-async-storage": "Stockage local"
}
```

## 🎨 Conventions de Code

### Nommage
- **Fichiers** : camelCase ou kebab-case
- **Composants React** : PascalCase
- **Fonctions** : camelCase
- **Constantes** : UPPER_SNAKE_CASE
- **Routes API** : kebab-case

### Structure
- Un fichier = Une responsabilité
- Composants réutilisables dans `/components`
- Écrans dans `/screens` organisés par rôle
- Modèles suivent le pattern Mongoose

## 🚀 Points d'Entrée

### Backend
```bash
npm run dev  # Lance le serveur sur port 5000
```

### Mobile
```bash
npm start    # Lance Metro Bundler
npx react-native run-android  # Lance sur Android
npx react-native run-ios       # Lance sur iOS
```

## 📝 Notes

- Le backend doit être lancé avant l'app mobile
- MongoDB doit être en cours d'exécution
- Les variables d'environnement sont dans `.env`
- Socket.io utilise le même port que l'API Express

---

**Cette structure est conçue pour être :**
- ✅ Modulaire
- ✅ Scalable
- ✅ Maintenable
- ✅ Testable
- ✅ Facile à comprendre








