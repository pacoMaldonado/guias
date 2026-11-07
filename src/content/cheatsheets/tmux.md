---
title: 'tmux'
description: 'Multiplexor de terminal: sesiones persistentes, ventanas, paneles, modo copia y una configuración mínima útil.'
category: 'Terminal'
icon: 'mdi:view-split-vertical'
tags: ['tmux', 'terminal', 'sesiones', 'atajos']
lastUpdated: 2026-11-06
isDraft: false
---

Casi todos los atajos empiezan con el prefijo `Ctrl + b`: púlsalo, suéltalo y después pulsa la tecla de la acción. Las sesiones siguen vivas aunque cierres la terminal o se caiga la conexión SSH.

## Conceptos

| Concepto | Descripción |
| --- | --- |
| Sesión | Conjunto de ventanas que sigue corriendo en segundo plano |
| Ventana | Como una pestaña: ocupa toda la pantalla |
| Panel | División de una ventana; cada uno tiene su propia shell |
| Prefijo | Combinación que avisa a tmux de que viene un atajo (`Ctrl + b`) |

## Sesiones desde la terminal

| Acción | Comando |
| --- | --- |
| Crear una sesión con nombre | `tmux new -s work` |
| Crear una sesión sin entrar en ella | `tmux new -s logs -d` |
| Listar sesiones | `tmux ls` |
| Conectarte a una sesión | `tmux attach -t work` |
| Conectarte a la última sesión | `tmux a` |
| Renombrar una sesión | `tmux rename-session -t work api` |
| Cerrar una sesión | `tmux kill-session -t work` |
| Cerrar todas las sesiones | `tmux kill-server` |

## Sesiones dentro de tmux

| Acción | Atajo |
| --- | --- |
| Desconectarte (la sesión sigue viva) | `Ctrl + b` `d` |
| Elegir sesión de una lista | `Ctrl + b` `s` |
| Renombrar la sesión actual | `Ctrl + b` `$` |
| Sesión anterior / siguiente | `Ctrl + b` `(` / `)` |

## Ventanas

| Acción | Atajo |
| --- | --- |
| Crear ventana | `Ctrl + b` `c` |
| Renombrar ventana | `Ctrl + b` `,` |
| Ventana siguiente / anterior | `Ctrl + b` `n` / `p` |
| Ir a la ventana por número | `Ctrl + b` `1` |
| Volver a la última ventana usada | `Ctrl + b` `l` |
| Elegir ventana de una lista | `Ctrl + b` `w` |
| Cerrar ventana (pide confirmación) | `Ctrl + b` `&` |

## Paneles

| Acción | Atajo |
| --- | --- |
| Dividir en izquierda y derecha | `Ctrl + b` `%` |
| Dividir en arriba y abajo | `Ctrl + b` `"` |
| Moverte entre paneles | `Ctrl + b` `←` `↑` `→` `↓` |
| Ir al siguiente panel | `Ctrl + b` `o` |
| Maximizar o restaurar el panel (zoom) | `Ctrl + b` `z` |
| Cerrar el panel (pide confirmación) | `Ctrl + b` `x` |
| Mostrar números de panel | `Ctrl + b` `q` |

## Organizar paneles

| Acción | Atajo |
| --- | --- |
| Cambiar al siguiente diseño predefinido | `Ctrl + b` `Space` |
| Redimensionar de 1 en 1 | `Ctrl + b` `Ctrl + ←` |
| Redimensionar de 5 en 5 | `Ctrl + b` `Alt + ←` |
| Intercambiar con el panel anterior / siguiente | `Ctrl + b` `{` / `}` |
| Convertir el panel en una ventana nueva | `Ctrl + b` `!` |

## Modo copia

Sirve para hacer scroll y copiar texto. La tabla asume `mode-keys vi` (incluido en la configuración de abajo).

| Acción | Atajo |
| --- | --- |
| Entrar en modo copia | `Ctrl + b` `[` |
| Entrar y subir una página | `Ctrl + b` `PgUp` |
| Empezar la selección | `Space` |
| Copiar la selección y salir | `Enter` |
| Buscar hacia abajo / arriba | `/` / `?` |
| Siguiente coincidencia | `n` |
| Salir del modo copia | `q` |
| Pegar lo copiado | `Ctrl + b` `]` |

## Comandos y ayuda

| Acción | Atajo |
| --- | --- |
| Abrir la línea de comandos de tmux | `Ctrl + b` `:` |
| Ver todos los atajos activos | `Ctrl + b` `?` |
| Mostrar un reloj grande | `Ctrl + b` `t` |

| Acción | Comando |
| --- | --- |
| Recargar la configuración | `tmux source-file ~/.tmux.conf` |
| Enviar un comando a otra sesión | `tmux send-keys -t logs "tail -f app.log" Enter` |
| Listar todos los atajos | `tmux list-keys` |

## Configuración mínima (~/.tmux.conf)

```bash
# Mouse: click to focus, drag to resize, wheel to scroll
set -g mouse on

# Number windows and panes from 1, renumber on close
set -g base-index 1
setw -g pane-base-index 1
set -g renumber-windows on

set -g history-limit 50000
set -g default-terminal "tmux-256color"
setw -g mode-keys vi

# Intuitive splits that keep the current directory
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
bind c new-window -c "#{pane_current_path}"

# Reload config with prefix + r
bind r source-file ~/.tmux.conf \; display "Config reloaded"

# Optional: use Ctrl + a as prefix instead of Ctrl + b
# unbind C-b
# set -g prefix C-a
# bind C-a send-prefix
```
