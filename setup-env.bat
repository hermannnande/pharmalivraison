@echo off
echo ========================================
echo   CONFIGURATION ENVIRONNEMENT ANDROID
echo ========================================
echo.

echo Recherche de Java JDK...
for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-*") do set "JAVA_HOME=%%i"
if not defined JAVA_HOME (
    for /d %%i in ("C:\Program Files\Java\jdk-*") do set "JAVA_HOME=%%i"
)
if not defined JAVA_HOME (
    for /d %%i in ("C:\Program Files\AdoptOpenJDK\jdk-*") do set "JAVA_HOME=%%i"
)

if defined JAVA_HOME (
    echo [OK] Java JDK trouve: %JAVA_HOME%
    set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
    echo [ERREUR] Java JDK non trouve!
    echo.
    echo Telechargez Java JDK 11 depuis:
    echo https://adoptium.net/temurin/releases/?version=11
    echo.
    pause
    exit /b 1
)

echo.
echo Recherche de Android SDK...
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if exist "%ANDROID_HOME%" (
    echo [OK] Android SDK trouve: %ANDROID_HOME%
    set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%"
) else (
    echo [ATTENTION] Android SDK non trouve a l'emplacement par defaut
    echo Emplacement attendu: %ANDROID_HOME%
    echo.
    echo Verifiez l'installation d'Android Studio et l'emplacement du SDK.
    echo.
)

echo.
echo ========================================
echo   CONFIGURATION COMPLETE
echo ========================================
echo.
echo JAVA_HOME = %JAVA_HOME%
echo ANDROID_HOME = %ANDROID_HOME%
echo.
echo Verification Java:
java -version
echo.

pause

