# Build stage
FROM node:18-alpine AS dev

WORKDIR /app

# Install dependencies including development dependencies
COPY package*.json ./
RUN npm ci

# Copy the application code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Add a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
USER nodeapp

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS prod

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Generate the Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Copy the built application and Prisma Client from the build stage
COPY /app/dist ./dist
COPY /app/prisma ./prisma
# COPY /app/node_modules/.prisma ./node_modules/.prisma

# Ensure the Prisma schema is copied
COPY prisma/schema.prisma ./prisma/

# Add a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001
USER nodeapp

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
