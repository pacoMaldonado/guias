---
title: 'Claude Code'
description: 'Claude Code en la terminal: instalación, flags, atajos, slash commands, CLAUDE.md, settings.json con hooks, MCP, subagentes y skills.'
category: 'Tools'
icon: 'mdi:robot-outline'
tags: ['claude-code', 'ia', 'cli', 'agentes', 'mcp']
lastUpdated: 2026-11-06
isDraft: false
---

Referencia de Claude Code 2.1 en la terminal. Escribe `?` con el prompt vacío para ver los atajos, `/` para ver los comandos y usa `Shift + Tab` para cambiar de modo de permisos.
Si lo usas dentro de Neovim, revisa la sección de Claude Code en la hoja de LazyVim.

## Instalación y arranque

| Acción | Comando |
| --- | --- |
| Instalar en macOS, Linux o WSL (script nativo, se actualiza solo) | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Instalar en Windows (PowerShell) | `irm https://claude.ai/install.ps1 \| iex` |
| Instalar con Homebrew (canal estable) | `brew install --cask claude-code` |
| Verificar la versión instalada | `claude --version` |
| Diagnóstico de la instalación y de los settings | `claude doctor` |
| Actualizar a mano | `claude update` |
| Abrir una sesión interactiva en el proyecto | `claude` |
| Abrir la sesión con una tarea inicial | `claude "explica la estructura de este repo"` |

La primera vez, `claude` abre el navegador para iniciar sesión. Necesitas un plan Pro, Max, Ultra, Team o Enterprise, o una cuenta de Console.

## Sesiones, modelo y modo no interactivo

| Acción | Comando |
| --- | --- |
| Responder y salir (modo print, ideal para scripts) | `claude -p "resume los cambios de este commit"` |
| Pasar datos por un pipe | `git diff \| claude -p "revisa este diff"` |
| Salida en JSON (un solo resultado) | `claude -p "lista los TODO" --output-format json` |
| Continuar la conversación más reciente del directorio | `claude -c` |
| Elegir una sesión anterior en un selector | `claude -r` |
| Retomar una sesión por ID o nombre | `claude -r auth-refactor` |
| Ponerle nombre a la sesión | `claude -n auth-refactor` |
| Elegir modelo (alias `opus`, `sonnet`, `fable` o nombre completo) | `claude --model opus` |
| Arrancar en modo plan (solo lectura) | `claude --permission-mode plan` |
| Dar acceso a otro directorio | `claude --add-dir ../shared-lib` |

## Atajos de teclado

| Acción | Atajo |
| --- | --- |
| Detener la respuesta o la herramienta en curso | `Esc` |
| Borrar el borrador, o abrir el menú de rewind con el prompt vacío | `Esc` `Esc` |
| Rotar modos de permisos (Manual, acceptEdits, plan y, si están habilitados, bypassPermissions y auto) | `Shift + Tab` |
| Interrumpir o limpiar la entrada (dos veces sale) | `Ctrl + c` |
| Buscar en el historial de prompts | `Ctrl + r` |
| Nueva línea (funciona en cualquier terminal) | `Ctrl + j` o `\` `Enter` |
| Nueva línea en iTerm2, Ghostty, Kitty, WezTerm o Windows Terminal | `Shift + Enter` |
| Editar el prompt en tu editor (`$EDITOR`) | `Ctrl + g` |
| Mandar a segundo plano un comando o agente en curso | `Ctrl + b` |
| Ver el transcript con el detalle de las herramientas | `Ctrl + o` |
| Cambiar de modelo sin borrar el prompt | `Alt + p` |
| Guardar el prompt actual para después y recuperarlo | `Ctrl + s` |

En macOS, los atajos con `Alt` requieren configurar Option como Meta en la terminal.

## Prefijos en el prompt

| Prefijo | Qué hace |
| --- | --- |
| `/` al inicio | Ejecuta un comando o una skill (`/` solo muestra la lista filtrable) |
| `!` al inicio | Modo shell: corre el comando, agrega su salida a la sesión y Claude responde |
| `@` | Menciona un archivo o carpeta con autocompletado (`@src/app.ts`) |
| `@agent-<nombre>` | Obliga a usar un subagente concreto |
| `?` con el prompt vacío | Muestra u oculta el panel de atajos |

Para guardar instrucciones permanentes usa `/memory` o edita `CLAUDE.md` directamente.

## Slash commands más útiles

| Comando | Qué hace |
| --- | --- |
| `/help` | Ayuda y lista de comandos disponibles |
| `/init` | Crea un `CLAUDE.md` inicial analizando el proyecto |
| `/clear` | Conversación nueva con contexto vacío |
| `/compact [instrucciones]` | Resume la conversación para liberar contexto |
| `/context` | Muestra el uso del contexto como cuadrícula de colores |
| `/model` | Cambia de modelo y lo guarda como predeterminado |
| `/plan [tarea]` | Entra en modo plan; con texto, empieza esa tarea |
| `/diff` | Revisa los cambios del árbol de trabajo, incluidos los de Claude |
| `/review` | Alias de `/code-review`: revisa el diff actual, un PR o una rama |
| `/rewind` | Vuelve la conversación o el código a un punto anterior (alias `/undo`) |
| `/resume` | Retoma una conversación por ID o nombre, o abre el selector |
| `/usage` | Costo de la sesión y límites del plan (`/cost` es alias) |

## Configuración y extensiones (slash commands)

| Comando | Qué hace |
| --- | --- |
| `/config` | Abre los ajustes (tema, modelo, modo editor vim…) |
| `/status` | Versión, modelo, cuenta y archivos de settings cargados |
| `/permissions` | Gestiona las reglas allow, ask y deny |
| `/memory` | Edita los `CLAUDE.md` y activa o desactiva la memoria automática |
| `/hooks` | Muestra los hooks configurados |
| `/mcp` | Estado, conexión y autenticación de servidores MCP |
| `/agents` | Recordatorio de cómo crear subagentes en `.claude/agents/` |
| `/skills` | Lista las skills disponibles |
| `/doctor` | Revisión completa de la instalación con correcciones propuestas |
| `/exit` | Sale de Claude Code (alias `/quit`) |

## Memoria: CLAUDE.md

| Archivo | Alcance |
| --- | --- |
| `~/.claude/CLAUDE.md` | Tus preferencias, en todos los proyectos |
| `./CLAUDE.md` o `./.claude/CLAUDE.md` | Instrucciones del equipo; se versiona en git |
| `./CLAUDE.local.md` | Preferencias personales del proyecto; agrégalo a `.gitignore` |
| `.claude/rules/*.md` | Reglas modulares por tema; pueden limitarse a rutas |
| `AGENTS.md` | Se lee si no hay ningún `CLAUDE.md` en el proyecto |

Se cargan todos (no se sobrescriben). Importa otros archivos con `@ruta`; las rutas relativas parten del archivo que importa y se permiten hasta 4 niveles de imports. Apunta a menos de 200 líneas por archivo.

```md
# Project guide

@README.md
@docs/04-architecture.md

## Commands
- Install: `pnpm install`
- Test: `pnpm run test`
- Lint: `pnpm run lint`

## Rules
- Use pnpm, never other package managers.
- Conventional Commits: `feat(scope): message`.
```

## settings.json y permisos

| Archivo | Alcance |
| --- | --- |
| `~/.claude/settings.json` | Usuario: todos tus proyectos |
| `.claude/settings.json` | Proyecto compartido: se versiona en git |
| `.claude/settings.local.json` | Proyecto local: solo tú, fuera de git |
| `managed-settings.json` | Política de la organización; nadie la sobrescribe |

Precedencia (de mayor a menor): managed, `--settings` en la línea de comandos, local, proyecto y usuario. Las listas como `permissions.allow` se combinan entre archivos. Este ejemplo va en `.claude/settings.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(pnpm run lint)", "Bash(pnpm run test *)", "Bash(git diff *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)", "Bash(git push --force *)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/require-pnpm.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

## Hook PreToolUse: forzar pnpm

El hook recibe el evento en JSON por stdin (`tool_input.command` trae el comando). Si sale con código `2`, Claude Code bloquea la herramienta y le muestra a Claude el mensaje de stderr. Requiere `jq` y permiso de ejecución (`chmod +x`).

```bash
#!/usr/bin/env bash
# .claude/hooks/require-pnpm.sh
COMMAND=$(jq -r '.tool_input.command')

if echo "$COMMAND" | grep -qE '(^|[;&|[:space:]])(npm|npx)([[:space:]]|$)'; then
  echo "Blocked by team policy: use pnpm (pnpm add, pnpm dlx, pnpm run) instead." >&2
  exit 2
fi
exit 0
```

Revisa los hooks activos con `/hooks`. Los cambios en settings se recargan sin reiniciar la sesión.

## Servidores MCP

| Acción | Comando |
| --- | --- |
| Agregar un servidor remoto (HTTP) | `claude mcp add --transport http notion https://mcp.notion.com/mcp` |
| Agregar un servidor local (stdio); todo tras `--` es el comando | `claude mcp add fetch -- uvx mcp-server-fetch` |
| Compartirlo con el equipo (scope project, en `.mcp.json`) | `claude mcp add --scope project --transport http notion https://mcp.notion.com/mcp` |
| Disponible en todos tus proyectos | `claude mcp add --scope user fetch -- uvx mcp-server-fetch` |
| Listar servidores configurados | `claude mcp list` |
| Ver el detalle de un servidor | `claude mcp get notion` |
| Eliminar un servidor | `claude mcp remove notion` |

| Scope | Dónde se guarda |
| --- | --- |
| `local` (por defecto) | `~/.claude.json`, solo este proyecto y solo tú |
| `project` | `.mcp.json` en la raíz; se versiona y pide aprobación |
| `user` | `~/.claude.json`, todos tus proyectos |

Pasa secretos con `-e KEY=value` o `--header`, nunca los escribas en `.mcp.json`. El transporte SSE está obsoleto: usa HTTP.

## Subagentes y skills

| Ruta | Qué contiene |
| --- | --- |
| `.claude/agents/<nombre>.md` | Subagentes del proyecto (se versionan) |
| `~/.claude/agents/<nombre>.md` | Subagentes personales, en todos los proyectos |
| `.claude/skills/<nombre>/SKILL.md` | Skills del proyecto; se invocan con `/<nombre>` |
| `~/.claude/skills/<nombre>/SKILL.md` | Skills personales |
| `.claude/commands/<nombre>.md` | Comandos antiguos; siguen funcionando, pero ahora son skills |

Un subagente es Markdown con frontmatter (`name` y `description` obligatorios). Invócalo por nombre en el prompt, con `@agent-code-reviewer` o para toda la sesión con `claude --agent code-reviewer`.

```md
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. Analyze the code and give specific,
actionable feedback on quality, security and best practices.
```

En una skill, `$ARGUMENTS` recibe el texto que escribes tras `/<nombre>`, y `disable-model-invocation: true` evita que Claude la cargue por su cuenta.

## Buenas prácticas

- Empieza las tareas grandes en modo plan (`Shift + Tab` o `/plan`), revisa el plan y luego deja que edite.
- Ejecuta `/init` en cada repo y mantén `CLAUDE.md` corto: comandos, convenciones y reglas que no se deducen del código.
- Usa `/clear` al cambiar de tarea y `/compact` en sesiones largas; vigila el consumo con `/context`.
- Trabaja en pasos pequeños: revisa cada cambio con `/diff` o `git diff` y haz commits pequeños y frecuentes.
- Si algo sale mal, `Esc` `Esc` o `/rewind` restauran el código y la conversación a un punto anterior.
- Lo que nunca debe pasar se garantiza con reglas `deny` o con hooks; `CLAUDE.md` es contexto, no una regla obligatoria.
- No uses `--dangerously-skip-permissions` fuera de un sandbox sin acceso a internet.
