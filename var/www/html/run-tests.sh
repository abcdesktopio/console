#!/bin/bash
VERSION="3.3"
ABCDESKTOP_YAML_SOURCE="https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/abcdesktop-$VERSION.yaml"

#downloading abcdesktop.yaml file
curl --progress-bar "$ABCDESKTOP_YAML_SOURCE" --output abcdesktop.yaml

#replacing console base image by the test image
sed -i'' -e "s|image: abcdesktopio/console:3.3|image: abcdesktopio/console:test.$1|g" abcdesktop.yaml

#create a temporary file to store the output
temp_file=$(mktemp)

#install deploy abcdesktop locally on the container
curl -sL https://raw.githubusercontent.com/abcdesktopio/conf/main/kubernetes/install-3.3.sh | bash > "$temp_file" 2>&1

if [ $? -ne 0 ]; then
    echo "abcdesktop install script failed to execute."
    exit 1
fi

cat "$temp_file"

#extract the abcdesktop URL
url=$(grep -oP 'http://[0-9.]+:[0-9]+/' "$temp_file" | tail -n 1)

#clean up the temporary file
rm "$temp_file"

#check if the URL was successfully extracted
if [ -z "$url" ]; then
    echo "Failed to retrieve the abcdesktop URL"
    exit 1
fi

cd var/www/html

#run the acutal test
npm run test -- url=$url