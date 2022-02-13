FROM node:16

WORKDIR /usr/src/hermes-gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "start"]