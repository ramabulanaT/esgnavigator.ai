FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++ && corepack enable

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS webbuild
ARG VITE_BASE_URL=/
ENV VITE_BASE_URL=${VITE_BASE_URL}
COPY . .
RUN npm run build

FROM node:20-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY data ./data
COPY --from=webbuild /app/dist ./dist
EXPOSE 3001
CMD ["node","./server/index.js"]

FROM nginx:1.27-alpine AS web
COPY docker/nginx.local.conf /etc/nginx/nginx.conf
COPY --from=webbuild /app/dist /usr/share/nginx/html
