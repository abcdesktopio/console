#!/bin/bash

export PYOS_FQDN=$(nslookup pyos | awk '/^Name:/ { print $2 }')
echo PYOS_FQDN=$PYOS_FQDN

nginx -g 'daemon off;'