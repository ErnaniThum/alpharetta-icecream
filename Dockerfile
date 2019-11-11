FROM node:alpine as builder

COPY package* ./
RUN apk add --no-cache python make g++
RUN npm install --production

FROM node:alpine as app
COPY --from=builder node_modules ./node_modules

COPY . .
CMD ["npm", "start"]