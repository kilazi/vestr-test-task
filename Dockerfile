# Use the official Node.js runtime as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for potential future Puppeteer usage)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy and install backend dependencies first (for better caching)
COPY backend/package*.json ./backend/
RUN cd backend && npm ci

# Copy and install client dependencies
COPY client/package*.json ./client/
RUN cd client && npm ci

# Copy source code
COPY backend/ ./backend/
COPY client/ ./client/

# Copy any shared config files
COPY *.json ./

# Build the backend (TypeScript compilation)
RUN cd backend && npm run build

# Remove dev dependencies after build to keep image small
RUN cd backend && npm prune --omit=dev

# Build the client
RUN cd client && npm run build

# Remove dev dependencies after build to keep image small
RUN cd client && npm prune --omit=dev

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Set working directory to backend
WORKDIR /app/backend

# Start the application
CMD ["node", "dist/index.js"]

