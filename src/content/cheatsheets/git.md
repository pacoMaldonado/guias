---
title: 'Git esencial'
description: 'Comandos de Git del día a día: ramas, commits, historial, stash, rebase, etiquetas, deshacer cambios, limpieza y trabajo remoto.'
category: 'Tools'
icon: 'mdi:git'
tags: ['git', 'vcs', 'ramas', 'commits']
lastUpdated: 2026-11-06
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

## Estado y diferencias

| Acción | Comando |
| --- | --- |
| Estado resumido con la rama y su tracking | `git status -sb` |
| Cambios sin preparar (working tree) | `git diff` |
| Cambios ya preparados para el commit | `git diff --staged` |
| Solo los nombres de archivos cambiados | `git diff --name-only` |
| Comparar tu rama con `main` | `git diff main...HEAD` |

## Commits

| Acción | Comando |
| --- | --- |
| Preparar un archivo concreto | `git add src/app.ts` |
| Elegir trozo a trozo qué preparar | `git add -p` |
| Crear el commit | `git commit -m "feat(auth): add login form validation"` |
| Añadir cambios al último commit sin tocar el mensaje | `git commit --amend --no-edit` |

Usa [Conventional Commits](https://www.conventionalcommits.org/): `tipo(scope): descripción en imperativo`, con tipos como `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf` o `ci`. Haz `--amend` solo sobre commits que aún no has subido.

## Ramas

| Acción | Comando |
| --- | --- |
| Listar todas las ramas (locales y remotas) | `git branch -a` |
| Crear y cambiar a una rama nueva | `git switch -c feature/login` |
| Cambiar a una rama existente | `git switch main` |
| Volver a la rama anterior | `git switch -` |
| Eliminar una rama ya fusionada | `git branch -d feature/login` |
| Forzar el borrado de una rama | `git branch -D feature/login` |

## Historial

| Acción | Comando |
| --- | --- |
| Historial compacto como grafo de todas las ramas | `git log --oneline --graph --all` |
| Historial de un archivo con sus diffs | `git log -p -- src/app.ts` |
| Seguir un archivo aunque se haya renombrado | `git log --follow -- src/app.ts` |
| Buscar commits por mensaje | `git log --grep="login"` |
| Quién cambió cada línea | `git blame src/app.ts` |
| Ver un commit concreto | `git show a1b2c3d` |
| Ver un archivo tal como estaba en otra rama | `git show main:src/app.ts` |

## Stash: guardar cambios temporalmente

| Acción | Comando |
| --- | --- |
| Guardar los cambios con un mensaje | `git stash push -m "wip: refactor del login"` |
| Incluir también archivos nuevos sin seguimiento | `git stash push -u -m "wip: nuevos componentes"` |
| Listar los stashes | `git stash list` |
| Recuperar el último y borrarlo de la lista | `git stash pop` |
| Aplicar uno concreto sin borrarlo | `git stash apply stash@{1}` |
| Borrar un stash | `git stash drop stash@{1}` |

## Rebase e integración

| Acción | Comando |
| --- | --- |
| Reaplicar tu rama sobre la última `main` | `git rebase origin/main` |
| Continuar tras resolver un conflicto | `git rebase --continue` |
| Cancelar el rebase y volver al estado inicial | `git rebase --abort` |
| Copiar un commit concreto a la rama actual | `git cherry-pick a1b2c3d` |
| Fusionar creando siempre un commit de merge | `git merge --no-ff feature/login` |

Haz rebase solo sobre ramas que nadie más usa. Si tu rama ya estaba subida, publícala después con `git push --force-with-lease`, nunca con `--force`.

## Etiquetas

| Acción | Comando |
| --- | --- |
| Crear una etiqueta anotada | `git tag -a v1.2.0 -m "Release 1.2.0"` |
| Listar etiquetas | `git tag --list` |
| Subir una etiqueta | `git push origin v1.2.0` |
| Subir todas las etiquetas | `git push --tags` |
| Borrar una etiqueta local | `git tag -d v1.2.0` |

## Deshacer cambios

| Acción | Comando |
| --- | --- |
| Descartar cambios locales en un archivo | `git restore path/to/file.ts` |
| Quitar un archivo del área de staging | `git restore --staged path/to/file.ts` |
| Corregir el mensaje del último commit | `git commit --amend -m "feat: add login form validation"` |
| Deshacer el último commit conservando los cambios | `git reset --soft HEAD~1` |
| Revertir un commit ya subido con un commit nuevo | `git revert a1b2c3d` |
| Ver dónde ha estado `HEAD` (para recuperar commits) | `git reflog` |
| Recuperar un commit perdido en una rama nueva | `git switch -c rescue a1b2c3d` |
| Descartar todo y volver a un commit (destructivo) | `git reset --hard HEAD~1` |

`git reset --hard` borra los cambios sin confirmar sin posibilidad de recuperarlos y reescribe la historia: no lo uses en ramas compartidas. En ramas ya subidas usa `git revert`.

## Mover y borrar archivos

| Acción | Comando |
| --- | --- |
| Renombrar o mover conservando el historial | `git mv src/old.ts src/new.ts` |
| Borrar un archivo del repositorio | `git rm src/legacy.ts` |
| Dejar de versionar un archivo sin borrarlo del disco | `git rm --cached .env.local` |

Haz el `git mv` en un commit y los cambios de contenido en otro: así Git detecta el renombrado y `git log --follow` sigue funcionando.

## Trabajo remoto y limpieza

| Acción | Comando |
| --- | --- |
| Vincular el repositorio remoto `origin` | `git remote add origin git@github.com:user/repo.git` |
| Subir la rama actual y configurar el tracking | `git push -u origin main` |
| Traer cambios aplicando rebase limpio | `git pull --rebase origin main` |
| Descargar referencias remotas sin fusionar | `git fetch --all --prune` |

### Limpieza de ramas

| Acción | Comando |
| --- | --- |
| Ramas locales ya fusionadas en `main` | `git branch --merged main` |
| Ramas aún sin fusionar | `git branch --no-merged main` |
| Quitar referencias a ramas remotas borradas | `git fetch --prune` |
| Borrar una rama en el remoto | `git push origin --delete feature/login` |
| Ver ramas cuyo remoto ya no existe | `git branch -vv` |

## Bisect: encontrar el commit que rompió algo

| Acción | Comando |
| --- | --- |
| Empezar la búsqueda | `git bisect start` |
| Marcar el commit actual como roto | `git bisect bad` |
| Marcar un commit que funcionaba | `git bisect good v1.1.0` |
| Automatizar con un script de tests | `git bisect run pnpm test` |
| Terminar y volver a tu rama | `git bisect reset` |

Git hace una búsqueda binaria: tras cada `good` o `bad` cambia a otro commit hasta señalar el primero que falla.
