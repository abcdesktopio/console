#!/bin/bash

echo "apt-get update"
apt-get update
echo "apt-get install -y apt-transport-https ca-certificates curl software-properties-common gpg openssl"
apt-get install -y --no-install-recommends curl gnupg ca-certificates openssl apt-transport-https software-properties-common

echo "install yarn npm nodejs "
mkdir -p /etc/apt/keyrings 
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg 
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list 
apt-get update
apt-get install -y --no-install-recommends nodejs
npm -g install yarn  

echo "install tests packages for console"
cd /var/www/html
yarn install --productuon=false 
npm i --package-lock-only 
npm audit fix

echo "install minikube"
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64

echo "install docker"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-get install -y --no-install-recommends docker-ce
usermod -aG docker $USER && newgrp docker