# Баскетбольный клуб - Установка фронтенда (Windows PowerShell)

Write-Host "🏀 Баскетбольный клуб - Установка фронтенда" -ForegroundColor Cyan
Write-Host "==========================================="
Write-Host ""

# Проверка Node.js
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js не установлен. Пожалуйста, установите Node.js 18 или выше." -ForegroundColor Red
    exit 1
}

$versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($versionNumber -lt 18) {
    Write-Host "❌ Требуется Node.js версии 18 или выше. У вас: $nodeVersion" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
Write-Host ""

# Установка зависимостей
Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при установке зависимостей" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Зависимости установлены успешно!" -ForegroundColor Green
Write-Host ""

# Создание .env если не существует
if (-not (Test-Path .env)) {
    Write-Host "📝 Создание .env файла..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Баскетбольный клуб
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✅ .env файл создан" -ForegroundColor Green
} else {
    Write-Host "✅ .env файл уже существует" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================="
Write-Host "✨ Установка завершена успешно!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Следующие шаги:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Запустите бэкенд:"
Write-Host "   cd ..\backend"
Write-Host "   npm run start:dev"
Write-Host ""
Write-Host "2. Запустите фронтенд:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Откройте браузер:"
Write-Host "   http://localhost:3000"
Write-Host ""
Write-Host "📖 Документация:" -ForegroundColor Cyan
Write-Host "   - START_HERE.md - начало работы"
Write-Host "   - QUICKSTART.md - быстрый старт"
Write-Host "   - FEATURES.md - функционал"
Write-Host ""
Write-Host "🚀 Готово к работе!" -ForegroundColor Green
Write-Host "==========================================="

