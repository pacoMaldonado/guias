# Configuración Git del Proyecto

## Setup inicial (una sola vez por máquina)

Después de clonar el repositorio, ejecuta el script de setup desde la raíz del repo:

### Linux / macOS

```bash
chmod +x git-script/setup-git.sh
./git-script/setup-git.sh
```

### Windows

```bat
git-script\setup-git.bat
```

El script configura automáticamente:

- El template de commits (`.gitmessage`)
- Los hooks de Git (`.githooks/`)
- Configuraciones globales recomendadas para el equipo

---

## Uso diario

### Commit con template (recomendado)

```bash
git commit
# Se abre el editor con el template pre-llenado y la guía de tipos/alcances
```

### Commit rápido

```bash
git commit -m "feat(auth): add JWT token validation"
```

El hook `commit-msg` valida automáticamente el formato. Si es inválido, el commit se cancela con un mensaje de error explicativo.

---

## Formato de commits

```
tipo(alcance): descripción breve en inglés
```

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `hotfix` | Corrección crítica en producción |
| `refactor` | Refactorización sin cambio funcional |
| `docs` | Documentación |
| `test` | Pruebas |
| `chore` | Mantenimiento, dependencias |
| `style` | Formato de código |
| `perf` | Optimización de rendimiento |
| `wip` | Trabajo en progreso (temporal) |

### Alcances comunes

`auth` · `ui` · `api` · `db` · `config` · `deps` · `test` · `docs`

### Ejemplos válidos

```
feat(auth): add JWT token validation
fix(ui): resolve modal overlay issue
docs(api): update endpoint documentation
refactor(db): optimize user queries
chore(deps): update react to v18.2.0
```

---

## Hooks activos

| Hook | Qué hace |
|---|---|
| `pre-commit` | Bloquea commits en ramas protegidas y detecta credenciales AWS |
| `commit-msg` | Valida el formato del mensaje contra el template |
| `pre-push` | Bloquea push directo a `main`, `develop`, `staging` |
| `prepare-commit-msg` | Inserta el nombre de la rama al inicio del mensaje |
| `post-merge` | Avisa si cambiaron archivos de dependencias |