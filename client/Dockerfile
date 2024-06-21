FROM node:latest AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

#production stage
#using nginx as web server to serve static files
FROM nginx:stable-alpine AS production

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY nginxDefault.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]










