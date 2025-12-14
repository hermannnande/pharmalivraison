@echo off
echo ========================================
echo   BUILD LES 2 APK - COMPLET
echo ========================================
echo.

echo Building Client APK...
call build-client-apk.bat
if %errorlevel% neq 0 (
    echo ERREUR lors du build Client!
    pause
    exit /b 1
)

echo.
echo.
echo Building Livreur APK...
call build-livreur-apk.bat
if %errorlevel% neq 0 (
    echo ERREUR lors du build Livreur!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   TOUS LES APK SONT PRETS !
echo ========================================
echo.
echo 1. pharma-client\apk\PharmaClient.apk
echo 2. pharma-livreur\apk\PharmaLivreur.apk
echo.
echo Transferez ces fichiers sur votre telephone.
echo.
pause

