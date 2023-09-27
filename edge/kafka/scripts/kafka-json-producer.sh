#!/bin/bash

KAFKA_CONTAINER_NAME="kafka"
BROKER_LIST="localhost:9092"
TOPIC_1="inventory"
TOPIC_2="checkout"
JSON_FILE_1="inventory.json"
JSON_FILE_2="checkout.json"
SEND_INTERVAL=5

send_json_to_topic() {
  local topic="$1"
  local json_file="$2"
  podman exec -i "$KAFKA_CONTAINER_NAME" ./bin/kafka-console-producer.sh --broker-list "$BROKER_LIST" --topic "$topic" < "$json_file"
}

while true; do
  send_json_to_topic "$TOPIC_1" "$JSON_FILE_1"

  send_json_to_topic "$TOPIC_2" "$JSON_FILE_2"

  sleep "$SEND_INTERVAL"
done
