---
title: 'Markdown'
description: 'Sintaxis de Markdown y GitHub Flavored Markdown: texto, listas, enlaces, código, tablas, notas al pie, alerts, details y frontmatter.'
category: 'Tools'
icon: 'mdi:language-markdown'
tags: ['markdown', 'gfm', 'documentacion', 'readme']
lastUpdated: 2026-11-06
isDraft: false
---

Markdown es texto plano que se convierte en HTML: lo que escribes a la izquierda de cada tabla produce el resultado de la derecha.
Las extensiones marcadas como GFM (GitHub Flavored Markdown) funcionan en GitHub y GitLab, pero no en todos los visores.

## Encabezados y párrafos

| Sintaxis | Resultado |
| --- | --- |
| `# Título` | Encabezado de nivel 1 (uno por documento) |
| `## Sección` | Encabezado de nivel 2 |
| `###### Nivel 6` | El nivel más bajo; se admiten de `#` a `######` |
| Una línea en blanco | Separa dos párrafos |
| Dos espacios al final de la línea | Salto de línea dentro del mismo párrafo |
| `\` al final de la línea | Salto de línea explícito (más visible que los espacios) |
| `<br>` | Salto de línea con HTML |

Deja siempre un espacio después de `#` y una línea en blanco antes y después de cada encabezado.

## Énfasis y texto en línea

| Sintaxis | Resultado |
| --- | --- |
| `*cursiva*` o `_cursiva_` | Texto en cursiva |
| `**negrita**` o `__negrita__` | Texto en negrita |
| `***negrita y cursiva***` | Ambos estilos a la vez |
| `~~tachado~~` | Texto tachado (GFM) |
| `` `código` `` | Código en línea con fuente monoespaciada |
| ``` `` usa `backticks` `` ``` | Código en línea que contiene backticks: rodéalo con dos |
| `<kbd>Ctrl</kbd> + <kbd>C</kbd>` | Teclas con estilo de tecla (HTML) |
| `H<sub>2</sub>O` / `x<sup>2</sup>` | Subíndice y superíndice (HTML) |

## Listas

```md
- Item con viñeta
- Otro item
  - Item anidado (2 espacios o alineado con el texto del padre)
    - Tercer nivel

1. Primer paso
2. Segundo paso
   1. Subpaso numerado (3 espacios)
1. La numeración real no importa: se renumera sola

- [x] Tarea completada
- [ ] Tarea pendiente
```

| Sintaxis | Resultado |
| --- | --- |
| `-`, `*` o `+` | Viñeta (no mezcles marcadores en la misma lista) |
| `1.` o `1)` | Item numerado |
| `5.` como primer item | La lista empieza en 5 |
| `- [ ]` / `- [x]` | Casilla de tarea vacía / marcada (GFM) |

## Enlaces e imágenes

| Sintaxis | Resultado |
| --- | --- |
| `[texto](https://example.com)` | Enlace en línea |
| `[texto](https://example.com "Título")` | Enlace con tooltip |
| `[texto](./docs/01-overview.md)` | Enlace relativo a otro archivo del repo |
| `[texto](#mi-seccion)` | Ancla a un encabezado del mismo documento |
| `[texto](./guia.md#instalacion)` | Ancla a una sección de otro documento |
| `[texto][ref]` | Enlace por referencia |
| `[ref]: https://example.com` | Definición de la referencia (en cualquier parte) |
| `<https://example.com>` | Autolink: la URL tal cual, clicable |

El ancla de un encabezado se genera en minúsculas, con espacios cambiados por `-` y sin la mayoría de signos: `## Mi Sección` da `#mi-sección` en GitHub.

### Imágenes

| Sintaxis | Resultado |
| --- | --- |
| `![Texto alternativo](./img/logo.png)` | Imagen; el texto alternativo es obligatorio para accesibilidad |
| `![Alt](./img/logo.png "Título")` | Imagen con tooltip |
| `[![Alt](./badge.svg)](https://example.com)` | Imagen que funciona como enlace (badges) |
| `<img src="./img/logo.png" width="200" alt="Logo">` | Imagen con tamaño controlado (HTML) |

## Código

Usa siempre un bloque con lenguaje para activar el resaltado de sintaxis. Si el bloque debe contener backticks, rodéalo con cuatro.

````md
```ts
const total: number = items.length;
```

```bash
pnpm install
```

```diff
- const port = 3000;
+ const port = 8080;
```
````

| Sintaxis | Resultado |
| --- | --- |
| ```` ```ts ```` | Abre un bloque con resaltado de TypeScript |
| ```` ```diff ```` | Colorea líneas que empiezan con `+` y `-` |
| ```` ```text ```` | Bloque sin resaltado |
| `~~~` | Alternativa a los backticks para abrir y cerrar |
| 4 espacios de sangría | Bloque de código sin lenguaje (evítalo) |

## Citas y separadores

```md
> Una cita puede tener varios párrafos.
>
> > Y citas anidadas.

---
```

| Sintaxis | Resultado |
| --- | --- |
| `> texto` | Cita en bloque |
| `> > texto` | Cita anidada |
| `---`, `***` o `___` | Línea horizontal (deja una línea en blanco antes) |

Ojo: `---` justo debajo de una línea de texto la convierte en encabezado de nivel 2 (sintaxis Setext).

## Tablas

```md
| Columna    | Izquierda | Centro | Derecha |
| ---------- | :-------- | :----: | ------: |
| Fila 1     | a         | b      |      10 |
| Con barra  | `a \| b`  | c      |      20 |
```

| Sintaxis | Resultado |
| --- | --- |
| `\| --- \|` | Fila separadora obligatoria bajo el encabezado |
| `:---` | Alinea la columna a la izquierda |
| `:---:` | Centra la columna |
| `---:` | Alinea a la derecha (útil para números) |

Para escribir una barra vertical dentro de una celda, escápala con una barra invertida: `a \| b`. Las columnas no necesitan estar alineadas en el texto, pero ayuda a leer el archivo. Una celda no admite listas ni bloques; usa `<br>` para saltos.

## Notas al pie y escapes

```md
Markdown fue creado en 2004.[^1] Puedes usar nombres.[^fuente]

[^1]: John Gruber y Aaron Swartz.
[^fuente]: Las notas se muestran al final del documento.
```

| Sintaxis | Resultado |
| --- | --- |
| `\*` | Asterisco literal, no cursiva |
| `\#` | Almohadilla literal al inicio de línea |
| `\_`, `` \` ``, `\[`, `\]` | Guion bajo, backtick y corchetes literales |
| `1986\. Un gran año` | Evita que una línea se convierta en lista numerada |
| `&lt;div&gt;` | Muestra `<div>` como texto (entidades HTML) |
| `&nbsp;` | Espacio que no se rompe |

## Alerts de GitHub

```md
> [!NOTE]
> Información útil que conviene leer aunque se lea en diagonal.

> [!TIP]
> Un consejo para hacer algo mejor o más fácil.

> [!IMPORTANT]
> Información clave para lograr el objetivo.

> [!WARNING]
> Requiere atención inmediata para evitar problemas.

> [!CAUTION]
> Advierte de riesgos o consecuencias negativas.
```

Son cinco tipos fijos y no se pueden anidar. GitHub los muestra con color e icono; otros visores los muestran como una cita normal.

## Extras de GFM

| Sintaxis | Resultado |
| --- | --- |
| `https://example.com` | Autolink: las URL se vuelven enlaces sin `<>` |
| `@usuario` | Mención que notifica a la persona |
| `@org/equipo` | Mención a un equipo de la organización |
| `#123` | Enlace al issue o PR 123 del repo |
| `owner/repo#123` | Enlace a un issue de otro repo |
| SHA de un commit (ej. `a5c3785`) | Enlace al commit |
| `:rocket:` | Shortcode de emoji |
| `$E = mc^2$` | Fórmula matemática en línea (LaTeX) |

Para escribir una mención sin notificar a nadie, ponla en código: `` `@usuario` ``.

## Detalles colapsables

```md
<details>
<summary>Ver el log completo</summary>

Deja una línea en blanco tras `</summary>` para que el
Markdown de dentro se procese.

- Funciona con listas, código y tablas.

</details>
```

| Sintaxis | Resultado |
| --- | --- |
| `<details>` | Bloque que se pliega y se despliega con un clic |
| `<summary>` | Texto visible cuando está cerrado |
| `<details open>` | Empieza desplegado |

## Frontmatter YAML

Bloque de metadatos al inicio del archivo, entre dos líneas `---`. Lo usan generadores como Astro, Hugo o Jekyll; GitHub lo muestra como una tabla.

```md
---
title: 'Guía de despliegue'
description: 'Pasos para publicar en producción.'
tags: ['devops', 'aws']
lastUpdated: 2026-11-06
draft: false
---

# Guía de despliegue
```

| Regla | Detalle |
| --- | --- |
| Posición | Debe ser lo primero del archivo, sin líneas antes |
| Comillas | Úsalas si el valor contiene `:` o `#` |
| Listas | En línea `['a', 'b']` o una por línea con `- a` |
| Fechas | Formato ISO `YYYY-MM-DD` |
