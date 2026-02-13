# syntax=docker/dockerfile:1
FROM node:20 AS builder
ARG BUILD_SCRIPT=build:dev
ARG ENVIRONMENT=dev

WORKDIR /app

RUN apt-get update && apt-get install -y git openssh-client && rm -rf /var/lib/apt/lists/*
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Clone and BUILD chatsupport-ui
RUN --mount=type=ssh git clone git@github.com:dhaam-ai/chatsupport-ui.git /chatsupport-ui && \
    cd /chatsupport-ui && \
    npm install && \
    npm run build

COPY package.json ./

ARG CACHEBUST=1

RUN npm install

COPY . .

ENV NODE_ENV=${ENVIRONMENT}

RUN npm run ${BUILD_SCRIPT}

# Stage 2
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
