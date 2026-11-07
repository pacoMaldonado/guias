---
title: 'Node.js'
description: 'Node.js 22/24 LTS: versiones con fnm, ejecutar scripts, ESM, APIs nativas, test runner, servidor HTTP, depuración y dependencias con pnpm.'
category: 'Backend'
icon: 'mdi:nodejs'
tags: ['nodejs', 'javascript', 'pnpm', 'backend']
lastUpdated: 2026-11-06
isDraft: false
---

Usa siempre una versión LTS (par: 22 o 24) y fíjala por proyecto con un archivo `.nvmrc` o `.node-version`.
Las dependencias se gestionan solo con `pnpm`; desde Node 22 ya tienes `fetch`, `--watch`, `--env-file` y un test runner sin instalar nada.

## Versiones con fnm

| Acción | Comando |
| --- | --- |
| Instalar la última LTS | `fnm install --lts` |
| Instalar una versión concreta | `fnm install 24` |
| Usar una versión en la terminal actual | `fnm use 24` |
| Definir la versión por defecto | `fnm default 24` |
| Listar versiones instaladas | `fnm list` |
| Fijar la versión del proyecto | `node --version > .nvmrc` |
| Cambiar de versión al entrar a la carpeta (en `~/.bashrc`) | `eval "$(fnm env --use-on-cd)"` |

### Equivalentes con nvm

| Acción | Comando |
| --- | --- |
| Instalar la última LTS | `nvm install --lts` |
| Usar la versión de `.nvmrc` | `nvm use` |
| Definir la versión por defecto | `nvm alias default 24` |
| Listar versiones instaladas | `nvm ls` |

## Ejecutar código

| Acción | Comando |
| --- | --- |
| Ejecutar un archivo | `node app.js` |
| Reiniciar al guardar cambios | `node --watch app.js` |
| Cargar variables desde `.env` | `node --env-file=.env app.js` |
| Combinar watch y `.env` | `node --watch --env-file=.env app.js` |
| Ejecutar un script de `package.json` sin pnpm | `node --run dev` |
| Evaluar una expresión rápida | `node -e "console.log(process.versions.node)"` |
| Abrir el REPL interactivo | `node` |
| Ver la versión instalada | `node --version` |

En el REPL, `.help` muestra los comandos, `.exit` (o `Ctrl + d`) sale y `_` guarda el último resultado.

## Módulos: ESM vs CommonJS

| Concepto | Descripción |
| --- | --- |
| `"type": "module"` | En `package.json`, hace que los `.js` sean ESM (`import`/`export`) |
| `.mjs` / `.cjs` | Fuerzan ESM o CommonJS sin importar el `"type"` |
| `import x from './x.js'` | En ESM la extensión del archivo es obligatoria |
| `require('./x')` | Sintaxis CommonJS; no existe en ESM |
| `import.meta.dirname` | Carpeta del módulo actual (sustituye a `__dirname` en ESM) |
| `import.meta.filename` | Ruta absoluta del archivo actual (sustituye a `__filename`) |
| Top-level `await` | Permitido en ESM, fuera de funciones `async` |

```js
// ESM: named exports, JSON import with attributes, top-level await
import { readFile } from 'node:fs/promises';
import config from './config.json' with { type: 'json' };

export const name = config.name;
const data = await readFile(new URL('./data.txt', import.meta.url), 'utf8');
```

## APIs nativas útiles

```js
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const dir = join(import.meta.dirname, 'output');
await mkdir(dir, { recursive: true });

const files = await readdir(import.meta.dirname);
const jsFiles = files.filter((f) => extname(f) === '.js');

await writeFile(join(dir, 'report.json'), JSON.stringify({ jsFiles }, null, 2));
const text = await readFile(join(dir, 'report.json'), 'utf8');
console.log(basename(dir), text.length);
```

| API | Para qué sirve |
| --- | --- |
| `process.env.PORT` | Leer variables de entorno (siempre son strings) |
| `process.argv.slice(2)` | Argumentos pasados al script |
| `process.exit(1)` | Terminar con código de error |
| `process.cwd()` | Carpeta desde donde se ejecutó Node |
| `fileURLToPath(import.meta.url)` | Convertir una URL `file://` a ruta (de `node:url`) |
| `util.parseArgs()` | Parsear flags de CLI sin librerías (de `node:util`) |

## fetch nativo

```js
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ana', createdAt: new Date().toISOString() }),
  signal: AbortSignal.timeout(5000), // abort after 5 s
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
const user = await res.json();
```

## Test runner nativo

| Acción | Comando |
| --- | --- |
| Ejecutar todos los tests (`*.test.js`, `test/`…) | `node --test` |
| Ejecutar un archivo concreto | `node --test src/sum.test.js` |
| Re-ejecutar al guardar | `node --test --watch` |
| Filtrar tests por nombre | `node --test --test-name-pattern="sum"` |

```js
// src/sum.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sum } from './sum.js';

describe('sum', () => {
  it('adds two numbers', () => {
    assert.equal(sum(2, 3), 5);
  });

  it('rejects non-numbers', () => {
    assert.throws(() => sum('a', 1), TypeError);
  });
});
```

## Servidor HTTP mínimo

```js
// server.js — run with: node --watch --env-file=.env server.js
import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 3000);

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
```

## Depuración

| Acción | Comando |
| --- | --- |
| Activar el inspector (puerto 9229) | `node --inspect app.js` |
| Pausar en la primera línea | `node --inspect-brk app.js` |
| Inspector accesible desde otra máquina o contenedor | `node --inspect=0.0.0.0:9229 app.js` |
| Depurar los tests | `node --inspect-brk --test` |
| Mostrar dónde se lanzó una excepción no capturada | `node --trace-uncaught app.js` |

Abre `chrome://inspect` en Chrome o usa la configuración "Attach" de VS Code. Dentro del código, `debugger;` detiene la ejecución cuando el inspector está activo.

## Dependencias con pnpm

| Acción | Comando |
| --- | --- |
| Crear `package.json` | `pnpm init` |
| Instalar todo lo del lockfile | `pnpm install` |
| Instalar en CI respetando el lockfile | `pnpm install --frozen-lockfile` |
| Añadir una dependencia | `pnpm add zod` |
| Añadir una dependencia de desarrollo | `pnpm add -D typescript` |
| Quitar una dependencia | `pnpm remove zod` |
| Actualizar dentro de los rangos permitidos | `pnpm update` |
| Actualizar a la última versión (ignora rangos) | `pnpm update --latest` |
| Ver dependencias desactualizadas | `pnpm outdated` |
| Saber por qué está instalado un paquete | `pnpm why <paquete>` |

## Ejecutar paquetes y scripts con pnpm

| Acción | Comando |
| --- | --- |
| Ejecutar un script de `package.json` | `pnpm run dev` |
| Atajo para scripts (si no choca con un comando de pnpm) | `pnpm dev` |
| Pasar argumentos al script | `pnpm run test -- --watch` |
| Ejecutar un binario instalado en el proyecto | `pnpm exec tsc --noEmit` |
| Ejecutar un paquete sin instalarlo | `pnpm dlx create-vite@latest my-app` |
| Listar los scripts disponibles | `pnpm run` |

```json
{
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "node --watch --env-file=.env src/server.js",
    "start": "node src/server.js",
    "test": "node --test",
    "lint": "eslint ."
  }
}
```
