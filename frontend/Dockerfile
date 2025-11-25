FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./
COPY vite.config.js ./

# Accept build arguments
ARG VITE_BACKEND_SERVER
ARG VITE_FILE_BASE_URL

# Set environment variables
ENV VITE_BACKEND_SERVER=${VITE_BACKEND_SERVER}
ENV VITE_FILE_BASE_URL=${VITE_FILE_BASE_URL}
ENV PROD=true

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]