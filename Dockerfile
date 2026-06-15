# Default release is latest
ARG TAG=latest
# Default base image 
ARG BASE_IMAGE=ubuntu

FROM ${BASE_IMAGE}:${TAG} AS builder

# define node major version to install
ENV NODE_MAJOR=20

# install npm requirements and nginx
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        dnsutils

# install yarn npm nodejs 
RUN  mkdir -p /etc/apt/keyrings && \
     curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
     echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
     apt-get update && \
     apt-get install -y --no-install-recommends nodejs npm 

COPY app /app

# install all the required packages
WORKDIR /app
RUN npm install 

# build react app
RUN npm run build

# fix
RUN npm audit fix || true

#
# main image start here
# use latest nginx image
FROM nginx:alpine-slim
RUN apk upgrade --no-cache && apk update --no-cache
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
