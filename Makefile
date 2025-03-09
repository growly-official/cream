build-agent:
	cd apps/agent && docker buildx build --platform linux/amd64 -t cream-agent:amd64 .

build-server:
	cd apps/server && docker buildx build --platform linux/amd64 -t cream-server:amd64 .

push-server:
	docker tag cream-server:amd64 registry.digitalocean.com/growly/cream-server
	docker push registry.digitalocean.com/growly/cream-server

push-agent:
	docker tag cream-agent:amd64 registry.digitalocean.com/growly/cream-agent
	docker push registry.digitalocean.com/growly/cream-agent

up:
	docker compose -f docker-compose.yaml up -d