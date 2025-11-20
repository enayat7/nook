FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && ls -la dist/ && npm prune --production

EXPOSE 3000

USER node

CMD ["npm", "start"]