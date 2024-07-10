#!/bin/bash

#start minikube 
minikube start --driver=docker --force

#install deploy abcdesktop locally on the container
curl -sL https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/install-3.3.sh | bash

cd /var/www/html

#run the acutal test
npm run test