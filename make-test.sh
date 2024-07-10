#/bin/bash

echo args is $1
# set default IMAGE_RELEASE to run test
DEFAULT_IMAGE=abcdesktopio/console:3.3
IMAGE_RELEASE=${1:-$DEFAULT_IMAGE}

echo "Run console test for $IMAGE_RELEASE"

#
# create the container
# with env 
#     TESTING_MODE='true' 
#     DISABLE_REMOTEIP_FILTERING='enabled'
#
CONTAINER_ID=$(docker run --rm --env TESTING_MODE='true' --env DISABLE_REMOTEIP_FILTERING='enabled' -d --privileged=true "$IMAGE_RELEASE" systemctl)

# define
# TIMEOUT in milliseconds to exec command inside the container
TIMEOUT=120000 

echo "Container ID: ${CONTAINER_ID}"
echo "Waiting for ${CONTAINER_ID}.State.Running..."
until [ "`docker inspect -f {{.State.Running}} $CONTAINER_ID`"=="true" ]; do
    echo '.'
    sleep 1;
done;


# install package before running tests
echo "Dump test install scripts"
docker exec --user root ${CONTAINER_ID} /var/www/html/install-tests.sh

# run tests
echo "Run tests..."
docker exec ${CONTAINER_ID} bash -e /var/www/html/run-tests.sh

if [ $? -ne 0 ]; then
    echo "Tests failed"
    echo "docker logs command"
    docker logs ${CONTAINER_ID}
    exit 1
fi

echo "Stop container ${CONTAINER_ID}..."
docker stop -t 0 ${CONTAINER_ID}

echo "Done"