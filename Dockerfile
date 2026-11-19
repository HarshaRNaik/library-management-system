# Use a supported Node.js LTS runtime
FROM node:22-alpine

# Application configuration
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Set the working directory
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code
COPY --chown=node:node src ./src

# Run as a non-root user
USER node

# Document the application port
EXPOSE 5000

# Check application health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the application
CMD ["node", "src/server.js"]
