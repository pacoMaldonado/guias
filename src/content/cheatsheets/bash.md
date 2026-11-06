---
title: 'Bash y Zsh'
description: 'Atajos de terminal, navegación de archivos, tuberías y gestión de procesos para el día a día.'
category: 'Terminal'
icon: 'mdi:console'
tags: ['bash', 'zsh', 'shell', 'terminal']
lastUpdated: 2026-09-15
isDraft: false
---

Trucos y comandos de shell para moverte más rápido por la terminal.

## Navegación

| Acción | Comando |
| --- | --- |
| Volver al directorio anterior | `cd -` |
| Guardar el directorio actual e ir a `/tmp` | `pushd /tmp` |
| Regresar al directorio guardado | `popd` |
| Listar archivos con permisos, tamaño legible y ocultos | `ls -lah` |

## Búsqueda de archivos

| Acción | Comando |
| --- | --- |
| Buscar archivos por nombre | `find . -name "*.log"` |
| Buscar texto recursivamente mostrando línea | `grep -rn "TODO" src/` |
| Contar coincidencias por archivo | `grep -rc "import" src/` |
| Ver el tamaño de las carpetas del directorio actual | `du -sh * \| sort -h` |

## Tuberías y redirección

| Acción | Comando |
| --- | --- |
| Filtrar la salida y contar las líneas | `cat access.log \| grep "500" \| wc -l` |
| Redirigir `stdout` y `stderr` a un archivo | `npm run build > build.log 2>&1` |
| Seguir un archivo de log en tiempo real | `tail -f /var/log/syslog` |

## Procesos y puertos

| Acción | Comando |
| --- | --- |
| Listar trabajos en segundo plano | `jobs` |
| Terminar el trabajo en segundo plano nº 1 | `kill %1` |
| Buscar procesos activos de Node.js | `ps aux \| grep node` |
| Ver qué proceso ocupa un puerto (ej. 4200) | `lsof -i :4200` |
