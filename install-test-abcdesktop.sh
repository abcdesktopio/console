#!/bin/bash
VERSION=4.1
ABCDESKTOP_YAML_SOURCE="https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/abcdesktop-$VERSION.yaml"

#downloading abcdesktop.yaml file
curl --progress-bar "$ABCDESKTOP_YAML_SOURCE" --output abcdesktop.yaml

#replacing console base image by the test image
sed -i'' -e "s|image: abcdesktopio/console:3.3|image: ghcr.io/abcdesktopio/console:test.$1|g" abcdesktop.yaml

echo "installing abcdesktop"

#install deploy abcdesktop locally on the container
curl -sL https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/install-$VERSION.sh | bash 

if [ $? -ne 0 ]; then
    echo "abcdesktop install script failed to execute."
    exit 1
fi