FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock files for caching
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the application code
COPY . .

# Run yarn build
RUN yarn build

# Start the application
CMD ["yarn", "start"]
# CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "80"]