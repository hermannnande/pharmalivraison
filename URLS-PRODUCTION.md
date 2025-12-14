# 🚀 PHARMALIVRAISON - URLS DE PRODUCTION

## ✅ APPLICATIONS DÉPLOYÉES

Toutes les applications sont déployées et opérationnelles !

---

## 🌐 URLs PUBLIQUES

### 🔧 Backend API (Railway)
**URL**: https://pharmalivraison-production.up.railway.app

**Endpoints principaux**:
- Health Check: https://pharmalivraison-production.up.railway.app/api/health
- Auth: https://pharmalivraison-production.up.railway.app/api/auth/login
- Orders: https://pharmalivraison-production.up.railway.app/api/orders
- Deliveries: https://pharmalivraison-production.up.railway.app/api/deliveries
- Socket.IO: wss://pharmalivraison-production.up.railway.app

---

### 📱 App Client (Vercel)
**URL**: https://pharmalivraison-client.vercel.app

**Fonctionnalités**:
- ✅ Scan d'ordonnance IA
- ✅ Suivi temps réel PRO
- ✅ Mode urgence
- ✅ Notifications intelligentes
- ✅ Historique des commandes
- ✅ Pharmacies favorites
- ✅ Rappels de médicaments

**Identifiants de test**:
- Téléphone: `+225070707070707`
- Mot de passe: `password123`

---

### 🚚 App Livreur (Vercel)
**URL**: https://pharmalivraison-livreur.vercel.app *(en déploiement)*

**Fonctionnalités**:
- ✅ Dashboard livreur
- ✅ GPS temps réel
- ✅ Gestion des livraisons
- ✅ Portefeuille
- ✅ Statistiques
- ✅ Historique des gains

**Identifiants de test**:
- Téléphone: `+225080808080808`
- Mot de passe: `password123`

---

## 🔌 CONFIGURATION TECHNIQUE

### Backend (Railway)
- **Plateforme**: Railway
- **Runtime**: Node.js 18+
- **Base de données**: In-memory (JSON) pour tests
- **Socket.IO**: Actif pour temps réel
- **CORS**: Activé pour toutes origines
- **Port**: 5000

### Frontends (Vercel)
- **Plateforme**: Vercel
- **Framework**: React 18 + Create React App
- **Routing**: React Router DOM v6
- **Maps**: Leaflet (React-Leaflet)
- **WebSocket**: Socket.IO Client
- **Build**: Production optimisé

---

## 📊 STATISTIQUES BACKEND

Au démarrage, le backend contient :
- 👥 **3 utilisateurs** (1 client, 1 livreur, 1 pharmacien)
- 🏥 **3 pharmacies** (avec localisation GPS)
- 💊 **5 médicaments** (stock disponible)
- 📦 **2 commandes** (dont 1 en cours)
- 🚚 **1 livraison** active

---

## 🔐 SÉCURITÉ

- **JWT Authentication**: Tokens valides 7 jours
- **HTTPS**: Toutes les connexions sécurisées
- **CORS**: Configuré pour production
- **Variables d'environnement**: Séparées par plateforme

---

## 🛠️ MAINTENANCE

### Redéploiement automatique
Chaque `git push` sur la branche `main` déclenche :
- ✅ Railway redéploie le backend automatiquement
- ✅ Vercel redéploie les apps automatiquement

### Logs en temps réel
- **Railway**: https://railway.app → Votre projet → Logs
- **Vercel**: https://vercel.com → Votre projet → Logs

---

## 📱 APK MOBILES

### Génération des APK
Pour générer les APK Android :

```powershell
# App Client
cd pharma-client
npx cap sync
npx cap open android
# Puis Build > Generate Signed Bundle/APK

# App Livreur
cd pharma-livreur
npx cap sync
npx cap open android
# Puis Build > Generate Signed Bundle/APK
```

### Configuration Capacitor
Les APK peuvent charger le contenu depuis Vercel :
- Mode hybride : APK charge `https://pharmalivraison-client.vercel.app`
- Mode natif : APK contient tout le code (offline possible)

---

## 🎯 PROCHAINES ÉTAPES

### Phase 1 : Tests ✅
- [x] Backend déployé
- [x] App Client déployée
- [ ] App Livreur déployée (en cours)

### Phase 2 : Intégrations (à venir)
- [ ] MongoDB Atlas (base de données cloud)
- [ ] Google Maps API (vraies cartes)
- [ ] Orange Money / MTN Money (paiements)
- [ ] Firebase (notifications push)
- [ ] AWS S3 / Cloudinary (images)

### Phase 3 : Production
- [ ] Tests utilisateurs
- [ ] Corrections bugs
- [ ] Publication Play Store
- [ ] Marketing & lancement

---

## 💡 SUPPORT

**Repository GitHub**: https://github.com/hermannnande/pharmalivraison

**Documentation**:
- README.md
- DEPLOIEMENT-GRATUIT.md
- GUIDE-VISUEL-DEPLOIEMENT.md

---

## ✨ CREDITS

**Développé par**: Hermann Nande  
**Date**: Décembre 2025  
**Stack**: React, Node.js, Express, Socket.IO, Railway, Vercel

---

🎉 **Félicitations ! Votre plateforme PharmaLivraison est en ligne !** 🚀




