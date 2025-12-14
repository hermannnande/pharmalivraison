# =====================================================
# SCRIPT DE DÉPLOIEMENT - PHARMALIVRAISON
# =====================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DÉPLOIEMENT PHARMALIVRAISON" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
Write-Host "🔍 Vérification de Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé !" -ForegroundColor Red
    Write-Host "📥 Téléchargez Git : https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Git installé" -ForegroundColor Green

# Vérifier si c'est déjà un repo Git
if (-not (Test-Path ".git")) {
    Write-Host ""
    Write-Host "📦 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

# Demander l'URL du repo GitHub
Write-Host ""
Write-Host "📝 Configuration GitHub" -ForegroundColor Cyan
Write-Host ""
Write-Host "Veuillez créer un repository sur GitHub :" -ForegroundColor Yellow
Write-Host "1. Allez sur https://github.com/new" -ForegroundColor Gray
Write-Host "2. Nom : pharmalivraison" -ForegroundColor Gray
Write-Host "3. Cliquez sur 'Create repository'" -ForegroundColor Gray
Write-Host ""

$repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ex: https://github.com/username/pharmalivraison.git)"

# Vérifier si l'URL est valide
if (-not $repoUrl) {
    Write-Host "❌ URL invalide" -ForegroundColor Red
    exit 1
}

# Ajouter le remote origin
Write-Host ""
Write-Host "🔗 Ajout du remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl
Write-Host "✅ Remote configuré" -ForegroundColor Green

# Ajouter tous les fichiers
Write-Host ""
Write-Host "📂 Ajout des fichiers..." -ForegroundColor Yellow
git add .
Write-Host "✅ Fichiers ajoutés" -ForegroundColor Green

# Commit
Write-Host ""
$commitMessage = Read-Host "Message de commit (appuyez sur Entrée pour 'Initial commit')"
if (-not $commitMessage) {
    $commitMessage = "Initial commit - PharmaLivraison"
}

Write-Host "💾 Création du commit..." -ForegroundColor Yellow
git commit -m "$commitMessage"
Write-Host "✅ Commit créé" -ForegroundColor Green

# Push vers GitHub
Write-Host ""
Write-Host "🚀 Envoi vers GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Vous devrez peut-être vous authentifier avec GitHub..." -ForegroundColor Yellow
Write-Host ""

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✅ CODE DÉPLOYÉ SUR GITHUB !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Votre code est maintenant sur GitHub !" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Backend (Railway)" -ForegroundColor Cyan
    Write-Host "   👉 Allez sur https://railway.app" -ForegroundColor Gray
    Write-Host "   👉 Connectez-vous avec GitHub" -ForegroundColor Gray
    Write-Host "   👉 Déployez depuis votre repo" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2️⃣  Apps (Vercel)" -ForegroundColor Cyan
    Write-Host "   👉 Allez sur https://vercel.com" -ForegroundColor Gray
    Write-Host "   👉 Connectez-vous avec GitHub" -ForegroundColor Gray
    Write-Host "   👉 Déployez pharma-client et pharma-livreur" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 Consultez DEPLOIEMENT-GRATUIT.md pour les détails" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERREUR lors du push" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions :" -ForegroundColor Yellow
    Write-Host "1. Vérifiez que vous avez créé le repo sur GitHub" -ForegroundColor Gray
    Write-Host "2. Vérifiez votre connexion Internet" -ForegroundColor Gray
    Write-Host "3. Authentifiez-vous avec GitHub : git config --global user.name 'Votre Nom'" -ForegroundColor Gray
    Write-Host "   et : git config --global user.email 'votre@email.com'" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "Appuyez sur une touche pour quitter..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")




