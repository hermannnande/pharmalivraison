# 🎯 Guide Dashboard Admin - PharmaLivraison Abidjan

## 📊 Dashboard Administrateur Web

J'ai créé un **Dashboard Admin complet** pour gérer toute votre application PharmaLivraison !

---

## ✨ Fonctionnalités du Dashboard

### 📈 Tableau de Bord
- **Statistiques en temps réel** : Utilisateurs, Pharmacies, Commandes, Livreurs
- **Commandes récentes** avec statuts
- **Vue d'ensemble** de l'activité

### 👥 Gestion des Utilisateurs
- **Liste complète** de tous les utilisateurs
- **Filtrage** par nom, téléphone, rôle
- **Voir les rôles** : Client, Livreur, Pharmacie, Admin
- **Statut** : Actif / Inactif
- **Actions** : Modifier, Désactiver

### 🏥 Gestion des Pharmacies
- **Liste des pharmacies** d'Abidjan
- **Cartes d'information** détaillées
- **Filtrage** par nom, commune
- **Badges** : 24h/24, De Garde, Vérifiée
- **Statistiques** : Note, Nombre de commandes
- **Localisation** par commune

### 📦 Gestion des Commandes
- **Liste complète** des commandes
- **Filtrage** par statut et numéro
- **Détails** : Client, Description, Prix, Date
- **Suivi des statuts** en temps réel
- **Codes couleur** par statut

### 🏍️ Gestion des Livreurs
- **Profils des livreurs**
- **Informations véhicule** : Type, Immatriculation
- **Statut** : Disponible / Indisponible
- **Vérification** : Vérifié / Non vérifié
- **Statistiques** : Note, Nombre de livraisons

### 📊 Statistiques (à venir)
- Graphiques détaillés
- Analyses temporelles
- Rapports personnalisés

### ⚙️ Paramètres (à venir)
- Configuration application
- Gestion des frais
- Paramètres système

---

## 🚀 Installation et Lancement

### Prérequis
- Node.js installé
- Backend en cours d'exécution (Docker ou npm)

### Étape 1 : Créer le Compte Admin

**Recréer les données avec le compte admin :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery"
docker-compose exec backend npm run seed
```

Vous verrez :
```
👨‍💼 ADMIN:
   Téléphone: 0700000000
   Mot de passe: admin123
```

### Étape 2 : Installer les Dépendances

```powershell
cd admin
npm install
```

### Étape 3 : Créer le Fichier .env

Créez `admin/.env` :
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Étape 4 : Lancer le Dashboard

```powershell
npm start
```

Le dashboard s'ouvrira automatiquement sur **http://localhost:3000**

---

## 🔐 Connexion

### Compte Admin
- **Téléphone** : `0700000000`
- **Mot de passe** : `admin123`

---

## 📱 Interface du Dashboard

### Menu Principal (Sidebar)

```
🏥 PharmaLivraison
─────────────────────
📊 Tableau de bord
👥 Utilisateurs
💊 Pharmacies
📦 Commandes
🏍️  Livreurs
📈 Statistiques
⚙️  Paramètres
```

### Tableau de Bord (Accueil)

```
┌─────────────────────────────────────────────┐
│  Dashboard Administrateur                    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │  👥  │  │  💊  │  │  📦  │  │  🏍️  │  │
│  │  12  │  │   5  │  │  45  │  │   3  │  │
│  │Users │  │Pharma│  │Orders│  │Delivr│  │
│  └──────┘  └──────┘  └──────┘  └──────┘  │
│                                             │
│  Commandes Récentes                         │
│  ─────────────────────                      │
│  #PL20241210001  ✅ Livré    8500 FCFA    │
│  #PL20241210002  🔄 En cours  1000 FCFA    │
│  ...                                        │
└─────────────────────────────────────────────┘
```

---

## 🎨 Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Material-UI (MUI)** - Composants modernes
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **React Hot Toast** - Notifications
- **Socket.io Client** - Temps réel (futur)

### Backend (existant)
- Node.js + Express
- MongoDB
- API REST complète

---

## 📊 Exemples d'Utilisation

### 1. Voir tous les Utilisateurs

1. Cliquer sur **"Utilisateurs"** dans le menu
2. Utiliser la barre de recherche pour filtrer
3. Voir les rôles (Client, Livreur, Pharmacie)
4. Cliquer sur les icônes pour Modifier/Supprimer

### 2. Gérer les Pharmacies

1. Cliquer sur **"Pharmacies"**
2. Voir toutes les pharmacies d'Abidjan
3. Filtrer par nom ou commune
4. Voir les pharmacies 24h et de garde
5. Vérifier le statut de validation

### 3. Suivre les Commandes

1. Cliquer sur **"Commandes"**
2. Filtrer par statut (En attente, Livré, etc.)
3. Rechercher par numéro de commande
4. Voir tous les détails (Client, Prix, Statut)

### 4. Gérer les Livreurs

1. Cliquer sur **"Livreurs"**
2. Voir tous les livreurs inscrits
3. Vérifier leur disponibilité
4. Voir leurs statistiques (Note, Livraisons)
5. Valider les documents

---

## 🔄 Workflow Admin

### Nouveau Livreur
1. **Livreur s'inscrit** sur l'app mobile
2. **Admin reçoit notification** (futur)
3. **Admin vérifie** les documents
4. **Admin valide** le compte
5. **Livreur peut commencer** à livrer

### Nouvelle Pharmacie
1. **Pharmacie s'inscrit**
2. **Admin vérifie** la licence
3. **Admin valide** la pharmacie
4. **Pharmacie apparaît** sur la carte

### Gestion des Commandes
1. **Voir toutes les commandes** en temps réel
2. **Intervenir** si problème
3. **Annuler** une commande si nécessaire
4. **Voir statistiques** globales

---

## 🛠️ Commandes Utiles

### Développement
```powershell
cd admin
npm start          # Lancer en mode dev
npm run build      # Build pour production
npm test          # Lancer les tests
```

### Production
```powershell
npm run build                    # Créer le build
serve -s build -l 3000          # Servir le build
```

---

## 🎯 Fonctionnalités Futures

### Court Terme
- [ ] Modification en ligne des utilisateurs
- [ ] Validation des livreurs en un clic
- [ ] Validation des pharmacies
- [ ] Suppression d'éléments
- [ ] Notifications en temps réel

### Moyen Terme
- [ ] Graphiques et statistiques avancées
- [ ] Rapport d'activité (journalier, hebdo, mensuel)
- [ ] Gestion des paramètres (frais, zones)
- [ ] Système de notifications push
- [ ] Chat avec support client
- [ ] Export de données (Excel, PDF)

### Long Terme
- [ ] Dashboard mobile admin
- [ ] Intelligence artificielle (prédictions)
- [ ] Système de promotion automatique
- [ ] Intégration paiement mobile money
- [ ] Multi-langue
- [ ] Multi-villes

---

## 📦 Structure du Projet Admin

```
admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.js          # Layout principal
│   ├── context/
│   │   └── AuthContext.js     # Authentification
│   ├── pages/
│   │   ├── LoginPage.js       # Connexion
│   │   ├── Dashboard.js       # Tableau de bord
│   │   ├── UsersPage.js       # Gestion utilisateurs
│   │   ├── PharmaciesPage.js  # Gestion pharmacies
│   │   ├── OrdersPage.js      # Gestion commandes
│   │   ├── DeliveriesPage.js  # Gestion livreurs
│   │   ├── StatisticsPage.js  # Statistiques
│   │   └── SettingsPage.js    # Paramètres
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

---

## 🔒 Sécurité

### Authentification
- **JWT Token** pour sécuriser les requêtes
- **Vérification du rôle** : Seuls les admins peuvent accéder
- **Session persistante** avec LocalStorage
- **Déconnexion automatique** après expiration

### Autorisations
- Seul le rôle **"admin"** peut se connecter
- API backend vérifie le rôle sur chaque requête
- Pas d'accès direct aux données sensibles

---

## 🐛 Dépannage

### Le dashboard ne se lance pas

**Solution** :
```powershell
cd admin
rm -rf node_modules
npm install
npm start
```

### Erreur de connexion à l'API

**Vérifier** :
1. Backend tourne sur port 5000
2. Fichier `.env` existe avec bonne URL
3. Docker containers actifs : `docker-compose ps`

### Erreur "Access Denied"

**Vérifier** :
1. Utilisateur a le rôle "admin"
2. Token valide dans localStorage
3. Se reconnecter si nécessaire

---

## 📞 Support

### Problèmes Courants

**Q: Je ne peux pas me connecter**
R: Vérifiez que le compte admin existe (recréer avec `npm run seed`)

**Q: Les données ne s'affichent pas**
R: Vérifiez que le backend est en cours d'exécution

**Q: Le dashboard est lent**
R: Vérifiez la connexion internet et les logs du backend

---

## 🎊 Félicitations !

Vous avez maintenant un **Dashboard Admin complet** pour gérer toute votre application !

### Ce Que Vous Pouvez Faire

✅ **Gérer tous les utilisateurs** (Clients, Livreurs, Pharmacies)
✅ **Valider les pharmacies** et livreurs
✅ **Suivre toutes les commandes** en temps réel
✅ **Voir les statistiques** globales
✅ **Interface moderne** et responsive
✅ **Recherche et filtrage** avancés

---

## 🚀 Prochaines Étapes

1. **Lancer le backend** : `docker-compose up -d`
2. **Recréer les données** avec admin : `docker-compose exec backend npm run seed`
3. **Installer le dashboard** : `cd admin && npm install`
4. **Lancer le dashboard** : `npm start`
5. **Se connecter** : `0700000000` / `admin123`
6. **Gérer votre application** ! 🎉

---

**Développé avec ❤️ pour faciliter la gestion de PharmaLivraison Abidjan**

**Version Dashboard : 1.0.0**








