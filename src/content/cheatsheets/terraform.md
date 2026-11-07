---
title: 'Terraform'
description: 'Flujo de trabajo, estado, variables, módulos, meta-argumentos, backend S3 con bloqueo nativo y funciones útiles de Terraform.'
category: 'DevOps'
icon: 'mdi:terraform'
tags: ['terraform', 'iac', 'aws', 'devops', 'hcl']
lastUpdated: 2026-11-06
isDraft: false
---

Comandos y patrones de Terraform para infraestructura como código. Revisa siempre el `plan` antes de aplicar y guárdalo con `-out` para aplicar exactamente lo que revisaste.

## Flujo de trabajo

| Acción | Comando |
| --- | --- |
| Inicializar proveedores, módulos y backend | `terraform init` |
| Actualizar proveedores dentro de las restricciones | `terraform init -upgrade` |
| Formatear todos los archivos `.tf` | `terraform fmt -recursive` |
| Validar la sintaxis y la configuración | `terraform validate` |
| Generar y guardar el plan | `terraform plan -out=tfplan` |
| Aplicar exactamente el plan guardado | `terraform apply tfplan` |
| Ver los outputs | `terraform output` |
| Destruir la infraestructura (pide confirmación) | `terraform destroy` |

## Estado

| Acción | Comando |
| --- | --- |
| Listar los recursos del estado | `terraform state list` |
| Ver los atributos de un recurso | `terraform state show aws_s3_bucket.data` |
| Renombrar un recurso en el estado | `terraform state mv aws_s3_bucket.data aws_s3_bucket.campaign_data` |
| Dejar de gestionar un recurso (no lo borra en AWS) | `terraform state rm aws_s3_bucket.legacy` |
| Importar un recurso existente | `terraform import aws_s3_bucket.data s3-acme-portal-data` |
| Sincronizar el estado con la realidad sin cambios | `terraform apply -refresh-only` |

Prefiere los bloques declarativos `import {}` y `moved {}`: quedan en el código y pasan por `plan`.

```hcl
import {
  to = aws_s3_bucket.data
  id = "s3-acme-portal-data"
}

moved {
  from = aws_s3_bucket.data
  to   = aws_s3_bucket.campaign_data
}
```

Con `terraform plan -generate-config-out=generated.tf` Terraform escribe el código de los recursos importados.

## Variables, outputs y locals

```hcl
variable "environment" {
  type        = string
  description = "Deployment environment"
  validation {
    condition     = contains(["dev", "qa", "prod"], var.environment)
    error_message = "environment must be dev, qa or prod."
  }
}

variable "tags" {
  type    = map(string)
  default = {}
}

locals {
  name_prefix = "acme-portal-${var.environment}"
}

output "bucket_arn" {
  value = aws_s3_bucket.data.arn
}
```

| Acción | Comando |
| --- | --- |
| Pasar un valor por línea de comandos | `terraform plan -var="environment=qa"` |
| Usar un archivo de variables | `terraform plan -var-file=qa.tfvars` |
| Leer un output en scripts | `terraform output -raw bucket_arn` |

`terraform.tfvars` y `*.auto.tfvars` se cargan solos. Marca con `sensitive = true` las variables y outputs que no deben mostrarse en el plan.

## Tipos de variables

| Tipo | Descripción |
| --- | --- |
| `string`, `number`, `bool` | Tipos primitivos. |
| `list(string)` | Lista ordenada de valores del mismo tipo. |
| `set(string)` | Conjunto sin orden ni duplicados; útil con `for_each`. |
| `map(string)` | Mapa clave-valor con valores del mismo tipo. |
| `object({ name = string, port = number })` | Estructura con atributos tipados. |
| `optional(string, "default")` | Atributo opcional dentro de un `object`. |
| `any` | Acepta cualquier tipo; úsalo con moderación. |

## Data sources y módulos

```hcl
data "aws_caller_identity" "current" {}

data "aws_vpc" "main" {
  tags = { Name = "vpc-acme-portal" }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "vpc-acme-portal"
  cidr = "10.0.0.0/16"
}

module "bridge" {
  source        = "../modules/lambda-handler"
  function_name = "lambda-acme-portal-bridge"
}
```

Fija `version` en módulos del registro; los módulos locales (`../modules/...`) no la llevan. Tras añadir un módulo ejecuta `terraform init`.

## Meta-argumentos

| Meta-argumento | Descripción |
| --- | --- |
| `count = 3` | Crea N copias; se referencian como `aws_instance.web[0]`. |
| `for_each = toset(var.names)` | Una instancia por clave de un mapa o set; se referencian como `aws_s3_bucket.b["logs"]`. |
| `depends_on = [aws_iam_role.lambda]` | Dependencia explícita cuando Terraform no puede inferirla. |
| `provider = aws.us_east_1` | Usa un proveedor con alias (otra región o cuenta). |
| `lifecycle { create_before_destroy = true }` | Crea el reemplazo antes de borrar el original. |
| `lifecycle { prevent_destroy = true }` | Bloquea cualquier plan que destruya el recurso. |
| `lifecycle { ignore_changes = [tags] }` | Ignora cambios externos en esos atributos. |
| `lifecycle { replace_triggered_by = [...] }` | Reemplaza el recurso cuando cambia otro. |

## Workspaces

| Acción | Comando |
| --- | --- |
| Listar workspaces | `terraform workspace list` |
| Crear un workspace | `terraform workspace new qa` |
| Cambiar de workspace | `terraform workspace select qa` |
| Ver el workspace actual | `terraform workspace show` |

Dentro del código, `terraform.workspace` devuelve el nombre del workspace activo. Para entornos con cuentas distintas suele ser mejor un directorio o backend por entorno.

## Backend S3 con bloqueo nativo

Desde Terraform 1.10 el backend S3 puede bloquear el estado con un archivo `.tflock` en el propio bucket (`use_lockfile`), sin tabla de DynamoDB.

```hcl
terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket       = "s3-acme-portal-terraform"
    key          = "infra/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

Activa el versionado en el bucket del estado. Si cambias el backend, ejecuta `terraform init -migrate-state`.

## Funciones útiles

| Función | Descripción |
| --- | --- |
| `lookup(var.sizes, "prod", "small")` | Valor de un mapa con valor por defecto. |
| `merge(local.common_tags, var.tags)` | Combina mapas; las claves de la derecha ganan. |
| `try(var.config.timeout, 30)` | Primer valor que se evalúe sin error. |
| `coalesce(var.name, "default")` | Primer argumento que no sea nulo ni cadena vacía. |
| `jsonencode({ Version = "2012-10-17" })` | Convierte un valor HCL a JSON (políticas IAM). |
| `templatefile("${path.module}/user-data.sh", { env = var.environment })` | Renderiza una plantilla con variables. |
| `format("lambda-%s-%s-%s", var.client, var.project, "bridge")` | Construye cadenas con formato. |
| `length(var.subnets)` | Número de elementos de una lista o mapa. |

Prueba funciones en vivo con `terraform console`.

## Secretos desde Secrets Manager

Nunca pongas contraseñas en `.tfvars` ni en el código: léelas en tiempo de plan con un data source.

```hcl
data "aws_secretsmanager_secret_version" "db" {
  secret_id = "secret-acme-portal-db-credentials"
}

locals {
  db_creds = jsondecode(data.aws_secretsmanager_secret_version.db.secret_string)
}

resource "aws_db_instance" "main" {
  identifier = "rds-acme-portal-main"
  username   = local.db_creds["username"]
  password   = local.db_creds["password"]
  # ...
}
```

El valor queda guardado en el estado: cifra el bucket del backend y restringe quién puede leerlo.
