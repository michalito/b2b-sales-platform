# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Development stage
FROM node:18-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
EXPOSE 5173
CMD ["npx", "serve", "-s", ".", "-l", "5173"]