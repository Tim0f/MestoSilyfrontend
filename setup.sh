#!/bin/bash

echo "🏀 Баскетбольный клуб - Установка фронтенда"
echo "==========================================="
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js 18 или выше."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18 или выше. У вас: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

echo ""
echo "✅ Зависимости установлены успешно!"
echo ""

# Создание .env если не существует
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cat > .env << EOL
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Баскетбольный клуб
EOL
    echo "✅ .env файл создан"
else
    echo "✅ .env файл уже существует"
fi

echo ""
echo "==========================================="
echo "✨ Установка завершена успешно!"
echo ""
echo "📚 Следующие шаги:"
echo ""
echo "1. Запустите бэкенд:"
echo "   cd ../backend"
echo "   npm run start:dev"
echo ""
echo "2. Запустите фронтенд:"
echo "   npm run dev"
echo ""
echo "3. Откройте браузер:"
echo "   http://localhost:3000"
echo ""
echo "📖 Документация:"
echo "   - START_HERE.md - начало работы"
echo "   - QUICKSTART.md - быстрый старт"
echo "   - FEATURES.md - функционал"
echo ""
echo "🚀 Готово к работе!"
echo "==========================================="

