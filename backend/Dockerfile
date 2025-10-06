FROM --platform=linux/amd64 node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p uploads src/migrations

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
