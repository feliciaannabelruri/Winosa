FROM node:20-alpine
WORKDIR /app
COPY backend-project/package*.json ./
RUN npm install
COPY backend-project/ .
EXPOSE 5000
CMD ["node", "server.js"]