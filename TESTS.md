# 🧪 Guide de Tests - PharmaLivraison Abidjan

## 🚀 Préparation des Tests

### 1. Démarrer l'environnement

#### Terminal 1 : MongoDB
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

#### Terminal 2 : Backend
```bash
cd backend
npm run dev
```

Le serveur devrait afficher :
```
✅ Connecté à MongoDB
🚀 Serveur démarré sur le port 5000
📍 Environnement: development
```

#### Terminal 3 : Application Mobile
```bash
cd mobile
npm start
```

#### Terminal 4 : Émulateur Android ou iOS
```bash
# Android
npx react-native run-android

# iOS (Mac uniquement)
npx react-native run-ios
```

### 2. Créer les données de test

```bash
cd backend
node src/scripts/seed.js
```

Cela créera automatiquement :
- 3 clients
- 3 livreurs
- 5 pharmacies (dans différentes communes d'Abidjan)
- 3 commandes de démonstration

## 👤 Comptes de Test

### Client
- **Téléphone** : `0707070707`
- **Mot de passe** : `test123`
- **Nom** : Adjoua Koné
- **Localisation** : Cocody Riviera 2

### Livreur
- **Téléphone** : `0708080808`
- **Mot de passe** : `test123`
- **Nom** : Jean Kouassi
- **Véhicule** : Moto (AB-1234-CI)
- **Statut** : Disponible

### Pharmacie
- **Téléphone** : `0702020202`
- **Mot de passe** : `test123`
- **Nom** : Admin Pharmacie

## 📝 Scénarios de Test

### Test 1 : Inscription et Connexion

#### 1.1 Inscription Client
1. Lancer l'app mobile
2. Cliquer sur "Client"
3. Cliquer sur "S'inscrire"
4. Remplir le formulaire :
   - Nom : `Test`
   - Prénom : `Client`
   - Téléphone : `0799999999`
   - Mot de passe : `test123`
   - Confirmer : `test123`
5. Cliquer sur "S'inscrire"
6. ✅ Vérifier l'accès à l'écran principal

#### 1.2 Connexion Client
1. Se déconnecter
2. Choisir "Client"
3. Entrer :
   - Téléphone : `0707070707`
   - Mot de passe : `test123`
4. Cliquer sur "Se connecter"
5. ✅ Vérifier l'accès à l'écran d'accueil

### Test 2 : Commander des Médicaments (Client)

#### 2.1 Voir les Pharmacies
1. Se connecter en tant que client (`0707070707`)
2. ✅ Vérifier que la carte s'affiche
3. ✅ Vérifier la localisation GPS
4. ✅ Vérifier les marqueurs de pharmacies
5. ✅ Vérifier le compteur "X pharmacies ouvertes"

#### 2.2 Créer une Commande Simple
1. Cliquer sur "Commander des médicaments"
2. Remplir :
   - **Description** : `Doliprane 1000mg, Amoxicilline 500mg`
   - **Adresse** : `Cocody Riviera 3, Résidence Eden`
   - **Instructions** : `3ème étage, porte 305`
3. Cliquer sur "Valider la commande"
4. ✅ Vérifier le message de confirmation
5. ✅ Vérifier la création dans l'onglet "Commandes"

#### 2.3 Créer une Commande avec Ordonnance
1. Cliquer sur "Commander des médicaments"
2. Remplir la description et l'adresse
3. Cliquer sur "Prendre en photo ou importer"
4. Choisir "Prendre une photo" ou "Choisir de la galerie"
5. Sélectionner/Prendre une photo
6. ✅ Vérifier l'aperçu de l'image
7. Valider la commande
8. ✅ Vérifier la création

### Test 3 : Accepter et Livrer (Livreur)

#### 3.1 Se Connecter en tant que Livreur
1. Se déconnecter
2. Choisir "Livreur"
3. Se connecter avec `0708080808` / `test123`
4. ✅ Vérifier l'écran des commandes disponibles

#### 3.2 Activer la Disponibilité
1. Activer le switch "Disponible"
2. ✅ Vérifier le changement de statut
3. ✅ Vérifier l'affichage des commandes en attente

#### 3.3 Accepter une Commande
1. Choisir une commande dans la liste
2. Cliquer sur "Accepter cette livraison"
3. Confirmer
4. ✅ Vérifier le message de succès
5. ✅ Vérifier la disparition de la liste "Disponibles"
6. Aller dans l'onglet "Historique"
7. Aller dans "En cours"
8. ✅ Vérifier que la commande apparaît

#### 3.4 Workflow de Livraison Complet

**Étape 1 : Aller à la pharmacie**
1. Cliquer sur "Aller à la pharmacie"
2. ✅ Vérifier le changement de statut

**Étape 2 : Arrivé à la pharmacie**
1. Cliquer sur "Arrivé à la pharmacie"
2. ✅ Vérifier le changement de statut

**Étape 3 : Commencer l'achat**
1. Cliquer sur "Commencer l'achat"
2. ✅ Vérifier le changement de statut

**Étape 4 : Entrer le prix et aller chez le client**
1. Cliquer sur "Entrer le prix et continuer"
2. Entrer le prix (ex: `8500`)
3. Valider
4. ✅ Vérifier que le prix total s'affiche (8500 + 1000 = 9500 FCFA)

**Étape 5 : Marquer comme livré**
1. Cliquer sur "Marquer comme livré"
2. ✅ Vérifier le passage dans "Historique"

### Test 4 : Suivi en tant que Client

#### 4.1 Voir le Livreur Assigné
1. Se reconnecter en tant que client
2. Aller dans "Commandes"
3. ✅ Vérifier l'affichage du nom du livreur
4. ✅ Vérifier le statut de la commande

#### 4.2 Voir les Changements de Statut
1. Créer une nouvelle commande
2. Dans un autre appareil/émulateur, se connecter en tant que livreur
3. Accepter la commande
4. Sur l'appareil client :
5. ✅ Vérifier la mise à jour du statut en temps réel
6. Rafraîchir (pull-to-refresh)
7. ✅ Vérifier les informations à jour

#### 4.3 Voir le Prix Final
1. Après que le livreur ait entré le prix
2. ✅ Vérifier l'affichage du montant total
3. ✅ Vérifier "Montant à collecter : X FCFA"

### Test 5 : Notifications Temps Réel

#### 5.1 Notification Nouvelle Commande (Livreur)
1. Se connecter en tant que livreur (disponible)
2. Sur un autre appareil, créer une commande en tant que client
3. ✅ Vérifier l'alerte "Nouvelle commande !"
4. ✅ Vérifier l'ajout dans la liste

#### 5.2 Notification Livreur Assigné (Client)
1. Se connecter en tant que client
2. Créer une commande
3. Sur un autre appareil, accepter en tant que livreur
4. ✅ Le client devrait voir la mise à jour

### Test 6 : Géolocalisation et Pharmacies

#### 6.1 Recherche de Pharmacies par Proximité
1. Se connecter en tant que client
2. ✅ Vérifier que les pharmacies proches apparaissent
3. ✅ Vérifier que les pharmacies éloignées n'apparaissent pas

#### 6.2 Filtrage des Pharmacies Ouvertes
1. Dans le backend, modifier une pharmacie pour la fermer
2. Rafraîchir l'app
3. ✅ Vérifier qu'elle n'apparaît plus dans la liste

### Test 7 : Profils

#### 7.1 Profil Client
1. Se connecter en tant que client
2. Aller dans "Profil"
3. ✅ Vérifier les informations affichées
4. Tester "Déconnexion"
5. ✅ Vérifier le retour à l'écran de connexion

#### 7.2 Profil Livreur
1. Se connecter en tant que livreur
2. Aller dans "Profil"
3. ✅ Vérifier les statistiques (livraisons, note)
4. ✅ Vérifier les informations du véhicule

## 🐛 Tests de Cas Limites

### Test 8 : Gestion des Erreurs

#### 8.1 Connexion avec Mauvais Identifiants
1. Entrer un téléphone inexistant
2. ✅ Vérifier le message d'erreur

#### 8.2 Commande Sans Description
1. Essayer de créer une commande vide
2. ✅ Vérifier le message d'erreur

#### 8.3 Double Acceptation
1. Accepter une commande en tant que livreur 1
2. Essayer d'accepter la même avec livreur 2
3. ✅ Vérifier le message d'erreur

### Test 9 : Performance

#### 9.1 Rafraîchissement Multiple
1. Faire plusieurs pull-to-refresh rapides
2. ✅ Vérifier qu'il n'y a pas de crash

#### 9.2 Changement Rapide de Statut
1. Changer plusieurs fois le statut rapidement
2. ✅ Vérifier la cohérence des données

## 🔧 Tests API avec Postman/Insomnia

### Endpoints à Tester

#### POST /api/auth/register
```json
{
  "nom": "Test",
  "prenom": "User",
  "telephone": "0712345678",
  "motDePasse": "test123",
  "role": "client"
}
```
✅ Doit retourner un token

#### POST /api/auth/login
```json
{
  "telephone": "0707070707",
  "motDePasse": "test123"
}
```
✅ Doit retourner un token

#### GET /api/pharmacies
✅ Doit retourner la liste des pharmacies

#### GET /api/pharmacies/open/now?latitude=5.3599&longitude=-4.0083
✅ Doit retourner les pharmacies ouvertes près de Cocody

#### POST /api/orders (avec token client)
```json
{
  "description": "Doliprane",
  "adresseLivraison": {
    "adresse": "Test Address",
    "location": {
      "coordinates": [-4.0083, 5.3599]
    }
  }
}
```
✅ Doit créer une commande

## 📊 Checklist Complète

### Authentification
- [ ] Inscription client
- [ ] Inscription livreur
- [ ] Connexion
- [ ] Déconnexion
- [ ] Token persistant

### Client
- [ ] Voir la carte
- [ ] Voir les pharmacies
- [ ] Créer une commande
- [ ] Upload d'ordonnance
- [ ] Voir la liste des commandes
- [ ] Voir le détail d'une commande
- [ ] Voir le livreur assigné
- [ ] Voir le statut en temps réel
- [ ] Pull-to-refresh

### Livreur
- [ ] Toggle disponibilité
- [ ] Voir les commandes disponibles
- [ ] Accepter une commande
- [ ] Workflow de livraison (6 étapes)
- [ ] Entrer le prix
- [ ] Appeler le client
- [ ] Voir l'historique
- [ ] Statistiques profil

### Backend
- [ ] Tous les endpoints répondent
- [ ] Authentification JWT
- [ ] Autorisation par rôle
- [ ] Géolocalisation fonctionne
- [ ] Socket.io connecté

### Temps Réel
- [ ] Notification nouvelle commande
- [ ] Notification livreur assigné
- [ ] Mise à jour statut

## 🎯 Critères de Succès

Une application est prête si :
- ✅ Tous les tests de scénarios passent
- ✅ Aucun crash lors de l'utilisation normale
- ✅ Les notifications temps réel fonctionnent
- ✅ La géolocalisation est précise
- ✅ L'upload d'images fonctionne
- ✅ Le workflow complet fonctionne de bout en bout

## 💡 Conseils de Test

1. **Tester sur plusieurs appareils** : Émulateur + Physique
2. **Tester la connexion** : WiFi vs 4G
3. **Tester les permissions** : GPS, Caméra, Photos
4. **Vider le cache** : Entre les tests
5. **Consulter les logs** :
   - Backend : Terminal
   - Mobile : `npx react-native log-android` ou `log-ios`

---

**Bon testing ! 🚀**








