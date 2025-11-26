FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./
COPY vite.config.js ./
COPY . .

# Force correct .env
RUN rm -f .env && \
    echo 'VITE_FILE_BASE_URL="https://erp-crm-mern-331764159612.us-central1.run.app/"' > .env && \
    echo 'VITE_BACKEND_SERVER="https://erp-crm-mern-331764159612.us-central1.run.app/"' >> .env && \
    echo 'VITE_DEV_REMOTE="remote"' >> .env

RUN cat .env

RUN npm install

# Build for production - this bakes env vars into the bundle
RUN npm run build

# Production stage
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]