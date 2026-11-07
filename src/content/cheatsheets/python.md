---
title: 'Python'
description: 'Python 3 moderno: entornos virtuales, uv, estructuras de datos, f-strings, funciones, clases, errores, archivos, fechas con zona y herramientas.'
category: 'Backend'
icon: 'mdi:language-python'
tags: ['python', 'uv', 'pytest', 'backend']
lastUpdated: 2026-11-06
isDraft: false
---

Trabaja siempre dentro de un entorno virtual y usa `uv` para crear proyectos, instalar dependencias y ejecutar scripts: es mucho más rápido que `pip`.
Los timestamps se guardan en UTC con `datetime.now(timezone.utc)`; nunca uses `datetime.now()` sin zona.

## Entornos virtuales (venv)

| Acción | Comando |
| --- | --- |
| Crear un entorno en `.venv` | `python3 -m venv .venv` |
| Activar en Linux / macOS | `source .venv/bin/activate` |
| Activar en Windows (PowerShell) | `.venv\Scripts\Activate.ps1` |
| Activar en Windows (cmd) | `.venv\Scripts\activate.bat` |
| Desactivar el entorno | `deactivate` |
| Ver qué intérprete se está usando | `python -c "import sys; print(sys.executable)"` |

Añade `.venv/` a tu `.gitignore`: el entorno se recrea, no se versiona.

## uv: gestor moderno

| Acción | Comando |
| --- | --- |
| Crear un proyecto nuevo (`pyproject.toml`) | `uv init my-app` |
| Añadir una dependencia | `uv add httpx` |
| Añadir una dependencia de desarrollo | `uv add --dev pytest ruff` |
| Quitar una dependencia | `uv remove httpx` |
| Instalar todo según `uv.lock` | `uv sync` |
| Ejecutar un script en el entorno del proyecto | `uv run main.py` |
| Ejecutar una herramienta del proyecto | `uv run pytest` |
| Crear un entorno virtual a mano | `uv venv` |
| Instalar una versión de Python | `uv python install 3.13` |
| Ejecutar una herramienta sin instalarla | `uvx ruff check` |

## pip básico

| Acción | Comando |
| --- | --- |
| Instalar un paquete | `python -m pip install requests` |
| Instalar desde un archivo de requisitos | `python -m pip install -r requirements.txt` |
| Congelar las versiones instaladas | `python -m pip freeze > requirements.txt` |
| Actualizar un paquete | `python -m pip install -U requests` |
| Desinstalar un paquete | `python -m pip uninstall requests` |
| Listar paquetes desactualizados | `python -m pip list --outdated` |

## Tipos y estructuras

| Tipo | Descripción |
| --- | --- |
| `list` | Secuencia ordenada y mutable: `[1, 2, 3]` |
| `tuple` | Secuencia ordenada e inmutable: `(1, 2)` |
| `dict` | Pares clave-valor, mantiene el orden de inserción: `{"a": 1}` |
| `set` | Elementos únicos sin orden: `{1, 2, 3}` |
| `x[-1]` / `x[1:3]` | Último elemento / slice del índice 1 al 2 |
| `d.get("k", 0)` | Leer una clave con valor por defecto, sin `KeyError` |
| `a, *rest = items` | Desempaquetar el primero y el resto |

```python
nums = [1, 2, 3, 4, 5]
squares = [n * n for n in nums if n % 2 == 0]   # [4, 16]
by_id = {u["id"]: u for u in users}              # dict comprehension
unique = {w.lower() for w in words}              # set comprehension
total = sum(n for n in nums)                     # generator expression

for i, name in enumerate(["ana", "luis"], start=1):
    print(i, name)
for name, age in zip(names, ages):
    print(f"{name}: {age}")
```

## Strings y f-strings

| Expresión | Resultado |
| --- | --- |
| `f"{price:.2f}"` | Dos decimales: `19.90` |
| `f"{1234567:,}"` | Separador de miles: `1,234,567` |
| `f"{0.256:.1%}"` | Porcentaje: `25.6%` |
| `f"{7:03d}"` | Relleno con ceros: `007` |
| `f"{name:>10}"` | Alinear a la derecha en 10 caracteres |
| `f"{now:%Y-%m-%d %H:%M}"` | Formatear una fecha |
| `f"{value=}"` | Depuración: imprime `value=42` |
| `", ".join(items)` / `s.split(",")` | Unir y separar strings |

## Funciones

```python
def greet(name: str, greeting: str = "Hola", *, upper: bool = False) -> str:
    """Return a greeting. Arguments after * are keyword-only."""
    text = f"{greeting}, {name}"
    return text.upper() if upper else text


def log(*args: object, **kwargs: object) -> None:
    print("args:", args, "kwargs:", kwargs)


greet("Ana", upper=True)          # 'HOLA, ANA'
log(1, 2, level="info")           # args: (1, 2) kwargs: {'level': 'info'}
```

Nunca uses un valor mutable como defecto (`def f(items=[])`): usa `None` y créalo dentro de la función.

## Clases y dataclasses

```python
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass(frozen=True)
class User:
    id: int
    email: str
    roles: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def is_admin(self) -> bool:
        return "admin" in self.roles


user = User(id=1, email="ana@example.com", roles=["admin"])
print(user.is_admin, user)
```

`@dataclass` genera `__init__`, `__repr__` y `__eq__`; `frozen=True` lo hace inmutable.

## Errores y context managers

```python
class ValidationError(Exception):
    """Raised when input data is invalid."""


try:
    value = int(raw)
except ValueError as exc:
    raise ValidationError(f"invalid number: {raw!r}") from exc
else:
    print("parsed", value)
finally:
    print("always runs")

# Context manager: closes the file even if an error occurs
with open("data.txt", encoding="utf-8") as f:
    first_line = f.readline()
```

## Archivos y pathlib

| Acción | Código |
| --- | --- |
| Ruta relativa al script actual | `Path(__file__).parent / "data.json"` |
| Leer todo el texto | `path.read_text(encoding="utf-8")` |
| Escribir texto | `path.write_text(text, encoding="utf-8")` |
| Crear carpetas (con padres) | `path.mkdir(parents=True, exist_ok=True)` |
| Buscar archivos recursivamente | `Path("src").rglob("*.py")` |
| Comprobar si existe | `path.exists()` |
| Nombre, extensión y nombre sin extensión | `path.name` / `path.suffix` / `path.stem` |

Todo con `from pathlib import Path`. Prefiere `pathlib` a `os.path`.

## Fechas con zona horaria

```python
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

now = datetime.now(timezone.utc)                 # always store in UTC
stamp = now.isoformat()                          # '2026-11-06T14:32:00.123456+00:00'

parsed = datetime.fromisoformat("2026-11-06T14:32:00Z")
tomorrow = now + timedelta(days=1)

# Convert to local time only to display it
local = now.astimezone(ZoneInfo("America/Mexico_City"))
print(local.strftime("%d/%m/%Y %H:%M"))
```

`datetime.now()` sin argumento devuelve una fecha *naive* (sin zona) que depende del servidor: evítala.

## Módulos útiles de la stdlib

| Módulo | Para qué sirve |
| --- | --- |
| `json` | `json.loads(text)` / `json.dumps(obj, indent=2)` |
| `collections` | `Counter`, `defaultdict`, `deque`, `namedtuple` |
| `itertools` | `chain`, `groupby`, `batched`, `product`, `islice` |
| `functools` | `cache`, `lru_cache`, `partial`, `reduce` |
| `pathlib` | Rutas y archivos orientados a objetos |
| `logging` | Logs con niveles en lugar de `print` |
| `argparse` | Parsear argumentos de línea de comandos |
| `subprocess` | `subprocess.run(["ls", "-l"], check=True)` |

## Herramientas: ruff, pytest y mypy

| Acción | Comando |
| --- | --- |
| Revisar el código (linter) | `uv run ruff check .` |
| Corregir lo que se pueda automáticamente | `uv run ruff check --fix .` |
| Formatear el código | `uv run ruff format .` |
| Ejecutar los tests | `uv run pytest` |
| Tests verbosos, parando en el primer fallo | `uv run pytest -v -x` |
| Ejecutar tests que coincidan con un nombre | `uv run pytest -k "parse"` |
| Comprobar tipos | `uv run mypy src` |

```python
# tests/test_calc.py
import pytest

from calc import divide


def test_divide() -> None:
    assert divide(10, 2) == 5


def test_divide_by_zero() -> None:
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)
```
