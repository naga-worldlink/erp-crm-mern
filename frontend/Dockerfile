FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./
COPY vite.config.js ./

COPY . .

RUN npm install

# Create .env file with correct backend URL at build time
RUN echo 'VITE_FILE_BASE_URL="https://erp-crm-backend-dtwiqq6p6q-uc.a.run.app/"' > .env && \
    echo 'VITE_BACKEND_SERVER="https://erp-crm-backend-dtwiqq6p6q-uc.a.run.app/"' >> .env && \
    echo 'PROD=true' >> .env

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]