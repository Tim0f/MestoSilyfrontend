# 🚀 Развертывание фронтенда

## Варианты развертывания

### 1. Development (локально)

```bash
npm install
npm run dev
```

Приложение доступно на: http://localhost:3000

---

### 2. Production Build (статика)

```bash
npm install
npm run build
```

Готовые файлы в папке `dist/`. Можно разместить на любом статическом хостинге.

#### Предпросмотр production сборки

```bash
npm run preview
```

---

### 3. Docker

#### Сборка образа

```bash
docker build -t basketball-frontend .
```

#### Запуск контейнера

```bash
docker run -p 80:80 basketball-frontend
```

Приложение доступно на: http://localhost

#### Docker Compose (вместе с бэкендом)

Создайте `docker-compose.yml` в корне проекта:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/basketball
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: basketball
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

Запуск:

```bash
docker-compose up -d
```

---

### 4. Vercel (рекомендуется для фронтенда)

#### Через CLI

```bash
npm install -g vercel
vercel
```

#### Через GitHub

1. Пушим код в GitHub
2. Импортируем проект в Vercel
3. Vercel автоматически определит Vite
4. Устанавливаем переменные окружения:
   - `VITE_API_URL`: URL вашего бэкенда

#### Конфигурация vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

### 5. Netlify

#### Через CLI

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Через GitHub

1. Пушим код в GitHub
2. Импортируем проект в Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment variables:
   - `VITE_API_URL`: URL вашего бэкенда

#### Файл netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 6. GitHub Pages

#### package.json добавить:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### vite.config.ts изменить:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... остальная конфигурация
})
```

#### Установка gh-pages

```bash
npm install -D gh-pages
```

#### Деплой

```bash
npm run deploy
```

---

### 7. AWS S3 + CloudFront

#### 1. Создать S3 bucket

```bash
aws s3 mb s3://basketball-club-frontend
```

#### 2. Собрать проект

```bash
npm run build
```

#### 3. Загрузить в S3

```bash
aws s3 sync dist/ s3://basketball-club-frontend --delete
```

#### 4. Настроить S3 для static website hosting

```bash
aws s3 website s3://basketball-club-frontend \
  --index-document index.html \
  --error-document index.html
```

#### 5. Создать CloudFront distribution

- Origin: S3 bucket
- Custom error response: 404 → /index.html (200)

---

## Переменные окружения

### Development (.env.local)

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Баскетбольный клуб
```

### Production (.env.production)

```env
VITE_API_URL=https://api.yourbasketball.com/api
VITE_APP_NAME=Баскетбольный клуб
```

**Важно**: Переменные должны начинаться с `VITE_` чтобы быть доступными в приложении.

---

## CI/CD

### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## Проверка перед деплоем

### Чек-лист

- [ ] Все тесты пройдены (если есть)
- [ ] Линтер не выдаёт ошибок: `npm run lint`
- [ ] Production сборка работает: `npm run build && npm run preview`
- [ ] API URL настроен правильно
- [ ] Переменные окружения установлены
- [ ] .env файлы не попали в git
- [ ] README обновлён
- [ ] Версия в package.json обновлена

### Команды проверки

```bash
# Линтер
npm run lint

# Сборка
npm run build

# Проверка размера бандла
npm run build -- --mode production

# Предпросмотр
npm run preview
```

---

## Мониторинг

### Рекомендуемые инструменты

1. **Sentry** - отслеживание ошибок
2. **Google Analytics** - аналитика
3. **Hotjar** - анализ поведения пользователей
4. **Lighthouse** - производительность

### Интеграция Sentry

```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
})
```

---

## Оптимизация производительности

### 1. Анализ бандла

```bash
npm run build -- --mode production
npx vite-bundle-visualizer
```

### 2. Lazy loading

```typescript
import { lazy, Suspense } from 'react'

const ProfilePage = lazy(() => import('./pages/ProfilePage'))

// В роутинге
<Suspense fallback={<Loading />}>
  <ProfilePage />
</Suspense>
```

### 3. CDN для статики

Использовать CloudFlare / AWS CloudFront

---

## Безопасность

### Заголовки безопасности

Настроены в `nginx.conf`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### HTTPS

Всегда используйте HTTPS в продакшене:
- Vercel/Netlify - автоматически
- Nginx - Let's Encrypt

### API CORS

Убедитесь, что бэкенд разрешает запросы с фронтенд домена.

---

## Поддержка

При возникновении проблем:
1. Проверьте логи сборки
2. Проверьте консоль браузера
3. Убедитесь, что API доступен
4. Проверьте переменные окружения

---

## Полезные ссылки

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Production Build](https://react.dev/learn/production-build)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

