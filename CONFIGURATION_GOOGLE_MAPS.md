# 🔧 CONFIGURATION GOOGLE MAPS API

## ✅ TOUT EST PRÊT ! Il ne reste que 2 fichiers à configurer !

---

## 📝 ÉTAPE 1 : OBTENIR LA CLÉ GOOGLE MAPS API

### Suivez le guide complet :

**Fichier :** `GUIDE_GOOGLE_MAPS_API.md`

**En résumé :**
1. Allez sur https://console.cloud.google.com/
2. Créez un compte (gratuit avec 200$/mois)
3. Créez un projet "PharmaLivraison"
4. Activez les APIs :
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Distance Matrix API
   - Directions API
5. Créez une clé API
6. Copiez la clé (exemple : `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

---

## 🔑 ÉTAPE 2 : CONFIGURER LE BACKEND

### Créez le fichier `.env` dans `backend/`

**Chemin :** `C:\Users\nande\Desktop\pharmarcie delivery\backend\.env`

**Contenu :**

```env
# MongoDB
MONGODB_URI=mongodb://mongo:27017/pharmalivraison

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_ici

# Cloudinary (pour upload images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Google Maps API 🆕
GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Port
PORT=5000

# Environnement
NODE_ENV=development
```

**⚠️ IMPORTANT : Remplacez `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` par votre VRAIE clé !**

---

## 🌐 ÉTAPE 3 : CONFIGURER LE FRONTEND

### Créez le fichier `.env.local` dans `pharma-web/`

**Chemin :** `C:\Users\nande\Desktop\pharmarcie delivery\pharma-web\.env.local`

**Contenu :**

```env
# URL de l'API backend
REACT_APP_API_BASE_URL=http://localhost:5000

# Google Maps API (même clé que le backend)
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT : Remplacez `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` par votre VRAIE clé !**

---

## 🚀 ÉTAPE 4 : RELANCER L'APPLICATION

### 1. Relancer le backend :

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery"
docker-compose restart
```

**Ou si vous n'utilisez pas Docker :**

```powershell
cd backend
npm start
```

### 2. Relancer le frontend :

```powershell
cd pharma-web
npm start
```

---

## ✅ ÉTAPE 5 : TESTER L'INTÉGRATION

### Ouvrez http://localhost:3000

1. **Connectez-vous** (client@test.com / 12345678)
2. **Sur la carte**, vous verrez :
   - Les VRAIES pharmacies d'Abidjan 🏥
   - Chargées depuis Google Maps
   - Avec horaires en temps réel
   - Distances calculées
3. **Cliquez sur une pharmacie** :
   - Popup avec infos réelles
   - Téléphone (si disponible)
   - Horaires d'ouverture
   - Note et avis

---

## 🧪 COMMENT VÉRIFIER QUE ÇA MARCHE

### 1. Vérifier dans la console du navigateur (F12)

Si vous voyez :
```
⚠️ Clé Google Maps API non configurée. Utilisation des données de démonstration.
```

→ Votre fichier `.env.local` n'est pas bien configuré !

### 2. Vérifier dans les logs du backend

Si vous voyez :
```
Google Maps API non configurée
```

→ Votre fichier `.env` du backend n'est pas bien configuré !

### 3. Si tout fonctionne :

Vous verrez dans les logs du backend :
```
✅ Connecté à MongoDB
✅ Google Maps API configurée
🚀 Serveur démarré sur le port 5000
```

Et sur la carte, les pharmacies avec des noms réels comme :
- Pharmacie du Plateau
- Pharmacie Cocody Centre
- Pharmacie de Garde Marcory
- etc.

---

## 📊 CE QUE VOUS OBTIENDREZ

### Avant (données de démonstration) :

```javascript
{
  nom: "Pharmacie du Plateau",
  adresse: "Boulevard du Plateau, Abidjan",
  estOuverte: true, // fixe
  horaires: null,
  telephone: null
}
```

### Après (données Google Maps) :

```javascript
{
  nom: "Pharmacie Sainte Marie du Plateau",
  adresse: "Rue Gourgas, Le Plateau, Abidjan",
  estOuverte: true, // EN TEMPS RÉEL !
  horaires: [
    "Lundi : 08:00 – 20:00",
    "Mardi : 08:00 – 20:00",
    "Mercredi : 08:00 – 20:00",
    // ...
  ],
  telephone: "+225 27 20 32 15 47",
  note: 4.2,
  nombreAvis: 87
}
```

---

## 🎯 FONCTIONNALITÉS DÉBLOQUÉES

Une fois Google Maps API configurée, vous aurez :

✅ **Vraies pharmacies** d'Abidjan  
✅ **Horaires en temps réel** (ouvert/fermé)  
✅ **Pharmacies de garde** (24h/24)  
✅ **Téléphones** pour appeler  
✅ **Distances réelles** calculées  
✅ **Itinéraires GPS** précis  
✅ **Photos** des pharmacies  
✅ **Notes et avis** Google  

---

## 💰 COÛT ESTIMÉ

### Pour 1000 utilisateurs par mois :

| Fonctionnalité | Requêtes/mois | Coût |
|----------------|---------------|------|
| Chargement carte | 1 000 | Gratuit |
| Recherche pharmacies | 5 000 | Gratuit |
| Calcul distance | 2 000 | Gratuit |
| Itinéraires | 1 000 | Gratuit |
| **TOTAL** | **9 000** | **0€** ✅ |

**💡 Vous restez LARGEMENT dans les limites gratuites !**

---

## 🛡️ SÉCURITÉ - IMPORTANT !

### 1. Ne partagez JAMAIS votre clé API publiquement !

❌ **Ne pas faire :**
- Commit `.env` sur GitHub
- Partager la clé sur Discord/WhatsApp
- L'écrire en clair dans le code

✅ **À faire :**
- Ajouter `.env` et `.env.local` au `.gitignore`
- Restreindre la clé dans Google Cloud Console
- Définir des alertes de budget

### 2. Fichiers déjà dans `.gitignore` :

```gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 🆘 DÉPANNAGE

### Problème : "Google Maps API non configurée"

**Solution :**
1. Vérifiez que `.env` et `.env.local` existent
2. Vérifiez que la clé est correcte (pas d'espaces)
3. Relancez le backend ET le frontend

### Problème : "This API project is not authorized"

**Solution :**
1. Allez sur Google Cloud Console
2. Vérifiez que les APIs sont bien activées
3. Vérifiez que la facturation est activée

### Problème : "Quota exceeded"

**Solution :**
1. Vous avez dépassé les limites gratuites
2. Ajoutez du cache dans le code
3. Ou passez à un plan payant

---

## 📞 ALTERNATIVE GRATUITE

### Si vous ne voulez PAS payer :

**Utilisez OpenStreetMap + Overpass API :**
- 100% gratuit
- Pas de limite
- Mais moins de données

**Fichier :** `pharma-web/src/services/openStreetMapService.js` (à créer)

---

## 🎊 C'EST TOUT !

**Une fois les 2 fichiers `.env` créés :**

1. ✅ Relancez backend
2. ✅ Relancez frontend
3. ✅ Testez sur http://localhost:3000
4. ✅ Profitez des VRAIES données ! 🚀

---

## 📚 FICHIERS CRÉÉS POUR VOUS

✅ `GUIDE_GOOGLE_MAPS_API.md` - Guide complet  
✅ `backend/src/routes/googleMaps.routes.js` - Routes backend  
✅ `pharma-web/src/services/googleMapsService.js` - Service frontend  
✅ `backend/src/server.js` - Mis à jour avec routes  

**Il ne vous reste plus qu'à :**
1. Obtenir la clé API
2. Créer les 2 fichiers `.env`
3. Relancer l'app

**C'est parti ! 🎉**






