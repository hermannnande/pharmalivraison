@echo off
echo ================================
echo  LANCEMENT APP ANDROID
echo  PharmaLivraison sur Telephone
echo ================================
echo.

echo Verification...
cd /d "%~dp0mobile"

if not exist "package.json" (
    echo ERREUR: Dossier mobile non trouve
    pause
    exit /b 1
)

echo Configuration:
echo - Backend API: http://192.168.1.5:5000
echo - Votre telephone doit etre connecte via USB
echo - Debogage USB doit etre active
echo.

echo ================================
echo  INSTRUCTIONS RAPIDES
echo ================================
echo.
echo Sur votre telephone Android:
echo.
echo 1. Parametres ^> A propos du telephone
echo    Tapez 7 fois sur "Numero de build"
echo.
echo 2. Parametres ^> Options pour developpeurs
echo    Activer "Debogage USB"
echo.
echo 3. Connectez le cable USB
echo    Autorisez le debogage USB
echo.
echo ================================
echo.

pause

echo.
echo Lancement de l'application...
echo Cela peut prendre 3-5 minutes...
echo.

npm run android

echo.
echo ================================
pause








