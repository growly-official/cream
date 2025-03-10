# Cream

<img src="https://github.com/user-attachments/assets/f2877449-36e2-4e6e-91b5-6d133327f0af" width="200px"/>


## Local Development

### 🐳 Publish Docker images

The two `agent` and `server` will be bundled as docker image and push to registry (currently using DigitalOcean platform)

Please see more details on `apps/server/Dockerfile` and `apps/agent/Dockerfile`

Make sure you installed and setup `doctl` ([docs](https://docs.digitalocean.com/reference/doctl/how-to/install/)) on your local machine.

1. Build server: `make build-server`
2. Publish server: `make push-server`

(apply the same for agent by replacing `server` to `agent` in make commands)
