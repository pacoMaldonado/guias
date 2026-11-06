---
title: 'Docker básico'
description: 'Ciclo de vida de contenedores e imágenes: construir, ejecutar, inspeccionar y limpiar.'
category: 'DevOps'
icon: 'mdi:docker'
tags: ['docker', 'contenedores', 'imagenes', 'devops']
lastUpdated: 2026-10-02
isDraft: false
---

Comandos esenciales para gestionar imágenes, contenedores y volúmenes con Docker.

## Imágenes

| Acción | Comando |
| --- | --- |
| Construir una imagen desde el directorio actual | `docker build -t my-app:latest .` |
| Listar las imágenes locales | `docker images` |
| Eliminar una imagen local | `docker rmi my-app:latest` |
| Descargar una imagen de Docker Hub | `docker pull node:22-alpine` |

## Contenedores

| Acción | Comando |
| --- | --- |
| Ejecutar contenedor en segundo plano exponiendo puerto | `docker run -d -p 8080:80 --name web my-app:latest` |
| Ver contenedores en ejecución (o todos con `-a`) | `docker ps` o `docker ps -a` |
| Seguir los logs de un contenedor en tiempo real | `docker logs -f web` |
| Abrir una terminal interactiva dentro del contenedor | `docker exec -it web sh` |
| Detener y eliminar un contenedor | `docker rm -f web` |

## Limpieza

| Acción | Comando |
| --- | --- |
| Eliminar contenedores detenidos, redes y capas huérfanas | `docker system prune` |
| Limpieza profunda (incluye imágenes no usadas y volúmenes) | `docker system prune -a --volumes` |
| Ver el uso de disco de Docker | `docker system df` |
