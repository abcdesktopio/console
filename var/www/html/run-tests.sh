#!/bin/bash

#install nodejs and npm
apt-get install -y --no-install-recommends nodejs
apt-get install -y --no-install-recommends npm

cd /var/www/html

#install tests packages
npm install jest
npm install selenium-webdriver

#run the acutal test
npm run test