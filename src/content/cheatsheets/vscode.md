---
title: 'VS Code'
description: 'Atajos y trucos de VS Code: paleta de comandos, multicursor, edición de líneas, búsqueda con regex, navegación, terminal, Git, depuración y CLI.'
category: 'Tools'
icon: 'mdi:microsoft-visual-studio-code'
tags: ['vscode', 'editor', 'atajos', 'productividad']
lastUpdated: 2026-11-06
isDraft: false
---

Las tablas muestran los atajos por defecto de Windows y Linux; cuando Linux usa otra combinación se indica en la descripción. En macOS cambia `Ctrl` por `Cmd` y `Alt` por `Option` en casi todos (ver la sección de macOS).
Si solo recuerdas un atajo, que sea la paleta de comandos: `Ctrl + Shift + P`.

## Paleta de comandos y archivos

| Acción | Atajo |
| --- | --- |
| Paleta de comandos | `Ctrl + Shift + P` o `F1` |
| Abrir archivo por nombre (Quick Open) | `Ctrl + P` |
| Ir a una línea (en Quick Open escribe `:42`) | `Ctrl + G` |
| Ir a un símbolo del archivo (en Quick Open, `@`) | `Ctrl + Shift + O` |
| Ir a un símbolo del proyecto (en Quick Open, `#`) | `Ctrl + T` |
| Abrir la configuración | `Ctrl + ,` |
| Abrir los atajos de teclado | `Ctrl + K` `Ctrl + S` |
| Cerrar el editor actual | `Ctrl + W` |
| Reabrir el último editor cerrado | `Ctrl + Shift + T` |
| Vista previa de Markdown | `Ctrl + Shift + V` |

## Multicursor y selección

| Acción | Atajo |
| --- | --- |
| Añadir cursor donde haces clic | `Alt + Click` |
| Cursor arriba / abajo (Linux: `Shift + Alt + ↑/↓`) | `Ctrl + Alt + ↑` / `Ctrl + Alt + ↓` |
| Seleccionar la siguiente coincidencia | `Ctrl + D` |
| Saltar la coincidencia actual y seguir | `Ctrl + K` `Ctrl + D` |
| Seleccionar todas las coincidencias | `Ctrl + Shift + L` |
| Cursor al final de cada línea seleccionada | `Shift + Alt + I` |
| Selección en columna (arrastrar) | `Shift + Alt + Click` |
| Deshacer la última operación de cursor | `Ctrl + U` |
| Ampliar / reducir la selección | `Shift + Alt + →` / `Shift + Alt + ←` |

## Edición de líneas

| Acción | Atajo |
| --- | --- |
| Mover la línea arriba / abajo | `Alt + ↑` / `Alt + ↓` |
| Duplicar la línea (Linux: `Ctrl + Shift + Alt + ↓`) | `Shift + Alt + ↓` |
| Borrar la línea | `Ctrl + Shift + K` |
| Insertar línea debajo / encima | `Ctrl + Enter` / `Ctrl + Shift + Enter` |
| Seleccionar la línea actual | `Ctrl + L` |
| Comentar / descomentar | `Ctrl + /` |
| Comentario de bloque (Linux: `Ctrl + Shift + A`) | `Shift + Alt + A` |
| Indentar / quitar indentación | `Ctrl + ]` / `Ctrl + [` |
| Formatear el documento (Linux: `Ctrl + Shift + I`) | `Shift + Alt + F` |
| Ir a la llave o paréntesis pareja | `Ctrl + Shift + \` |

## Buscar y reemplazar

| Acción | Atajo |
| --- | --- |
| Buscar en el archivo | `Ctrl + F` |
| Reemplazar en el archivo | `Ctrl + H` |
| Buscar en todo el proyecto | `Ctrl + Shift + F` |
| Reemplazar en todo el proyecto | `Ctrl + Shift + H` |
| Siguiente / anterior coincidencia | `F3` / `Shift + F3` |
| Seleccionar todas las coincidencias de la búsqueda | `Alt + Enter` |
| Activar regex / mayúsculas / palabra completa | `Alt + R` / `Alt + C` / `Alt + W` |

Con regex activado puedes usar grupos en el reemplazo: buscar `(\w+)\.log\(` y reemplazar por `logger.$1(`. En el campo de reemplazo, `\n` inserta un salto de línea y `\u` / `\l` cambian la siguiente letra a mayúscula / minúscula.

## Navegar por el código

| Acción | Atajo |
| --- | --- |
| Ir a la definición | `F12` |
| Ver la definición sin salir (peek) | `Alt + F12` |
| Abrir la definición en un lateral | `Ctrl + K` `F12` |
| Ver referencias | `Shift + F12` |
| Renombrar símbolo en todo el proyecto | `F2` |
| Acciones rápidas y correcciones | `Ctrl + .` |
| Forzar sugerencias de autocompletado | `Ctrl + Space` |
| Siguiente error o advertencia | `F8` |
| Volver atrás / adelante (Linux: `Ctrl + Alt + -` / `Ctrl + Shift + -`) | `Alt + ←` / `Alt + →` |

## Paneles, layout y terminal

| Acción | Atajo |
| --- | --- |
| Mostrar / ocultar la barra lateral | `Ctrl + B` |
| Explorador / Búsqueda / Git / Depuración / Extensiones | `Ctrl + Shift + E` / `F` / `G` / `D` / `X` |
| Mostrar / ocultar el panel inferior | `Ctrl + J` |
| Panel de problemas | `Ctrl + Shift + M` |
| Dividir el editor | `Ctrl + \` |
| Enfocar el grupo de editores 1, 2, 3 | `Ctrl + 1` / `Ctrl + 2` / `Ctrl + 3` |
| Modo Zen | `Ctrl + K` `Z` |
| Mostrar / ocultar la terminal integrada | ``Ctrl + ` `` |
| Crear una terminal nueva | ``Ctrl + Shift + ` `` |
| Dividir la terminal | `Ctrl + Shift + 5` |

## Git integrado

| Acción | Atajo |
| --- | --- |
| Abrir la vista de control de código | `Ctrl + Shift + G` |
| Confirmar el commit desde el cuadro de mensaje | `Ctrl + Enter` |

En la paleta de comandos escribe `Git:` para ver todas las acciones:

| Comando de la paleta | Qué hace |
| --- | --- |
| `Git: Checkout to...` | Cambiar de rama o crear una nueva |
| `Git: Pull` / `Git: Push` | Sincronizar con el remoto |
| `Git: Stash` / `Git: Pop Stash` | Guardar y recuperar cambios temporales |
| `Git: Open Changes` | Ver el diff del archivo actual |
| `Git: Undo Last Commit` | Deshace el último commit conservando los cambios |

En la vista de cambios, el botón `+` de cada archivo equivale a `git add`; selecciona líneas en el diff y usa `Git: Stage Selected Ranges` para un `git add -p` visual. El historial de cada archivo está en el panel Timeline del explorador.

## Depuración

| Acción | Atajo |
| --- | --- |
| Iniciar o continuar | `F5` |
| Ejecutar sin depurar | `Ctrl + F5` |
| Detener | `Shift + F5` |
| Reiniciar | `Ctrl + Shift + F5` |
| Poner o quitar breakpoint | `F9` |
| Paso por encima / dentro / fuera | `F10` / `F11` / `Shift + F11` |

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug current file",
      "program": "${file}"
    }
  ]
}
```

## settings.json útiles

Ábrelo desde la paleta con `Preferences: Open User Settings (JSON)`. Para ajustes del proyecto usa `.vscode/settings.json` y versiónalo.

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "editor.rulers": [100],
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.bracketPairColorization.enabled": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.autoSave": "onFocusChange",
  "explorer.compactFolders": false,
  "terminal.integrated.defaultProfile.linux": "zsh",
  "[python]": { "editor.defaultFormatter": "charliermarsh.ruff" }
}
```

## Comando code en la terminal

| Acción | Comando |
| --- | --- |
| Abrir la carpeta actual | `code .` |
| Abrir en la ventana ya abierta | `code -r .` |
| Abrir en una ventana nueva | `code -n .` |
| Abrir un archivo en una línea concreta | `code -g src/main.ts:42` |
| Comparar dos archivos | `code --diff old.json new.json` |
| Instalar una extensión | `code --install-extension esbenp.prettier-vscode` |
| Listar las extensiones instaladas | `code --list-extensions` |
| Usar VS Code como editor de Git | `git config --global core.editor "code --wait"` |

En macOS instala el comando desde la paleta: `Shell Command: Install 'code' command in PATH`.

## Equivalencias en macOS

| Acción | Atajo |
| --- | --- |
| Paleta de comandos | `Cmd + Shift + P` |
| Quick Open | `Cmd + P` |
| Seleccionar la siguiente coincidencia | `Cmd + D` |
| Cursor arriba / abajo | `Option + Cmd + ↑` / `Option + Cmd + ↓` |
| Mover / duplicar la línea | `Option + ↓` / `Shift + Option + ↓` |
| Borrar la línea | `Cmd + Shift + K` |
| Comentar / descomentar | `Cmd + /` |
| Formatear el documento | `Shift + Option + F` |
| Terminal integrada | ``Ctrl + ` `` |
| Volver atrás / adelante | `Ctrl + -` / `Ctrl + Shift + -` |
