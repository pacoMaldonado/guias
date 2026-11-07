---
title: 'Docker básico'
description: 'Imágenes, contenedores, volúmenes, redes, Dockerfile multi-stage con pnpm, depuración y limpieza con Docker.'
category: 'DevOps'
icon: 'mdi:docker'
tags: ['docker', 'contenedores', 'imagenes', 'devops', 'dockerfile']
lastUpdated: 2026-11-06
isDraft: false
---

Comandos esenciales para construir imágenes, ejecutar contenedores y persistir datos con Docker. Usa `--rm` en contenedores de prueba para no acumular basura.

## Imágenes

| Acción | Comando |
| --- | --- |
| Construir una imagen desde el directorio actual | `docker build -t my-app:latest .` |
| Construir pasando un argumento de build | `docker build --build-arg NODE_VERSION=22 -t my-app:1.0.0 .` |
| Construir solo hasta una etapa del Dockerfile | `docker build --target build -t my-app:build .` |
| Listar las imágenes locales | `docker images` |
| Descargar una imagen de Docker Hub | `docker pull node:22-alpine` |
| Etiquetar una imagen para un registro | `docker tag my-app:latest registry.example.com/team/my-app:1.0.0` |
| Subir una imagen al registro | `docker push registry.example.com/team/my-app:1.0.0` |
| Ver las capas y su tamaño | `docker history my-app:latest` |
| Eliminar una imagen local | `docker rmi my-app:latest` |

## Contenedores

| Acción | Comando |
| --- | --- |
| Ejecutar contenedor en segundo plano exponiendo puerto | `docker run -d -p 8080:80 --name web my-app:latest` |
| Ejecutar con variables de entorno | `docker run -d -e NODE_ENV=production --name api my-app:latest` |
| Ejecutar cargando variables desde un archivo | `docker run -d --env-file .env --name api my-app:latest` |
| Ejecutar uno temporal que se borra al salir | `docker run --rm -it node:22-alpine sh` |
| Ver contenedores en ejecución (o todos con `-a`) | `docker ps` o `docker ps -a` |
| Detener un contenedor | `docker stop web` |
| Iniciar un contenedor detenido | `docker start web` |
| Reiniciar un contenedor | `docker restart web` |
| Detener y eliminar un contenedor | `docker rm -f web` |

## Inspeccionar y copiar

| Acción | Comando |
| --- | --- |
| Ver la configuración completa en JSON | `docker inspect web` |
| Ver consumo de CPU y memoria en vivo | `docker stats` |
| Copiar un archivo del contenedor al host | `docker cp web:/app/logs/app.log ./app.log` |
| Copiar un archivo del host al contenedor | `docker cp ./config.json web:/app/config.json` |
| Ver los procesos dentro del contenedor | `docker top web` |

## Volúmenes

| Acción | Comando |
| --- | --- |
| Crear un volumen con nombre | `docker volume create pgdata` |
| Listar volúmenes | `docker volume ls` |
| Ver dónde vive y quién lo usa | `docker volume inspect pgdata` |
| Montar un volumen con nombre | `docker run -d -v pgdata:/var/lib/postgresql/data postgres:17` |
| Montar una carpeta del host (bind mount) | `docker run --rm -v "$(pwd)":/app -w /app node:22-alpine ls` |
| Eliminar un volumen | `docker volume rm pgdata` |

- **Volumen con nombre** (`pgdata:/ruta`): lo gestiona Docker, sobrevive al contenedor. Ideal para bases de datos.
- **Bind mount** (`./carpeta:/ruta`): refleja una carpeta del host. Ideal para desarrollo con recarga en vivo.

## Redes

| Acción | Comando |
| --- | --- |
| Crear una red bridge propia | `docker network create app-net` |
| Listar redes | `docker network ls` |
| Arrancar un contenedor en esa red | `docker run -d --name db --network app-net postgres:17` |
| Conectar un contenedor existente a la red | `docker network connect app-net api` |
| Ver qué contenedores están en la red | `docker network inspect app-net` |

En una red creada por ti, los contenedores se encuentran por **nombre**: desde `api` puedes conectar a `db:5432`. La red `bridge` por defecto no ofrece esa resolución DNS.

## Dockerfile multi-stage con pnpm

```dockerfile
# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
# Official pnpm binary (use the non-alpine tag for Debian-based images)
COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pnpx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --frozen-lockfile
COPY . .
RUN pnpm run build && pnpm prune --prod

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

pnpm se copia desde la imagen oficial `ghcr.io/pnpm/pnpm`, como indica la guía de Docker de pnpm. El cache mount de BuildKit reutiliza los paquetes descargados entre builds.

Un `.dockerignore` evita copiar basura y secretos al contexto de build:

```gitignore
node_modules
dist
.git
.env*
*.log
Dockerfile
```

## Depuración

| Acción | Comando |
| --- | --- |
| Seguir los logs de un contenedor en tiempo real | `docker logs -f web` |
| Ver logs de los últimos 10 minutos | `docker logs --since 10m web` |
| Ver solo las últimas 100 líneas | `docker logs --tail 100 web` |
| Abrir una terminal interactiva dentro del contenedor | `docker exec -it web sh` |
| Ver la IP del contenedor | `docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web` |
| Ver el estado y el código de salida | `docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' web` |

## Limpieza

| Acción | Comando |
| --- | --- |
| Eliminar contenedores detenidos, redes y capas huérfanas | `docker system prune` |
| Limpieza profunda (incluye imágenes no usadas y volúmenes) | `docker system prune -a --volumes` |
| Eliminar solo imágenes sin etiqueta | `docker image prune` |
| Eliminar volúmenes que ningún contenedor usa | `docker volume prune` |
| Ver el uso de disco de Docker | `docker system df` |
