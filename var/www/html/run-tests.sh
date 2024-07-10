#!/bin/bash

#start docker
dockerd &
docker run hello-world

#start minikube 
minikube start 

#install deploy abcdesktop locally on the container
curl -sL https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/install-3.3.sh | bash

cd /var/www/html

#run the acutal test
npm run test