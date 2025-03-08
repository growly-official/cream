agent:
	docker buildx build --platform linux/amd64 -t cream-agent --load .

up:
	docker compose -f docker-compose.yaml up