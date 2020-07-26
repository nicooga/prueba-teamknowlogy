FROM node:12.16.1-alpine3.11

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

CMD npm start
