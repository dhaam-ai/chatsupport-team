# syntax=docker/dockerfile:1
# Stage 1: Build the React microfrontend
FROM node:20 AS builder
ARG BUILD_SCRIPT=build:dev
ARG ENVIRONMENT=dev

WORKDIR /workspace

# Install git and SSH client for private repo access
RUN apt-get update && apt-get install -y git openssh-client && rm -rf /var/lib/apt/lists/*

# Set up SSH client and git configuration
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Clone chatsupport-ui as a sibling directory
RUN --mount=type=ssh git clone git@github.com:dhaam-ai/chatsupport-ui.git /workspace/chatsupport-ui

# Verify chatsupport-ui exists
RUN ls -la /workspace/chatsupport-ui/ && cat /workspace/chatsupport-ui/package.json | head -5

WORKDIR /workspace/chatsupport-team

COPY package.json ./

ARG CACHEBUST=1

# Install and verify
RUN npm install && ls -la node_modules/chatsupport-ui/ || echo "chatsupport-ui NOT in node_modules"

COPY . .

ENV NODE_ENV=${ENVIRONMENT}

RUN npm run ${BUILD_SCRIPT}

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /workspace/chatsupport-team/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
