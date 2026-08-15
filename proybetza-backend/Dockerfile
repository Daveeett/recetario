# paso 1: Construccion del entorno
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# paso 2: Ejecucion del entorno
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# se copia el build del paso 1
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/db/migrations ./dist/db/migrations

EXPOSE 3000
CMD ["sh", "-c", "node dist/db/migrate.js && node dist/db/seeds/recipes.seed.js && npm start"]
