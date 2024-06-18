FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm", "start" ]