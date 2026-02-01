# Build stage not required for Node backend; single stage is sufficient
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production 2>/dev/null || npm install --omit=dev

COPY . .

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "src/server.js"]
