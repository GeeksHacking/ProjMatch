FROM node:18-alpine as base

WORKDIR /frontend

FROM base as deps

COPY package*.json ./

RUN npm install

FROM base as runner

COPY --from=deps /frontend/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD npm run dev