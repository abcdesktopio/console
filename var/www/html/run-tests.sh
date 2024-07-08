#!/bin/bash

cd /var/www/html
mkdir -p /etc/apt/keyrings && \
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
apt-get update && \
apt-get install -y --no-install-recommends nodejs && \
npm -g install yarn  && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*
npm install jest
npm install selenium-webdriver
npm run test