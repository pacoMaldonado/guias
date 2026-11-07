---
title: 'Docker Compose'
description: 'Orquesta varios contenedores con Docker Compose v2: comandos, compose.yaml, variables de entorno, perfiles, overrides, redes y volúmenes.'
category: 'DevOps'
icon: 'mdi:layers-outline'
tags: ['docker', 'compose', 'contenedores', 'devops']
lastUpdated: 2026-11-06
isDraft: false
---

Docker Compose levanta una aplicación de varios servicios desde un solo archivo `compose.yaml`. Usa la sintaxis v2 `docker compose` (con espacio); el binario antiguo `docker-compose` ya no se mantiene.

## Ciclo de vida

| Acción | Comando |
| --- | --- |
| Levantar todos los servicios en segundo plano | `docker compose up -d` |
| Levantar reconstruyendo las imágenes | `docker compose up -d --build` |
| Detener y eliminar contenedores y redes | `docker compose down` |
| Detener y borrar también los volúmenes | `docker compose down -v` |
| Reiniciar un servicio | `docker compose restart api` |
| Ver el estado de los servicios | `docker compose ps` |

## Logs y ejecución

| Acción | Comando |
| --- | --- |
| Seguir los logs de un servicio | `docker compose logs -f api` |
| Ver las últimas 50 líneas de todos | `docker compose logs --tail 50` |
| Abrir una shell en un servicio en marcha | `docker compose exec api sh` |
| Ejecutar un comando puntual en un contenedor nuevo | `docker compose run --rm api pnpm run migrate` |
| Abrir psql en el servicio de base de datos | `docker compose exec db psql -U app -d app` |

## Imágenes y configuración

| Acción | Comando |
| --- | --- |
| Construir las imágenes de los servicios | `docker compose build` |
| Construir sin caché | `docker compose build --no-cache` |
| Descargar las imágenes más recientes | `docker compose pull` |
| Ver la configuración final ya interpolada | `docker compose config` |
| Sincronizar cambios de código en vivo (requiere `develop.watch`) | `docker compose watch` |

## Estructura de compose.yaml

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    environment:
      DATABASE_URL: postgres://app:${DB_PASSWORD}@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:17
    environment:
      POSTGRES_USER: app
      POSTGRES_DB: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

No uses la clave `version:`: está obsoleta y Compose la ignora. `depends_on` con `service_healthy` espera a que el healthcheck de `db` pase antes de arrancar `api`.

## Variables de entorno

| Mecanismo | Descripción |
| --- | --- |
| `.env` | Se lee automáticamente junto a `compose.yaml` y alimenta la interpolación `${VAR}` del archivo. |
| `env_file: .env` | Inyecta las variables del archivo **dentro** del contenedor. |
| `environment:` | Define variables del contenedor directamente en el servicio. |
| `${VAR:-default}` | Usa `default` si `VAR` no existe o está vacía. |
| `${VAR:?mensaje}` | Falla con `mensaje` si `VAR` no está definida. |
| `--env-file prod.env` | Usa otro archivo para la interpolación: `docker compose --env-file prod.env up -d`. |

Nunca subas `.env` con secretos al repositorio: versiona un `.env.example` con placeholders.

## Perfiles

Asigna servicios opcionales a un perfil; solo arrancan si activas ese perfil.

```yaml
services:
  adminer:
    image: adminer
    ports:
      - "8081:8080"
    profiles: [tools]
```

| Acción | Comando |
| --- | --- |
| Levantar incluyendo el perfil `tools` | `docker compose --profile tools up -d` |
| Activar perfiles por variable de entorno | `COMPOSE_PROFILES=tools docker compose up -d` |

## Overrides y varios archivos

- `compose.override.yaml` se combina automáticamente con `compose.yaml` al ejecutar `docker compose up`. Úsalo para ajustes locales (puertos, bind mounts).
- Con `-f` eliges los archivos de forma explícita; los posteriores sobrescriben a los anteriores.

| Acción | Comando |
| --- | --- |
| Combinar base y producción | `docker compose -f compose.yaml -f compose.prod.yaml up -d` |
| Revisar el resultado de la combinación | `docker compose -f compose.yaml -f compose.prod.yaml config` |
| Usar otro nombre de proyecto | `docker compose -p my-app-staging up -d` |

## Redes y volúmenes

Compose crea una red por proyecto y cada servicio es accesible por su nombre (`db:5432`). Declara redes propias para aislar servicios:

```yaml
services:
  api:
    networks: [backend, frontend]
  db:
    networks: [backend]

networks:
  backend:
  frontend:

volumes:
  pgdata:
    external: true   # created beforehand with docker volume create
```

| Acción | Comando |
| --- | --- |
| Listar los volúmenes del proyecto | `docker volume ls --filter label=com.docker.compose.project=my-app` |
| Listar las redes creadas | `docker network ls` |
