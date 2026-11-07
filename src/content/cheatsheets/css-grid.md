---
title: 'CSS Grid'
description: 'Guía rápida de CSS Grid: tracks, fr, minmax, auto-fit, áreas, colocación, alineación, subgrid y patrones de layout responsivo.'
category: 'Frontend'
icon: 'mdi:view-grid-outline'
tags: ['css', 'grid', 'layout', 'responsive', 'frontend']
lastUpdated: 2026-11-06
isDraft: false
---

Grid organiza el contenido en **dos dimensiones** a la vez (filas y columnas). Defines la estructura en el contenedor y colocas los elementos por líneas, por nombre de área o dejas que se acomoden solos.

## Conceptos clave

| Concepto | Significado |
| --- | --- |
| Contenedor grid | Elemento con `display: grid`; sus hijos directos son elementos grid |
| Track (pista) | Una fila o una columna completa |
| Línea | Borde entre tracks; se numeran desde 1 (y desde -1 contando por el final) |
| Celda | Intersección de una fila y una columna |
| Área | Rectángulo de una o más celdas, opcionalmente con nombre |
| Grid explícito | Los tracks que defines con `grid-template-*` |
| Grid implícito | Tracks que el navegador crea solo cuando hay más elementos de los previstos |
| `fr` | Fracción del espacio libre restante del contenedor |

## Definir columnas y filas

| Propiedad o valor | Qué hace |
| --- | --- |
| `display: grid` | Activa Grid en el contenedor |
| `grid-template-columns: 200px 1fr` | Una columna fija de 200px y otra que ocupa el resto |
| `grid-template-columns: repeat(3, 1fr)` | Tres columnas iguales |
| `grid-template-rows: auto 1fr auto` | Cabecera y pie a su tamaño; el centro llena la altura |
| `minmax(12rem, 1fr)` | Track con un mínimo de 12rem y un máximo de una fracción |
| `minmax(0, 1fr)` | Columna flexible que puede encogerse por debajo del ancho de su contenido |
| `fit-content(20rem)` | Se ajusta al contenido, pero nunca supera 20rem |
| `[sidebar-start] 250px [sidebar-end]` | Da nombre a las líneas para colocar elementos por nombre |

## auto-fill vs auto-fit

Ambos crean tantas columnas como quepan en `repeat()`. La diferencia aparece cuando **sobran huecos**:

| Valor | Comportamiento |
| --- | --- |
| `repeat(auto-fill, minmax(12rem, 1fr))` | Conserva las columnas vacías; los elementos mantienen su ancho y queda hueco al final |
| `repeat(auto-fit, minmax(12rem, 1fr))` | Colapsa las columnas vacías; los elementos se estiran para llenar toda la fila |
| `repeat(auto-fill, 12rem)` | Columnas fijas de 12rem; el espacio sobrante queda libre |

Con muchos elementos (filas llenas) los dos se ven igual. Usa `auto-fit` si quieres que pocas tarjetas ocupen todo el ancho.

## Espaciado (gap)

| Propiedad | Qué hace |
| --- | --- |
| `gap: 1rem` | Mismo espacio entre filas y entre columnas |
| `gap: 2rem 1rem` | Primero `row-gap`, luego `column-gap` |
| `row-gap: 2rem` | Solo el espacio vertical entre filas |
| `column-gap: 1rem` | Solo el espacio horizontal entre columnas |

El `gap` solo existe **entre** tracks, nunca en los bordes exteriores del contenedor.

## Colocar elementos

| Propiedad | Qué hace |
| --- | --- |
| `grid-column: 1 / 3` | Va de la línea 1 a la 3 (ocupa dos columnas) |
| `grid-column: 1 / -1` | Ocupa todo el ancho, de la primera a la última línea |
| `grid-column: span 2` | Ocupa dos columnas desde donde le toque |
| `grid-column: 2 / span 3` | Empieza en la línea 2 y abarca tres columnas |
| `grid-row: 1 / 3` | Ocupa dos filas |
| `grid-area: 2 / 1 / 4 / 3` | Atajo: `row-start / column-start / row-end / column-end` |
| `grid-column: sidebar-start / sidebar-end` | Coloca el elemento usando líneas con nombre |
| `order: -1` | Cambia el orden de autocolocación (no el del teclado) |

## Áreas con nombre

```css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100dvh;
}

.page > header { grid-area: header; }
.page > aside { grid-area: sidebar; }
.page > main { grid-area: main; }
.page > footer { grid-area: footer; }

@media (width < 48rem) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main" "sidebar" "footer";
  }
}
```

Usa `.` para dejar una celda vacía. Cada área debe formar un rectángulo.

## Alineación

| Propiedad | Qué hace |
| --- | --- |
| `justify-items: center` | Alinea el contenido de **cada celda** en horizontal |
| `align-items: center` | Alinea el contenido de cada celda en vertical |
| `place-items: center` | Atajo de `align-items` + `justify-items` |
| `justify-content: center` | Mueve **toda la grilla** en horizontal si sobra espacio en el contenedor |
| `align-content: center` | Mueve toda la grilla en vertical |
| `place-content: center` | Atajo de `align-content` + `justify-content` |
| `justify-self: end` | Alinea un solo elemento en horizontal dentro de su celda |
| `align-self: start` / `place-self: center` | Alinea un solo elemento en vertical, o en ambos ejes |

Regla rápida: `*-items` y `*-self` mueven elementos dentro de sus celdas; `*-content` mueve la grilla completa.

## Grid implícito

| Propiedad | Qué hace |
| --- | --- |
| `grid-auto-rows: 10rem` | Alto de las filas que se crean automáticamente |
| `grid-auto-rows: minmax(8rem, auto)` | Filas automáticas de al menos 8rem que crecen con el contenido |
| `grid-auto-columns: 1fr` | Ancho de las columnas implícitas |
| `grid-auto-flow: row` | Rellena fila a fila (por defecto) |
| `grid-auto-flow: column` | Rellena columna a columna |
| `grid-auto-flow: dense` | Rellena huecos con elementos posteriores más pequeños (altera el orden visual) |

## Subgrid

`subgrid` hace que un elemento hijo reutilice los tracks de su padre. Así, el título, el texto y el botón de tarjetas distintas quedan alineados entre sí.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.card {
  display: grid;
  grid-row: span 3; /* title, body, footer */
  grid-template-rows: subgrid;
}
```

## Patrones comunes

### Grilla responsiva sin media queries

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}
```

`min(100%, 16rem)` evita el desbordamiento horizontal en pantallas más estrechas que 16rem.

### Centrado en una línea

```css
.center {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}
```

### Holy grail (cabecera, tres columnas y pie)

```css
.holy-grail {
  display: grid;
  grid-template: auto 1fr auto / 200px minmax(0, 1fr) 200px;
  min-height: 100dvh;
}

.holy-grail > header,
.holy-grail > footer {
  grid-column: 1 / -1;
}
```

## Grid o Flexbox

| Situación | Elige |
| --- | --- |
| Layout de página (cabecera, sidebar, contenido, pie) | Grid |
| Filas y columnas que deben alinearse entre sí | Grid |
| Galería o tarjetas del mismo ancho en filas | Grid con `auto-fit` |
| Fila de botones, barra de navegación, iconos con texto | Flexbox |
| Elementos de ancho variable según su contenido | Flexbox |
| Distribuir en un solo eje con `space-between` | Flexbox |

Se combinan sin problema: Grid para la estructura general y Flexbox dentro de cada celda. Consulta también la hoja de CSS Flexbox.
