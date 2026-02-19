#!/bin/bash

echo "apt-get update"
sudo apt-get update
echo "apt-get install -y apt-transport-https ca-certificates curl software-properties-common gpg openssl sed"
sudo apt-get install -y --no-install-recommends curl gnupg ca-certificates openssl apt-transport-https software-properties-common sed

echo "install yarn npm nodejs "
mkdir -p /etc/apt/keyrings 
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg 
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list 
sudo apt-get update
sudo apt-get install -y --no-install-recommends nodejs
sudo npm -g install yarn  

echo "install tests packages for console"
cd app/
yarn install --production=false 
npm i --package-lock-only 
