# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
# RUN npm ci --only=production
RUN npm install --omit=dev

# Копируем остальные файлы
COPY . .

# Собираем Next.js
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем
CMD ["npm", "start"]
