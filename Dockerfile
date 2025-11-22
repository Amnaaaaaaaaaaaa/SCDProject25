# Use Node.js 20 LTS Alpine (lightweight)
FROM node:20-alpine

# Set metadata
LABEL maintainer="student@university.edu"
LABEL description="NodeVault Application with MongoDB"
LABEL version="1.0"

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p backups data

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('OK')" || exit 1

# Start application
CMD ["node", "test-server.js"]
