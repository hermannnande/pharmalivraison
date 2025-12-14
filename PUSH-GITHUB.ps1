# =====================================================
# SCRIPT DEPLOIEMENT GITHUB - VERSION SIMPLE
# =====================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEPLOIEMENT GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier Git
Write-Host "Verification de Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "ERREUR : Git n'est pas installe !" -ForegroundColor Red
    Write-Host "Telechargez Git : https://git-scm.com/download/win" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "OK - Git installe" -ForegroundColor Green
Write-Host ""

# Initialiser Git
if (-not (Test-Path ".git")) {
    Write-Host "Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "OK - Repository initialise" -ForegroundColor Green
} else {
    Write-Host "OK - Repository deja initialise" -ForegroundColor Green
}
Write-Host ""

# Demander l'URL du repo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IMPORTANT :" -ForegroundColor Yellow
Write-Host "1. Allez sur https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name : pharmalivraison" -ForegroundColor White
Write-Host "3. Cliquez sur Create repository" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Collez l'URL de votre repo GitHub (ex: https://github.com/username/pharmalivraison.git)"

if (-not $repoUrl) {
    Write-Host "ERREUR : URL vide" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Configuration du remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl
Write-Host "OK - Remote configure" -ForegroundColor Green
Write-Host ""

# Ajouter fichiers
Write-Host "Ajout des fichiers..." -ForegroundColor Yellow
git add .
Write-Host "OK - Fichiers ajoutes" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "Creation du commit..." -ForegroundColor Yellow
git commit -m "Initial commit - PharmaLivraison"
Write-Host "OK - Commit cree" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Envoi vers GitHub..." -ForegroundColor Yellow
Write-Host "Vous devrez peut-etre vous authentifier..." -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   CODE SUR GITHUB !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifiez : $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "PROCHAINE ETAPE : Railway (Backend)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERREUR lors du push" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions :" -ForegroundColor Yellow
    Write-Host "1. Verifiez que le repo existe sur GitHub" -ForegroundColor Gray
    Write-Host "2. Authentifiez-vous avec votre compte GitHub" -ForegroundColor Gray
    Write-Host ""
}

pause




