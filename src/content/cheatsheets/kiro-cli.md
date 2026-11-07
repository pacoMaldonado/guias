---
title: 'Kiro CLI'
description: 'Kiro CLI (antes Amazon Q Developer CLI): instalación, login, chat, agentes, slash commands, steering, MCP, modo headless y specs.'
category: 'Tools'
icon: 'mdi:ghost-outline'
tags: ['kiro', 'ia', 'cli', 'agentes', 'mcp']
lastUpdated: 2026-11-06
isDraft: false
---

Referencia de Kiro CLI 3.x, el sucesor de Amazon Q Developer CLI. El binario es `kiro-cli` y, sin subcomando, abre el chat.
Comparte la carpeta `.kiro/` (steering, specs, agentes, MCP) con el IDE Kiro. Para usarlo dentro de Neovim, revisa la hoja de LazyVim.

## Instalación y login

| Acción | Comando |
| --- | --- |
| Instalar en macOS o Linux (script oficial) | `curl -fsSL https://cli.kiro.dev/install \| bash` |
| Instalar en Ubuntu con el paquete `.deb` descargado | `sudo dpkg -i kiro-cli.deb` |
| Verificar la versión | `kiro-cli --version` |
| Iniciar sesión (abre el navegador) | `kiro-cli login` |
| Iniciar sesión por SSH (device code) | `kiro-cli login --use-device-flow` |
| Iniciar sesión con GitHub o Google | `kiro-cli login --social github` |
| Ver el usuario y el estado de la sesión | `kiro-cli whoami` |
| Cerrar sesión (conserva agentes y configuración) | `kiro-cli logout` |
| Buscar actualizaciones sin instalarlas | `kiro-cli update --check` |
| Reporte de diagnóstico (versión, sistema, entorno) | `kiro-cli diagnostic` |

## Iniciar y retomar el chat

| Acción | Comando |
| --- | --- |
| Abrir el chat en el proyecto actual | `kiro-cli` |
| Abrir el chat con una primera pregunta | `kiro-cli chat "explica la estructura de este repo"` |
| Arrancar con un agente concreto | `kiro-cli --agent backend-reviewer` |
| Ver los modelos disponibles | `kiro-cli chat --list-models` |
| Elegir modelo al arrancar | `kiro-cli chat --model <modelo>` |
| Continuar la última conversación del directorio | `kiro-cli chat --resume` |
| Elegir una conversación anterior | `kiro-cli chat --resume-picker` |
| Retomar una sesión por ID | `kiro-cli chat --resume-id <session-id>` |
| Listar las sesiones guardadas del directorio | `kiro-cli chat --list-sessions` |

## Atajos de teclado

| Acción | Atajo |
| --- | --- |
| Cerrar paneles, cancelar la ejecución o vaciar la cola | `Esc` |
| Cancelar la entrada o salir de la sesión | `Ctrl + c` |
| Salir de la sesión | `Ctrl + d` |
| Nueva línea (todas las terminales, incluido tmux) | `Ctrl + j` |
| Nueva línea en iTerm2, Ghostty, Kitty, Warp o Zed | `Shift + Enter` |
| Buscar en el historial de prompts | `Ctrl + r` |
| Búsqueda difusa de comandos y archivos de contexto | `Ctrl + s` |
| Expandir la salida colapsada de la shell | `Ctrl + o` |
| Entrar en modo Plan o volver al agente anterior | `Shift + Tab` |
| Autocompletar referencias a archivos | `Tab` |

## Entrada: shell y referencias

| Sintaxis | Qué hace |
| --- | --- |
| `!git status` | Ejecuta el comando directamente, sin pasar por la IA |
| `@src/index.ts` | Incluye el contenido del archivo en el mensaje |
| `@src/` | Incluye el árbol del directorio |
| `@"ruta con espacios.txt"` | Rutas con espacios, entre comillas |
| `/editor` | Escribe un prompt largo en tu editor por defecto |

Las referencias `@` pueden ir en cualquier parte del mensaje: `Revisa @src/auth.ts en busca de fallos de seguridad`.

## Slash commands esenciales

| Comando | Qué hace |
| --- | --- |
| `/help` | Cambia al agente de ayuda basado en la documentación |
| `/clear` | Limpia la conversación y conserva la sesión |
| `/compact` | Resume la conversación para liberar contexto |
| `/context` | Muestra el uso del contexto y gestiona archivos (`add`, `remove`, `show`) |
| `/model` | Elige el modelo y su nivel de razonamiento |
| `/agent` | Lista, crea, edita o cambia de agente (`/agent swap`) |
| `/plan [prompt]` | Cambia al agente Plan; con texto, lo envía de inmediato |
| `/spec` | Lista, crea, ejecuta o analiza specs |
| `/chat` | Sesiones: `new`, `resume`, `save` y `load` |
| `/rewind` | Bifurca la conversación desde un turno anterior |
| `/usage` | Facturación y créditos consumidos |
| `/quit` | Sale del chat (alias `/exit` y `/q`) |

## Herramientas y configuración (slash commands)

| Comando | Qué hace |
| --- | --- |
| `/tools` | Ve las herramientas y sus permisos |
| `/tools trust write` | Confía en una herramienta durante la sesión |
| `/tools untrust write` | Vuelve a pedir confirmación para esa herramienta |
| `/permissions` | Decide qué hace Kiro con acciones que tus reglas no cubren |
| `/mcp` | Estado de los servidores MCP (`/mcp auth` reautentica uno remoto) |
| `/hooks` | Muestra los hooks de contexto activos |
| `/prompts` | Gestiona prompts reutilizables |
| `/config` | Revisa agentes, MCP, Powers, steering, skills y hooks configurados |
| `/settings` | Tema, atajos, terminal, pantalla e historial |
| `/todos` | Ve, agrega y completa tareas pendientes |

Las skills en `.kiro/skills/` y `~/.kiro/skills/` también se vuelven slash commands (`/pr-review`).

## Agentes

| Agente | Para qué sirve |
| --- | --- |
| Default | Asistente general; arranca en cada sesión con todas las herramientas |
| Plan | Solo lectura: explora el código y propone un plan, luego lo pasa a Default |
| Spec | Requisitos, diseño y tareas con aprobación entre fases |
| Quick Spec | Las tres fases de un spec sin aprobaciones intermedias |
| Bug Fix | Causa raíz, diseño de la corrección y tareas |
| Guide / Help | Ayuda basada en la documentación de tu versión (`/guide`, `/help`) |

Los agentes propios viven en `.kiro/agents/<nombre>.json` (proyecto, tiene prioridad) o en `~/.kiro/agents/` (global):

```json
{
  "name": "backend-reviewer",
  "description": "Reviews backend changes before a merge request",
  "tools": ["read", "write", "shell"],
  "prompt": "You review Python and Terraform code following the team conventions",
  "model": "claude-sonnet-4.6"
}
```

| Acción | Comando |
| --- | --- |
| Listar agentes | `kiro-cli agent list` |
| Crear un agente | `kiro-cli agent create backend-reviewer` |
| Usarlo por defecto en cada chat | `kiro-cli agent set-default backend-reviewer` |

## Contexto: steering y AGENTS.md

| Ruta | Qué contiene |
| --- | --- |
| `.kiro/steering/*.md` | Reglas del proyecto (se versionan) |
| `~/.kiro/steering/*.md` | Reglas globales, para todos los proyectos |
| `product.md`, `tech.md`, `structure.md` | Archivos base: producto, stack y estructura |
| `AGENTS.md` | En la raíz del proyecto o en `~/.kiro/steering/`; siempre se carga |

El front matter decide cuándo se carga cada archivo: `always` (por defecto), `fileMatch`, `manual` (con `#nombre-del-archivo`) o `auto` (según `description`). Debe ser lo primero del archivo:

```yaml
---
inclusion: fileMatch
fileMatchPattern: ["**/*.ts", "**/*.tsx"]
---
```

Con agentes propios el steering no se incluye solo: agrega `"file://.kiro/steering/**/*.md"` a su campo `resources`. Usa `/context show` para ver qué archivos entraron.

## Servidores MCP

| Acción | Comando |
| --- | --- |
| Agregar un servidor al proyecto | `kiro-cli mcp add --name fetch --command uvx --args mcp-server-fetch --scope workspace` |
| Agregarlo para todos los proyectos | `kiro-cli mcp add --name fetch --command uvx --args mcp-server-fetch --scope global` |
| Listar servidores configurados | `kiro-cli mcp list` |
| Ver el estado de un servidor | `kiro-cli mcp status --name fetch` |
| Eliminar un servidor | `kiro-cli mcp remove --name fetch --scope workspace` |

La configuración vive en `.kiro/settings/mcp.json` (proyecto, gana en caso de conflicto) y `~/.kiro/settings/mcp.json` (global). Un agente puede definir sus propios `mcpServers`, que tienen la mayor prioridad.

```json
{
  "mcpServers": {
    "fetch": { "command": "uvx", "args": ["mcp-server-fetch"] },
    "api-server": {
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer ${API_TOKEN}" }
    }
  }
}
```

## Modo headless (no interactivo)

Requiere una API key en la variable `KIRO_API_KEY` (planes Pro y superiores). Nunca la escribas en el repo: cárgala desde tu gestor de secretos.

| Acción | Comando |
| --- | --- |
| Ejecutar un prompt y salir | `kiro-cli chat --v3 --no-interactive "resume los TODO de src/"` |
| Pasar el prompt por stdin | `printf '%s\n' "resume los TODO" \| kiro-cli chat --v3 --no-interactive` |
| Aprobar solo herramientas concretas | `kiro-cli chat --v3 --no-interactive --trust-tools=read_file,grep_search "busca los TODO en src/"` |
| Aprobar todas las herramientas (solo en entornos aislados) | `kiro-cli chat --v3 --no-interactive --trust-all-tools "ejecuta los tests"` |
| Salida como eventos JSON Lines | `kiro-cli chat --v3 --no-interactive --output-format stream-json "resume los TODO"` |

## Configuración

| Acción | Comando |
| --- | --- |
| Listar los ajustes actuales | `kiro-cli settings list` |
| Abrir el archivo de ajustes en el editor | `kiro-cli settings open` |
| Cambiar un ajuste global | `kiro-cli settings telemetry.enabled false` |
| Cambiar un ajuste solo en este proyecto | `kiro-cli settings --workspace telemetry.enabled false` |
| Borrar un ajuste | `kiro-cli settings --delete chat.defaultModel` |

## Specs y relación con el IDE Kiro

Un spec convierte una idea en tres documentos dentro de `.kiro/specs/<feature>/`, la misma carpeta que usa el IDE: puedes empezar en la terminal y seguir en el editor (o al revés).

| Archivo | Qué contiene |
| --- | --- |
| `requirements.md` | Historias de usuario y criterios de aceptación (`bugfix.md` en specs de bugs) |
| `design.md` | Arquitectura técnica y enfoque de implementación |
| `tasks.md` | Tareas discretas y rastreables para implementar |

| Comando | Qué hace |
| --- | --- |
| `/spec` | Lista los specs y entra en modo spec |
| `/spec new user-auth` | Crea un spec nuevo |
| `/spec view user-auth design` | Abre uno de sus documentos (`requirements`, `design` o `tasks`) |
| `/spec analyze_requirements user-auth` | Busca ambigüedades y criterios de aceptación faltantes |
| `/spec run user-auth` | Ejecuta las tareas del spec |

Versiona `.kiro/specs/` junto al código: los specs están pensados para compartirse con el equipo.
