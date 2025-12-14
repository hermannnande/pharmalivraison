@echo off
echo ========================================
echo   BUILD APK - PHARMA LIVREUR
echo ========================================
echo.

echo [1/4] Build React App...
cd pharma-livreur
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors du build React!
    pause
    exit /b 1
)

echo.
echo [2/4] Sync avec Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERREUR lors de la synchronisation!
    pause
    exit /b 1
)

echo.
echo [3/4] Build APK Android...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ERREUR lors du build Android!
    echo.
    echo Assurez-vous d'avoir:
    echo - Java JDK 11 ou superieur installe
    echo - JAVA_HOME configure
    echo - Android SDK installe
    pause
    exit /b 1
)

echo.
echo [4/4] Copie de l'APK...
cd ..
if not exist "apk" mkdir apk
copy "android\app\build\outputs\apk\debug\app-debug.apk" "apk\PharmaLivreur.apk"

echo.
echo ========================================
echo   BUILD TERMINE !
echo ========================================
echo.
echo APK cree: pharma-livreur\apk\PharmaLivreur.apk
echo.
echo Transferez ce fichier sur votre telephone et installez-le.
echo.
pause

