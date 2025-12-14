# 🚀 COMMANDES MANUELLES - Lancer l'App Android

## 📱 Instructions Pas à Pas

### ⚠️ Problème Identifié

Les scripts automatiques ont un problème avec PowerShell. Voici la solution **manuelle** (5 minutes) :

---

## 🛠️ SOLUTION : Ouvrir Un Nouveau Terminal

### Étape 1 : Ouvrir PowerShell Manuellement

**Méthode 1 - Depuis Windows :**
1. Cliquer sur le menu Démarrer
2. Taper "PowerShell"
3. Cliquer sur "Windows PowerShell"

**Méthode 2 - Depuis l'Explorateur :**
1. Ouvrir le dossier `pharmarcie delivery`
2. Maintenir **Shift** + Clic droit dans le dossier
3. Choisir "Ouvrir PowerShell ici"

---

### Étape 2 : Copier-Coller Ces Commandes

**Dans le nouveau PowerShell, copiez-collez ligne par ligne :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
```

**Puis :**

```powershell
npx react-native run-android
```

**Appuyez sur Entrée et attendez !**

---

## ⏱️ Ce Qui Va Se Passer

### Minute 0-1 : Vérification

```
info Running jetifier...
info Checking Android SDK...
```

### Minute 1-4 : Compilation

```
> Task :app:compileDebugJavaWithJavac
> Task :app:mergeDebugResources
> Task :app:processDebugManifest
```

### Minute 4-5 : Installation

```
> Task :app:installDebug
BUILD SUCCESSFUL in 4m 32s
```

### Minute 5 : Lancement

```
Starting: Intent { cmp=com.pharmalivraison/.MainActivity }
✅ App installée et lancée !
```

---

## 📱 Sur Votre Téléphone

### Préparation (si pas encore fait) :

**1. Mode Développeur :**
```
Paramètres → À propos → Taper 7x sur "Numéro de build"
```

**2. Débogage USB :**
```
Paramètres → Options développeurs → Activer "Débogage USB"
```

**3. Connexion USB :**
```
- Brancher le câble
- Autoriser le débogage USB (popup)
- Cocher "Toujours autoriser"
```

---

## ✅ Vérifications Avant de Lancer

**Checklist Rapide :**

- [ ] ✅ Backend Docker tourne : `docker-compose ps` dans un autre terminal
- [ ] 📱 Téléphone en mode développeur
- [ ] 🔌 Débogage USB activé
- [ ] 🔗 Téléphone connecté via USB
- [ ] 📡 Téléphone et PC sur même WiFi
- [ ] 💾 Dépendances npm installées

**Tout est OK ? Lancez la commande ! 🚀**

---

## 🎯 Commande Finale

**À copier-coller dans un NOUVEAU PowerShell :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

---

## 🐛 Si Ça Ne Marche Pas

### Option Alternative : Expo Go (Plus Simple)

Si React Native ne fonctionne pas, on peut utiliser Expo :

1. **Sur votre téléphone** : Installer "Expo Go" depuis Play Store
2. **Scanner un QR code**
3. **L'app se lance** dans Expo

*(Je peux convertir le projet en Expo si nécessaire)*

---

## 📞 Support

### Besoin d'Aide ?

**Je suis là pour vous aider !**

Si vous avez des erreurs :
1. Copiez le message d'erreur
2. Envoyez-le moi
3. Je vous aiderai à résoudre le problème !

---

## 🎊 Récapitulatif

**Ce Qui Est Prêt :**
- ✅ Backend API (Docker)
- ✅ Dashboard Admin (http://localhost:3000)
- ✅ Code Mobile (prêt à compiler)
- ✅ Configuration (IP, .env)
- ✅ Données de test

**Ce Qu'il Faut Faire :**
- 📱 Préparer le téléphone (mode dev + USB)
- 💻 Ouvrir nouveau PowerShell
- 📋 Copier-coller la commande
- ⏱️ Attendre 5 minutes

---

**🚀 Commande à copier-coller :**

```powershell
cd "C:\Users\nande\Desktop\pharmarcie delivery\mobile"
npx react-native run-android
```

**Bonne chance ! 📱🎉**








