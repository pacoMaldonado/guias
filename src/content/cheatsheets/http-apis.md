---
title: 'HTTP y APIs REST'
description: 'Métodos y códigos HTTP, cabeceras comunes, diseño de URLs REST, paginación, curl, errores con problem+json y autenticación.'
category: 'Backend'
icon: 'mdi:api'
tags: ['http', 'rest', 'api', 'curl']
lastUpdated: 2026-11-06
isDraft: false
---

Una API REST expone **recursos** (sustantivos en la URL) y usa los **métodos HTTP** como verbos.
Devuelve siempre el código de estado correcto y fechas en ISO 8601 UTC (`2026-11-06T14:32:00Z`).

## Métodos HTTP

| Método | Uso |
| --- | --- |
| `GET` | Leer un recurso o una colección. Seguro e idempotente |
| `POST` | Crear un recurso o lanzar una acción. Ni seguro ni idempotente |
| `PUT` | Reemplazar el recurso completo. Idempotente |
| `PATCH` | Modificar parte del recurso. No idempotente por definición |
| `DELETE` | Eliminar un recurso. Idempotente |
| `HEAD` | Igual que `GET` pero solo cabeceras. Seguro e idempotente |
| `OPTIONS` | Consultar métodos permitidos; lo usa el preflight de CORS. Seguro |

**Seguro**: no modifica el estado del servidor. **Idempotente**: repetir la petición deja el mismo resultado que hacerla una vez (se puede reintentar sin miedo).

## Códigos 2xx y 3xx

| Código | Significado |
| --- | --- |
| `200 OK` | Éxito con cuerpo en la respuesta |
| `201 Created` | Recurso creado; incluye `Location` con su URL |
| `202 Accepted` | Aceptado para procesarse de forma asíncrona |
| `204 No Content` | Éxito sin cuerpo (típico en `DELETE` o `PUT`) |
| `206 Partial Content` | Respuesta parcial a una petición con `Range` |
| `301 Moved Permanently` | La URL cambió para siempre |
| `302 Found` | Redirección temporal |
| `304 Not Modified` | La copia en caché sigue siendo válida (con `ETag`) |
| `307` / `308` | Redirección temporal / permanente que conserva el método y el cuerpo |

## Códigos 4xx: error del cliente

| Código | Significado |
| --- | --- |
| `400 Bad Request` | Petición mal formada (JSON inválido, parámetro erróneo) |
| `401 Unauthorized` | Falta autenticarse o el token no es válido |
| `403 Forbidden` | Autenticado, pero sin permiso para esto |
| `404 Not Found` | El recurso no existe |
| `405 Method Not Allowed` | El método no está soportado en esa URL |
| `409 Conflict` | Choca con el estado actual (duplicado, versión antigua) |
| `422 Unprocessable Content` | Sintaxis correcta pero datos que no pasan la validación |
| `429 Too Many Requests` | Límite de peticiones superado; mira `Retry-After` |

## Códigos 5xx: error del servidor

| Código | Significado |
| --- | --- |
| `500 Internal Server Error` | Error no controlado en el servidor |
| `501 Not Implemented` | El servidor no soporta esa funcionalidad |
| `502 Bad Gateway` | Un proxy recibió una respuesta inválida del servicio de atrás |
| `503 Service Unavailable` | Caído o saturado temporalmente; puede incluir `Retry-After` |
| `504 Gateway Timeout` | El servicio de atrás no respondió a tiempo |
| `507 Insufficient Storage` | El servidor no puede guardar lo necesario |

Regla rápida: un 4xx se corrige cambiando la petición; un 5xx no es culpa del cliente y a veces vale la pena reintentar.

## Cabeceras comunes

| Cabecera | Para qué sirve |
| --- | --- |
| `Content-Type: application/json` | Formato del cuerpo enviado |
| `Accept: application/json` | Formato que el cliente quiere recibir |
| `Authorization: Bearer <token>` | Credenciales de la petición |
| `Cache-Control: no-store` | Política de caché (`max-age=3600`, `no-cache`, `private`) |
| `ETag` / `If-None-Match` | Versión del recurso; si no cambió, el servidor responde `304` |
| `Location` | URL del recurso creado (`201`) o del destino de una redirección |
| `Retry-After` | Segundos (o fecha) a esperar antes de reintentar |
| `Idempotency-Key` | Clave única para reintentar un `POST` sin duplicar el efecto |

## CORS

| Cabecera | Para qué sirve |
| --- | --- |
| `Access-Control-Allow-Origin` | Orígenes permitidos (`https://app.example.com`); evita `*` con credenciales |
| `Access-Control-Allow-Methods` | Métodos permitidos en peticiones cruzadas |
| `Access-Control-Allow-Headers` | Cabeceras que el cliente puede enviar (`Authorization`, `Content-Type`) |
| `Access-Control-Allow-Credentials` | `true` para permitir cookies o credenciales |
| `Access-Control-Max-Age` | Segundos que el navegador cachea el preflight |
| `Access-Control-Expose-Headers` | Cabeceras de respuesta que el JavaScript puede leer |

CORS lo aplica el **navegador**: curl o un backend no lo comprueban. El preflight es un `OPTIONS` automático antes de peticiones no simples.

## Diseño de URLs REST

| Petición | Significado |
| --- | --- |
| `GET /users` | Listar usuarios |
| `POST /users` | Crear un usuario |
| `GET /users/42` | Obtener el usuario 42 |
| `PATCH /users/42` | Modificar campos del usuario 42 |
| `DELETE /users/42` | Eliminar el usuario 42 |
| `GET /users/42/orders` | Pedidos del usuario 42 (recurso anidado) |
| `POST /orders/7/cancel` | Acción que no encaja en CRUD (úsalo con moderación) |
| `/v1/users` | Versión de la API en la ruta |

Convenciones: sustantivos en plural, `kebab-case` en rutas (`/order-items`), sin verbos ni extensiones (`/getUsers.json`), y máximo uno o dos niveles de anidación.

## Paginación, filtros y orden

| Petición | Qué hace |
| --- | --- |
| `GET /orders?page=2&per_page=20` | Paginación por offset: simple, pero lenta e inestable en tablas grandes o cambiantes |
| `GET /orders?limit=20&cursor=eyJpZCI6MTIzfQ` | Paginación por cursor: estable y eficiente; el servidor devuelve el siguiente cursor |
| `GET /orders?status=paid` | Filtrar por un campo |
| `GET /orders?created_after=2026-11-01T00:00:00Z` | Filtrar por rango de fechas en ISO 8601 UTC |
| `GET /orders?sort=-created_at,total` | Ordenar: `-` indica descendente |
| `GET /orders?fields=id,total,status` | Devolver solo algunos campos |

```json
{
  "data": [{ "id": 124, "total": 59.9, "createdAt": "2026-11-06T14:32:00Z" }],
  "pagination": { "limit": 20, "nextCursor": "eyJpZCI6MTQ0fQ", "hasMore": true }
}
```

## curl

| Acción | Comando |
| --- | --- |
| GET con cabeceras | `curl -H "Accept: application/json" -H "Authorization: Bearer $TOKEN" https://api.example.com/users` |
| POST con JSON | `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"Ana"}'` |
| POST con JSON (atajo, curl 7.82+) | `curl --json '{"name":"Ana"}' https://api.example.com/users` |
| PUT leyendo el cuerpo de un archivo | `curl -X PUT https://api.example.com/users/42 -H "Content-Type: application/json" -d @user.json` |
| DELETE | `curl -X DELETE https://api.example.com/users/42` |
| Enviar un archivo (multipart) | `curl -F "file=@report.pdf" https://api.example.com/uploads` |
| Ver cabeceras y cuerpo | `curl -i https://api.example.com/users` |
| Ver solo cabeceras (HEAD) | `curl -I https://api.example.com/users` |
| Seguir redirecciones | `curl -L https://example.com` |
| Modo detallado (depurar TLS y cabeceras) | `curl -v https://api.example.com/users` |
| Límite de tiempo total en segundos | `curl --max-time 10 https://api.example.com/users` |
| Guardar la respuesta en un archivo | `curl -o users.json https://api.example.com/users` |
| Fallar con código de salida en 4xx/5xx (scripts) | `curl -fsS https://api.example.com/health` |

## Formato de error estándar (RFC 9457)

Responde los errores con `Content-Type: application/problem+json` y una estructura común:

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation failed",
  "status": 422,
  "detail": "The request body has 2 invalid fields.",
  "instance": "/users",
  "timestamp": "2026-11-06T14:32:00Z",
  "errors": [
    { "field": "email", "message": "must be a valid email" },
    { "field": "birthDate", "message": "must be in the past" }
  ]
}
```

`type`, `title`, `status`, `detail` e `instance` son los campos estándar; puedes añadir otros propios como `errors` o `timestamp`. Nunca expongas trazas de error ni detalles internos.

## Autenticación

| Esquema | Descripción |
| --- | --- |
| Bearer / JWT | `Authorization: Bearer <token>`; el JWT es un token firmado con claims (`sub`, `exp`) que el servidor verifica sin estado |
| API key | Clave estática en una cabecera como `X-API-Key: <clave>`; simple, ideal entre servicios. Nunca en la URL |
| OAuth 2.0 | Un servidor de autorización emite access tokens de corta vida; usa Authorization Code + PKCE para apps y Client Credentials entre servicios |
| Basic | `Authorization: Basic <base64(user:pass)>`; solo sobre HTTPS y para casos internos |

Guarda los secretos en un gestor de secretos (por ejemplo, AWS Secrets Manager), nunca en el código ni en el repositorio.
