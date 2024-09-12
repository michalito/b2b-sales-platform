# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Production stage
FROM node:18-alpine AS prod
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist /app
COPY --from=build /app/public /app/public
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Set environment variable for development
ENV VITE_API_URL=${VITE_API_URL}
EXPOSE 5173
CMD ["npx", "serve", "-s", ".", "-l", "5173"]