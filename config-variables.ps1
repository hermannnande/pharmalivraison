# Configuration des variables d'environnement pour Android Studio
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Android pour PharmaLivraison" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Définir ANDROID_HOME
Write-Host "Configuration de ANDROID_HOME..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')

# Ajouter les outils Android au PATH
Write-Host "Ajout des outils Android au PATH..." -ForegroundColor Yellow
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools",
    "$env:LOCALAPPDATA\Android\Sdk\emulator",
    "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin"
)

foreach ($path in $androidPaths) {
    if ($currentPath -notlike "*$path*") {
        $currentPath += ";$path"
    }
}

[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'User')

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Variables configurées avec succès !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Fermez TOUS les PowerShell et ouvrez-en un NOUVEAU !" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ensuite, lancez: npx react-native run-android" -ForegroundColor Cyan
Write-Host ""








