# =============================================================================
# Stage 1: Install dependencies
# Uses Node Alpine — tiny footprint, deterministic installs via package-lock.
# =============================================================================
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# =============================================================================
# Stage 2: Build the React/Vite bundle
# =============================================================================
FROM deps AS build
WORKDIR /app

COPY . .

# Vite reads VITE_* prefixed env vars at build time.
# The value is injected via docker-compose build args → env.
ARG VITE_API_BASE_URL_V1
ENV VITE_API_BASE_URL_V1=$VITE_API_BASE_URL_V1

RUN npm run build:docker

# =============================================================================
# Stage 3: Serve with Nginx
# Unprivileged nginx image.  Static assets only — zero Node runtime overhead.
# =============================================================================
FROM nginx:1.27-alpine AS runtime

# Replace the default config with our SPA-friendly one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
