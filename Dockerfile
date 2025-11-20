FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production=false

# Copy source code and config files
COPY . .

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la dist/ && test -f dist/index.js

# Remove dev dependencies after successful build
RUN npm prune --production

EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

CMD ["npm", "start"]