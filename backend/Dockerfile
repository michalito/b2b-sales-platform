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
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001
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

# Copy the built application and Prisma Client from the build stage
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/prisma ./prisma
COPY --from=dev /app/node_modules/.prisma ./node_modules/.prisma

# Ensure the Prisma schema is copied as well
COPY prisma/schema.prisma ./prisma/

# Add a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001
USER nodeapp

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]