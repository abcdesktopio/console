#!/bin/bash

apt-get install -y --no-install-recommends npm
cd /var/www/html
npm install jest
npm install selenium-webdriver
npm run test