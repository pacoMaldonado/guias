---
title: 'CSS Flexbox'
description: 'Guía rápida de Flexbox: ejes, propiedades del contenedor y de los elementos, valores de flex, patrones comunes y errores típicos.'
category: 'Frontend'
icon: 'mdi:language-css3'
tags: ['css', 'flexbox', 'layout', 'frontend']
lastUpdated: 2026-11-06
isDraft: false
---

Flexbox reparte el espacio en **una dimensión** (fila o columna). Piensa siempre en dos ejes: `justify-*` trabaja sobre el eje principal y `align-*` sobre el eje cruzado.

## Conceptos clave

| Concepto | Significado |
| --- | --- |
| Contenedor flex | Elemento con `display: flex`; sus hijos directos pasan a ser elementos flex |
| Elemento flex | Cada hijo directo del contenedor (los nietos no se ven afectados) |
| Eje principal | Dirección en la que se colocan los elementos; la define `flex-direction` |
| Eje cruzado | Perpendicular al principal (vertical si la dirección es `row`) |
| Inicio y fin (`start` / `end`) | Extremos de cada eje; dependen de la dirección y del idioma (LTR/RTL) |
| Espacio libre | Lo que sobra o falta en el eje principal; lo reparten `flex-grow` y `flex-shrink` |
| Línea flex | Cada fila (o columna) de elementos cuando hay `flex-wrap: wrap` |

## Contenedor: dirección y envoltura

| Propiedad | Qué hace |
| --- | --- |
| `display: flex` | Convierte el elemento en contenedor flex de tipo bloque |
| `display: inline-flex` | Igual, pero el contenedor se comporta como elemento en línea |
| `flex-direction: row` | Eje principal horizontal (valor por defecto) |
| `flex-direction: column` | Eje principal vertical; los elementos se apilan |
| `row-reverse` / `column-reverse` | Invierte el orden visual (no el orden de lectura ni el foco) |
| `flex-wrap: nowrap` | Todo en una sola línea; los elementos se encogen (por defecto) |
| `flex-wrap: wrap` | Los elementos pasan a la siguiente línea cuando no caben |
| `flex-flow: row wrap` | Atajo de `flex-direction` + `flex-wrap` |
| `gap: 1rem` | Espacio entre elementos; acepta `row-gap` y `column-gap` por separado |

## Contenedor: alineación

| Propiedad | Qué hace |
| --- | --- |
| `justify-content: flex-start` | Agrupa los elementos al inicio del eje principal (por defecto) |
| `justify-content: center` | Los centra en el eje principal |
| `justify-content: flex-end` | Los empuja al final del eje principal |
| `justify-content: space-between` | Primero y último en los extremos; el resto del espacio, repartido entre ellos |
| `justify-content: space-around` | Mismo espacio a cada lado de cada elemento (los bordes quedan con la mitad) |
| `justify-content: space-evenly` | Espacios idénticos entre elementos y en los bordes |
| `align-items: stretch` | Estira los elementos a lo alto de la línea (por defecto) |
| `align-items: center` / `flex-start` / `flex-end` | Centra o pega los elementos en el eje cruzado |
| `align-items: baseline` | Alinea por la línea base del texto (útil con tamaños de fuente distintos) |
| `align-content: space-between` | Reparte las **líneas** en el eje cruzado; solo actúa con `flex-wrap: wrap` |

## Propiedades de los elementos

| Propiedad | Qué hace |
| --- | --- |
| `flex-grow: 1` | Cuánto crece el elemento para ocupar el espacio libre (0 = no crece) |
| `flex-shrink: 1` | Cuánto se encoge cuando falta espacio (0 = nunca se encoge) |
| `flex-basis: 200px` | Tamaño inicial en el eje principal antes de repartir espacio (`auto` usa `width`/`height`) |
| `flex: 1 1 200px` | Atajo de `grow`, `shrink` y `basis`, en ese orden |
| `order: -1` | Cambia el orden visual (por defecto 0); no cambia el orden del teclado ni del lector de pantalla |
| `align-self: flex-end` | Sobrescribe `align-items` solo para este elemento |
| `margin-left: auto` | Absorbe todo el espacio libre a su izquierda y empuja el elemento al final |

## Valores abreviados de flex

| Valor | Significado |
| --- | --- |
| `flex: initial` | `0 1 auto`: no crece, sí se encoge, parte de su tamaño (comportamiento por defecto) |
| `flex: 1` | `1 1 0%`: crece y se encoge; todos los `flex: 1` quedan del **mismo ancho** |
| `flex: auto` | `1 1 auto`: crece y se encoge, pero parte de su contenido; los más largos quedan más anchos |
| `flex: none` | `0 0 auto`: tamaño fijo según su contenido; ni crece ni se encoge |
| `flex: 0 0 200px` | Exactamente 200px: ideal para una barra lateral o una columna fija |
| `flex: 2` | Crece el doble que un hermano con `flex: 1` |

## Patrones: centrado y navegación

### Centrado perfecto

```css
.center {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center; /* vertical */
  min-height: 100dvh;
}
```

### Barra con logo a la izquierda y menú a la derecha

```css
.navbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar .menu {
  margin-left: auto; /* pushes the menu to the right edge */
}
```

## Patrones: página y tarjetas

### Footer pegado abajo

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  margin: 0;
}

main {
  flex: 1; /* takes all remaining height */
}
```

### Tarjetas que se reparten y envuelven

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 16rem; /* grow, shrink, never below ~16rem per row */
}
```

## Patrón: sidebar + contenido

```css
.layout {
  display: flex;
  gap: 2rem;
}

.sidebar {
  flex: 0 0 250px; /* fixed width */
}

.content {
  flex: 1;
  min-width: 0; /* lets long content shrink instead of overflowing */
}

@media (width < 48rem) {
  .layout {
    flex-direction: column;
  }
}
```

## Errores frecuentes

| Problema | Solución |
| --- | --- |
| El texto no hace `ellipsis` y desborda | Los elementos flex tienen `min-width: auto`; añade `min-width: 0` al elemento flex |
| Las imágenes se deforman o se estiran | Usa `align-self: flex-start` o `flex-shrink: 0`, y `object-fit: cover` si fijas alto y ancho |
| `align-content` no hace nada | Solo funciona con varias líneas: necesita `flex-wrap: wrap` |
| `justify-content` no centra en vertical | En `row` el eje principal es horizontal; para vertical usa `align-items` |
| `flex: 1` no reparte igual | Comprueba `min-width: 0` y que ningún hijo tenga `width` fijo grande |
| `order` rompe la navegación con `Tab` | El foco sigue el orden del HTML; reordena el marcado en lugar de usar `order` |

### Texto truncado con puntos suspensivos

```css
.item {
  flex: 1;
  min-width: 0;
}

.item .title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
