#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Use: $0 <topic>"
  exit 1
fi

CONTAINER_NAME="kafka"

COMMAND="./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic $1"

podman exec -ti $CONTAINER_NAME bash -c "$COMMAND"
