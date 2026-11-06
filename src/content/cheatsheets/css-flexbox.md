---
title: 'CSS Flexbox'
description: 'Guía rápida de Flexbox: ejes, alineación, distribución del espacio y patrones comunes de diseño.'
category: 'Frontend'
icon: 'mdi:language-css3'
tags: ['css', 'flexbox', 'layout', 'frontend']
lastUpdated: 2026-08-20
isDraft: false
---

Propiedades de Flexbox para construir diseños flexibles.

## Contenedor

```css
.container {
  display: flex;
  flex-direction: row; /* row | column */
  flex-wrap: wrap; /* allow items to wrap */
  gap: 1rem; /* spacing between items */
}
```

## Alineación

```css
.container {
  justify-content: space-between; /* main axis */
  align-items: center; /* cross axis */
}
```

## Elementos

```css
.item {
  flex: 1 1 0; /* grow shrink basis */
  align-self: flex-start; /* override align-items per item */
}
```

## Centrado perfecto

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```
