FROM node:20-alpine

# Install dependencies for node-canvas and puppeteer
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    chromium \
    ca-certificates

# Set environment variables for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json .

# Install dependencies
RUN npm install
# RUN npm install -g pm2


# Copy the rest of the application code
COPY . .

# Build the application
# RUN npm run srv:build

EXPOSE 8080

# CMD ["pm2-runtime", "start", "npm", "--", "run", "srv:start"]
CMD ["npm", "run", "srv:start"]