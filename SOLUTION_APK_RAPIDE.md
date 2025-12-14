# 🚀 GUIDE RAPIDE : Créer vos APK Android

## ⚠️ Problème détecté : Java 17 requis

Le plugin Android Gradle nécessite **Java 17** (vous avez Java 11).

---

## ✅ SOLUTION RAPIDE : Utiliser Expo EAS (Recommandé)

Créez vos APK dans le cloud **sans installer Java 17** ni Android Studio complet !

### Étape 1 : Installer Expo CLI

```bash
npm install -g eas-cli
```

### Étape 2 : Se connecter

```bash
eas login
```
Créez un compte gratuit sur https://expo.dev si nécessaire

### Étape 3 : Créer l'APK Client

```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-client"
npm install expo
npx expo init --yes
eas build --platform android --profile preview
```

✅ L'APK sera créé dans le cloud en **10-15 minutes**
✅ Vous recevrez un **lien de téléchargement**

### Étape 4 : Créer l'APK Livreur

```bash
cd "C:\Users\nande\Desktop\pharmarcie delivery\pharma-livreur"
npm install expo
npx expo init --yes
eas build --platform android --profile preview
```

---

## 🔧 OU : Mettre à jour Java vers 17

Si vous préférez build localement :

1. **Téléchargez Java 17** : https://adoptium.net/temurin/releases/?version=17
2. **Installez-le** (remplacera Java 11)
3. **Relancez** `build-client-apk.bat`

---

## 📱 Alternative IMMÉDIATE : Tester sans APK

Vos apps sont **déjà en ligne** sur Vercel !

**Sur votre téléphone** :
1. Ouvrez Chrome
2. Allez sur vos URLs Vercel
3. Menu (⋮) > **"Ajouter à l'écran d'accueil"**
4. ✅ Apps installées comme natives !

**Avantages** :
- ✅ Fonctionne **maintenant** (0 installation)
- ✅ GPS, notifications, tout marche
- ✅ Mises à jour automatiques
- ✅ Pas besoin de réinstaller

---

## 🎯 Recommandation

**Pour tester maintenant** → Utilisez les PWA (Vercel + "Ajouter à l'écran d'accueil")

**Pour créer des vrais APK** → Utilisez **Expo EAS** (build cloud, le plus simple)

**Pour distribution Play Store** → Utilisez Expo EAS avec profil `production`

---

## 📞 URLs de vos apps Vercel

Trouvez vos URLs sur le dashboard Vercel :
- Client : `https://[votre-projet-client].vercel.app`
- Livreur : `https://[votre-projet-livreur].vercel.app`

Ouvrez-les sur mobile et installez-les comme PWA !

