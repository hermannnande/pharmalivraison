# 📱 INSTRUCTIONS SIMPLES - Tester sur Votre Téléphone

## ✅ Configuration Terminée !

Votre adresse IP : **192.168.1.5** ✅
Application configurée : **Prête** ✅

---

## 🚀 3 ÉTAPES SIMPLES

### 1️⃣ Préparer Votre Téléphone (2 minutes)

**Sur votre téléphone Android :**

#### A. Activer le Mode Développeur
```
Paramètres 
  → À propos du téléphone
    → Taper 7 FOIS sur "Numéro de build"
      → ✅ "Vous êtes développeur !"
```

#### B. Activer le Débogage USB
```
Paramètres
  → Options pour développeurs
    → Activer "Options pour développeurs"
    → Activer "Débogage USB"
      → ✅ Débogage activé !
```

#### C. Connecter à l'Ordinateur
```
1. Brancher le câble USB
2. Sur le téléphone → Popup "Autoriser débogage USB ?"
3. Cocher "Toujours autoriser depuis cet ordinateur"
4. Cliquer "OK"
   → ✅ Téléphone connecté !
```

---

### 2️⃣ Lancer l'Application (1 clic)

**Sur votre ordinateur :**

**Double-cliquez sur ce fichier :**
```
lancer-app-telephone.bat
```

C'est dans le dossier `C:\Users\nande\Desktop\pharmarcie delivery\`

**OU copiez-collez dans PowerShell :**
```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery"
.\lancer-app-telephone.bat
```

---

### 3️⃣ Attendre l'Installation (3-5 minutes)

**Vous verrez dans le terminal :**
```
> Task :app:compileDebugJavaWithJavac
> Task :app:installDebug
BUILD SUCCESSFUL in 2m 34s
```

**Sur votre téléphone :**
- L'app **PharmaLivraison** s'installe
- L'app **s'ouvre automatiquement**
- ✅ **Vous voyez l'écran de sélection de rôle !**

---

## 🎯 Tester l'Application

### Test Client

1. **Choisir** "Client" (bouton vert 👤)
2. **Se connecter** :
   - Téléphone : `0707070707`
   - Mot de passe : `test123`
3. ✅ **Voir** la carte avec les pharmacies
4. **Cliquer** "Commander des médicaments"
5. **Remplir** le formulaire
6. **Prendre** une photo d'ordonnance (optionnel)
7. **Valider** la commande

### Test Livreur

1. **Se déconnecter**
2. **Choisir** "Livreur" (bouton orange 🏍️)
3. **Se connecter** :
   - Téléphone : `0708080808`
   - Mot de passe : `test123`
4. **Activer** "Disponible"
5. **Accepter** une commande
6. **Suivre** le workflow

---

## 🐛 Si Problème

### ❌ "No devices found"

**Solution :**
1. Débrancher et rebrancher le câble USB
2. Sur le téléphone :
   - Dérouler les notifications
   - Cliquer "Chargement USB"
   - Choisir "Transfert de fichiers"

### ❌ Build échoue

**Solution :**
1. Assurez-vous d'être connecté à Internet
2. Réessayez : `.\lancer-app-telephone.bat`

### ❌ App ne se connecte pas au backend

**Solution :**
1. Vérifiez que téléphone et PC sont sur le **même WiFi**
2. Vérifiez que le backend tourne : `docker-compose ps`
3. Testez depuis le navigateur du téléphone : `http://192.168.1.5:5000`

---

## ✅ Checklist Finale

Avant de lancer :

- [ ] Mode développeur activé ✓
- [ ] Débogage USB activé ✓
- [ ] Téléphone connecté via USB ✓
- [ ] Téléphone et PC sur même WiFi ✓
- [ ] Backend Docker en cours (`docker-compose ps`) ✓
- [ ] Fichier `.env` configuré (192.168.1.5) ✓

**Tout est prêt ? Double-cliquez sur `lancer-app-telephone.bat` ! 🚀**

---

## 🎊 Une Fois l'App Installée

L'application **PharmaLivraison** sera **installée de façon permanente** sur votre téléphone !

**Vous pourrez :**
- 📱 L'ouvrir comme n'importe quelle app
- 🗺️ Voir les pharmacies d'Abidjan
- 💊 Commander des médicaments
- 📸 Prendre des photos d'ordonnances
- ✅ La montrer à qui vous voulez !

---

## 📞 Comptes de Test

| Rôle | Téléphone | Mot de passe |
|------|-----------|--------------|
| Client | 0707070707 | test123 |
| Livreur | 0708080808 | test123 |

---

**🚀 Double-cliquez sur `lancer-app-telephone.bat` pour commencer ! 🚀**

**⏱️ Dans 5 minutes, vous aurez l'app sur votre téléphone ! 📱**








