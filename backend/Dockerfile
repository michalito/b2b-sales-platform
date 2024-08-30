# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy prisma schema (needed for migrations)
COPY prisma ./prisma/

# Add a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001

# Create a directory for logs and set permissions
RUN mkdir -p /app/logs && chown -R nodeapp:nodejs /app/logs

# Copy the startup script
# COPY docker-entrypoint.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Switch to non-root user
USER nodeapp

# Expose the application port
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Set environment variables
ENV NODE_ENV=production

# # Use the startup script as the entry point
# ENTRYPOINT ["docker-entrypoint.sh"]

# Command to run the application
CMD ["node", "dist/index.js"]