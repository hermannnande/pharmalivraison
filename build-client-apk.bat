@echo off
echo ========================================
echo   BUILD APK - PHARMA CLIENT
echo ========================================
echo.

REM Configurer l'environnement
echo [0/5] Configuration environnement...
for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-*") do set "JAVA_HOME=%%i"
if not defined JAVA_HOME (
    for /d %%i in ("C:\Program Files\Java\jdk-*") do set "JAVA_HOME=%%i"
)
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

echo [1/5] Build React App...
cd pharma-client
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors du build React!
    pause
    exit /b 1
)

echo.
echo [2/5] Sync avec Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERREUR lors de la synchronisation!
    pause
    exit /b 1
)

echo.
echo [3/5] Preparation Gradle...
cd android
if not exist "local.properties" (
    echo sdk.dir=%ANDROID_HOME:\=\\%> local.properties
    echo Configuration local.properties creee
)

echo.
echo [4/5] Build APK Android (peut prendre 5-10 minutes)...
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ERREUR lors du build Android!
    echo.
    echo Verifiez:
    echo - Java JDK 11+ installe
    echo - Android SDK installe via Android Studio
    echo - Variables d'environnement configurees
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Copie de l'APK...
cd ..
if not exist "apk" mkdir apk
copy "android\app\build\outputs\apk\debug\app-debug.apk" "apk\PharmaClient.apk" >nul

echo.
echo ========================================
echo   BUILD TERMINE !
echo ========================================
echo.
echo APK cree: pharma-client\apk\PharmaClient.apk
echo Taille: 
dir "apk\PharmaClient.apk" | find "PharmaClient.apk"
echo.
echo Transferez ce fichier sur votre telephone et installez-le.
echo.
pause
