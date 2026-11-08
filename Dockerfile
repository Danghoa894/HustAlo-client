# Dockerfile — development_guide.md §9.2. Context = gốc HustAlo-client: docker build -t hustalo-client .
# Image chỉ phục vụ file tĩnh (non-root, cổng 8080); TLS + proxy /api, /socket.io nằm ở nginx biên (§9.3).

# ---- build: typecheck + vite build + quét secret (AC-105) + kích thước bundle (NFR-05) ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime: nginx không chạy bằng root ----
FROM nginxinc/nginx-unprivileged:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
