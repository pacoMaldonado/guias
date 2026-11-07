---
title: 'TypeScript'
description: 'TypeScript 5.x: tipos, interfaces, narrowing, genéricos, utility types, mapped y conditional types, satisfies y un tsconfig estricto.'
category: 'Frontend'
icon: 'mdi:language-typescript'
tags: ['typescript', 'tipos', 'genericos', 'tsconfig', 'frontend']
lastUpdated: 2026-11-06
isDraft: false
---

TypeScript añade tipos estáticos a JavaScript y los elimina al compilar: no existen en tiempo de ejecución.
Activa `strict` desde el primer día y prefiere que el compilador infiera los tipos; anota sobre todo parámetros y valores exportados.

## Comandos básicos

| Acción | Comando |
| --- | --- |
| Instalar TypeScript en el proyecto | `pnpm add -D typescript` |
| Crear un `tsconfig.json` inicial | `pnpm exec tsc --init` |
| Comprobar tipos sin generar archivos | `pnpm exec tsc --noEmit` |
| Comprobar tipos en modo observador | `pnpm exec tsc --noEmit --watch` |
| Compilar según `tsconfig.json` | `pnpm exec tsc` |
| Ver la versión instalada | `pnpm exec tsc --version` |
| Instalar tipos de Node.js | `pnpm add -D @types/node` |

## Tipos básicos y literales

```ts
let title: string = 'Guías';
let count: number = 0;
let active: boolean = true;
let tags: string[] = ['ts', 'js'];
let point: [number, number] = [10, 20];          // tuple
let id: string | number;                         // union

type Status = 'idle' | 'loading' | 'error';      // literal union
let anything: unknown;                           // safe: must narrow before use
function fail(msg: string): never { throw new Error(msg); }
function log(msg: string): void { console.log(msg); }
```

Prefiere `unknown` sobre `any`: `any` desactiva la comprobación de tipos.

## Interfaces vs type

```ts
interface User {
  readonly id: string;
  name: string;
  email?: string;                                 // optional
}
interface Admin extends User { permissions: string[] }

type Point = { x: number; y: number };
type Id = string | number;                        // only `type` can alias unions
type WithTimestamps<T> = T & { createdAt: string; updatedAt: string };
```

| Caso | Recomendación |
| --- | --- |
| Forma de un objeto o contrato de una clase | `interface` (se puede extender y fusionar) |
| Uniones, tuplas, primitivos o tipos calculados | `type` |
| Combinar tipos | `extends` en interfaces, `&` en types |

## Uniones e intersecciones

| Sintaxis | Significado |
| --- | --- |
| `A \| B` | El valor es `A` o `B`; solo puedes usar lo común hasta hacer narrowing |
| `A & B` | El valor tiene todas las propiedades de `A` y de `B` |
| `string \| null` | Valor que puede faltar; con `strict` obliga a comprobarlo |
| `T[]` / `Array<T>` | Array de `T` (dos formas equivalentes) |
| `readonly T[]` | Array que no se puede modificar |

## Narrowing

```ts
function format(value: string | number) {
  if (typeof value === 'string') return value.toUpperCase();
  return value.toFixed(2);
}

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {                      // discriminated union
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    default: { const unreachable: never = shape; return unreachable; }
  }
}

if ('permissions' in user) { /* user is Admin here */ }

function isUser(value: unknown): value is User {          // type guard
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

## Genéricos

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
}

function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
```

`extends` en un genérico es una restricción: limita qué tipos acepta `T`.

## Utility types

| Tipo | Qué hace |
| --- | --- |
| `Partial<T>` | Todas las propiedades opcionales (útil para updates) |
| `Required<T>` | Todas las propiedades obligatorias |
| `Readonly<T>` | Todas las propiedades de solo lectura |
| `Pick<T, 'a' \| 'b'>` | Solo las propiedades indicadas |
| `Omit<T, 'password'>` | Todas excepto las indicadas |
| `Record<K, V>` | Objeto con claves `K` y valores `V` |
| `ReturnType<typeof fn>` | Tipo que devuelve una función |
| `Parameters<typeof fn>` | Tupla con los tipos de los parámetros |
| `Awaited<T>` | Tipo resuelto de una promesa (`Awaited<Promise<User>>` es `User`) |
| `NonNullable<T>` | Quita `null` y `undefined` |

## keyof, typeof e indexed access

| Sintaxis | Significado |
| --- | --- |
| `keyof User` | Unión de las claves: `'id' \| 'name' \| 'email'` |
| `typeof config` | Tipo de un valor existente (en posición de tipo) |
| `User['name']` | Tipo de una propiedad concreta |
| `(typeof ROLES)[number]` | Unión de los elementos de un array `as const` |
| `keyof typeof config` | Claves de un objeto existente |

## Mapped y conditional types

```ts
// Mapped: transform every property of T
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

// Conditional: choose a type based on another
type IsString<T> = T extends string ? true : false;
type ElementOf<T> = T extends readonly (infer U)[] ? U : never;

type A = ElementOf<string[]>;                // string
```

## satisfies, as const y enums

```ts
const ROLES = ['admin', 'editor', 'viewer'] as const;   // readonly tuple of literals
type Role = (typeof ROLES)[number];                     // 'admin' | 'editor' | 'viewer'

const routes = {
  home: '/',
  docs: '/docs',
} satisfies Record<string, string>;        // checks the shape, keeps the literal keys

// Prefer literal unions over enums
type Direction = 'up' | 'down';
enum LegacyDirection { Up = 'UP', Down = 'DOWN' }  // emits JS code at runtime
```

| Opción | Cuándo usarla |
| --- | --- |
| Unión de literales | Por defecto: sin código extra y compatible con `erasableSyntaxOnly` |
| `as const` + objeto | Cuando necesitas los valores en tiempo de ejecución |
| `enum` | Solo si el proyecto ya los usa; generan JavaScript |
| `x as T` | Aserción: confías en ti, no en el compilador; úsala lo mínimo |

## tsconfig recomendado

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "preserve",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

- Esta configuración es para proyectos con bundler (Vite, Astro, Angular). Para una librería o un servicio Node.js sin bundler usa `"module": "nodenext"` (que implica `moduleResolution` `nodenext`) y quita `noEmit`.
- `verbatimModuleSyntax` exige `import type` para importar solo tipos.
- `noUncheckedIndexedAccess` hace que `arr[0]` sea `T | undefined`.
