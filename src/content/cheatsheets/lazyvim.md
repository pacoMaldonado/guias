---
title: 'LazyVim'
description: 'Atajos y configuración de LazyVim para full-stack y DevOps: movimiento, búsqueda, LSP, Angular, Tailwind, Git y asistentes de IA.'
category: 'Terminal'
icon: 'mdi:keyboard-outline'
tags: ['lazyvim', 'neovim', 'vim', 'atajos', 'lsp']
lastUpdated: 2026-11-06
isDraft: false
---

Atajos de LazyVim v14+ para trabajar con Backend (Python, Node, AWS), Frontend (Angular, Tailwind) y DevOps.
En las tablas, `<leader>` es la tecla Espacio (el valor por defecto de LazyVim). `Ctrl`, `Alt` y `Shift` son las teclas modificadoras habituales.

## Movimiento y navegación

| Acción | Atajo |
| --- | --- |
| Moverse un carácter | `h` `j` `k` `l` |
| Palabra siguiente / anterior | `w` / `b` |
| Fin de la palabra actual | `e` |
| Inicio / fin de línea | `0` o `^` / `$` |
| Inicio / fin del archivo | `gg` / `G` |
| Ir a la línea N (ej. `42G`) | `N G` |
| Media página arriba / abajo | `Ctrl + u` / `Ctrl + d` |
| Párrafo anterior / siguiente | `{` / `}` |
| Ir al par `( ) [ ] { } < >` | `%` |
| Saltador ultra rápido (Flash): `s` y 2 letras | `s` |

## Explorador de archivos (Neo-tree)

| Acción | Atajo |
| --- | --- |
| Abrir / cerrar el explorador | `<leader> e` |
| Enfocar el archivo actual en el árbol | `<leader> f E` |

Dentro de Neo-tree:

| Acción | Atajo |
| --- | --- |
| Crear archivo o carpeta (si termina en `/`, crea una carpeta) | `a` |
| Eliminar archivo o carpeta | `d` |
| Renombrar / mover | `r` / `m` |
| Copiar / cortar / pegar | `c` / `x` / `p` |
| Ver archivos ocultos (`.env`, etc.) | `H` o `i` |
| Ver archivos ignorados (`.gitignore`) | `I` o `g` |
| Abrir en split horizontal / vertical | `s` / `v` |

## Búsqueda y Live Grep

| Acción | Atajo |
| --- | --- |
| Buscar archivos por nombre | `<leader> Espacio` |
| Buscar texto en el proyecto (Live Grep) | `<leader> /` o `<leader> s g` |
| Buscar texto en el buffer actual | `<leader> s b` |
| Buscar la palabra bajo el cursor | `<leader> s w` |
| Buscar en archivos recientes | `<leader> f r` |
| Buscar símbolos y funciones | `<leader> s s` |
| Buscar en el historial de commits | `<leader> g c` |
| Buscar comandos y keymaps | `<leader> s k` |
| Buscar la palabra actual en el archivo | `*` (adelante) / `#` (atrás) |

## Buffers, splits y tabs

| Acción | Atajo |
| --- | --- |
| Navegar entre buffers abiertos | `Shift + h` / `Shift + l` |
| Cerrar el buffer actual | `<leader> b d` |
| Fijar (pin) un buffer importante | `<leader> b p` |
| Cerrar todos los buffers no fijados | `<leader> b P` |
| Split horizontal | `<leader> w -` |
| Split vertical | `<leader> w \|` |
| Moverse entre ventanas | `Ctrl + h/j/k/l` |
| Cerrar la ventana actual | `<leader> w d` |
| Maximizar / restaurar la ventana | `<leader> w m` |

## LSP y navegación de código

| Acción | Atajo |
| --- | --- |
| Ir a la definición (función o clase) | `g d` |
| Buscar todas las referencias | `g r` |
| Ir a la implementación | `g I` |
| Ir a la definición de tipo | `g y` |
| Ver documentación y firma (hover) | `K` |
| Renombrar un símbolo en todo el proyecto | `<leader> c r` |
| Formatear el documento actual | `<leader> c f` |
| Volver a la posición previa | `Ctrl + o` |
| Avanzar a la posición siguiente | `Ctrl + i` |

## Errores y acciones de código (Trouble)

| Acción | Atajo |
| --- | --- |
| Ver las acciones disponibles (code actions) | `<leader> c a` |
| Ver el detalle del error en la línea actual | `<leader> c d` |
| Siguiente diagnóstico / error | `] d` / `] e` |
| Anterior diagnóstico / error | `[ d` / `[ e` |
| Abrir la lista completa de errores | `<leader> x x` |
| Abrir los errores del buffer actual | `<leader> x X` |
| Ver la lista de TODO, BUG, HACK | `<leader> s t` |

## Frontend, Angular y Tailwind

| Acción | Atajo |
| --- | --- |
| Saltar del componente TS a su template HTML (con el cursor sobre `templateUrl`) | `g d` |
| Ir a la etiqueta HTML de cierre (con el cursor sobre `<div>`) | `%` |
| Cambiar el contenido dentro de una etiqueta | `c i t` (change inner tag) |
| Borrar la etiqueta completa y conservar el contenido | `d a t` |
| Autocompletado de Tailwind CSS con vista previa de color | `Ctrl + Espacio` / `Tab` |
| Formatear HTML, CSS y Angular con Prettier | `<leader> c f` |

El autocierre y el autorenombrado de etiquetas HTML funcionan solos con el plugin `nvim-ts-autotag`.

## Terminal, Bash y Git

| Acción | Atajo |
| --- | --- |
| Abrir la terminal flotante | `<leader> f t` o `Ctrl + /` |
| Ocultar la terminal flotante | `Esc Esc` o `Ctrl + /` |
| Abrir LazyGit (interfaz interactiva de Git) | `<leader> g g` |

Bash sin salir de Neovim:

| Acción | Comando |
| --- | --- |
| Ejecutar un comando | `:! <comando>` |
| Ejemplo: listar archivos ocultos | `:!ls -la` |
| Insertar la salida de un comando en el archivo | `:r !<comando>` |
| Filtrar una selección con un comando (ej. `jq`) | `:'<,'>!jq .` |

## Markdown

El renderizado dentro del buffer viene activado en LazyVim con `render-markdown`.

| Acción | Atajo o comando |
| --- | --- |
| Alternar el renderizado de Markdown | `:RenderMarkdown toggle` |
| Previsualizar en el navegador | `:MarkdownPreviewToggle` |
| Atajo para la previsualización en el navegador | `<leader> c p` |
| Marcar o desmarcar un checkbox `[ ]` (sobre la línea) | `Espacio` |

## Activar módulos con :LazyExtras

LazyVim trae módulos preconfigurados para Angular, Tailwind CSS, Prettier, Python, TypeScript, Docker, Terraform, YAML e IA.
Ejecuta `:LazyExtras` en Neovim y presiona `x` sobre cada paquete que quieras instalar:

| Módulo | Qué incluye |
| --- | --- |
| `lang.angular` | Angular Language Service (LSP) |
| `lang.tailwindcss` | Tailwind LSP y colorizer para el autocompletado |
| `formatting.prettier` | Formateador para HTML, CSS, JS/TS y Angular |
| `lang.python` | Pyright, Ruff, Debugpy y VirtualEnv |
| `lang.typescript` | Vtsls (TS/JS) y ESLint |
| `lang.docker` y `lang.terraform` | Dockerfiles, Compose y HCL LSP |
| `ai.avante` | Asistente de IA nativo, estilo Cursor |
| `ai.claudecode` | Claude Code (la vía recomendada) |

### Flujo de trabajo con Angular

Con `lang.angular` activo, la lógica en TypeScript y la plantilla HTML quedan conectadas:

- Pon el cursor sobre `templateUrl: './app.component.html'` y presiona `g d` para saltar al HTML.
- Las plantillas autocompletan variables del componente, pipes y directivas de Angular (`*ngIf`, `@for`).

### Tailwind CSS y HTML

- Sugerencias de clases de Tailwind con vista previa del color al escribir dentro de `class="..."`.
- Prettier formatea al guardar. También puedes usar `<leader> c f` o guardar con `Ctrl + s`.

### Configuración Lua del stack

Guarda este archivo en `~/.config/nvim/lua/plugins/stack_config.lua`:

```lua
return {
  -- 1. Python & FastAPI: VirtualEnv selector
  {
    "linux-cultist/venv-selector.nvim",
    dependencies = { "neovim/nvim-lspconfig", "nvim-telescope/telescope.nvim" },
    opts = { name = { "venv", ".venv", "env", ".env" }, auto_refresh = true },
    keys = {
      { "<leader>cv", "<cmd>VenvSelect<cr>", desc = "Select VirtualEnv (Python)" },
    },
  },

  -- 2. HTML / Angular: auto close and rename tags
  {
    "windwp/nvim-ts-autotag",
    opts = {
      opts = {
        enable_close = true,
        enable_rename = true,
        enable_close_on_slash = true,
      },
    },
  },

  -- 3. Tailwind CSS & CSS: show colors inline in the buffer
  {
    "roobert/tailwindcss-colorizer-cmp.nvim",
    opts = { color_square_width = 2 },
  },

  -- 4. Markdown preview in the web browser
  {
    "iamcco/markdown-preview.nvim",
    cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
    ft = { "markdown" },
    build = function() vim.fn["mkdp#util#install"]() end,
    keys = {
      { "<leader>cp", "<cmd>MarkdownPreviewToggle<cr>", desc = "Markdown Preview Web" },
    },
  },

  -- 5. AI assistant (Avante.nvim, Cursor style)
  {
    "yetone/avante.nvim",
    event = "VeryLazy",
    opts = { provider = "copilot" },
  },
}
```

## Kiro CLI en LazyVim (kiro.nvim)

Puedes invocar los CLIs de IA sin salir del editor, montándolos como plugins de `lazy.nvim` con su propio atajo.

| Acción | Atajo o comando |
| --- | --- |
| Abrir / cerrar Kiro CLI | `<leader> t k` |
| Comando equivalente del plugin | `:KiroToggle` |
| Cargar el plugin manualmente | `:Lazy load kiro.nvim` |
| Salir del modo insertar de la terminal | `Ctrl + \` `Ctrl + n` |
| Volver al modo insertar (escribirle a Kiro) | `i` / `a` |
| Moverse entre ventanas (código y Kiro) | `Ctrl + h/j/k/l` |

### Instalación

Crea `~/.config/nvim/lua/plugins/kiro.lua`:

```lua
return {
  {
    'srirammv/kiro.nvim',
    config = function()
      require('kiro').setup()
    end,
    keys = {
      { '<leader>tk', '<cmd>KiroToggle<cr>', desc = 'Toggle Kiro CLI' },
    },
  }
}
```

1. Guarda el archivo y reinicia Neovim, o ejecuta `:Lazy sync` para que lazy.nvim descargue el plugin.
2. Verifica el estado del plugin con `:Lazy`.
3. Presiona `<leader> t k` para alternar la interfaz de Kiro CLI.

Requisito de tmux: esta integración usa tmux, así que debes correr Neovim dentro de una sesión.

```bash
tmux new -s dev
nvim .
```

Alternativa sin tmux: lanza el binario `kiro` con `toggleterm.nvim` y mapea el mismo atajo `<leader> t k`.

## Claude Code en LazyVim (claudecode.nvim)

| Acción | Atajo o comando |
| --- | --- |
| Enfocar o abrir la sesión de Claude | `<leader> a f` |
| Adjuntar el buffer actual al contexto | `<leader> a b` |
| Enviar la selección (modo visual) | `<leader> a s` |
| Seleccionar el modelo de Claude | `<leader> a m` |
| Enfocar la sesión activa | `:ClaudeCodeFocus` |
| Iniciar una sesión nueva | `:ClaudeCodeNew` |
| Enviar texto o selección | `:ClaudeCodeSend` |
| Agregar un archivo al contexto | `:ClaudeCodeAdd %` |

### Vía recomendada: extra oficial

1. Abre Neovim y ejecuta `:LazyExtras`.
2. Baja hasta la sección `ai`.
3. Selecciona `claudecode` y presiona `x`.
4. Reinicia Neovim para que lazy.nvim instale el plugin.

Antes de abrir Neovim, instala y autentica el CLI de Claude Code, y comprueba que el comando `claude` (o `claude-code`) funciona en tu shell:

```bash
which claude
claude --version
```

### Configuración manual

Crea `~/.config/nvim/lua/plugins/claudecode.lua`:

```lua
return {
  {
    "coder/claudecode.nvim", -- Official wrapper of the Claude Code IDE extension
    dependencies = {
      "nvim-lua/plenary.nvim",
      "ibhagwan/fzf-lua", -- Optional: file pickers and session switching
    },
    cmd = { "ClaudeCodeFocus", "ClaudeCodeNew", "ClaudeCodeSend" },
    keys = {
      { "<leader>af", "<cmd>ClaudeCodeFocus<cr>",       desc = "Focus Claude Code" },
      { "<leader>ab", "<cmd>ClaudeCodeAdd %<cr>",      desc = "Add Buffer to Claude" },
      { "<leader>as", ":ClaudeCodeSend<cr>", mode = "v", desc = "Send Selection to Claude" },
      { "<leader>am", "<cmd>ClaudeCodeSelectModel<cr>", desc = "Select Claude Model" },
    },
    opts = {
      -- Custom plugin overrides here
    },
  }
}
```

Usa solo una de las dos vías. Si ya activaste `ai.claudecode` en `:LazyExtras`, este archivo solo sirve para sobrescribir atajos u `opts`.
