# ----------------------- Stage 1: Build -------------------
FROM node:21 AS server-builder

# setup the working dir
WORKDIR /app

# code
COPY . .

# packages install
RUN npm install

# ------------------- Stage 2: Runtime ------------------------------
FROM node:21-slim

# setup the working dir
WORKDIR /app

# copy the above stage as compressed
COPY --from=server-builder /app .

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]