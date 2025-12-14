# 🚀 DÉPLOIEMENT GRATUIT - PHARMALIVRAISON

> Guide complet pour déployer sur **GitHub + Railway + Vercel** (100% GRATUIT)

---

## 📋 PLAN DE DÉPLOIEMENT

### 1️⃣ GitHub - Hébergement du code source
### 2️⃣ Railway - Backend API (Gratuit)
### 3️⃣ Vercel - Apps Client & Livreur (Gratuit)

---

## 🌟 ÉTAPE 1 : GITHUB (Code Source)

### A. Créer un compte GitHub

1. Aller sur https://github.com
2. Créer un compte (gratuit)
3. Confirmer l'email

### B. Créer un nouveau repository

1. Cliquer sur le bouton "+" en haut à droite
2. Sélectionner "New repository"
3. Nom : `pharmalivraison`
4. Description : `Application de livraison de médicaments en Côte d'Ivoire`
5. **Cocher "Private"** (pour protéger votre code)
6. Cliquer sur "Create repository"

### C. Pousser le code sur GitHub

**Dans PowerShell, à la racine du projet :**

```powershell
# Initialiser Git (si pas déjà fait)
git init

# Créer un fichier .gitignore
@"
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.production

# Build
build/
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Android/iOS
android/
ios/
*.apk
*.ipa
"@ | Out-File -FilePath .gitignore -Encoding UTF8

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - PharmaLivraison"

# Lier au repository GitHub (REMPLACER 'votre-username' par votre nom d'utilisateur)
git remote add origin https://github.com/votre-username/pharmalivraison.git

# Pousser le code
git branch -M main
git push -u origin main
```

✅ **Code sur GitHub !**

---

## 🚂 ÉTAPE 2 : RAILWAY (Backend API)

### A. Créer un compte Railway

1. Aller sur https://railway.app
2. Cliquer sur "Start a New Project"
3. Se connecter avec **GitHub** (recommandé)

### B. Déployer le Backend

1. Cliquer sur "New Project"
2. Sélectionner "Deploy from GitHub repo"
3. Autoriser Railway à accéder à vos repos
4. Sélectionner `pharmalivraison`
5. Railway détecte automatiquement Node.js

### C. Configurer le Backend

#### 1. Sélectionner le dossier backend

Dans les settings du projet Railway :
- **Root Directory** : `backend-api`
- **Build Command** : `npm install`
- **Start Command** : `node src/server.js`

#### 2. Ajouter les variables d'environnement

Dans l'onglet "Variables" :

```
PORT=5000
JWT_SECRET=votre-secret-jwt-production-super-securise-123456789
NODE_ENV=production
```

#### 3. Générer un domaine public

1. Onglet "Settings"
2. Section "Networking"
3. Cliquer sur "Generate Domain"
4. Copier l'URL générée (exemple : `pharmalivraison-production.up.railway.app`)

✅ **Backend déployé sur Railway !**

**URL de l'API :** `https://votre-app.up.railway.app/api`

### D. Tester l'API

```bash
curl https://votre-app.up.railway.app/api/health
```

---

## ⚡ ÉTAPE 3 : VERCEL (Apps Client & Livreur)

### A. Créer un compte Vercel

1. Aller sur https://vercel.com
2. Cliquer sur "Sign Up"
3. Se connecter avec **GitHub** (recommandé)

---

## 📱 DÉPLOIEMENT APP CLIENT

### 1. Mettre à jour la configuration

**Modifier `pharma-client/src/config.js` :**

```javascript
// URLs de l'API
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://votre-app.up.railway.app/api', // ⬅️ URL Railway
};
```

### 2. Créer un fichier vercel.json

**Créer `pharma-client/vercel.json` :**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Pousser les modifications sur GitHub

```powershell
cd pharma-client
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### 4. Déployer sur Vercel

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur "Add New..." → "Project"
3. Sélectionner votre repo `pharmalivraison`
4. Configurer :
   - **Framework Preset** : Create React App
   - **Root Directory** : `pharma-client`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`
5. Cliquer sur "Deploy"

⏳ **Vercel build l'app (2-3 minutes)...**

✅ **App Client déployée !**

**URL :** `https://pharmalivraison-client.vercel.app`

---

## 🚚 DÉPLOIEMENT APP LIVREUR

### 1. Mettre à jour la configuration

**Modifier `pharma-livreur/src/config.js` :**

```javascript
// URLs de l'API
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://votre-app.up.railway.app/api', // ⬅️ URL Railway
};
```

### 2. Créer un fichier vercel.json

**Créer `pharma-livreur/vercel.json` :**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Pousser les modifications sur GitHub

```powershell
cd pharma-livreur
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### 4. Déployer sur Vercel

1. Retour sur https://vercel.com/dashboard
2. Cliquer sur "Add New..." → "Project"
3. Sélectionner votre repo `pharmalivraison` à nouveau
4. Configurer :
   - **Framework Preset** : Create React App
   - **Root Directory** : `pharma-livreur`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`
5. Cliquer sur "Deploy"

✅ **App Livreur déployée !**

**URL :** `https://pharmalivraison-livreur.vercel.app`

---

## 🎯 RÉCAPITULATIF DES URLs

Une fois tout déployé, vous aurez :

| Service | Plateforme | URL |
|---------|-----------|-----|
| **Backend API** | Railway | `https://votre-app.up.railway.app/api` |
| **App Client** | Vercel | `https://pharmalivraison-client.vercel.app` |
| **App Livreur** | Vercel | `https://pharmalivraison-livreur.vercel.app` |
| **Code Source** | GitHub | `https://github.com/votre-username/pharmalivraison` |

---

## ✅ VÉRIFICATION POST-DÉPLOIEMENT

### 1. Tester le Backend

```bash
# Health check
curl https://votre-app.up.railway.app/api/health

# Login client
curl -X POST https://votre-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+22507070707\",\"password\":\"password123\"}"
```

### 2. Tester l'App Client

1. Ouvrir `https://pharmalivraison-client.vercel.app`
2. Se connecter : **07070707** / **password123**
3. ✅ Vérifier que tout fonctionne

### 3. Tester l'App Livreur

1. Ouvrir `https://pharmalivraison-livreur.vercel.app`
2. Se connecter : **08080808** / **password123**
3. ✅ Vérifier que tout fonctionne

---

## 🔄 MISES À JOUR AUTOMATIQUES

### Avantage : CI/CD automatique !

Maintenant, chaque fois que vous faites un `git push` :
- ✅ Railway redéploie automatiquement le backend
- ✅ Vercel redéploie automatiquement les apps

**Workflow :**
```powershell
# Faire des modifications
# ...

# Commit et push
git add .
git commit -m "Nouvelle fonctionnalité"
git push

# ⏳ Déploiement automatique en cours...
# ✅ Apps mises à jour en 2-3 minutes !
```

---

## 💰 LIMITES GRATUITES

### Railway (Gratuit)
- ✅ 500 heures/mois (suffisant pour 1 projet)
- ✅ 1 GB RAM
- ✅ 1 GB Storage
- ✅ Déploiement illimité

### Vercel (Gratuit)
- ✅ 100 GB de bande passante/mois
- ✅ Déploiements illimités
- ✅ Domaines personnalisés
- ✅ SSL automatique (HTTPS)

### GitHub (Gratuit)
- ✅ Repos illimités (publics et privés)
- ✅ Collaborateurs illimités
- ✅ Actions CI/CD (2000 min/mois)

---

## 🌐 DOMAINES PERSONNALISÉS (Optionnel)

### Pour Vercel

1. Acheter un domaine (ex: `pharmalivraison.ci`)
2. Dans Vercel → Settings → Domains
3. Ajouter votre domaine
4. Configurer les DNS selon les instructions

### Pour Railway

1. Dans Railway → Settings → Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS

---

## 🔒 SÉCURITÉ EN PRODUCTION

### ⚠️ Important avant le lancement

1. **Changer le JWT_SECRET** dans Railway
   ```
   JWT_SECRET=generer-un-secret-vraiment-aleatoire-et-long-123456789
   ```

2. **Configurer CORS** dans le backend
   ```javascript
   // backend-api/src/server.js
   app.use(cors({
     origin: [
       'https://pharmalivraison-client.vercel.app',
       'https://pharmalivraison-livreur.vercel.app'
     ],
     credentials: true
   }));
   ```

3. **Hasher les mots de passe** (voir guide production)

---

## 🐛 DÉPANNAGE

### Erreur "Module not found"

Dans le `package.json` du backend, vérifier :
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Erreur CORS

Vérifier que les URLs dans `config.js` correspondent bien à l'URL Railway.

### App blanche sur Vercel

1. Vérifier les logs de build dans Vercel
2. S'assurer que `npm run build` fonctionne en local
3. Vérifier que `build/` est bien généré

### Backend ne démarre pas

1. Vérifier les logs dans Railway
2. S'assurer que toutes les variables d'environnement sont définies
3. Tester en local avec les mêmes variables

---

## 📊 MONITORING

### Railway Dashboard
- CPU usage
- Memory usage
- Request logs
- Erreurs en temps réel

### Vercel Dashboard
- Visites
- Build time
- Erreurs
- Performance

---

## 🎉 FÉLICITATIONS !

Votre application **PharmaLivraison** est maintenant :

- ✅ Déployée en ligne
- ✅ Accessible depuis n'importe où
- ✅ Avec HTTPS automatique
- ✅ Avec CI/CD automatique
- ✅ 100% GRATUIT !

Vous pouvez maintenant :
- 📱 Partager les liens avec vos utilisateurs
- 🧪 Faire des tests en conditions réelles
- 💼 Présenter aux investisseurs
- 🚀 Lancer votre startup !

---

## 📞 LIENS UTILES

- **Railway :** https://railway.app
- **Vercel :** https://vercel.com
- **GitHub :** https://github.com
- **Documentation Railway :** https://docs.railway.app
- **Documentation Vercel :** https://vercel.com/docs

---

**Projet déployé avec succès ! 🎊**




