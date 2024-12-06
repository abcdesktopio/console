# Default release is 22.04
ARG TAG=22.04
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
        nginx \
        dnsutils

# install yarn npm nodejs 
RUN  mkdir -p /etc/apt/keyrings && \
     curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
     echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
     apt-get update && \
     apt-get install -y --no-install-recommends nodejs 

COPY var/www/html /var/www/html

# install all the required packages
WORKDIR /var/www/html
RUN npm install --omit=dev

#
# main image start here
#
FROM nginx
# add /var/www/html with node_modules installed
COPY --from=builder /var/www/html /usr/share/nginx/html
EXPOSE 80
