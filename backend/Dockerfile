# Single-stage production image
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only (npm ci requires package-lock.json)
COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

# Copy application source
COPY . .

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "src/server.js"]
