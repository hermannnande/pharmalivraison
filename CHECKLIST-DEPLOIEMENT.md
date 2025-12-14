# 🎯 CHECKLIST DÉPLOIEMENT - PHARMALIVRAISON

## ✅ ÉTAPE 1 : GITHUB (5 minutes)

### À faire maintenant :

1. [ ] Aller sur https://github.com/new
2. [ ] Nom du repo : `pharmalivraison`
3. [ ] Visibilité : **Private**
4. [ ] Cliquer sur **Create repository**
5. [ ] Copier l'URL (ex: `https://github.com/username/pharmalivraison.git`)
6. [ ] Exécuter dans PowerShell : `.\PUSH-GITHUB.ps1`
7. [ ] Coller l'URL quand demandé
8. [ ] Vérifier que le code est sur GitHub

✅ **Code sur GitHub !**

---

## ✅ ÉTAPE 2 : RAILWAY - Backend (10 minutes)

### À faire ensuite :

1. [ ] Aller sur https://railway.app
2. [ ] Cliquer sur **Start a New Project**
3. [ ] Se connecter avec **GitHub**
4. [ ] Cliquer sur **New Project** → **Deploy from GitHub repo**
5. [ ] Autoriser Railway à accéder à GitHub
6. [ ] Sélectionner `pharmalivraison`
7. [ ] Attendre la détection automatique
8. [ ] Aller dans **Settings** :
   - [ ] **Root Directory** : `backend-api`
   - [ ] **Start Command** : `node src/server.js`
9. [ ] Aller dans **Variables** :
   - [ ] Ajouter `PORT` = `5000`
   - [ ] Ajouter `JWT_SECRET` = `votre-secret-production-123456`
   - [ ] Ajouter `NODE_ENV` = `production`
10. [ ] Aller dans **Settings** → **Networking**
11. [ ] Cliquer sur **Generate Domain**
12. [ ] **📋 COPIER L'URL** (ex: `pharmalivraison-production.up.railway.app`)

### Tester :
```bash
curl https://votre-app.up.railway.app/api/health
```

✅ **Backend en ligne !**

**URL Backend** : `https://___________________.up.railway.app/api`

---

## ✅ ÉTAPE 3A : VERCEL - App Client (7 minutes)

### Avant de déployer :

1. [ ] Ouvrir `pharma-client/src/config.js`
2. [ ] Ligne 11, remplacer par votre URL Railway :
   ```javascript
   production: 'https://VOTRE-URL-RAILWAY.up.railway.app/api',
   ```
3. [ ] Sauvegarder
4. [ ] Dans PowerShell :
   ```powershell
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

### Déployer sur Vercel :

5. [ ] Aller sur https://vercel.com
6. [ ] Se connecter avec **GitHub**
7. [ ] Cliquer sur **Add New...** → **Project**
8. [ ] Sélectionner `pharmalivraison`
9. [ ] Configurer :
   - [ ] **Framework Preset** : Create React App
   - [ ] **Root Directory** : `pharma-client`
   - [ ] **Build Command** : `npm run build`
   - [ ] **Output Directory** : `build`
10. [ ] Cliquer sur **Deploy**
11. [ ] ⏳ Attendre 2-3 minutes
12. [ ] **📋 COPIER L'URL** (ex: `pharmalivraison-client.vercel.app`)

### Tester :
```
Ouvrir l'URL
Login : 07070707 / password123
```

✅ **App Client en ligne !**

**URL Client** : `https://___________________.vercel.app`

---

## ✅ ÉTAPE 3B : VERCEL - App Livreur (7 minutes)

### Avant de déployer :

1. [ ] Ouvrir `pharma-livreur/src/config.js`
2. [ ] Ligne 11, remplacer par votre URL Railway :
   ```javascript
   production: 'https://VOTRE-URL-RAILWAY.up.railway.app/api',
   ```
3. [ ] Sauvegarder
4. [ ] Dans PowerShell :
   ```powershell
   git add .
   git commit -m "Update API URL for production (livreur)"
   git push
   ```

### Déployer sur Vercel :

5. [ ] Retour sur https://vercel.com/dashboard
6. [ ] Cliquer sur **Add New...** → **Project**
7. [ ] Sélectionner `pharmalivraison` à nouveau
8. [ ] Configurer :
   - [ ] **Framework Preset** : Create React App
   - [ ] **Root Directory** : `pharma-livreur`
   - [ ] **Build Command** : `npm run build`
   - [ ] **Output Directory** : `build`
9. [ ] Cliquer sur **Deploy**
10. [ ] ⏳ Attendre 2-3 minutes
11. [ ] **📋 COPIER L'URL** (ex: `pharmalivraison-livreur.vercel.app`)

### Tester :
```
Ouvrir l'URL
Login : 08080808 / password123
```

✅ **App Livreur en ligne !**

**URL Livreur** : `https://___________________.vercel.app`

---

## 🎉 DÉPLOIEMENT TERMINÉ !

### 📋 VOS URLs FINALES :

```
Backend API : https://___________________.up.railway.app/api
App Client  : https://___________________.vercel.app
App Livreur : https://___________________.vercel.app
```

---

## 📱 ÉTAPE 4 : GÉNÉRER LES APK (10 minutes)

### App Client :

```powershell
cd pharma-client
npm run build
npx cap add android
npx cap sync
npx cap open android
```

Dans Android Studio :
- [ ] Build → Build Bundle(s) / APK(s) → Build APK(s)
- [ ] APK dans : `android/app/build/outputs/apk/debug/`

### App Livreur :

```powershell
cd pharma-livreur
npm run build
npx cap add android
npx cap sync
npx cap open android
```

Dans Android Studio :
- [ ] Build → Build Bundle(s) / APK(s) → Build APK(s)
- [ ] APK dans : `android/app/build/outputs/apk/debug/`

✅ **APK Générés !**

---

## 🧪 TESTS FINAUX

### Test Complet :

1. [ ] Backend répond : `curl https://votre-backend/api/health`
2. [ ] App Client web fonctionne (login, navigation)
3. [ ] App Livreur web fonctionne (login, dashboard)
4. [ ] APK Client s'installe et fonctionne
5. [ ] APK Livreur s'installe et fonctionne
6. [ ] Socket.IO temps réel fonctionne
7. [ ] Commande complète (client → livreur → livraison)

✅ **Tout fonctionne !**

---

## 🔄 MISES À JOUR FUTURES

### Pour mettre à jour :

```powershell
# 1. Modifier le code
# 2. Tester en local
npm start

# 3. Push vers GitHub
git add .
git commit -m "Description des modifications"
git push

# 4. Déploiement automatique (2-3 min)
# ✅ Apps mises à jour !
# ✅ APK voient les changements (approche hybride)
```

---

## 📞 IDENTIFIANTS DE TEST

**Client :**
- Téléphone : `07070707`
- Mot de passe : `password123`

**Livreur :**
- Téléphone : `08080808`
- Mot de passe : `password123`

---

## 💰 COÛT TOTAL : 0 FCFA

- ✅ GitHub : GRATUIT
- ✅ Railway : GRATUIT (500h/mois)
- ✅ Vercel : GRATUIT (100GB/mois)
- ✅ Mises à jour : GRATUIT (illimitées)

---

## 🎯 PLAY STORE (PLUS TARD)

Quand tout fonctionne parfaitement :
1. [ ] Créer compte Google Play Developer (25 USD)
2. [ ] Préparer les assets (icônes, screenshots)
3. [ ] Uploader les APK
4. [ ] Remplir les infos de l'app
5. [ ] Soumettre pour validation
6. [ ] ⏳ Attendre 1-3 jours
7. [ ] ✅ App sur Play Store !

---

**Temps total : ~30 minutes**
**Difficulté : Facile** ⭐⭐☆☆☆

**Bon déploiement ! 🚀**




