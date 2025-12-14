# 🐳 Guide Docker - PharmaLivraison Abidjan

## 🚀 Lancement Ultra-Rapide avec Docker

Avec Docker, vous n'avez **RIEN à installer** ! Ni Node.js, ni MongoDB, ni rien d'autre !

---

## ⚡ Méthode 1 : Script Automatique (RECOMMANDÉ)

### Windows

**Double-cliquez sur :**
```
lancer-app.bat
```

### Mac/Linux

**Dans le terminal :**
```bash
chmod +x lancer-app.sh
./lancer-app.sh
```

C'est tout ! 🎉 L'application démarre automatiquement.

---

## 📝 Méthode 2 : Commandes Manuelles

### 1. Démarrer tous les services

```bash
docker-compose up -d
```

Cela va :
- ✅ Télécharger MongoDB
- ✅ Construire le backend
- ✅ Démarrer les 2 services
- ✅ Créer le réseau

### 2. Créer les données de test

```bash
# Attendre 10 secondes que MongoDB démarre
# Puis :
docker-compose exec backend npm run seed
```

### 3. Vérifier que tout fonctionne

```bash
docker-compose ps
```

Vous devriez voir :
```
NAME                STATUS
pharma-mongodb      Up
pharma-backend      Up
```

### 4. Tester l'API

```bash
curl http://localhost:5000
```

Vous devriez voir :
```json
{
  "message": "Bienvenue sur l'API PharmaLivraison Abidjan 🏥",
  "version": "1.0.0"
}
```

---

## 📱 Lancer l'Application Mobile

Une fois le backend démarré avec Docker :

### Terminal 1 : Metro Bundler
```bash
cd mobile
npm install
npm start
```

### Terminal 2 : Android
```bash
cd mobile
npx react-native run-android
```

**IMPORTANT** : Dans `mobile/.env`, utilisez :
```env
# Pour Android avec Docker
API_URL=http://10.0.2.2:5000/api

# Pour émulateur iOS
API_URL=http://localhost:5000/api
```

---

## 🛠️ Commandes Utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Backend seulement
docker-compose logs -f backend

# MongoDB seulement
docker-compose logs -f mongodb
```

### Arrêter les services
```bash
docker-compose down
```

### Redémarrer les services
```bash
docker-compose restart
```

### Arrêter ET supprimer les données
```bash
docker-compose down -v
```

### Reconstruire l'image backend
```bash
docker-compose build backend
docker-compose up -d
```

### Exécuter une commande dans le conteneur
```bash
# Exemple : créer les données de test
docker-compose exec backend npm run seed

# Exemple : accéder au shell du backend
docker-compose exec backend sh

# Exemple : accéder à MongoDB
docker-compose exec mongodb mongosh pharmalivraison
```

---

## 🔍 Vérification de l'Installation

### 1. Vérifier Docker
```bash
docker --version
docker-compose --version
```

### 2. Vérifier les conteneurs
```bash
docker-compose ps
```

Résultat attendu :
```
NAME               IMAGE              STATUS         PORTS
pharma-backend     pharmalivraison    Up 2 minutes   0.0.0.0:5000->5000/tcp
pharma-mongodb     mongo:7.0          Up 2 minutes   0.0.0.0:27017->27017/tcp
```

### 3. Vérifier l'API
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri http://localhost:5000

# Mac/Linux
curl http://localhost:5000
```

### 4. Vérifier MongoDB
```bash
docker-compose exec mongodb mongosh --eval "db.version()"
```

---

## 🧪 Tests Complets

### Test Backend

```bash
# 1. Vérifier l'API
curl http://localhost:5000

# 2. Lister les pharmacies
curl http://localhost:5000/api/pharmacies

# 3. Login client
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"telephone":"0707070707","motDePasse":"test123"}'
```

### Test Mobile

1. Lancer `lancer-app.bat` (Windows) ou `lancer-app.sh` (Mac/Linux)
2. Attendre le message "SERVICES DÉMARRÉS !"
3. Lancer l'app mobile :
   ```bash
   cd mobile
   npm install
   npm start
   # Nouveau terminal
   npx react-native run-android
   ```
4. Se connecter avec : `0707070707` / `test123`

---

## 📊 Architecture Docker

```
┌─────────────────────────────────────────┐
│           Application Mobile            │
│          (React Native)                 │
└─────────────────────────────────────────┘
              ↓ HTTP/WebSocket
┌─────────────────────────────────────────┐
│      🐳 Conteneur Backend               │
│      Node.js + Express                  │
│      Port: 5000                         │
└─────────────────────────────────────────┘
              ↓ Mongoose
┌─────────────────────────────────────────┐
│      🐳 Conteneur MongoDB               │
│      Base de données                    │
│      Port: 27017                        │
└─────────────────────────────────────────┘
```

---

## 🐛 Dépannage

### Problème : Port 5000 déjà utilisé

**Solution 1 : Changer le port**
```yaml
# Dans docker-compose.yml
ports:
  - "5001:5000"  # Utiliser 5001 au lieu de 5000
```

**Solution 2 : Trouver et arrêter le processus**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Problème : MongoDB ne démarre pas

```bash
# Supprimer les volumes et recommencer
docker-compose down -v
docker-compose up -d
```

### Problème : Le backend ne se connecte pas à MongoDB

```bash
# Vérifier les logs
docker-compose logs backend

# Redémarrer le backend
docker-compose restart backend
```

### Problème : Les modifications du code ne sont pas prises en compte

```bash
# Reconstruire l'image
docker-compose build backend
docker-compose up -d
```

### Problème : L'app mobile ne se connecte pas au backend

**Android :**
```env
# mobile/.env
API_URL=http://10.0.2.2:5000/api
```

**iOS :**
```env
# mobile/.env
API_URL=http://localhost:5000/api
```

**Appareil physique :**
```env
# Remplacer par l'IP de votre ordinateur
API_URL=http://192.168.1.X:5000/api
```

---

## 🎯 Workflow de Développement

### Développement quotidien

```bash
# 1. Matin : Démarrer
docker-compose up -d

# 2. Coder...
# Les modifications sont automatiques grâce aux volumes

# 3. Voir les logs en temps réel
docker-compose logs -f backend

# 4. Soir : Arrêter
docker-compose down
```

### Déploiement

```bash
# 1. Construire pour production
docker-compose -f docker-compose.prod.yml build

# 2. Déployer
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📦 Ce Qui Est Inclus

### docker-compose.yml
- ✅ Service MongoDB
- ✅ Service Backend
- ✅ Réseau interne
- ✅ Volumes persistants
- ✅ Variables d'environnement

### backend/Dockerfile
- ✅ Image Node.js Alpine (légère)
- ✅ Installation des dépendances
- ✅ Hot-reload pour développement
- ✅ Port 5000 exposé

### Scripts de Lancement
- ✅ `lancer-app.bat` (Windows)
- ✅ `lancer-app.sh` (Mac/Linux)
- ✅ Automatisation complète

---

## 🎉 Avantages de Docker

✅ **Pas d'installation** : Ni Node.js, ni MongoDB
✅ **Portable** : Fonctionne partout
✅ **Isolé** : N'affecte pas votre système
✅ **Rapide** : Démarre en quelques secondes
✅ **Propre** : Un seul `docker-compose down` pour tout nettoyer
✅ **Reproductible** : Même environnement pour tous

---

## 🚀 Commandes Rapides

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Status
docker-compose ps

# Seed data
docker-compose exec backend npm run seed

# Shell backend
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh pharmalivraison
```

---

## ✅ Checklist de Démarrage

- [ ] Docker installé
- [ ] Docker Compose installé
- [ ] Ports 5000 et 27017 libres
- [ ] Lancé `lancer-app.bat` ou `lancer-app.sh`
- [ ] Backend accessible sur http://localhost:5000
- [ ] Données de test créées
- [ ] App mobile configurée avec bonne URL
- [ ] App mobile lancée avec `npm start`

---

**Avec Docker, c'est aussi simple que ça ! 🐳**

**Tout démarre en UN CLIC ! 🚀**








