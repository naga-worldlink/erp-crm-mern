FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./
COPY vite.config.js ./

COPY . .

# Accept build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm install

# Build the frontend with the API URL
RUN npm run build

EXPOSE 3000

# Serve the built files
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]