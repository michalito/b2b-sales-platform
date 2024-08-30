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
# RUN npx tsc --skipLibCheck --noEmit

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
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Ensure the Prisma schema is copied as well
COPY --from=build /app/prisma/schema.prisma ./

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
