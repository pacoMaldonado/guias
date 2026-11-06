---
title: 'Bash y Zsh'
description: 'Atajos de terminal, navegación de archivos, tuberías y gestión de procesos para el día a día.'
category: 'Terminal'
icon: 'mdi:console'
tags: ['bash', 'zsh', 'shell', 'terminal']
lastUpdated: 2026-09-15
isDraft: false
---

Trucos de shell para moverte más rápido por la terminal.

## Navegación

```bash
cd -            # Go back to the previous directory
pushd /tmp      # Save current dir and move to /tmp
popd            # Return to the saved directory
```

## Búsqueda de archivos

```bash
# Find files by name
find . -name "*.log"

# Search text recursively, showing line numbers
grep -rn "TODO" src/

# Count matches
grep -rc "import" src/
```

## Tuberías y redirección

```bash
# Pipe output into another command
cat access.log | grep "500" | wc -l

# Redirect stdout and stderr to a file
npm run build > build.log 2>&1
```

## Procesos

```bash
jobs            # List background jobs
kill %1         # Kill background job number 1
ps aux | grep node
```
