# Base image
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the application code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the build artifacts from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Ensure the Prisma schema is copied
COPY prisma/schema.prisma ./prisma/

# Add a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
USER nodeapp

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
