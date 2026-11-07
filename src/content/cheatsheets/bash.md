---
title: 'Bash y Zsh'
description: 'Atajos de edición, historial, expansión de variables, bucles, alias, scripts y procesamiento de texto para trabajar rápido en la shell.'
category: 'Terminal'
icon: 'mdi:console'
tags: ['bash', 'zsh', 'shell', 'terminal', 'productividad']
lastUpdated: 2026-11-06
isDraft: false
---

Trucos y comandos de shell para moverte más rápido por la terminal. Casi todo funciona igual en Bash y Zsh; donde no, se indica. Para administración del sistema consulta la hoja de Linux.

## Navegación

| Acción | Comando |
| --- | --- |
| Volver al directorio anterior | `cd -` |
| Guardar el directorio actual e ir a `/tmp` | `pushd /tmp` |
| Regresar al directorio guardado | `popd` |
| Listar archivos con permisos, tamaño legible y ocultos | `ls -lah` |

## Atajos de edición de línea

| Acción | Atajo |
| --- | --- |
| Ir al inicio / final de la línea | `Ctrl + a` / `Ctrl + e` |
| Retroceder / avanzar una palabra | `Alt + b` / `Alt + f` |
| Borrar la palabra anterior | `Ctrl + w` |
| Borrar hasta el inicio (en Zsh, toda la línea) | `Ctrl + u` |
| Borrar hasta el final de la línea | `Ctrl + k` |
| Pegar lo último borrado | `Ctrl + y` |
| Buscar en el historial (repite para ir más atrás) | `Ctrl + r` |
| Insertar el último argumento del comando anterior | `Alt + .` |
| Limpiar la pantalla | `Ctrl + l` |
| Cancelar la línea actual | `Ctrl + c` |

## Historial

| Acción | Comando |
| --- | --- |
| Repetir el último comando | `!!` |
| Repetir el último comando con sudo | `sudo !!` |
| Reusar el último argumento del comando anterior | `ls !$` |
| Ejecutar el comando número 123 del historial | `!123` |
| Repetir el último comando cambiando un texto | `^staging^production` |
| Buscar en el historial | `history \| grep docker` |

En Zsh, `!!` y `!$` se expanden primero en la línea para que confirmes con `Enter`.

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
| Redirigir `stdout` y `stderr` a un archivo | `pnpm run build > build.log 2>&1` |
| Ver la salida y guardarla a la vez | `pnpm test \| tee test.log` |
| Descartar la salida por completo | `./noisy.sh > /dev/null 2>&1` |
| Seguir un archivo de log en tiempo real | `tail -f /var/log/syslog` |

## Procesar texto

| Acción | Comando |
| --- | --- |
| Contar líneas repetidas, de más a menos | `sort access.log \| uniq -c \| sort -rn \| head` |
| Extraer el primer campo separado por `:` | `cut -d: -f1 /etc/passwd` |
| Imprimir la primera columna (separada por espacios) | `awk '{print $1}' access.log` |
| Sumar la columna 2 | `awk '{s += $2} END {print s}' sizes.txt` |
| Reemplazar texto en un archivo (GNU sed) | `sed -i 's/localhost/127.0.0.1/g' .env.example` |
| Pasar la lista de archivos a otro comando | `find . -name "*.tmp" -print0 \| xargs -0 rm` |
| Leer un campo de un JSON | `jq -r '.version' package.json` |
| Listar las claves de un objeto JSON | `jq -r '.dependencies \| keys[]' package.json` |

En macOS, `sed -i` necesita un argumento vacío: `sed -i '' 's/a/b/g' file`.

## Variables y expansión

| Expresión | Resultado |
| --- | --- |
| `${PORT:-3000}` | Valor de `PORT`, o `3000` si está vacía o no existe |
| `${NAME:?falta NAME}` | Aborta con ese mensaje si `NAME` no está definida |
| `${#NAME}` | Longitud del texto |
| `${FILE%.*}` | Quita la extensión: `report.tar.gz` → `report.tar` |
| `${PATH_VAR##*/}` | Solo el nombre del archivo (como `basename`) |
| `${NAME/old/new}` | Reemplaza la primera aparición de `old` |
| `$(git branch --show-current)` | Sustituye por la salida del comando |
| `$((3 * 4))` | Aritmética entera: `12` |
| `cp app.conf{,.bak}` | Llaves: se expande a `cp app.conf app.conf.bak` |
| `mkdir -p logs/{dev,qa,prod}` | Crea tres carpetas de una vez; `{1..5}` genera rangos |

Usa siempre comillas dobles alrededor de las variables (`"$FILE"`) para evitar problemas con espacios.

## Condicionales y bucles

```bash
if [[ -f .env ]]; then
  echo "Using .env"
elif [[ -z "${API_URL:-}" ]]; then
  echo "API_URL is not set" >&2
fi

for file in *.log; do
  gzip "$file"
done

while read -r line; do
  echo "Host: $line"
done < hosts.txt

[[ -d dist ]] && echo "built" || echo "run the build first"
```

## Alias y funciones

Añádelos a `~/.bashrc` (Bash) o `~/.zshrc` (Zsh) y recarga con `source ~/.zshrc`.

```bash
alias ll='ls -lah'
alias gs='git status -sb'
alias ..='cd ..'

# Create a folder and enter it
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# Show what is listening on a port
port() {
  lsof -i ":$1"
}
```

| Acción | Comando |
| --- | --- |
| Ver qué es un comando (alias, función o binario) | `type ll` |
| Ejecutar el comando original ignorando el alias | `\ls` |
| Quitar un alias en la sesión actual | `unalias ll` |

## Scripts y shebang

```bash
#!/usr/bin/env bash
# Stop on errors, undefined variables and failed pipes
set -euo pipefail

name="${1:-world}"
echo "Hello, $name"
```

| Acción | Comando |
| --- | --- |
| Dar permiso de ejecución | `chmod +x hello.sh` |
| Ejecutar el script | `./hello.sh Ana` |
| Comprobar la sintaxis sin ejecutar | `bash -n hello.sh` |
| Ejecutar mostrando cada línea (depuración) | `bash -x hello.sh` |
| Ver el código de salida del último comando | `echo $?` |

## Procesos y puertos

| Acción | Comando |
| --- | --- |
| Listar trabajos en segundo plano | `jobs` |
| Traer al primer plano el trabajo nº 1 | `fg %1` |
| Terminar el trabajo en segundo plano nº 1 | `kill %1` |
| Buscar procesos activos de Node.js | `ps aux \| grep node` |
| Ver qué proceso ocupa un puerto (ej. 4200) | `lsof -i :4200` |
