# 🚀 DÉMARRAGE RAPIDE - PHARMALIVRAISON

> Guide ultra-rapide pour démarrer le projet en 5 minutes

---

## ⚡ INSTALLATION EXPRESS

### 1. Backend API (Terminal 1)

```bash
cd backend-api
npm install
echo PORT=5000 > .env
echo JWT_SECRET=secret-dev-key-123456 >> .env
node src/server.js
```

✅ Backend prêt sur : **http://localhost:5000**

---

### 2. App Client (Terminal 2)

```bash
cd pharma-client
npm install
npm start
```

✅ App Client prête sur : **http://localhost:3000**

---

### 3. App Livreur (Terminal 3)

```bash
cd pharma-livreur
npm install
npm start
```

✅ App Livreur prête sur : **http://localhost:3001**

---

## 🔐 CONNEXION TEST

### Client
- **Téléphone :** `07070707`
- **Mot de passe :** `password123`

### Livreur
- **Téléphone :** `08080808`
- **Mot de passe :** `password123`

---

## 📱 SCÉNARIO DE TEST COMPLET

### Étape 1 : Connexion Client
1. Ouvrir http://localhost:3000
2. Se connecter avec 07070707 / password123
3. ✅ Vous êtes sur la page d'accueil

### Étape 2 : Commander
1. Cliquer sur une pharmacie
2. Ajouter des médicaments
3. Passer la commande
4. ✅ Commande créée

### Étape 3 : Connexion Livreur
1. Ouvrir http://localhost:3001 (nouvel onglet)
2. Se connecter avec 08080808 / password123
3. ✅ Vous êtes sur le dashboard livreur

### Étape 4 : Accepter la livraison
1. Voir la commande disponible
2. Cliquer sur "Accepter"
3. ✅ Livraison en cours

### Étape 5 : Suivi temps réel (Client)
1. Retour sur l'app client
2. Voir la carte avec position du livreur
3. ✅ Tracking GPS en temps réel

---

## 🛠️ COMMANDES UTILES

### Arrêter tous les processus Node.js

**Windows (PowerShell) :**
```powershell
taskkill /F /IM node.exe
```

**Mac/Linux :**
```bash
killall node
```

### Nettoyer les node_modules

```bash
# Backend
cd backend-api
rm -rf node_modules package-lock.json
npm install

# Client
cd pharma-client
rm -rf node_modules package-lock.json
npm install

# Livreur
cd pharma-livreur
rm -rf node_modules package-lock.json
npm install
```

### Vérifier les ports

**Windows :**
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

**Mac/Linux :**
```bash
lsof -i :5000
lsof -i :3000
lsof -i :3001
```

---

## 🐛 PROBLÈMES COURANTS

### ❌ Port déjà utilisé

```bash
# Tuer le processus sur le port 5000
npx kill-port 5000

# Ou changer le port
PORT=5001 node src/server.js
```

### ❌ Module introuvable

```bash
npm install
```

### ❌ Erreur CORS

Vérifier que le backend a bien :
```javascript
app.use(cors());
```

### ❌ 400 Bad Request au login

Vérifier que :
1. Le backend tourne bien sur port 5000
2. Les numéros de téléphone correspondent dans `data.js`
3. Le mot de passe est `password123`

---

## 📊 TESTER LES API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Login Client

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+22507070707\",\"password\":\"password123\"}"
```

### Login Livreur

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+22508080808\",\"password\":\"password123\"}"
```

### Liste des pharmacies

```bash
curl http://localhost:5000/api/pharmacies
```

### Liste des médicaments

```bash
curl http://localhost:5000/api/medications
```

---

## 🎯 POINTS DE VÉRIFICATION

### Backend ✅
- [ ] Serveur démarre sans erreur
- [ ] Health check répond
- [ ] Login fonctionne
- [ ] Socket.IO connecté

### App Client ✅
- [ ] Page login s'affiche
- [ ] Login fonctionne
- [ ] Navigation fonctionne
- [ ] Voir les pharmacies

### App Livreur ✅
- [ ] Page login s'affiche
- [ ] Login fonctionne
- [ ] Dashboard affiche les stats
- [ ] Voir les livraisons disponibles

---

## 🚀 PRÊT POUR LE DÉPLOIEMENT ?

1. ✅ Tout fonctionne en local
2. ✅ Modifier `src/config.js` avec l'URL du backend en prod
3. ✅ Déployer le backend (Heroku/Railway/Render)
4. ✅ Générer les APK avec Capacitor
5. ✅ Distribuer les apps !

Voir **DEPLOIEMENT.md** pour les détails complets.

---

## 📞 AIDE

Si vous bloquez :
1. Vérifier les logs du backend
2. Vérifier la console du navigateur (F12)
3. Relire ce guide
4. Consulter README.md

---

**Bon développement ! 🎉**




