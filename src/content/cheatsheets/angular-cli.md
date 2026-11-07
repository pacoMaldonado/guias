---
title: 'Angular CLI'
description: 'Comandos de Angular CLI v22: instalar, crear proyectos, servir en red local, generar código, compilar, probar y migrar.'
category: 'Frontend'
icon: 'mdi:angular'
tags: ['angular', 'cli', 'ng', 'typescript']
lastUpdated: 2026-11-06
isDraft: false
---

Los comandos se pueden abreviar: `ng generate component` equivale a `ng g c`.
Dos opciones que se repiten mucho: `--directory .` crea el proyecto en la carpeta actual y `--skip-tests` evita los archivos `.spec.ts`.

## Instalación y entorno

| Acción | Comando |
| --- | --- |
| Instalar la CLI globalmente | `pnpm add -g @angular/cli` |
| Instalar la versión 22 exacta | `pnpm add -g @angular/cli@22` |
| Verificar la versión instalada | `ng version` o `ng v` |
| Desinstalar la CLI global | `pnpm remove -g @angular/cli` |
| Limpiar el store de pnpm (paquetes sin uso) | `pnpm store prune` |
| Ver la ayuda general | `ng help` |
| Configurar Analytics de Angular | `ng analytics [on\|off]` |

## Crear proyectos (ng new)

| Acción | Comando |
| --- | --- |
| Crear un proyecto de forma interactiva | `ng new mi-app` |
| Crear en la carpeta actual (sin subcarpeta) | `ng new mi-app --directory .` |
| Personalizar el nombre o la ruta de la carpeta | `ng new mi-app --directory mi-carpeta` |
| Proyecto con SCSS | `ng new mi-app --style=scss` |
| Proyecto con SSR (Server-Side) | `ng new mi-app --ssr=true` |
| Sin SSR (solo SPA, client-only) | `ng new mi-app --ssr=false` |
| Sin archivos de test (`.spec.ts`) | `ng new mi-app --skip-tests` |
| Sin inicializar el repositorio Git | `ng new mi-app --skip-git` |
| Usar pnpm como gestor de paquetes | `ng new mi-app --package-manager=pnpm` |
| Sin instalación inicial (`pnpm install`) | `ng new mi-app --skip-install` |
| Aceptar los valores por defecto | `ng new mi-app --defaults` |

## Servidor local y red (ng serve)

| Acción | Comando |
| --- | --- |
| Iniciar el servidor básico | `ng serve` o `ng s` |
| Servir y abrir el navegador | `ng serve -o` o `ng serve --open` |
| Acceso desde red local (WiFi/LAN) | `ng serve --host 0.0.0.0` |
| Cambiar el puerto (ej. 8080) | `ng serve --port 8080` |
| Red local con puerto personalizado | `ng serve --host 0.0.0.0 --port 4200` |
| Servidor con SSL / HTTPS nativo | `ng serve --ssl` |
| Desactivar el live reload | `ng serve --live-reload=false` |
| Permitir hosts externos | `ng serve --disable-host-check` |

### Exponer la app en tu red local

Por defecto Angular levanta en `localhost:4200`, accesible solo desde tu PC. Para probarla desde un móvil, una tablet u otro equipo en la misma red:

1. Ejecuta el servidor con el host abierto.

   ```bash
   ng serve --host 0.0.0.0
   ```

2. Obtén tu IP local con el comando de tu sistema: `ipconfig` en Windows, `ifconfig` o `ip a` en Linux y Mac. Busca la dirección IPv4 (por ejemplo `192.168.1.75`).

3. Abre en el otro dispositivo la IP y el puerto:

   ```text
   http://192.168.1.75:4200
   ```

Si no carga:

- Confirma que ambos dispositivos están en la misma red WiFi, no en la red de invitados ni en datos móviles.
- En Windows, permite el acceso en el Firewall cuando Node.js lo pida, o añade una regla de entrada para el puerto 4200.
- En Linux, ejecuta `sudo ufw allow 4200/tcp`.

### Scripts recomendados en package.json

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "start:host": "ng serve --host 0.0.0.0 --port 4200",
  "start:open": "ng serve -o",
  "build": "ng build",
  "build:prod": "ng build --configuration production",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "test:ci": "ng test --watch=false --code-coverage",
  "clean": "rm -rf .angular/cache dist node_modules && pnpm install"
}
```

Con esto puedes ejecutar `pnpm run start:host`.

### Host y puerto fijos en angular.json

Para que siempre levante en red, defínelos en `angular.json`:

```json
"serve": {
  "options": {
    "host": "0.0.0.0",
    "port": 4200
  }
}
```

## Generar código (ng generate)

| Acción | Comando |
| --- | --- |
| Componente | `ng g c mi-componente` |
| Componente standalone | `ng g c mi-comp --standalone` |
| Componente con template y estilos inline | `ng g c mi-comp -t -s` |
| Servicio injectable | `ng g s mi-servicio` |
| Guard de rutas | `ng g g mi-guard` |
| Interceptor HTTP | `ng g interceptor mi-interceptor` |
| Pipe de transformación | `ng g p mi-pipe` |
| Directiva personalizada | `ng g d mi-directiva` |
| Interface de TypeScript | `ng g i mi-interface` |
| Enum | `ng g e mi-enum` |
| Clase | `ng g cl mi-clase` |

## Build y producción (ng build)

| Acción | Comando |
| --- | --- |
| Build optimizado de producción | `ng build` |
| Build para un entorno específico | `ng build --configuration=staging` |
| Build con `base-href` personalizado | `ng build --base-href=/app/` |
| Generar source maps para depurar | `ng build --source-map` |
| Build en modo watch (recompila) | `ng build --watch` |
| Analizar el tamaño de los bundles | `ng build --stats-json` |

## Testing y calidad (ng test)

| Acción | Comando |
| --- | --- |
| Ejecutar las pruebas unitarias | `ng test` o `ng t` |
| Ejecutar con cobertura | `ng test --code-coverage` |
| Ejecutar una sola vez (modo CI) | `ng test --watch=false` |
| Ejecutar sin interfaz (headless) | `ng test --browsers=ChromeHeadless` |
| Ejecutar el linter | `ng lint` |
| Corregir errores de linting | `ng lint --fix` |

## Actualizar y reparar

| Acción | Comando |
| --- | --- |
| Ver actualizaciones pendientes | `ng update` |
| Actualizar Angular Core y CLI | `ng update @angular/cli @angular/core` |
| Forzar la actualización (incompatibilidades) | `ng update --force` |
| Actualizar a la versión siguiente (next) | `ng update --next` |

### Reparar node_modules y caché

```bash
# Full clean reinstall (keeps pnpm-lock.yaml so versions stay pinned)
rm -rf node_modules && pnpm install

# Clear the Angular build cache
rm -rf .angular/cache

# Fix vulnerable dependencies
pnpm audit --fix
```

## Schematics y librerías (ng add)

| Acción | Comando |
| --- | --- |
| Añadir Angular Material | `ng add @angular/material` |
| Añadir PWA / Service Worker | `ng add @angular/pwa` |
| Añadir Angular Localize (i18n) | `ng add @angular/localize` |
| Añadir Tailwind CSS | `pnpm add -D tailwindcss postcss autoprefixer` |
| Generar un componente Material (tabla) | `ng g @angular/material:table mi-tabla` |
| Generar navegación / sidebar de Material | `ng g @angular/material:nav mi-nav` |

## Migración moderna (schematics)

| Acción | Comando |
| --- | --- |
| Migrar al nuevo control flow (`@if` / `@for`) | `ng g @angular/core:control-flow` |
| Migrar componentes a standalone | `ng g @angular/core:standalone` |
| Migrar la inyección a la función `inject()` | `ng g @angular/core:inject` |
| Migrar a lazy loading de rutas | `ng g @angular/core:route-lazy-loading` |
