
# ==============================
# Stage 1: Build Vite React App
# ==============================
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Vite build-time environment variable
ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=${VITE_SERVER_BASE_URL}

# Copy package configuration
COPY package.json ./

# Install dependencies, including optional native packages
RUN npm install --include=optional

# Copy application source
COPY . .

# Build Vite application
RUN npm run build

# ==============================
# Stage 2: Serve using Nginx
# ==============================
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Vite generates production files in dist/
COPY --from=build /app/dist .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
