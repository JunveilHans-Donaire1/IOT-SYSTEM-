# =========================
# Stage 1: Build React app
# =========================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Vite app (output goes to /app/dist)
RUN npm run build

# =========================
# Stage 2: Serve the built app
# =========================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app/dist ./dist

# Install serve globally to serve the static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]