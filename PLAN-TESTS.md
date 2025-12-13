# 🧪 PLAN DE TESTS - PHARMALIVRAISON

## ✅ TESTS À EFFECTUER APRÈS DÉPLOIEMENT

Une fois toutes les apps déployées, voici les tests à faire pour valider le système complet.

---

## 🔧 1. TEST BACKEND (Railway)

### Health Check
```bash
curl https://pharmalivraison-production.up.railway.app/api/health
```

**Résultat attendu**:
```json
{
  "status": "OK",
  "message": "Backend PharmaLivraison opérationnel",
  "stats": {
    "users": 3,
    "pharmacies": 3,
    "medications": 5,
    "orders": 2,
    "deliveries": 1
  }
}
```

### Test Login Client
```bash
curl -X POST https://pharmalivraison-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+225070707070707","password":"password123"}'
```

**Résultat attendu**: Token JWT + infos utilisateur

---

## 📱 2. TEST APP CLIENT (Vercel)

### URL: https://pharmalivraison-client.vercel.app

#### Test 1: Accès à l'app
- [ ] Ouvrir l'URL dans le navigateur
- [ ] Vérifier que la page de login s'affiche
- [ ] Pas d'erreur dans la console (F12)

#### Test 2: Login
- [ ] Entrer téléphone: `+225070707070707`
- [ ] Entrer mot de passe: `password123`
- [ ] Cliquer sur "Se connecter"
- [ ] Redirection vers la page d'accueil

#### Test 3: Navigation
- [ ] Dashboard client s'affiche
- [ ] Carte interactive visible
- [ ] Pharmacies affichées sur la carte
- [ ] Menu de navigation fonctionne

#### Test 4: Fonctionnalités
- [ ] Recherche de pharmacie
- [ ] Scan d'ordonnance (interface visible)
- [ ] Mode urgence accessible
- [ ] Historique des commandes

---

## 🚚 3. TEST APP LIVREUR (Vercel)

### URL: https://pharmalivraison-livreur.vercel.app

#### Test 1: Accès à l'app
- [ ] Ouvrir l'URL dans le navigateur
- [ ] Page de login visible
- [ ] Pas d'erreur console

#### Test 2: Login
- [ ] Téléphone: `+225080808080808`
- [ ] Mot de passe: `password123`
- [ ] Connexion réussie
- [ ] Redirection vers dashboard livreur

#### Test 3: Dashboard
- [ ] Liste des commandes disponibles
- [ ] Bouton "Disponible/Indisponible"
- [ ] Statistiques visibles (gains, livraisons)
- [ ] Carte GPS visible

#### Test 4: Livraison
- [ ] Accepter une commande
- [ ] Voir les détails de la commande
- [ ] Carte de navigation affichée
- [ ] Boutons d'action (démarrer, arrivé, etc.)

---

## 🔌 4. TEST SOCKET.IO (Temps Réel)

### Test de connexion
1. Ouvrir l'app Client dans le navigateur
2. Ouvrir la console (F12) → onglet "Console"
3. Chercher le message: `✅ Socket connecté`

### Test de communication
1. Ouvrir l'app Client dans un onglet
2. Ouvrir l'app Livreur dans un autre onglet
3. Se connecter sur les deux
4. Vérifier les logs Socket.IO dans la console

---

## 🌐 5. TEST CROSS-ORIGIN (CORS)

### Vérifier que les apps peuvent communiquer avec le backend

#### Dans la console du navigateur (F12):
```javascript
fetch('https://pharmalivraison-production.up.railway.app/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS OK:', d))
  .catch(e => console.error('❌ CORS ERROR:', e))
```

**Résultat attendu**: Message `✅ CORS OK` avec les données

---

## 📊 6. TEST DE CHARGE (Optionnel)

### Test simple de disponibilité
```bash
# Faire 10 requêtes successives
for i in {1..10}; do
  curl -s https://pharmalivraison-production.up.railway.app/api/health
  echo "Request $i done"
done
```

---

## 🐛 7. TESTS D'ERREURS

### Test login avec mauvais identifiants
- [ ] Tenter de se connecter avec un mauvais mot de passe
- [ ] Vérifier le message d'erreur approprié
- [ ] Pas de crash de l'app

### Test sans connexion Internet (simulation)
- [ ] Ouvrir les Dev Tools (F12)
- [ ] Aller dans "Network" → "Offline"
- [ ] Tenter une action
- [ ] Vérifier le message d'erreur de connexion

---

## 📱 8. TEST RESPONSIVE (Mobile)

### Dans le navigateur
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Sélectionner "iPhone 12 Pro" ou "Samsung Galaxy S20"
3. Vérifier :
   - [ ] L'app s'affiche correctement
   - [ ] Les boutons sont cliquables
   - [ ] Le menu est accessible
   - [ ] La carte fonctionne

---

## ✅ CHECKLIST FINALE

### Backend (Railway)
- [ ] API répond correctement
- [ ] Socket.IO connecté
- [ ] Logs accessibles
- [ ] Pas d'erreurs 500

### App Client (Vercel)
- [ ] Page de login accessible
- [ ] Connexion fonctionnelle
- [ ] Dashboard s'affiche
- [ ] Carte interactive
- [ ] Navigation fluide

### App Livreur (Vercel)
- [ ] Page de login accessible
- [ ] Connexion fonctionnelle
- [ ] Dashboard livreur s'affiche
- [ ] GPS et carte fonctionnent
- [ ] Actions de livraison

### Intégration
- [ ] Apps communiquent avec le backend
- [ ] Socket.IO fonctionne
- [ ] CORS configuré correctement
- [ ] Pas d'erreurs console

---

## 🎯 PROCHAINES ÉTAPES SI TOUT FONCTIONNE

1. ✅ Tests utilisateurs réels
2. ✅ Corrections de bugs mineurs
3. ✅ Ajout de vraies données (MongoDB)
4. ✅ Intégration Google Maps
5. ✅ Intégration paiements (Orange Money, MTN)
6. ✅ Génération APK Android
7. ✅ Publication Play Store

---

## 📝 RAPPORTS DE BUGS

Si vous trouvez des bugs, notez :
- URL de l'app
- Action effectuée
- Erreur observée
- Message d'erreur (console)
- Capture d'écran

---

🎉 **Bon test !** 🚀

