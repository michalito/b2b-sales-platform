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
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist /app
EXPOSE 5173
CMD ["npx", "serve", "-s", "."]
