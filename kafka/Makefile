.PHONY: stop-kafka-podman start-kafka-podman

stop-kafka-podman:
	podman-compose -f podman/container-compose.yaml down

start-kafka-podman:
	podman-compose -f podman/container-compose.yaml up

kafka-podman: start-kafka-podman
