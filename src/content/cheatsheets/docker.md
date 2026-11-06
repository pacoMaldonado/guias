---
title: 'Docker básico'
description: 'Ciclo de vida de contenedores e imágenes: construir, ejecutar, inspeccionar y limpiar.'
category: 'DevOps'
icon: 'mdi:docker'
tags: ['docker', 'contenedores', 'imagenes', 'devops']
lastUpdated: 2026-10-02
isDraft: false
---

Comandos para gestionar imágenes y contenedores con Docker.

## Imágenes

```bash
# Build an image from the current directory
docker build -t my-app:latest .

# List local images
docker images

# Remove an image
docker rmi my-app:latest
```

## Contenedores

```bash
# Run a container and map a port
docker run -d -p 8080:80 --name web my-app:latest

# Follow the logs of a running container
docker logs -f web

# Open a shell inside a running container
docker exec -it web sh
```

## Limpieza

```bash
# Remove stopped containers, unused networks and dangling images
docker system prune

# Remove everything not in use (including volumes)
docker system prune -a --volumes
```
