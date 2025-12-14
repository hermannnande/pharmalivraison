@echo off
echo ================================
echo  LANCEMENT DASHBOARD ADMIN
echo  PharmaLivraison Abidjan
echo ================================
echo.

cd admin
echo [1/2] Verification du dossier...
if not exist "package.json" (
    echo ERREUR: Fichier package.json non trouve
    pause
    exit /b 1
)

echo [2/2] Lancement du dashboard...
echo.
echo Le dashboard va s'ouvrir sur http://localhost:3000
echo.
echo Compte Admin:
echo   Telephone: 0700000000
echo   Mot de passe: admin123
echo.
echo ================================
echo.

set BROWSER=none
npm start








