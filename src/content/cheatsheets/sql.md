---
title: 'SQL'
description: 'SQL con foco en PostgreSQL: consultas, agregación, JOINs, CTE, window functions, DDL, DML, upsert, transacciones y comandos de psql.'
category: 'Backend'
icon: 'mdi:database'
tags: ['sql', 'postgresql', 'psql', 'base-de-datos']
lastUpdated: 2026-11-06
isDraft: false
---

La mayoría de la sintaxis es SQL estándar; lo que es propio de PostgreSQL está marcado como tal.
Los ejemplos usan unas tablas `customers` y `orders` (un cliente tiene muchos pedidos).

## Consultas básicas

```sql
SELECT id, name, email
FROM customers
WHERE country = 'MX'
  AND created_at >= '2026-01-01T00:00:00Z'
ORDER BY created_at DESC, name ASC
LIMIT 20 OFFSET 40;           -- page 3 with 20 rows per page

SELECT DISTINCT country FROM customers;
SELECT name AS customer_name FROM customers c;   -- column and table aliases
```

El orden de escritura es `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT`.

## Operadores de filtrado

| Operador | Descripción |
| --- | --- |
| `IN ('MX', 'CO')` | Coincide con cualquiera de la lista |
| `BETWEEN 10 AND 20` | Rango inclusivo en ambos extremos |
| `LIKE 'Ana%'` | Patrón: `%` cualquier texto, `_` un carácter |
| `ILIKE '%gmail.com'` | Como `LIKE` sin distinguir mayúsculas (PostgreSQL) |
| `IS NULL` / `IS NOT NULL` | Comparar con nulos (`= NULL` nunca es verdadero) |
| `COALESCE(phone, 'N/A')` | Primer valor no nulo |
| `NOT`, `AND`, `OR` | Combinar condiciones; usa paréntesis para dejar clara la prioridad |
| `CASE WHEN … THEN … ELSE … END` | Condicional dentro de una consulta |

## Agregación

```sql
SELECT customer_id,
       COUNT(*)          AS orders,
       SUM(total)        AS revenue,
       AVG(total)        AS avg_ticket,
       MAX(created_at)   AS last_order
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(total) > 1000
ORDER BY revenue DESC;
```

`WHERE` filtra filas **antes** de agrupar; `HAVING` filtra grupos **después**. Toda columna del `SELECT` que no esté agregada debe ir en el `GROUP BY`. `COUNT(*)` cuenta filas; `COUNT(columna)` ignora los nulos.

## JOINs

| JOIN | Qué devuelve |
| --- | --- |
| `INNER JOIN` | Solo las filas con coincidencia en ambas tablas |
| `LEFT JOIN` | Todas las de la izquierda; columnas de la derecha en `NULL` si no hay coincidencia |
| `RIGHT JOIN` | Todas las de la derecha; lo inverso de `LEFT JOIN` |
| `FULL JOIN` | Todas las filas de ambas tablas, coincidan o no |
| `CROSS JOIN` | Producto cartesiano: cada fila con cada fila |
| `USING (id)` | Atajo de `ON a.id = b.id` cuando la columna se llama igual |

```sql
-- Customers with their order count, including those with no orders
SELECT c.id, c.name, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- Customers that never ordered
SELECT c.* FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## Subconsultas y CTE

```sql
-- Subquery in WHERE
SELECT * FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE total > 500);

-- EXISTS is usually clearer and faster for "has at least one"
SELECT * FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- CTE: name an intermediate result
WITH top_customers AS (
  SELECT customer_id, SUM(total) AS revenue
  FROM orders GROUP BY customer_id
  ORDER BY revenue DESC LIMIT 10
)
SELECT c.name, t.revenue
FROM top_customers t JOIN customers c ON c.id = t.customer_id;
```

### CTE recursiva (árbol de categorías)

```sql
WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 AS depth
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.depth + 1
  FROM categories c JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree ORDER BY depth, name;
```

## Window functions

```sql
SELECT customer_id, id, total, created_at,
  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at) AS n,
  RANK()       OVER (ORDER BY total DESC)                          AS rank_by_total,
  LAG(total)   OVER (PARTITION BY customer_id ORDER BY created_at) AS prev_total,
  SUM(total)   OVER (PARTITION BY customer_id ORDER BY created_at) AS running_total
FROM orders;
```

| Función | Descripción |
| --- | --- |
| `ROW_NUMBER()` | Numeración 1, 2, 3… sin empates |
| `RANK()` | Empates comparten puesto y dejan huecos (1, 1, 3) |
| `DENSE_RANK()` | Empates sin huecos (1, 1, 2) |
| `LAG(col)` / `LEAD(col)` | Valor de la fila anterior / siguiente |
| `SUM(col) OVER (…)` | Total acumulado o por partición sin colapsar filas |
| `PARTITION BY` | Reinicia el cálculo por grupo, como un `GROUP BY` que no agrupa |

## DDL: crear y modificar tablas

```sql
CREATE TABLE customers (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  country     CHAR(2) NOT NULL DEFAULT 'MX',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  BIGINT NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  total        NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

En PostgreSQL usa `TIMESTAMPTZ` para fechas: se almacena en UTC y se convierte según la zona de la sesión.

## ALTER e índices

| Acción | SQL |
| --- | --- |
| Añadir una columna | `ALTER TABLE customers ADD COLUMN phone TEXT;` |
| Eliminar una columna | `ALTER TABLE customers DROP COLUMN phone;` |
| Renombrar una columna | `ALTER TABLE customers RENAME COLUMN name TO full_name;` |
| Añadir una restricción | `ALTER TABLE orders ADD CONSTRAINT chk_status CHECK (status IN ('pending', 'paid'));` |
| Crear un índice | `CREATE INDEX idx_orders_customer ON orders (customer_id);` |
| Índice único compuesto | `CREATE UNIQUE INDEX idx_unique_sku ON products (store_id, sku);` |
| Crear índice sin bloquear escrituras (PostgreSQL) | `CREATE INDEX CONCURRENTLY idx_orders_created ON orders (created_at);` |
| Ver el plan de ejecución | `EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;` |

## DML: insertar, actualizar y borrar

```sql
INSERT INTO customers (email, name)
VALUES ('ana@example.com', 'Ana'), ('luis@example.com', 'Luis')
RETURNING id;                                  -- RETURNING is PostgreSQL

UPDATE orders SET status = 'paid'
WHERE id = 42;

DELETE FROM orders
WHERE status = 'pending' AND created_at < now() - INTERVAL '30 days';

-- Upsert (PostgreSQL): insert or update on unique conflict
INSERT INTO customers (email, name)
VALUES ('ana@example.com', 'Ana María')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
```

Un `UPDATE` o `DELETE` sin `WHERE` afecta a **todas** las filas. Prueba antes el `WHERE` con un `SELECT`.

## Transacciones

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

SAVEPOINT before_fee;
UPDATE accounts SET balance = balance - 1 WHERE id = 1;
ROLLBACK TO SAVEPOINT before_fee;    -- undo only the fee

COMMIT;                              -- or ROLLBACK; to undo everything
```

Una transacción es todo o nada: si algo falla antes del `COMMIT`, haz `ROLLBACK` y ningún cambio queda aplicado.

## Cliente psql (PostgreSQL)

| Acción | Comando |
| --- | --- |
| Conectarse a una base de datos | `psql -h localhost -U postgres -d my_db` |
| Conectarse con una URL | `psql "postgresql://user@localhost:5432/my_db"` |
| Ejecutar un archivo SQL | `psql -d my_db -f schema.sql` |
| Ejecutar una consulta y salir | `psql -d my_db -c "SELECT count(*) FROM orders;"` |

| Meta-comando | Qué hace |
| --- | --- |
| `\l` | Listar bases de datos |
| `\c my_db` | Conectarse a otra base de datos |
| `\dt` | Listar tablas del esquema actual |
| `\d orders` | Describir una tabla: columnas, índices y restricciones |
| `\du` | Listar roles y usuarios |
| `\x` | Alternar la vista expandida (una columna por línea) |
| `\timing` | Mostrar el tiempo de cada consulta |
| `\i file.sql` | Ejecutar un archivo SQL |
| `\q` | Salir de psql |
