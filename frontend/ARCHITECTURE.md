# Архитектура фронтенд приложения

## 📁 Структура проекта

```
frontend/
├── public/                      # Статические файлы
│   └── basketball.svg          # Иконка приложения
├── src/
│   ├── components/             # Переиспользуемые компоненты
│   │   ├── Badge.tsx          # Компонент бейджа
│   │   ├── Button.tsx         # Компонент кнопки
│   │   ├── Card.tsx           # Компонент карточки
│   │   ├── EmptyState.tsx     # Компонент пустого состояния
│   │   ├── ErrorMessage.tsx   # Компонент ошибки
│   │   ├── Footer.tsx         # Футер сайта
│   │   ├── Header.tsx         # Хедер сайта
│   │   ├── Layout.tsx         # Основной layout
│   │   ├── Loading.tsx        # Компонент загрузки
│   │   └── ProtectedRoute.tsx # Защищённый роут
│   ├── context/               # React Context
│   │   └── AuthContext.tsx   # Контекст авторизации
│   ├── hooks/                 # Кастомные хуки
│   │   ├── useDebounce.ts    # Хук debounce
│   │   ├── useFetch.ts       # Хук для fetch запросов
│   │   └── useLocalStorage.ts # Хук для localStorage
│   ├── pages/                 # Страницы приложения
│   │   ├── ChatsPage.tsx     # Страница чатов
│   │   ├── HomePage.tsx      # Главная страница
│   │   ├── LoginPage.tsx     # Страница входа
│   │   ├── NewsPage.tsx      # Страница новостей
│   │   ├── ProfilePage.tsx   # Страница профиля
│   │   ├── RegisterPage.tsx  # Страница регистрации
│   │   ├── SchedulePage.tsx  # Страница расписания
│   │   ├── SectionsPage.tsx  # Страница секций
│   │   └── ShopPage.tsx      # Страница магазина
│   ├── types/                 # TypeScript типы
│   │   └── index.ts          # Все типы приложения
│   ├── utils/                 # Утилиты
│   │   ├── api.ts            # API клиент
│   │   └── formatDate.ts     # Утилиты для дат
│   ├── constants/             # Константы
│   │   └── index.ts          # Константы приложения
│   ├── App.tsx               # Главный компонент
│   ├── main.tsx              # Точка входа
│   ├── index.css             # Глобальные стили
│   └── vite-env.d.ts         # TypeScript декларации
├── .eslintrc.cjs             # Конфигурация ESLint
├── .gitignore                # Git ignore
├── index.html                # HTML шаблон
├── package.json              # Зависимости
├── postcss.config.js         # PostCSS конфигурация
├── tailwind.config.js        # Tailwind конфигурация
├── tsconfig.json             # TypeScript конфигурация
├── vite.config.ts            # Vite конфигурация
├── README.md                 # Основная документация
├── QUICKSTART.md             # Быстрый старт
└── ARCHITECTURE.md           # Архитектура (этот файл)
```

## 🏗️ Архитектурные решения

### 1. Роутинг

Используется **React Router v6** для навигации:
- Публичные маршруты: главная, магазин, расписание, новости, секции
- Защищённые маршруты: профиль, чаты
- Отдельные маршруты для аутентификации: вход, регистрация

### 2. Управление состоянием

**React Context API** для глобального состояния:
- `AuthContext` - авторизация пользователя
- Локальное состояние компонентов для UI

### 3. Работа с API

- Централизованный API клиент (`src/utils/api.ts`)
- Автоматическое добавление токена к запросам
- Обработка ошибок 401 (перенаправление на login)
- Axios interceptors для глобальной обработки

### 4. Типизация

Строгая типизация с **TypeScript**:
- Интерфейсы для всех данных (`src/types/index.ts`)
- Типизированные props для компонентов
- Type-safe API запросы

### 5. Стилизация

**Tailwind CSS** для всех стилей:
- Utility-first подход
- Кастомная цветовая палитра (оранжевый/голубой)
- Адаптивный дизайн (mobile-first)
- Компоненты с вариантами (Button, Badge)

## 🔄 Потоки данных

### Аутентификация

```
LoginPage → AuthContext.login() → API /auth/login → 
→ Сохранение токена → Обновление user → Redirect
```

### Загрузка данных

```
Page Component → useEffect → axios.get → 
→ setState → Re-render
```

### Создание данных

```
Form Submit → axios.post → Success/Error → 
→ Reload data / Show message
```

## 🎨 UI/UX паттерны

### 1. Градиенты
- Кнопки: `from-orange-500 to-orange-600`
- Карточки профиля: `from-orange-400 to-orange-600`
- Хедер: `from-orange-500 to-orange-600`

### 2. Тени и эффекты
- Карточки: `shadow-lg` + `hover:shadow-xl`
- Активные элементы: `active:scale-95`

### 3. Состояния загрузки
- Спиннер для долгих операций
- Скелетоны для списков (можно добавить)
- Сообщения об успехе/ошибке

### 4. Пустые состояния
- Иконка + текст + действие
- Используется компонент `EmptyState`

## 🔐 Безопасность

1. **Токены**: Хранятся в localStorage
2. **Protected Routes**: Проверка авторизации перед доступом
3. **API клиент**: Автоматическое добавление токена
4. **Validation**: Проверка форм на клиенте

## 📱 Адаптивность

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Адаптивные компоненты
- Header: меню скрывается на мобильных
- Grid layouts: от 1 до 4 колонок
- Карточки: stack на мобильных

## ⚡ Оптимизация

### Текущая
- Vite для быстрой сборки
- Tree-shaking неиспользуемого кода
- Минификация в продакшене

### Возможные улучшения
- Code splitting по роутам
- Lazy loading компонентов
- Виртуализация длинных списков
- Кеширование API запросов (React Query)
- Service Worker для offline работы

## 🧪 Тестирование

### Сейчас
Тесты не реализованы

### Рекомендации
- Unit тесты: Jest + React Testing Library
- E2E тесты: Playwright / Cypress
- Покрытие: минимум 70%

## 📦 Зависимости

### Production
- `react` - UI библиотека
- `react-dom` - DOM рендеринг
- `react-router-dom` - Роутинг
- `axios` - HTTP клиент
- `lucide-react` - Иконки

### Development
- `typescript` - Типизация
- `vite` - Сборщик
- `tailwindcss` - CSS фреймворк
- `eslint` - Линтер
- `@vitejs/plugin-react` - React плагин для Vite

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

### Docker (рекомендуется)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

## 🔮 Будущие улучшения

1. **State Management**: Переход на Redux / Zustand
2. **API Layer**: Интеграция React Query
3. **Forms**: Использование React Hook Form
4. **Validation**: Zod для схем валидации
5. **i18n**: Мультиязычность
6. **Theme**: Тёмная тема
7. **PWA**: Progressive Web App
8. **Notifications**: Push уведомления
9. **Analytics**: Google Analytics / Mixpanel
10. **Error Tracking**: Sentry

## 📚 Дополнительные ресурсы

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Docs](https://reactrouter.com)

