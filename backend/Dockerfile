#build  stage
FROM node:16-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

#production stage
FROM node:16-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app/public ./public
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]