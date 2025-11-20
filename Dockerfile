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

# Check what was built and verify main file exists
RUN find dist/ -name "*.js" -type f && ls -la dist/src/

# Remove dev dependencies after successful build
RUN npm prune --production

EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

CMD ["node", "dist/src/index.js"]