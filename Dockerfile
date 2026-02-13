# syntax=docker/dockerfile:1
# Stage 1: Build the React microfrontend
FROM node:20 AS builder
ARG BUILD_SCRIPT=build:dev
ARG ENVIRONMENT=dev

# Set working directory to /workspace/chatsupport-team (mimics local folder structure)
WORKDIR /workspace

# Install git and SSH client for private repo access
RUN apt-get update && apt-get install -y git openssh-client && rm -rf /var/lib/apt/lists/*

# Set up SSH client and git configuration
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Clone chatsupport-ui as a sibling directory (mimics local: ../chatsupport-ui)
RUN --mount=type=ssh git clone git@github.com:dhaam-ai/chatsupport-ui.git /workspace/chatsupport-ui

# Now set workdir to the app directory
WORKDIR /workspace/chatsupport-team

# Copy package.json for better dependency caching
COPY package.json ./

ARG CACHEBUST=1

# Install project dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

ENV NODE_ENV=${ENVIRONMENT}

# Build the React application using rspack
RUN npm run ${BUILD_SCRIPT}

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /workspace/chatsupport-team/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
