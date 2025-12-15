# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Build args для Vite
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости (fallback на npm install, если нет lock-файла)
RUN if [ -f package-lock.json ]; then npm ci --prefer-offline; else npm install; fi

# Копируем исходники
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

