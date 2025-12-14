Write-Host ""
Write-Host "========================================"  -ForegroundColor Magenta
Write-Host "PHARMALIVRAISON - TEST SIMPLE"  -ForegroundColor Magenta
Write-Host "========================================"  -ForegroundColor Magenta
Write-Host ""

Write-Host "1. Arret de tous les services..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

Write-Host "2. Demarrage backend seul..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\nande\Desktop\pharmarcie delivery\backend-api'; node src/server.js"

Start-Sleep -Seconds 4

Write-Host "3. Test backend..." -ForegroundColor Yellow
try {
    $body = @{
        phone = "+225070707070707"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Token:" ($response.token.Substring(0,30) + "...") -ForegroundColor Cyan
    Write-Host "User:" $response.user.firstName $response.user.lastName -ForegroundColor Cyan
    Write-Host "Role:" $response.user.role -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend fonctionne! Vous pouvez demarrer les apps:" -ForegroundColor Green
    Write-Host "  cd pharma-client && npm start" -ForegroundColor Gray
    Write-Host "  cd pharma-livreur && npm start" -ForegroundColor Gray
} catch {
    Write-Host ""
    Write-Host "ERREUR!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Gray
    Write-Host ""
    Write-Host "Regardez la fenetre du backend pour voir les logs" -ForegroundColor Yellow
}

Write-Host ""
pause




