# Node x64 для совместимости с Windows/WSL2
FROM --platform=linux/amd64 node:22-slim

WORKDIR /app

# Копируем только package.json и package-lock.json для кеширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем исходники
COPY . .

# Создаём папку для uploads
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
