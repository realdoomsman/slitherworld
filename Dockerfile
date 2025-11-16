FROM node:18-slim

# Install Python and build tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy app files
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "run", "server:prod"]
