# Multi-stage Dockerfile for React + Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install dependencies
COPY package.json ./
RUN npm install

# Copy application source code
COPY . .

# Build production static assets
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 3000;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Copy compiled build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
