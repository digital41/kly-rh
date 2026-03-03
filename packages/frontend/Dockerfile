# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/frontend/package.json packages/frontend/

RUN npm ci --workspace=@kly-rh/shared --workspace=@kly-rh/frontend

COPY packages/shared/ packages/shared/
COPY packages/frontend/ packages/frontend/
COPY tsconfig.base.json ./

ENV VITE_API_URL=/api/v1
ENV VITE_USE_MOCK=false

RUN npm run build --workspace=@kly-rh/frontend

# --- Serve stage ---
FROM nginx:alpine
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
