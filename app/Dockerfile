FROM node:20.11.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install nodemon -g

EXPOSE 3000

CMD npm run dev