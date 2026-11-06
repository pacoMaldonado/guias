---
title: 'Git esencial'
description: 'Comandos de Git más usados en el día a día: ramas, commits, deshacer cambios y trabajo remoto.'
category: 'Tools'
icon: 'mdi:git'
tags: ['git', 'vcs', 'ramas', 'commits']
lastUpdated: 2026-10-28
isDraft: false
---

Comandos de Git que usas cada día, agrupados por tarea. Usa `git switch` y `git restore` en lugar de `git checkout`: son más explícitos y reducen los errores.

## Configuración inicial

| Acción | Comando |
| --- | --- |
| Definir tu nombre global | `git config --global user.name "Tu Nombre"` |
| Definir tu correo global | `git config --global user.email "tu@correo.com"` |
| Establecer `main` como rama por defecto | `git config --global init.defaultBranch main` |
| Ver toda la configuración activa | `git config --list` |

## Ramas

| Acción | Comando |
| --- | --- |
| Listar todas las ramas (locales y remotas) | `git branch -a` |
| Crear y cambiar a una rama nueva | `git switch -c feature/login` |
| Cambiar a una rama existente | `git switch main` |
| Eliminar una rama ya fusionada | `git branch -d feature/login` |
| Forzar el borrado de una rama | `git branch -D feature/login` |

## Deshacer cambios

| Acción | Comando |
| --- | --- |
| Descartar cambios locales en un archivo | `git restore path/to/file.ts` |
| Quitar un archivo del área de staging | `git restore --staged path/to/file.ts` |
| Corregir el mensaje del último commit | `git commit --amend -m "feat: add login form validation"` |
| Deshacer el último commit conservando los cambios | `git reset --soft HEAD~1` |

## Trabajo remoto

| Acción | Comando |
| --- | --- |
| Vincular el repositorio remoto `origin` | `git remote add origin git@github.com:user/repo.git` |
| Subir la rama actual y configurar el tracking | `git push -u origin main` |
| Traer cambios aplicando rebase limpio | `git pull --rebase origin main` |
| Descargar referencias remotas sin fusionar | `git fetch --all --prune` |
