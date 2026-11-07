---
title: 'HTML'
description: 'HTML moderno: esqueleto, metaetiquetas, estructura semántica, imágenes, formularios, tablas accesibles, elementos nativos y accesibilidad.'
category: 'Frontend'
icon: 'mdi:language-html5'
tags: ['html', 'semantica', 'accesibilidad', 'formularios', 'seo']
lastUpdated: 2026-11-06
isDraft: false
---

Elige primero el elemento con el significado correcto y después aplica estilos: el HTML semántico mejora la accesibilidad, el SEO y el mantenimiento.
Antes de recurrir a `aria-*` o a JavaScript, revisa si existe un elemento nativo que ya lo resuelva (`button`, `details`, `dialog`).

## Esqueleto de documento

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mi página</title>
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/main.js"></script>
  </head>
  <body>
    <main>
      <h1>Hola mundo</h1>
    </main>
  </body>
</html>
```

- `lang` en `html` ayuda a lectores de pantalla y traductores.
- Los scripts `type="module"` se ejecutan diferidos: no bloquean el renderizado.

## Metaetiquetas esenciales

```html
<meta name="description" content="Resumen de la página en ~155 caracteres." />
<meta name="theme-color" content="#0f172a" />
<link rel="canonical" href="https://example.com/guia" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />

<!-- Open Graph (previews in social networks and chats) -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Título para compartir" />
<meta property="og:description" content="Descripción breve." />
<meta property="og:image" content="https://example.com/og.png" />
<meta property="og:url" content="https://example.com/guia" />
```

Usa URL absolutas en `og:image` y `og:url`. Un tamaño habitual para la imagen es 1200 x 630 px.

## Estructura semántica

| Elemento | Uso |
| --- | --- |
| `header` | Cabecera de la página o de una sección: logo, título, navegación |
| `nav` | Bloque de enlaces de navegación principal o secundaria |
| `main` | Contenido principal; solo uno visible por página |
| `article` | Contenido independiente y reutilizable: post, tarjeta de producto, comentario |
| `section` | Agrupación temática con su propio encabezado |
| `aside` | Contenido relacionado pero secundario: barra lateral, notas |
| `footer` | Pie de la página o de una sección: autoría, enlaces legales |
| `figure` + `figcaption` | Imagen, diagrama o código con su leyenda |
| `div` / `span` | Contenedores sin significado; úsalos solo para estilos |

## Texto e inline

| Elemento | Uso |
| --- | --- |
| `h1` ... `h6` | Encabezados jerárquicos; no saltes niveles |
| `p` | Párrafo |
| `strong` / `em` | Importancia / énfasis (no solo negrita o cursiva) |
| `code` / `pre` / `kbd` | Código en línea / bloque preformateado / tecla del usuario |
| `abbr title="..."` | Abreviatura con su forma completa |
| `time datetime="2026-11-06T15:00:00Z"` | Fecha legible por máquinas (en UTC) |
| `mark` | Texto resaltado por relevancia (p. ej. resultados de búsqueda) |
| `ul` / `ol` / `dl` | Lista sin orden / ordenada / de definiciones (`dt` + `dd`) |
| `blockquote cite="..."` | Cita en bloque con su fuente |

## Enlaces e imágenes

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Sitio externo</a>
<a href="mailto:hola@example.com">Escríbenos</a>
<a href="/docs/guia.pdf" download>Descargar PDF</a>

<img src="foto-800.jpg" alt="Equipo revisando un tablero" width="800" height="600"
     loading="lazy" decoding="async"
     srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw" />

<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Vista del producto" width="1200" height="600" />
</picture>
```

- Indica `width` y `height` para evitar saltos de diseño (CLS).
- No uses `loading="lazy"` en la imagen principal visible al cargar; para ella usa `fetchpriority="high"`.

## Formularios: tipos de input

| Tipo | Uso |
| --- | --- |
| `type="email"` | Correo; valida formato y muestra teclado con `@` en móvil |
| `type="tel"` | Teléfono; teclado numérico, sin validación de formato |
| `type="url"` | URL completa con esquema |
| `type="number"` | Número con `min`, `max` y `step` |
| `type="password"` | Contraseña oculta |
| `type="date"` / `type="time"` / `type="datetime-local"` | Selectores de fecha y hora nativos |
| `type="search"` | Campo de búsqueda con botón de limpiar |
| `type="checkbox"` / `type="radio"` | Opciones múltiples / una opción por `name` |
| `type="file"` | Subida de archivos; limita con `accept=".pdf,image/*"` |
| `type="range"` / `type="color"` | Deslizador / selector de color |

## Formularios: validación y etiquetas

| Atributo | Qué hace |
| --- | --- |
| `required` | Campo obligatorio |
| `pattern="[A-Z]{3}-\d{4}"` | Expresión regular que debe cumplir todo el valor |
| `min` / `max` / `step` | Límites de números y fechas |
| `minlength` / `maxlength` | Longitud de texto permitida |
| `autocomplete="email"` | Pista para autocompletar (`name`, `tel`, `new-password`, `one-time-code`...) |
| `inputmode="numeric"` | Teclado virtual a mostrar sin cambiar el tipo |
| `novalidate` (en `form`) | Desactiva la validación nativa para hacerla con JavaScript |

```html
<form action="/signup" method="post">
  <fieldset>
    <legend>Datos de contacto</legend>
    <label for="email">Correo</label>
    <input id="email" name="email" type="email" autocomplete="email" required />
    <label>
      <input type="checkbox" name="terms" required /> Acepto los términos
    </label>
  </fieldset>
  <button type="submit">Registrarme</button>
</form>
```

Todo campo necesita un `label` asociado (con `for` o envolviéndolo). El `placeholder` no sustituye a la etiqueta.

## Tablas accesibles

```html
<table>
  <caption>Ventas por trimestre (MXN)</caption>
  <thead>
    <tr>
      <th scope="col">Trimestre</th>
      <th scope="col">Ventas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>120,000</td>
    </tr>
  </tbody>
</table>
```

- `caption` da título a la tabla; `scope` indica si un `th` encabeza una columna o una fila.
- Usa tablas solo para datos tabulares, nunca para maquetar.

## Elementos interactivos nativos

```html
<details>
  <summary>¿Cómo cambio mi contraseña?</summary>
  <p>Ve a Ajustes y luego a Seguridad.</p>
</details>

<dialog id="confirm">
  <form method="dialog">
    <p>¿Eliminar el archivo?</p>
    <button value="cancel">Cancelar</button>
    <button value="ok">Eliminar</button>
  </form>
</dialog>
<button onclick="document.getElementById('confirm').showModal()">Eliminar</button>

<button popovertarget="menu">Opciones</button>
<div id="menu" popover>Contenido flotante que se cierra con Esc o clic fuera</div>
```

- `showModal()` abre el `dialog` como modal (con fondo y foco atrapado); `show()` lo abre sin bloquear.
- `details` con el mismo atributo `name` forma un acordeón exclusivo.

## Accesibilidad

| Técnica | Qué hace |
| --- | --- |
| `alt="..."` | Texto alternativo; usa `alt=""` en imágenes decorativas |
| `aria-label="Cerrar"` | Nombre accesible para controles sin texto visible (iconos) |
| `aria-labelledby="id"` / `aria-describedby="id"` | Toma el nombre o la descripción de otro elemento |
| `aria-live="polite"` | Anuncia cambios dinámicos (mensajes, contadores) sin mover el foco |
| `aria-expanded="true"` | Indica si un menú o panel controlado está abierto |
| `aria-current="page"` | Marca el enlace de la página actual en la navegación |
| `role="alert"` / `role="status"` | Región que se anuncia de inmediato / de forma discreta |
| Un `h1` y niveles en orden | Los lectores de pantalla navegan por encabezados |
| `button` para acciones, `a` para navegar | Teclado y semántica correctos sin código extra |

## Atributos globales útiles

| Atributo | Qué hace |
| --- | --- |
| `data-*` | Datos propios; en JS se leen con `el.dataset.userId` (de `data-user-id`) |
| `hidden` | Oculta el elemento (y lo saca del árbol de accesibilidad) |
| `inert` | Desactiva foco, clics y lectura del elemento y sus hijos |
| `tabindex="0"` | Hace enfocable un elemento en el orden natural |
| `tabindex="-1"` | Enfocable solo desde JS (`el.focus()`), no con `Tab` |
| `id` | Identificador único: anclas (`#seccion`), `label for`, ARIA |
| `title` | Tooltip nativo; no lo uses como única etiqueta accesible |
| `contenteditable` | Permite editar el contenido del elemento |
| `translate="no"` | Evita que los traductores automáticos cambien el texto |

Evita `tabindex` positivo (`1`, `2`...): rompe el orden natural de navegación.
