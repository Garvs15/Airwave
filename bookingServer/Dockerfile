FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn install

EXPOSE 4001

CMD ["yarn", "start"]
