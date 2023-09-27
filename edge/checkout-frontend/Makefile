CONTAINER_NAME=checkout-frontend

build-container:
	podman build -t $(CONTAINER_NAME) .

run-container:
	podman run -d -p 9090:8080 $(CONTAINER_NAME)

run-container-with-env:
	podman run -d -p 9090:8080 -e SYS_INVENTORY_URL=$(SYS_INVENTORY_URL) -e SYS_UPDATE_URL=$(SYS_UPDATE_URL) $(CONTAINER_NAME)

install-angular-cli:
	npm install -g @angular/cli

start-angular-app:
	npx ng serve
