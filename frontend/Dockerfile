FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./
COPY vite.config.js ./

COPY . .

RUN npm install

# Build arguments
ARG VITE_BACKEND_SERVER=https://erp-crm-backend-dtwiqq6p6q-uc.a.run.app/
ARG VITE_FILE_BASE_URL=https://erp-crm-backend-dtwiqq6p6q-uc.a.run.app/

# Set environment variables for build
ENV VITE_BACKEND_SERVER=$VITE_BACKEND_SERVER
ENV VITE_FILE_BASE_URL=$VITE_FILE_BASE_URL
ENV PROD=true

# Build the app
RUN npm run build

# Production stage
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]