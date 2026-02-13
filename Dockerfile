# syntax=docker/dockerfile:1
# Stage 1: Build the React microfrontend
FROM node:20 AS builder

ARG BUILD_SCRIPT=build:dev
ARG ENVIRONMENT=dev

# Set the working directory inside the container
WORKDIR /app

# Install git and SSH client for private repo access
RUN apt-get update && apt-get install -y git openssh-client && rm -rf /var/lib/apt/lists/*

# Set up SSH client and git configuration
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Copy package.json for better dependency caching
COPY package.json ./

# Add this line before the cached RUN command
ARG CACHEBUST=1

# Install project dependencies
COPY ../chatsupport-ui /chatsupport-ui

RUN npm install

# Copy the rest of your application code into the working directory
COPY . .

ENV NODE_ENV=${ENVIRONMENT}

# Build the React application using rspack with NODE_ENV=production
RUN npm run ${BUILD_SCRIPT}

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built React application from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 80, which Nginx will listen on
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
