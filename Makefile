IMAGENAME=mbeghelli/console
CONTAINERNAME="console"
NGINXPORT=80
TIMEZONE=Europe/Paris

help:
	@echo "-------------------------------------------------------------"
	@echo "console"
	@echo "-------------------------------------------------------------"
	@echo "make clean		: clean docker container and image"
	@echo "make build		: build docker container"
	@echo "make run		    : run docker container"
	@echo "make stop		: stop docker container"
	@echo "make exec		: open session inside docker container"
	@echo "make logs		: get logs of docker container"
	@echo "make tests		: test instance"	
	@echo "-------------------------------------------------------------"

clean: stop
	-docker rm $(CONTAINERNAME)  # docker container
	-docker rmi $(IMAGENAME)    # docker image

build: clean
	docker build -t $(IMAGENAME) .

run:
	docker run -d -e "TZ=$(TIMEZONE)" --name $(CONTAINERNAME) -p $(NGINXPORT):$(NGINXPORT) $(IMAGENAME) 

stop:
	-docker stop -t0 $(CONTAINERNAME)
	
exec:
	docker exec -it $(CONTAINERNAME) /bin/bash

logs:
	docker logs $(CONTAINERNAME)

tests:
	cd var/www/html \
	&& npm run test
