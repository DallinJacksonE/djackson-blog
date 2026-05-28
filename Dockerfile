# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application and compile it
COPY . .
RUN npm run build

# --- Stage 2: Serve the Application ---
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy the essential package files for the production server
COPY package*.json ./
# Install ONLY production dependencies (like express) to keep the container tiny
RUN npm install --omit=dev

# Copy the Express server script
COPY server.js .

# Copy the compiled Vite output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the internal container port
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
