FROM ubuntu as ubuntu_node_modules_builder

# define node major version to install
ENV NODE_MAJOR=20

# install npm requirements and nginx
RUN apt-get update &&  apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        nginx \
        dnsutils \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

        
# install yarn npm nodejs 
RUN  mkdir -p /etc/apt/keyrings && \
     curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
     echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
     apt-get update && \
     apt-get install -y --no-install-recommends nodejs && \
     npm -g install yarn  && \
     apt-get clean && \
     rm -rf /var/lib/apt/lists/*

COPY var/www/html /var/www/html

# install all the required packages
WORKDIR /var/www/html
RUN yarn install --production=true && npm i --package-lock-only && npm audit fix

#
# main image start here
#
FROM ubuntu 

# add /var/www/html with node_modules installed
COPY --from=ubuntu_node_modules_builder /var/www/html /var/www/html

RUN apt-get update &&  apt-get install -y --no-install-recommends \
        nginx \
        dnsutils \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

# add nginx configuration file
COPY etc/nginx/sites-available /etc/nginx/sites-available

COPY ./docker-entrypoint.sh /
WORKDIR /
RUN chmod +x docker-entrypoint.sh

CMD [ "./docker-entrypoint.sh" ]
EXPOSE 80