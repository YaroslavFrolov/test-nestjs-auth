FROM node:20-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install && yarn cache clean --all

COPY . .

RUN yarn build

CMD ["yarn", "start:dev"]
