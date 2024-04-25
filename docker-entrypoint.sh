#!/bin/bash

##########################################
# uncomment the lines to resolv pyos FQDN
#
# PYOS_SERVER_NAME=pyos
# while true; do
#         if nslookup $PYOS_SERVER_NAME
#        then
#          break
#        else
#          echo "nslookup $PYOS_SERVER_NAME command as failed, sleeping for 1s"
#          sleep 1s
#        fi
# done
# PYOS_FQDN=$(nslookup $PYOS_SERVER_NAME | awk '/^Name:/ { print $2 }')
# echo "PYOS_FQDN=$PYOS_FQDN"
##########################################

nginx -g 'daemon off;'
