# paso 1: Construccion del entorno
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# paso 2: Ejecucion del entorno
FROM nginx:alpine
COPY --from=build /app/dist/cookbook/browser /usr/share/nginx/html

# configuracion de nginx para manejar rutas de angular
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# comando de ejecucion
CMD ["nginx", "-g", "daemon off;"]
