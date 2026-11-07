---
title: 'Tailwind CSS'
description: 'Tailwind CSS v4: instalación con Vite, configuración CSS-first con @theme, utilidades de layout, responsive, estados, modo oscuro y valores arbitrarios.'
category: 'Frontend'
icon: 'mdi:tailwind'
tags: ['tailwind', 'css', 'utility-first', 'frontend']
lastUpdated: 2026-11-06
isDraft: false
---

Tailwind v4 ya no usa `tailwind.config.js`: toda la configuración vive en tu CSS (`@theme`, `@custom-variant`, `@utility`, `@plugin`). Las clases se detectan solas en los archivos del proyecto.

## Instalación con Vite

| Acción | Comando |
| --- | --- |
| Crear un proyecto Vite | `pnpm create vite my-project` |
| Instalar Tailwind y su plugin de Vite | `pnpm add tailwindcss @tailwindcss/vite` |
| Instalar el plugin de tipografía (opcional) | `pnpm add -D @tailwindcss/typography` |
| Arrancar el servidor de desarrollo | `pnpm run dev` |

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

```css
/* src/style.css */
@import "tailwindcss";
```

## Detección de clases y plugins

Tailwind escanea todo el proyecto salvo lo que está en `.gitignore`, `node_modules`, archivos binarios, CSS y lockfiles.

| Directiva | Qué hace |
| --- | --- |
| `@source "../node_modules/@acme/ui";` | Añade una ruta que no se escanea por defecto |
| `@source not "../src/legacy";` | Excluye una carpeta del escaneo |
| `@source inline("underline");` | Genera siempre una clase (sustituye al antiguo `safelist`) |
| `@import "tailwindcss" source("../src");` | Cambia la carpeta base desde la que se escanea |
| `@import "tailwindcss" source(none);` | Desactiva la detección automática; solo cuenta lo declarado con `@source` |
| `@plugin "@tailwindcss/typography";` | Carga un plugin por nombre de paquete o ruta local |

## Layout

| Clase | Qué hace |
| --- | --- |
| `flex` / `inline-flex` | `display: flex` |
| `flex-col` / `flex-wrap` | Dirección en columna / permite envolver |
| `items-center` / `justify-between` | `align-items: center` / `justify-content: space-between` |
| `flex-1` / `shrink-0` | Crece para llenar el espacio / no se encoge |
| `grid grid-cols-3` | Grid de tres columnas iguales |
| `col-span-2` / `col-span-full` | Ocupa dos columnas / todo el ancho |
| `gap-4` / `gap-x-2` | Espacio entre elementos (1rem) / solo horizontal |
| `container mx-auto px-4` | Ancho máximo según breakpoint, centrado y con padding (no se centra solo) |
| `hidden` / `block` | Oculta (`display: none`) / muestra como bloque |
| `relative` / `absolute inset-0` | Posicionamiento; `inset-0` pega el elemento a los cuatro bordes |

## Espaciado y tamaños

Cada paso de la escala vale `0.25rem` (4px): `p-4` = 1rem, `m-8` = 2rem. Cualquier número entero funciona (`p-13`).

| Clase | Qué hace |
| --- | --- |
| `p-4` / `px-4` / `py-2` | Padding en todos los lados / horizontal / vertical |
| `pt-2` / `ps-4` | Padding superior / al inicio (respeta RTL) |
| `m-4` / `mx-auto` / `-mt-2` | Margen / centrado horizontal / margen negativo |
| `space-y-4` | Separación vertical entre hijos |
| `w-full` / `w-1/2` / `w-64` | Ancho 100% / 50% / 16rem |
| `h-screen` / `min-h-dvh` | Alto de la ventana / mínimo según el viewport dinámico |
| `size-10` | Ancho y alto iguales (2.5rem) en una sola clase |
| `max-w-md` / `max-w-7xl` | Ancho máximo de la escala de contenedores (28rem / 80rem) |
| `max-w-screen` / `max-w-full` | Máximo 100vw / 100% del padre |

## Tipografía

| Clase | Qué hace |
| --- | --- |
| `text-sm` / `text-base` / `text-2xl` | Tamaño de fuente (incluye un interlineado por defecto) |
| `text-lg/7` | Tamaño `lg` con `line-height` del paso 7 de la escala |
| `font-medium` / `font-bold` | Peso 500 / 700 |
| `font-sans` / `font-mono` | Familia tipográfica del tema |
| `leading-relaxed` / `tracking-tight` | Interlineado / espaciado entre letras |
| `text-center` / `text-balance` | Alineación / reparte el texto de títulos en líneas equilibradas |
| `uppercase` / `italic` / `underline` | Transformaciones y decoración |
| `truncate` | Una línea con `...` si no cabe |
| `line-clamp-3` | Corta el texto en 3 líneas con puntos suspensivos |

## Colores y opacidad

| Clase | Qué hace |
| --- | --- |
| `bg-sky-500` | Fondo con el tono 500 de la paleta `sky` (escala de 50 a 950) |
| `text-gray-700` / `text-white` | Color del texto |
| `border-red-300` | Color del borde |
| `bg-sky-500/50` | Mismo color al 50% de opacidad |
| `text-black/75` | Texto negro al 75% |
| `bg-transparent` / `bg-current` | Fondo transparente / usa el `color` actual |
| `fill-current` / `stroke-sky-500` | Colores para iconos SVG |
| `accent-pink-500` / `caret-sky-500` | Color de checkboxes y del cursor de texto |

## Bordes, esquinas y sombras

| Clase | Qué hace |
| --- | --- |
| `border` / `border-2` / `border-t` | Borde de 1px / 2px / solo superior |
| `rounded` / `rounded-lg` / `rounded-full` | Esquinas redondeadas / grandes / círculo o píldora |
| `rounded-t-xl` | Redondea solo las esquinas superiores |
| `shadow-sm` / `shadow-lg` | Sombra pequeña / grande |
| `ring-2 ring-sky-500` | Anillo (sombra sólida) de 2px, útil para el foco |
| `outline-none` / `outline-2` | Quita el outline / outline de 2px |
| `divide-y divide-gray-200` | Línea separadora entre hijos |
| `opacity-50` | Opacidad del elemento completo |

## Responsive

Mobile-first: una clase sin prefijo aplica a **todos** los tamaños; `md:` aplica desde ese ancho **hacia arriba**.

| Variante | Qué hace |
| --- | --- |
| `sm:` | Desde 40rem (640px) |
| `md:` | Desde 48rem (768px) |
| `lg:` | Desde 64rem (1024px) |
| `xl:` / `2xl:` | Desde 80rem (1280px) / 96rem (1536px) |
| `max-md:` | Solo por debajo de 48rem |
| `md:max-xl:flex` | Solo en el rango de `md` a `xl` |
| `@container` + `@md:flex-row` | Container query: reacciona al ancho del padre, no de la ventana |

```html
<div class="flex flex-col gap-4 md:flex-row">
  <aside class="md:w-64 md:shrink-0">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>
```

## Estados e interacción

| Variante | Qué hace |
| --- | --- |
| `hover:bg-sky-600` | Al pasar el ratón (solo en dispositivos que admiten hover) |
| `focus-visible:ring-2` | Foco por teclado, sin activarse al hacer clic con el ratón |
| `active:scale-95` | Mientras se pulsa |
| `disabled:opacity-50` | Cuando el elemento está deshabilitado |
| `group` + `group-hover:text-white` | Estiliza un hijo cuando se pasa el ratón por el padre marcado con `group` |
| `peer` + `peer-invalid:visible` | Estiliza un hermano posterior según el estado del `peer` |
| `has-checked:bg-indigo-50` | Aplica si algún descendiente está marcado (`:has()`) |
| `aria-expanded:rotate-180` | Aplica si `aria-expanded="true"` |
| `data-active:border-sky-500` | Aplica si existe el atributo `data-active` |
| `data-[size=large]:p-8` | Aplica según el valor de un atributo `data-*` |

## Modo oscuro

Por defecto `dark:` sigue la preferencia del sistema (`prefers-color-scheme`). Para controlarlo con una clase o un atributo en `<html>`, redefine la variante:

```css
@import "tailwindcss";

/* toggle with <html class="dark"> */
@custom-variant dark (&:where(.dark, .dark *));

/* or with <html data-theme="dark"> */
/* @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *)); */
```

```html
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Content
</div>
```

## Valores arbitrarios y variables

| Clase | Qué hace |
| --- | --- |
| `top-[117px]` | Cualquier valor que no esté en la escala |
| `bg-[#bada55]` | Color arbitrario |
| `grid-cols-[1fr_500px_2fr]` | Los guiones bajos se convierten en espacios |
| `fill-(--brand-color)` | Atajo de `fill-[var(--brand-color)]` |
| `text-(length:--my-size)` | Pista de tipo cuando la variable es ambigua |
| `[mask-type:luminance]` | Propiedad CSS arbitraria completa |
| `md:max-[72rem]:hidden` | Breakpoint puntual con valor arbitrario |

## Tema personalizado con @theme

Cada variable de `@theme` crea utilidades: `--color-brand-500` habilita `bg-brand-500`, `text-brand-500`, etc.

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --color-brand-500: oklch(0.62 0.19 255);
  --color-brand-700: oklch(0.48 0.17 258);
  --breakpoint-3xl: 120rem;
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}

@utility content-auto {
  content-visibility: auto;
}

.btn {
  @variant hover {
    background: var(--color-brand-700);
  }
}
```

## Transiciones y animaciones

| Clase | Qué hace |
| --- | --- |
| `transition` / `transition-colors` | Anima propiedades comunes / solo colores |
| `duration-300` / `ease-out` | Duración en ms / curva de aceleración |
| `delay-150` | Retraso antes de empezar |
| `hover:scale-105` / `hover:-translate-y-1` | Transformaciones (combínalas con `transition`) |
| `animate-spin` / `animate-pulse` | Rotación continua / parpadeo suave (skeletons) |
| `animate-ping` / `animate-bounce` | Onda expansiva / rebote |
| `motion-reduce:animate-none` | Respeta la preferencia de reducir movimiento |
| `starting:opacity-0` | Estado inicial al aparecer en el DOM (`@starting-style`) |
