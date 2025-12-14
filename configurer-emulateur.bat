@echo off
echo ========================================
echo Configuration pour Emulateur Android
echo ========================================
echo.

cd mobile

echo # Configuration de l'API pour EMULATEUR ANDROID > .env
echo # 10.0.2.2 est l'adresse localhost pour l'emulateur Android >> .env
echo API_URL=http://10.0.2.2:5000/api >> .env
echo SOCKET_URL=http://10.0.2.2:5000 >> .env
echo. >> .env
echo # Pour telephone physique, utilisez plutot : >> .env
echo # API_URL=http://192.168.1.5:5000/api >> .env
echo # SOCKET_URL=http://192.168.1.5:5000 >> .env
echo. >> .env
echo # Cle API Google Maps >> .env
echo GOOGLE_MAPS_API_KEY=AIzaSyDemoKey123456789 >> .env

echo.
echo ✅ Fichier .env configure pour emulateur !
echo.
echo Configuration :
echo - API_URL=http://10.0.2.2:5000/api
echo - SOCKET_URL=http://10.0.2.2:5000
echo.
echo ========================================
echo Vous pouvez maintenant lancer l'app :
echo   npx react-native run-android
echo ========================================
echo.

cd ..
pause








