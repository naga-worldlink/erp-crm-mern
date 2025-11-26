FROM node:20.9.0-alpine

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

# Verify .env
RUN echo "=== .env content ===" && cat .env

RUN npm install

EXPOSE 8080

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${PORT:-8080}"]