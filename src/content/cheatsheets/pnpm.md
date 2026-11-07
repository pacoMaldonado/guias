---
title: 'pnpm'
description: 'pnpm, el gestor de paquetes del equipo: instalación, comandos diarios, aprobación de builds, workspaces, configuración y CI.'
category: 'Tools'
icon: 'mdi:package-variant-closed'
tags: ['pnpm', 'node', 'paquetes', 'monorepo', 'seguridad']
lastUpdated: 2026-11-06
isDraft: false
---

pnpm es el único gestor de paquetes JavaScript permitido en el equipo: es más rápido, ahorra disco y bloquea por defecto los scripts de instalación de las dependencias.
Esta hoja cubre pnpm 12; la mayoría de comandos funcionan igual desde la versión 10.

## Por qué pnpm

| Característica | Qué aporta |
| --- | --- |
| Store global con enlaces | Cada versión de un paquete se guarda una sola vez en disco y los proyectos la enlazan |
| `node_modules` estricto | Solo puedes importar lo que declaras en `package.json`: adiós a las dependencias fantasma |
| Scripts bloqueados | `preinstall`, `install` y `postinstall` de las dependencias no se ejecutan hasta que los apruebas |
| `minimumReleaseAge` | No instala versiones publicadas hace menos de 1 día (valor por defecto: `1440` minutos) |
| Workspaces nativos | Monorepos con `pnpm-workspace.yaml` y filtros por paquete |
| `pnpm-lock.yaml` | Lockfile determinista; versiónalo siempre |

## Instalación y versión

| Acción | Comando |
| --- | --- |
| Instalar en Linux o macOS | `curl -fsSL https://get.pnpm.io/install.sh \| sh -` |
| Instalar con wget | `wget -qO- https://get.pnpm.io/install.sh \| sh -` |
| Instalar en Windows (PowerShell) | `Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing \| Invoke-Expression` |
| Instalar una versión concreta | `curl -fsSL https://get.pnpm.io/install.sh \| env PNPM_VERSION=12.16.1 sh -` |
| Ver la versión instalada | `pnpm --version` |
| Actualizar pnpm (desde v11.10) | `pnpm self-update` |

Fija la versión del proyecto en `package.json` con el campo `packageManager`. Dentro de ese proyecto, `pnpm self-update` actualiza solo ese campo. En Docker, copia el binario desde la imagen oficial `ghcr.io/pnpm/pnpm` (ver la hoja de Docker).

```json
{
  "packageManager": "pnpm@12.16.1"
}
```

## Dependencias del día a día

| Acción | Comando |
| --- | --- |
| Instalar todo lo del `package.json` | `pnpm install` |
| Añadir una dependencia | `pnpm add zod` |
| Añadir una dependencia de desarrollo | `pnpm add -D typescript` |
| Añadir una versión exacta | `pnpm add -E react@19` |
| Instalar una CLI global | `pnpm add -g @angular/cli` |
| Quitar una dependencia | `pnpm remove zod` |
| Instalar solo dependencias de producción | `pnpm install --prod` |
| Primera vez con globales: preparar `PNPM_HOME` | `pnpm setup` |

## Actualizar e inspeccionar

| Acción | Comando |
| --- | --- |
| Ver dependencias desactualizadas | `pnpm outdated` |
| Actualizar dentro de los rangos de `package.json` | `pnpm update` |
| Elegir qué actualizar, incluidas versiones mayores | `pnpm up --interactive --latest` |
| Por qué está instalado un paquete | `pnpm why lodash` |
| Listar dependencias directas | `pnpm list --depth 0` |
| Buscar vulnerabilidades conocidas | `pnpm audit` |
| Reducir duplicados en el lockfile | `pnpm dedupe` |
| Liberar espacio del store | `pnpm store prune` |

## Ejecutar scripts y binarios

| Acción | Comando |
| --- | --- |
| Ejecutar un script de `package.json` | `pnpm run build` |
| Forma corta (si no choca con un comando de pnpm) | `pnpm build` |
| Pasar argumentos al script | `pnpm test -- --watch` |
| Ejecutar un binario local de `node_modules/.bin` | `pnpm exec tsc --noEmit` |
| Ejecutar un paquete sin instalarlo | `pnpm dlx cowsay hola` |
| Crear un proyecto desde un starter | `pnpm create vite my-app` |

## Aprobar scripts de instalación

pnpm no ejecuta los scripts de build de las dependencias hasta que los revisas. Con `strictDepBuilds` (activo por defecto) la instalación falla si hay builds sin revisar. Tus decisiones se guardan en `allowBuilds` dentro de `pnpm-workspace.yaml`; `onlyBuiltDependencies` e `ignoredBuiltDependencies` se eliminaron en v11.

| Acción | Comando |
| --- | --- |
| Revisar los builds pendientes (interactivo) | `pnpm approve-builds` |
| Aprobar unos y denegar otro (con `!`) | `pnpm approve-builds esbuild '!core-js'` |
| Aprobar los builds de paquetes globales | `pnpm approve-builds -g` |

```yaml
# pnpm-workspace.yaml
allowBuilds:
  esbuild: true      # allowed to run install scripts
  core-js: false     # reviewed and denied
```

Evita `pnpm approve-builds --all` y `dangerouslyAllowAllBuilds: true`: aprueban todo sin revisar y anulan la protección.

## Equivalencias si vienes de otro gestor

| Acción habitual | En pnpm |
| --- | --- |
| Instalar desde el lockfile en CI | `pnpm install --frozen-lockfile` |
| Instalar un paquete | `pnpm add <paquete>` |
| Instalar como dependencia de desarrollo | `pnpm add -D <paquete>` |
| Desinstalar | `pnpm remove <paquete>` |
| Instalar globalmente | `pnpm add -g <paquete>` |
| Ejecutar un paquete puntual sin instalar | `pnpm dlx <paquete>` |
| Ejecutar un binario del proyecto | `pnpm exec <binario>` |
| Árbol de dependencias | `pnpm list` |

## Workspaces y monorepos

```yaml
# pnpm-workspace.yaml (repo root)
packages:
  - 'apps/*'
  - 'packages/*'
```

| Acción | Comando |
| --- | --- |
| Ejecutar un script en todos los paquetes | `pnpm -r run build` |
| Scripts en paralelo (ej. servidores de desarrollo) | `pnpm -r --parallel run dev` |
| Ejecutar solo en un paquete | `pnpm --filter web dev` |
| Un paquete y todas sus dependencias | `pnpm --filter "web..." build` |
| Paquetes de una carpeta | `pnpm --filter "./packages/**" test` |
| Solo lo que cambió respecto a `main` | `pnpm --filter "...[origin/main]" test` |
| Añadir una dependencia a un paquete | `pnpm --filter web add zod` |
| Enlazar un paquete local del workspace | `pnpm --filter web add @acme/ui --workspace` |
| Añadir una herramienta en la raíz | `pnpm add -w -D prettier` |

Las dependencias internas se declaran con el protocolo `workspace:`, por ejemplo `"@acme/ui": "workspace:*"`.

## Configuración: qué va dónde

| Archivo | Qué contiene |
| --- | --- |
| `pnpm-workspace.yaml` | Casi toda la configuración: `allowBuilds`, `minimumReleaseAge`, `nodeLinker`, `publicHoistPattern`, `packages` |
| `.npmrc` | Solo autenticación, registry, TLS, proxy y `local-address` |
| `package.json` | `packageManager`, scripts y dependencias |
| Config global (`pnpm config set -g`) | Ajustes de la máquina como `storeDir` |

```ini
# .npmrc: auth only, never commit real tokens
@acme:registry=https://registry.example.com/
//registry.example.com/:_authToken=${NODE_AUTH_TOKEN}
```

Las variables `${...}` se expanden en `.npmrc`, pero no en las URL de registry dentro de `pnpm-workspace.yaml`. Guarda el token en el gestor de secretos del CI, nunca en el repositorio.

## Integración continua

En CI usa siempre `pnpm install --frozen-lockfile`: falla si `pnpm-lock.yaml` no coincide con `package.json`.

```yaml
# .gitlab-ci.yml
test:
  image: ghcr.io/pnpm/pnpm:12
  cache:
    key:
      files: [pnpm-lock.yaml]
    paths: [.pnpm-store]
  before_script:
    - pnpm config set store-dir .pnpm-store
    - pnpm runtime set node 24 -g
    - pnpm install --frozen-lockfile
  script:
    - pnpm test
```

En GitHub Actions, la documentación oficial usa la acción `pnpm/setup` (v3) con `runtime: node@24` y `cache: true`; fija la acción a un SHA de commit.
