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
cd var/www/html
sudo yarn install --productuon=false 
sudo npm i --package-lock-only 
sudo npm audit fix

echo "install chrome"
sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list' 
wget -O- https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo tee /etc/apt/trusted.gpg.d/linux_signing_key.pub 
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 78BD65473CB3BD13 
sudo apt-get update 
sudo apt-key export D38B4796 | gpg --dearmour -o /etc/apt/trusted.gpg.d/chrome.gpg 
sudo apt-get install -y --no-install-recommends google-chrome-stable 

# echo "install kubectl"
# apt-get update
# curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
# chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
# echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | tee /etc/apt/sources.list.d/kubernetes.list
# chmod 644 /etc/apt/sources.list.d/kubernetes.list
# apt-get update
# apt-get install -y --no-install-recommends kubectl

# echo "install minikube"
# curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
# install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64

# echo "install docker"
# apt-get update
# apt-get install -y --no-install-recommends docker.io