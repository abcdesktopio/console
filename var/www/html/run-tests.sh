#!/bin/bash
VERSION="3.3"
ABCDESKTOP_YAML_SOURCE="https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/abcdesktop-$VERSION.yaml"

#downloading abcdesktop.yaml file
curl --progress-bar "$ABCDESKTOP_YAML_SOURCE" --output abcdesktop.yaml

#replacing console base image by the test image
sed -i'' -e "s|image: abcdesktopio/console:3.3|image: abcdesktopio/console:test.$1|g" abcdesktop.yaml

#install deploy abcdesktop locally on the container
output =$(curl -sL https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/install-3.3.sh | bash | sudo tee /dev/tty)

#extract the abcdesktop URL
url=$(echo "$output" | grep -oP 'http://[0-9.]+:[0-9]+/' | tail -n 1)

#check if the URL was successfully extracted
if [ -z "$url" ]; then
    echo "Failed to retrieve the abcdesktop URL"
    exit 1
fi

cd var/www/html

#run the acutal test
npm run test -- url=$url