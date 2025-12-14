# 🎯 GUIDE VISUEL - DÉPLOIEMENT EN 3 ÉTAPES

> Déployer PharmaLivraison en ligne en 30 minutes (GRATUIT)

---

## 🚀 VUE D'ENSEMBLE

```
┌─────────────┐
│   GITHUB    │  ← Code source (gratuit)
└──────┬──────┘
       │
       ├────────────────┬────────────────┐
       │                │                │
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   RAILWAY   │  │   VERCEL    │  │   VERCEL    │
│   Backend   │  │   Client    │  │   Livreur   │
│     API     │  │     App     │  │     App     │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## ✅ ÉTAPE 1 : GITHUB (5 minutes)

### 📸 Screenshot attendu : Page GitHub avec votre code

### Actions à faire :

```powershell
# Dans PowerShell, à la racine du projet

# 1. Lancer le script automatique
.\DEPLOY-GITHUB.ps1

# OU manuellement :

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "Initial commit - PharmaLivraison"

# Ajouter le remote (REMPLACER votre-username)
git remote add origin https://github.com/votre-username/pharmalivraison.git

# Pousser le code
git branch -M main
git push -u origin main
```

### ✅ Vérification :
- Aller sur `https://github.com/votre-username/pharmalivraison`
- Voir tous vos fichiers

---

## ✅ ÉTAPE 2 : RAILWAY - Backend (10 minutes)

### 📋 Checklist :

#### 1. Créer un compte
- [ ] Aller sur https://railway.app
- [ ] Cliquer sur "Start a New Project"
- [ ] Se connecter avec **GitHub**

#### 2. Créer le projet
- [ ] Cliquer sur "New Project"
- [ ] Sélectionner "Deploy from GitHub repo"
- [ ] Autoriser Railway à accéder à GitHub
- [ ] Sélectionner `pharmalivraison`

#### 3. Configurer le service
- [ ] Railway détecte automatiquement Node.js
- [ ] Aller dans **Settings**
- [ ] **Root Directory** : `backend-api`
- [ ] **Start Command** : `node src/server.js`

#### 4. Variables d'environnement
- [ ] Aller dans l'onglet **Variables**
- [ ] Ajouter :
  ```
  PORT=5000
  JWT_SECRET=votre-secret-production-super-securise-123456
  NODE_ENV=production
  ```

#### 5. Générer un domaine
- [ ] Onglet **Settings**
- [ ] Section **Networking**
- [ ] Cliquer sur **Generate Domain**
- [ ] **📋 COPIER L'URL** (exemple : `pharmalivraison-production.up.railway.app`)

#### 6. Tester l'API
```bash
# Remplacer par votre URL Railway
curl https://votre-app.up.railway.app/api/health
```

### ✅ Vérification :
- L'API répond avec un JSON
- Vous voyez les statistiques (users, pharmacies, etc.)

---

## ✅ ÉTAPE 3A : VERCEL - App Client (7 minutes)

### 📋 Checklist :

#### 1. Mettre à jour la configuration

**Modifier `pharma-client/src/config.js` :**

Ligne 10-13, changer :
```javascript
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://votre-app.up.railway.app/api', // ← VOTRE URL RAILWAY
};
```

#### 2. Pousser sur GitHub
```powershell
cd pharma-client
git add .
git commit -m "Update API URL for production"
git push
```

#### 3. Déployer sur Vercel
- [ ] Aller sur https://vercel.com
- [ ] Cliquer sur "Sign Up"
- [ ] Se connecter avec **GitHub**
- [ ] Cliquer sur "Add New..." → "Project"
- [ ] Sélectionner `pharmalivraison`
- [ ] Configurer :
  - **Framework Preset** : Create React App
  - **Root Directory** : `pharma-client`
  - **Build Command** : `npm run build`
  - **Output Directory** : `build`
- [ ] Cliquer sur **Deploy**

⏳ **Attendre 2-3 minutes...**

#### 4. Récupérer l'URL
- [ ] Copier l'URL générée (ex: `pharmalivraison-client.vercel.app`)

### ✅ Vérification :
- Ouvrir l'URL
- Voir la page de login
- Tester connexion : **07070707** / **password123**

---

## ✅ ÉTAPE 3B : VERCEL - App Livreur (7 minutes)

### 📋 Checklist :

#### 1. Mettre à jour la configuration

**Modifier `pharma-livreur/src/config.js` :**

Ligne 10-13, changer :
```javascript
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://votre-app.up.railway.app/api', // ← VOTRE URL RAILWAY
};
```

#### 2. Pousser sur GitHub
```powershell
cd pharma-livreur
git add .
git commit -m "Update API URL for production"
git push
```

#### 3. Déployer sur Vercel
- [ ] Retour sur https://vercel.com/dashboard
- [ ] Cliquer sur "Add New..." → "Project"
- [ ] Sélectionner `pharmalivraison` à nouveau
- [ ] Configurer :
  - **Framework Preset** : Create React App
  - **Root Directory** : `pharma-livreur`
  - **Build Command** : `npm run build`
  - **Output Directory** : `build`
- [ ] Cliquer sur **Deploy**

⏳ **Attendre 2-3 minutes...**

#### 4. Récupérer l'URL
- [ ] Copier l'URL générée (ex: `pharmalivraison-livreur.vercel.app`)

### ✅ Vérification :
- Ouvrir l'URL
- Voir la page de login
- Tester connexion : **08080808** / **password123**

---

## 🎉 FÉLICITATIONS ! PROJET DÉPLOYÉ !

### 📋 Vos URLs finales :

```
┌────────────────────────────────────────────────────┐
│  BACKEND API                                       │
│  https://votre-app.up.railway.app/api            │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  APP CLIENT                                        │
│  https://pharmalivraison-client.vercel.app        │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  APP LIVREUR                                       │
│  https://pharmalivraison-livreur.vercel.app       │
└────────────────────────────────────────────────────┘
```

---

## 🧪 TEST COMPLET

### Scénario de test en production :

#### 1. Client commande
```
1. Ouvrir https://pharmalivraison-client.vercel.app
2. Login : 07070707 / password123
3. Choisir une pharmacie
4. Ajouter des médicaments
5. Passer commande
✅ Commande créée
```

#### 2. Livreur accepte
```
1. Ouvrir https://pharmalivraison-livreur.vercel.app
2. Login : 08080808 / password123
3. Voir la commande disponible
4. Cliquer "Accepter"
✅ Livraison en cours
```

#### 3. Suivi temps réel
```
1. Retour sur l'app client
2. Aller dans "Mes commandes"
3. Cliquer sur la commande en cours
✅ Voir la position du livreur en temps réel
```

---

## 🔄 MISES À JOUR

### Workflow de mise à jour :

```powershell
# 1. Faire vos modifications dans le code
# ...

# 2. Commit et push
git add .
git commit -m "Description des modifications"
git push

# 3. Déploiement automatique !
# ⏳ Railway redéploie le backend (2-3 min)
# ⏳ Vercel redéploie les apps (2-3 min)
# ✅ Apps mises à jour automatiquement !
```

---

## 📊 MONITORING

### Railway Dashboard
```
https://railway.app/dashboard
→ Voir votre projet
→ Logs en temps réel
→ CPU / Memory usage
→ Requêtes
```

### Vercel Dashboard
```
https://vercel.com/dashboard
→ Voir vos projets
→ Analytics
→ Build logs
→ Performance
```

---

## 🐛 PROBLÈMES COURANTS

### ❌ Backend ne démarre pas sur Railway
**Solution :**
1. Vérifier les logs dans Railway
2. S'assurer que `Root Directory = backend-api`
3. Vérifier que `JWT_SECRET` est défini

### ❌ App blanche sur Vercel
**Solution :**
1. Vérifier les logs de build
2. S'assurer que `Root Directory` est correct
3. Vérifier que l'URL API est bien configurée dans `config.js`

### ❌ Erreur 404 sur les routes
**Solution :**
- Vérifier que `vercel.json` existe dans le dossier de l'app
- Vérifier la configuration des routes

### ❌ Erreur CORS
**Solution :**
Dans `backend-api/src/server.js`, remplacer :
```javascript
app.use(cors());
```
par :
```javascript
app.use(cors({
  origin: [
    'https://pharmalivraison-client.vercel.app',
    'https://pharmalivraison-livreur.vercel.app'
  ],
  credentials: true
}));
```

---

## 📱 PARTAGER AVEC VOS UTILISATEURS

### QR Codes (optionnel)

Générez des QR codes pour vos URLs :
- https://www.qr-code-generator.com

### Message à envoyer :

```
🏥 PharmaLivraison est maintenant en ligne !

📱 App Client :
https://pharmalivraison-client.vercel.app

🚚 App Livreur :
https://pharmalivraison-livreur.vercel.app

🔐 Identifiants de test :
Client : 07070707 / password123
Livreur : 08080808 / password123
```

---

## 🎯 PROCHAINES ÉTAPES

- [ ] Tester tous les scénarios
- [ ] Inviter des beta-testeurs
- [ ] Configurer un domaine personnalisé
- [ ] Ajouter Google Analytics
- [ ] Migrer vers MongoDB
- [ ] Intégrer les paiements Mobile Money
- [ ] Lancer commercialement ! 🚀

---

**Temps total : ~30 minutes**
**Coût : 0 FCFA (100% GRATUIT)**

**Bon déploiement ! 🎉**




