#!/bin/bash

echo "apt-get update"
apt-get update
echo "apt-get install -y curl gpg"
apt-get install -y --no-install-recommends curl gnupg ca-certificates


echo "install yarn npm nodejs "
mkdir -p /etc/apt/keyrings 
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg 
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list 
apt-get update
apt-get install -y --no-install-recommends nodejs npm
npm -g install yarn  

echo "install tests packages for console"
cd /var/www/html
yarn install --productuon=false && npm i --package-lock-only && npm audit fix