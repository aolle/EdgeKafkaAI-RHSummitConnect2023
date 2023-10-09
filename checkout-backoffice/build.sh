#!/bin/bash

mvn clean package
podman build -f src/main/docker/Dockerfile.jvm -t checkout-backoffice .

