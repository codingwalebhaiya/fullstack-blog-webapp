# Stage 1
FROM node:21 AS server-builder

# setup the working dir
WORKDIR /app

# code
COPY . .

# packages install
RUN npm install

# ------------------- Stage 2: Final Stage ------------------------------
FROM node:21-slim

# setup the working dir
WORKDIR /app

# copy the above stage as compressed
COPY --from=server-builder /app .

COPY .env.docker .env

# Port
EXPOSE 8080

# App
CMD ["npm", "start"]