# 🗺️ GUIDE COMPLET - GOOGLE MAPS API

## 🎯 OBJECTIF

Intégrer les **vraies données** des pharmacies d'Abidjan avec :
- Positions GPS réelles
- Horaires d'ouverture
- Pharmacies de garde
- Téléphones et adresses
- Calcul de distance
- Itinéraires GPS

---

## 🔑 ÉTAPE 1 : CRÉER UN COMPTE GOOGLE CLOUD

### 1. Aller sur Google Cloud Console

**URL :** https://console.cloud.google.com/

### 2. Créer un compte

- Cliquez sur "Get started for free" ou "Commencer gratuitement"
- Connectez-vous avec votre compte Google
- Acceptez les conditions

### 3. Créer un projet

1. En haut à gauche, cliquez sur le nom du projet
2. Cliquez "Nouveau projet"
3. Nom : `PharmaLivraison`
4. Cliquez "Créer"

---

## 💳 ÉTAPE 2 : ACTIVER LA FACTURATION (GRATUIT)

### Google donne 200$ de crédit gratuit chaque mois !

1. Allez dans "Facturation" (Billing)
2. Cliquez "Activer la facturation"
3. Entrez vos informations de carte bancaire
   - **Aucun débit automatique** si vous restez dans les limites gratuites
   - **200$ offerts par mois**
4. Validez

**💡 Astuce :** Vous pouvez définir des alertes pour ne jamais dépasser 200$.

---

## 🚀 ÉTAPE 3 : ACTIVER LES APIs NÉCESSAIRES

### APIs à activer :

#### 1. **Maps JavaScript API**
- Pour afficher la carte interactive
- **Gratuit jusqu'à 28 000 chargements/mois**

#### 2. **Places API**
- Pour rechercher les pharmacies
- **Gratuit jusqu'à 5 000 requêtes/mois**

#### 3. **Geocoding API**
- Pour convertir adresses ↔ coordonnées GPS
- **Gratuit jusqu'à 40 000 requêtes/mois**

#### 4. **Distance Matrix API**
- Pour calculer les distances et temps de trajet
- **Gratuit jusqu'à 100 000 éléments/mois**

#### 5. **Directions API** (optionnel)
- Pour les itinéraires détaillés
- **Gratuit jusqu'à 10 000 requêtes/mois**

### Comment activer :

1. Dans la console, allez dans "APIs & Services" → "Bibliothèque"
2. Cherchez chaque API
3. Cliquez dessus
4. Cliquez "Activer"
5. Répétez pour chaque API

---

## 🔐 ÉTAPE 4 : CRÉER UNE CLÉ API

### 1. Aller dans "APIs & Services" → "Identifiants"

### 2. Cliquer "Créer des identifiants" → "Clé API"

### 3. Votre clé API est générée !

**Exemple :** `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Sécuriser la clé (IMPORTANT !)

1. Cliquez sur la clé créée
2. Sous "Restrictions relatives aux applications" :
   - Choisissez "Sites web"
   - Ajoutez : `http://localhost:3000/*`
   - Ajoutez : `https://votre-domaine.com/*`
3. Sous "Restrictions relatives aux API" :
   - Sélectionnez "Restreindre la clé"
   - Cochez les 5 APIs activées ci-dessus
4. Cliquez "Enregistrer"

---

## 📊 ÉTAPE 5 : LIMITES GRATUITES

| API | Limite Gratuite | Au-delà |
|-----|-----------------|---------|
| Maps JavaScript | 28 000 chargements/mois | 7$/1000 |
| Places API | 5 000 requêtes/mois | Varie |
| Geocoding | 40 000 requêtes/mois | 5$/1000 |
| Distance Matrix | 100 000 éléments/mois | Varie |
| Directions | 10 000 requêtes/mois | 5$/1000 |

**💡 Pour une app avec 1000 utilisateurs/mois :**
- 1000 utilisateurs × 10 recherches = 10 000 requêtes
- **Reste dans les limites gratuites !** ✅

---

## 🛡️ ÉTAPE 6 : SÉCURITÉ - DÉFINIR DES ALERTES

### Pour ne jamais payer :

1. Allez dans "Facturation" → "Budgets & alertes"
2. Créez un budget :
   - Montant : **150€** (pour rester sous les 200$ gratuits)
   - Alertes à : 50%, 75%, 90%, 100%
3. Vous recevrez des emails si vous approchez

---

## 💻 ÉTAPE 7 : INTÉGRER DANS L'APP

### 1. Créer un fichier `.env.local`

Dans `pharma-web/` :

```bash
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Utiliser dans le code

```javascript
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
```

---

## 🔍 COMMENT CHERCHER LES PHARMACIES

### Code exemple :

```javascript
// Rechercher les pharmacies autour d'une position
async function searchPharmacies(lat, lng, radius = 5000) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=pharmacy&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.results.map(place => ({
    id: place.place_id,
    nom: place.name,
    adresse: place.vicinity,
    position: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    },
    estOuverte: place.opening_hours?.open_now || false,
    note: place.rating,
    nombreAvis: place.user_ratings_total
  }));
}
```

---

## 📞 OBTENIR LES DÉTAILS (HORAIRES, TÉLÉPHONE)

### Code exemple :

```javascript
async function getPharmacyDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,opening_hours,website&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    telephone: data.result.formatted_phone_number,
    horaires: data.result.opening_hours?.weekday_text,
    ouvert24h: data.result.opening_hours?.periods?.length === 1,
    siteWeb: data.result.website
  };
}
```

---

## 🏥 IDENTIFIER LES PHARMACIES DE GARDE

### Pharmacies ouvertes 24h/24 :

```javascript
async function getPharmaciesDeGarde(lat, lng) {
  const pharmacies = await searchPharmacies(lat, lng, 10000);
  
  // Filtrer celles ouvertes maintenant
  const ouvertes = pharmacies.filter(p => p.estOuverte);
  
  // Pour chaque pharmacie, vérifier si 24h/24
  const deGarde = [];
  for (const pharma of ouvertes) {
    const details = await getPharmacyDetails(pharma.id);
    if (details.ouvert24h) {
      deGarde.push({ ...pharma, ...details });
    }
  }
  
  return deGarde;
}
```

---

## 📏 CALCULER LA DISTANCE

### Code exemple :

```javascript
async function calculateDistance(origin, destination) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  const element = data.rows[0].elements[0];
  
  return {
    distance: element.distance.text, // "2.5 km"
    duree: element.duration.text,    // "8 min"
    metres: element.distance.value,  // 2500
    secondes: element.duration.value // 480
  };
}
```

---

## 🚗 OBTENIR UN ITINÉRAIRE

### Code exemple :

```javascript
async function getDirections(origin, destination) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  const route = data.routes[0];
  
  return {
    polyline: route.overview_polyline.points, // Pour tracer sur la carte
    distance: route.legs[0].distance.text,
    duree: route.legs[0].duration.text,
    etapes: route.legs[0].steps.map(step => step.html_instructions)
  };
}
```

---

## 🌍 COORDONNÉES GPS D'ABIDJAN

### Quartiers principaux :

| Quartier | Latitude | Longitude |
|----------|----------|-----------|
| Cocody | 5.3600 | -3.9867 |
| Plateau | 5.3198 | -4.0128 |
| Marcory | 5.2833 | -3.9833 |
| Yopougon | 5.3333 | -4.0833 |
| Adjamé | 5.3533 | -4.0267 |
| Treichville | 5.2833 | -4.0167 |
| Koumassi | 5.2900 | -3.9400 |
| Port-Bouët | 5.2500 | -3.9167 |

---

## 🔄 MISE À JOUR EN TEMPS RÉEL

### Actualiser les horaires toutes les 5 minutes :

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    refreshPharmacies();
  }, 5 * 60 * 1000); // 5 minutes
  
  return () => clearInterval(interval);
}, []);
```

---

## 💰 COÛT ESTIMÉ POUR L'APP

### Scénario : 1000 utilisateurs actifs par mois

**Utilisation par utilisateur :**
- 1 chargement de carte : 1 requête Maps JavaScript
- 5 recherches de pharmacies : 5 requêtes Places API
- 2 calculs de distance : 2 requêtes Distance Matrix
- 1 itinéraire : 1 requête Directions

**Total mensuel :**
- Maps JavaScript : 1000 requêtes (**gratuit**, limite 28 000)
- Places API : 5000 requêtes (**gratuit**, limite 5 000) ⚠️
- Distance Matrix : 2000 requêtes (**gratuit**, limite 100 000)
- Directions : 1000 requêtes (**gratuit**, limite 10 000)

**💡 Pour rester gratuit :**
- Cache les résultats de recherche (5-10 min)
- Limite les recherches automatiques
- **Coût estimé : 0€ si optimisé !** ✅

---

## 🎁 ALTERNATIVE GRATUITE : OPENSTREETMAP

Si vous ne voulez PAS utiliser Google Maps :

### **Overpass API** (OpenStreetMap)
- **100% GRATUIT**
- Données ouvertes
- Chercher pharmacies, horaires, téléphones

**Exemple :**
```javascript
const url = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=pharmacy](around:5000,${lat},${lng});out;`;
```

**Avantages :**
- Gratuit illimité
- Pas de clé API
- Données libres

**Inconvénients :**
- Moins de données que Google
- Horaires parfois obsolètes
- Moins précis en Afrique

---

## 🏆 RECOMMANDATION

### Pour votre app PharmaLivraison :

**✅ Utilisez Google Maps API**

**Raisons :**
1. **200$ gratuits/mois** = suffisant pour débuter
2. **Données les plus précises** pour Abidjan
3. **Horaires à jour**
4. **Téléphones vérifiés**
5. **API simple** et bien documentée

**💡 Stratégie :**
- Démarrez avec Google Maps (gratuit)
- Optimisez pour rester dans les limites
- Quand vous avez 10 000+ utilisateurs :
  - Créez votre propre base de données de pharmacies
  - Utilisez Google Maps juste pour la carte

---

## ✅ CHECKLIST COMPLÈTE

```
□ Créer compte Google Cloud Platform
□ Créer projet "PharmaLivraison"
□ Activer facturation (gratuit avec 200$)
□ Activer Maps JavaScript API
□ Activer Places API
□ Activer Geocoding API
□ Activer Distance Matrix API
□ Activer Directions API
□ Créer clé API
□ Sécuriser la clé (restrictions)
□ Définir alertes de budget (150€)
□ Créer fichier .env.local
□ Ajouter la clé dans l'app
□ Tester la recherche de pharmacies
□ Tester horaires d'ouverture
□ Tester calcul de distance
□ Optimiser (cache) pour rester gratuit
```

---

## 📚 DOCUMENTATION OFFICIELLE

- **Console Google Cloud :** https://console.cloud.google.com/
- **Places API :** https://developers.google.com/maps/documentation/places/web-service/overview
- **Distance Matrix :** https://developers.google.com/maps/documentation/distance-matrix/overview
- **Tarifs :** https://cloud.google.com/maps-platform/pricing

---

## 🎊 PRÊT À COMMENCER ?

**Une fois que vous avez votre clé API Google Maps, dites-moi et je vais :**

1. ✅ Créer le fichier `.env.local`
2. ✅ Modifier `ClientHomeModern.js` pour utiliser les vraies pharmacies
3. ✅ Ajouter la recherche en temps réel
4. ✅ Afficher horaires et téléphones
5. ✅ Calculer distances réelles
6. ✅ Filtrer pharmacies de garde

**Vous aurez une app avec de VRAIES DONNÉES ! 🚀🎉**






