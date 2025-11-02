# ------------------- Stage 1: Build Stage ------------------------------
FROM node:21 AS client-builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependency
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# ------------------- Stage 2: Final Stage ------------------------------

FROM nginx:alpine

# Copy build files from React build
COPY --from=client-builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
