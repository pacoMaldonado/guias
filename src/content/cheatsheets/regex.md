---
title: 'Expresiones regulares'
description: 'Regex de un vistazo: clases, anclas, cuantificadores, grupos, lookaround, flags, patrones comunes y uso en JavaScript, grep, sed y rg.'
category: 'Tools'
icon: 'mdi:regex'
tags: ['regex', 'javascript', 'grep', 'texto']
lastUpdated: 2026-11-06
isDraft: false
---

Una expresión regular describe un patrón de texto para buscar, validar o reemplazar. La sintaxis de esta hoja es la de JavaScript; la mayoría funciona igual en Python, VS Code, `rg` y `grep -P`.
Prueba tus patrones con texto real antes de usarlos en producción: un regex que "casi" funciona es una fuente clásica de bugs.

## Caracteres y clases

| Patrón | Significado |
| --- | --- |
| `.` | Cualquier carácter excepto salto de línea (con flag `s`, también el salto) |
| `\d` / `\D` | Un dígito `[0-9]` / cualquier cosa que no sea dígito |
| `\w` / `\W` | Carácter de palabra `[A-Za-z0-9_]` / lo contrario |
| `\s` / `\S` | Espacio en blanco (espacio, tab, salto) / lo contrario |
| `[abc]` | Uno de los caracteres listados |
| `[^abc]` | Cualquier carácter excepto los listados |
| `[a-z0-9]` | Rangos: minúscula o dígito |
| `[áéíóúñ]` | Caracteres acentuados: `\w` no los incluye |
| `\p{L}` | Cualquier letra de cualquier idioma (requiere flag `u` o `v`) |

## Anclas y límites

| Patrón | Significado |
| --- | --- |
| `^` | Inicio del texto (o de cada línea con flag `m`) |
| `$` | Final del texto (o de cada línea con flag `m`) |
| `\b` | Límite de palabra: `\bcat\b` encuentra "cat" pero no "concat" |
| `\B` | Posición que no es límite de palabra |
| `^\d+$` | Todo el texto son dígitos (patrón típico de validación) |

## Cuantificadores

| Patrón | Significado |
| --- | --- |
| `*` | 0 o más veces |
| `+` | 1 o más veces |
| `?` | 0 o 1 vez (opcional): `colou?r` |
| `{3}` | Exactamente 3 veces |
| `{2,}` | 2 o más veces |
| `{2,5}` | Entre 2 y 5 veces |
| `*?`, `+?`, `??` | Versión perezosa: toma lo mínimo posible |

Por defecto los cuantificadores son codiciosos (toman lo máximo). Sobre `<b>uno</b><b>dos</b>`, `<b>.*</b>` coge todo el texto, mientras que `<b>.*?</b>` se detiene en el primer cierre.

## Grupos y alternancia

| Patrón | Significado |
| --- | --- |
| `(abc)` | Grupo de captura: guarda lo encontrado como `$1`, `$2`... |
| `(?:abc)` | Grupo sin captura: agrupa sin guardar (más rápido y claro) |
| `(?<year>\d{4})` | Grupo con nombre: se lee como `groups.year` |
| `\1` | Referencia a lo que capturó el grupo 1: `(\w)\1` encuentra letras dobles |
| `\k<year>` | Referencia a un grupo con nombre |
| `cat\|dog` | Alternancia: "cat" o "dog" |
| `gr(a\|e)y` | Alternancia limitada a un grupo: "gray" o "grey" |

## Lookahead y lookbehind

Comprueban lo que hay delante o detrás sin incluirlo en el resultado.

| Patrón | Significado |
| --- | --- |
| `x(?=y)` | `x` solo si va seguida de `y` (lookahead positivo) |
| `x(?!y)` | `x` solo si NO va seguida de `y` (lookahead negativo) |
| `(?<=y)x` | `x` solo si va precedida de `y` (lookbehind positivo) |
| `(?<!y)x` | `x` solo si NO va precedida de `y` (lookbehind negativo) |
| `\d+(?=€)` | El número de "25€" sin el símbolo |
| `(?<=\$)\d+` | El número de "$25" sin el símbolo |

## Flags

| Flag | Efecto |
| --- | --- |
| `g` | Global: todas las coincidencias, no solo la primera |
| `i` | Ignora mayúsculas y minúsculas |
| `m` | Multilínea: `^` y `$` funcionan por línea |
| `s` | dotAll: `.` también coincide con saltos de línea |
| `u` | Unicode: emojis y `\p{...}` funcionan bien |
| `v` | Unicode mejorado (ES2024): añade operaciones de conjuntos como `[\p{L}--[a-z]]` |
| `y` | Sticky: solo busca desde `lastIndex` |
| `d` | Guarda los índices de inicio y fin de cada grupo |

No combines `u` y `v` en el mismo regex. En JavaScript se escriben tras la barra: `/hola/gi`.

## Escapes

| Patrón | Significado |
| --- | --- |
| `\.` `\*` `\+` `\?` | Carácter literal en lugar de su significado especial |
| `\(` `\)` `\[` `\]` `\{` `\}` | Paréntesis, corchetes y llaves literales |
| `\\` | Barra invertida literal |
| `\/` | Barra literal dentro de un regex `/.../` de JavaScript |
| `\t` `\n` `\r` | Tabulador, salto de línea, retorno de carro |
| `ñ` / `\u{1F600}` | Carácter por código Unicode (el segundo requiere `u`) |

Caracteres que hay que escapar fuera de una clase: `. * + ? ^ $ { } ( ) [ ] \ |` y `/` en literales de JavaScript.

## Patrones comunes

Son aproximaciones prácticas, no validaciones completas: para emails y URL de verdad usa la validación del framework o `new URL()`.

| Caso | Patrón |
| --- | --- |
| Email simple | `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| URL http(s) | `^https?:\/\/[\w.-]+(?::\d+)?(?:\/\S*)?$` |
| Fecha ISO (`2026-11-06`) | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` |
| UUID | `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` (con `i`) |
| IPv4 | `^((25[0-5]\|2[0-4]\d\|1?\d?\d)\.){3}(25[0-5]\|2[0-4]\d\|1?\d?\d)$` |
| Slug (`mi-articulo-2`) | `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| Contraseña: 12+ caracteres, mayúscula, minúscula, dígito y símbolo | `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$` |
| Espacios duplicados | `\s{2,}` |

La fecha ISO acepta días imposibles como `2026-02-31`: valida el valor con una librería de fechas.

## Uso en JavaScript

```js
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

re.test('2026-11-06');                          // true
'2026-11-06'.match(re).groups.year;             // '2026'
'2026-11-06'.replace(re, '$<day>/$<month>/$<year>'); // '06/11/2026'

const text = 'a1 b22 c333';
[...text.matchAll(/\d+/g)].map((m) => m[0]);    // ['1', '22', '333']
text.replace(/\d+/g, (n) => `[${n}]`);          // 'a[1] b[22] c[333]'
'a, b;c'.split(/[,;]\s*/);                      // ['a', 'b', 'c']

const safe = new RegExp(`^${RegExp.escape(userInput)}$`, 'i'); // escape user input
```

`matchAll` y `replaceAll` exigen el flag `g`. Un regex con `g` guarda estado en `lastIndex`: no reutilices el mismo objeto con `test()` en un bucle. `RegExp.escape` está disponible desde ES2025 (Node 24).

## En la terminal

| Acción | Comando |
| --- | --- |
| Buscar con regex extendido (ERE) | `grep -E 'error\|warn' app.log` |
| Buscar recursivo, con número de línea | `grep -rnE 'TODO\|FIXME' src/` |
| Usar `\d` y lookaround (PCRE, GNU grep) | `grep -P '(?<=id=)\d+' app.log` |
| Mostrar solo la parte que coincide | `grep -oE '[0-9]{3}-[0-9]{4}' contacts.txt` |
| Reemplazar con grupos (GNU sed) | `sed -E 's/([a-z]+)@example\.com/\1@acme.com/g' users.txt` |
| Reemplazar en el archivo (crea copia `.bak`) | `sed -E -i.bak 's/v[0-9]+\.[0-9]+/v2.0/' VERSION` |
| Buscar en el proyecto con ripgrep | `rg 'useState\(' -t ts` |
| Ripgrep con lookaround | `rg -P '(?<!test_)fetch\(' src/` |

En `grep -E` y `sed -E` no existe `\d`: usa `[0-9]`. En `sed` las referencias van como `\1`; en JavaScript, como `$1`.
