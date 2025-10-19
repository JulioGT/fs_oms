# Backend Dockerfile
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (needed for build and migrations)
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Keep sequelize-cli for migrations
# Note: We need sequelize-cli in production for migrations

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
