.PHONY: stop-kafka-podman run-kafka-podman

stop-kafka-podman:
	podman-compose -f podman/container-compose.yaml down

run-kafka-podman:
	podman-compose -f podman/container-compose.yaml up

kafka-podman: run-kafka-podman
