# Use the official Node.js runtime as base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Create uploads directory and set permissions
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads

# Copy the rest of the application code
COPY . .

# Remove development files that aren't needed in production
RUN rm -rf .git .gitignore README_TECHNICAL.md .vscode

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Define the command to run the application
CMD ["node", "server.js"]
