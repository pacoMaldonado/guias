---
title: 'Git esencial'
description: 'Comandos de Git más usados en el día a día: ramas, commits, deshacer cambios y trabajo remoto.'
category: 'Tools'
icon: 'mdi:git'
tags: ['git', 'vcs', 'ramas', 'commits']
lastUpdated: 2026-10-28
isDraft: false
---

Comandos de Git que usas cada día, agrupados por tarea.

## Configuración inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
git config --global init.defaultBranch main
```

## Ramas

```bash
# List all branches (local and remote)
git branch -a

# Create and switch to a new branch
git switch -c feature/login

# Delete a merged branch
git branch -d feature/login
```

## Deshacer cambios

```bash
# Discard changes in a file (careful: irreversible)
git restore path/to/file.ts

# Unstage a file but keep the changes
git restore --staged path/to/file.ts

# Amend the last commit message
git commit --amend -m "feat: add login form validation"
```

## Trabajo remoto

```bash
git remote add origin git@github.com:user/repo.git
git push -u origin main
git pull --rebase origin main
```

> **Consejo:** usa `git switch` y `git restore` en lugar de `git checkout`.
> Son más explícitos y reducen los errores.
