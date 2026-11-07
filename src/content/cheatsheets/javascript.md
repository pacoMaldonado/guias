---
title: 'JavaScript'
description: 'JavaScript moderno (ES2015–ES2025): sintaxis, arrays, objetos, módulos, asincronía con fetch, DOM, Map/Set, fechas y manejo de errores.'
category: 'Frontend'
icon: 'mdi:language-javascript'
tags: ['javascript', 'es2025', 'async', 'dom', 'frontend']
lastUpdated: 2026-11-06
isDraft: false
---

Referencia rápida de JavaScript moderno para navegador y Node.js. Usa `const` por defecto, `let` cuando necesites reasignar y olvídate de `var`.
Los métodos que no mutan (`toSorted`, `toReversed`, `with`) evitan efectos secundarios difíciles de depurar.

## Variables y tipos

| Código | Significado |
| --- | --- |
| `const` / `let` | Constante (la referencia no cambia) / variable reasignable, ambas con ámbito de bloque |
| `string`, `number`, `bigint`, `boolean` | Primitivos de texto, número de 64 bits, entero arbitrario (`10n`), lógico |
| `undefined` / `null` | Sin asignar / ausencia intencional de valor |
| `symbol` | Identificador único (`Symbol('id')`) |
| `typeof x` | Tipo en texto; ojo: `typeof null === 'object'` |
| `Array.isArray(x)` | Forma correcta de comprobar si es un array |
| `===` / `!==` | Comparación estricta; evita `==` |
| `Number.isNaN(x)` | Comprueba `NaN` sin conversiones implícitas |

## Destructuring, spread y rest

```js
const { name, role = 'user', ...rest } = user;   // default + rest
const { address: { city } = {} } = user;         // nested with fallback
const [first, , third] = items;                  // skip elements
[a, b] = [b, a];                                 // swap values

const merged = { ...defaults, ...options };      // shallow merge (last wins)
const all = [...listA, ...listB];
const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);
```

## Funciones

```js
function greet(name = 'mundo') {
  return `Hola, ${name}`;
}

const double = (n) => n * 2;                 // implicit return
const toUser = (name) => ({ name });         // return an object: wrap in ()

const counter = () => {
  let count = 0;
  return () => ++count;                      // closure keeps state
};
```

Las arrow functions no tienen `this` propio: lo toman del contexto. Úsalas en callbacks, no como métodos de objeto.

## Strings

| Código | Significado |
| --- | --- |
| `` `Total: ${price * qty}` `` | Template literal con interpolación y saltos de línea |
| `s.includes('x')` | Contiene el texto |
| `s.startsWith('a')` / `s.endsWith('z')` | Empieza / termina con |
| `s.trim()` | Quita espacios al inicio y al final |
| `s.padStart(5, '0')` | Rellena a la izquierda: `'42'` pasa a `'00042'` |
| `s.replaceAll('-', ' ')` | Reemplaza todas las coincidencias |
| `s.split(',')` | Divide en un array |
| `s.at(-1)` | Último carácter |
| `s.localeCompare(t, 'es')` | Compara respetando acentos y el idioma |

## Arrays

| Método | Qué hace |
| --- | --- |
| `map(fn)` | Nuevo array transformando cada elemento |
| `filter(fn)` | Nuevo array con los que cumplen la condición |
| `reduce(fn, init)` | Acumula en un solo valor (suma, objeto, etc.) |
| `find(fn)` / `findLast(fn)` | Primer / último elemento que cumple (o `undefined`) |
| `some(fn)` / `every(fn)` | Alguno / todos cumplen la condición |
| `includes(x)` | Contiene el valor (funciona con `NaN`) |
| `flat()` / `flatMap(fn)` | Aplana un nivel / transforma y aplana |
| `at(-1)` | Acceso con índice negativo (último elemento) |
| `toSorted(fn)` / `toReversed()` / `with(i, v)` | Copias ordenada / invertida / con un elemento cambiado, sin mutar |
| `structuredClone(obj)` | Copia profunda (global, no método de array) |

```js
const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
const byPrice = products.toSorted((a, b) => a.price - b.price);
```

## Objetos

| Código | Significado |
| --- | --- |
| `Object.keys(o)` / `Object.values(o)` | Array de claves / valores |
| `Object.entries(o)` | Array de pares `[clave, valor]` |
| `Object.fromEntries(pairs)` | Construye un objeto desde pares (inverso de `entries`) |
| `Object.groupBy(list, fn)` | Agrupa en un objeto según la clave que devuelva `fn` |
| `user?.address?.city` | Optional chaining: `undefined` si algo intermedio es nulo |
| `fn?.()` | Llama solo si la función existe |
| `value ?? 'default'` | Usa el default solo si es `null` o `undefined` (no con `0` ni `''`) |
| `opts.retries ??= 3` | Asigna solo si es `null` o `undefined` |
| `Object.hasOwn(o, 'key')` | La propiedad es propia (no heredada) |

```js
const byStatus = Object.groupBy(orders, (o) => o.status);
const prices = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Number(v)]));
```

## Clases y módulos ESM

```js
// user.js
export class User {
  #password;                                 // private field
  static count = 0;

  constructor(name, password) {
    this.name = name;
    this.#password = password;
    User.count++;
  }

  get initials() {
    return this.name.slice(0, 2).toUpperCase();
  }
}
export default function createUser(name) { return new User(name, ''); }

// main.js
import createUser, { User } from './user.js';
const { Chart } = await import('./chart.js');   // dynamic import (lazy load)
```

## Asincronía: promesas y async/await

| Código | Significado |
| --- | --- |
| `await promise` | Espera el resultado dentro de una función `async` (o en el nivel superior de un módulo) |
| `Promise.all([...])` | Espera todas; falla en cuanto una falla |
| `Promise.allSettled([...])` | Espera todas y devuelve `{ status, value \| reason }` de cada una |
| `Promise.any([...])` | La primera que se cumple; falla solo si fallan todas |
| `Promise.race([...])` | La primera que termine, se cumpla o falle |
| `AbortSignal.timeout(5000)` | Señal que cancela una petición tras 5 segundos |

```js
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

### Fetch con manejo de errores

```js
async function getJson(url, { timeoutMs = 5000, signal } = {}) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: signal ?? AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    // fetch only rejects on network errors, not on 4xx/5xx
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}

const controller = new AbortController();
try {
  const data = await getJson('/api/users', { signal: controller.signal });
  console.log(data);
} catch (err) {
  if (err.name === 'AbortError') console.warn('Request cancelled');
  else console.error(err);
}
// controller.abort(); cancels the request
```

## DOM y eventos

```js
const form = document.querySelector('#signup');
const items = document.querySelectorAll('.item');      // static NodeList

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  console.log(data);
});

// Event delegation: one listener for many (even future) children
document.querySelector('#list').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (button) removeItem(button.dataset.id);
});

el.classList.toggle('active');
el.textContent = userInput;                // safe: never use innerHTML with user data
```

## Map y Set

| Código | Significado |
| --- | --- |
| `new Map([[k, v]])` | Diccionario con claves de cualquier tipo y orden de inserción |
| `map.set(k, v)` / `map.get(k)` / `map.has(k)` | Escribir / leer / comprobar una clave |
| `map.size` | Número de entradas |
| `Map.groupBy(list, fn)` | Agrupa en un `Map` (admite claves no string) |
| `new Set(array)` | Colección de valores únicos |
| `[...new Set(array)]` | Quitar duplicados de un array |
| `a.union(b)` / `a.intersection(b)` / `a.difference(b)` | Operaciones de conjuntos (ES2025) |
| `new WeakMap()` | Claves objeto sin impedir su recolección de memoria |

## Fechas

```js
// Store and send dates in UTC (ISO 8601)
const createdAt = new Date().toISOString();       // "2026-11-06T15:32:00.000Z"

// Convert to local time only when displaying
const fmt = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  dateStyle: 'medium',
  timeStyle: 'short',
});
fmt.format(new Date(createdAt));

new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(1234.5);
```

Usa siempre nombres de zona (`America/Mexico_City`), nunca offsets fijos como `-06:00`.

## Manejo de errores

```js
class ValidationError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'ValidationError';
  }
}

try {
  JSON.parse(raw);
} catch (err) {
  throw new ValidationError('Invalid payload', { cause: err });  // keep the original error
} finally {
  cleanup();
}
```

- Lanza siempre objetos `Error` (no strings): conservan el stack trace.
- En promesas sin `await`, añade `.catch()`: los rechazos no capturados se pierden o tumban el proceso en Node.js.
