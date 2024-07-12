#!/bin/bash
VERSION="3.3"
ABCDESKTOP_YAML_SOURCE="https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/abcdesktop-$VERSION.yaml"

#downloading abcdesktop.yaml file
curl --progress-bar "$ABCDESKTOP_YAML_SOURCE" --output abcdesktop.yaml

#replacing console base image by the test image
sed -i'' -e "s|image: abcdesktopio/console:3.3|image: abcdesktopio/console:test.$1|g" abcdesktop.yaml

#install deploy abcdesktop locally on the container
curl -sL https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/install-3.3.sh | bash

cd var/www/html

#run the acutal test
npm run test