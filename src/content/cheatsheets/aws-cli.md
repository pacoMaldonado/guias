---
title: 'AWS CLI'
description: 'AWS CLI v2: perfiles con SSO, S3, CloudFront, Lambda, DynamoDB, Secrets Manager, ECR y filtros con --query.'
category: 'DevOps'
icon: 'mdi:aws'
tags: ['aws', 'cli', 's3', 'lambda', 'cloud']
lastUpdated: 2026-11-06
isDraft: false
---

Comandos de AWS CLI v2 para el día a día. Autentícate con IAM Identity Center (SSO) o roles: nunca guardes claves de acceso de larga duración en tu equipo ni en el repositorio.

## Configuración y perfiles

| Acción | Comando |
| --- | --- |
| Configurar un perfil con IAM Identity Center (SSO) | `aws configure sso` |
| Iniciar sesión SSO de un perfil | `aws sso login --profile my-profile` |
| Cerrar la sesión SSO | `aws sso logout` |
| Ver quién eres (cuenta, rol, ARN) | `aws sts get-caller-identity` |
| Usar un perfil en un solo comando | `aws s3 ls --profile my-profile` |
| Usar un perfil en toda la sesión de terminal | `export AWS_PROFILE=my-profile` |
| Listar los perfiles configurados | `aws configure list-profiles` |
| Ver de dónde salen las credenciales y la región | `aws configure list` |

## Regiones

| Acción | Comando |
| --- | --- |
| Cambiar la región en un solo comando | `aws lambda list-functions --region us-east-1` |
| Fijar la región para la sesión | `export AWS_REGION=us-east-1` |
| Guardar la región por defecto de un perfil | `aws configure set region us-east-1 --profile my-profile` |
| Listar las regiones habilitadas | `aws ec2 describe-regions --query "Regions[].RegionName" --output text` |

## S3

| Acción | Comando |
| --- | --- |
| Listar buckets | `aws s3 ls` |
| Listar el contenido de un prefijo | `aws s3 ls s3://s3-acme-portal-assets/images/` |
| Crear un bucket | `aws s3 mb s3://s3-acme-portal-assets --region us-east-1` |
| Subir un archivo | `aws s3 cp ./report.csv s3://s3-acme-portal-data/reports/` |
| Descargar un prefijo completo | `aws s3 cp s3://s3-acme-portal-data/reports/ ./reports --recursive` |
| Sincronizar y borrar en destino lo que ya no existe | `aws s3 sync ./dist s3://s3-acme-portal-web --delete` |
| Probar un sync sin ejecutarlo | `aws s3 sync ./dist s3://s3-acme-portal-web --delete --dryrun` |
| Borrar un prefijo completo | `aws s3 rm s3://s3-acme-portal-data/tmp/ --recursive` |
| Generar una URL temporal (1 hora) | `aws s3 presign s3://s3-acme-portal-data/reports/report.csv --expires-in 3600` |

## CloudFront

| Acción | Comando |
| --- | --- |
| Listar distribuciones (ID y dominio) | `aws cloudfront list-distributions --query "DistributionList.Items[].[Id,DomainName]" --output table` |
| Invalidar toda la caché | `aws cloudfront create-invalidation --distribution-id E1ABCDEF2GHIJK --paths "/*"` |
| Invalidar rutas concretas | `aws cloudfront create-invalidation --distribution-id E1ABCDEF2GHIJK --paths "/index.html" "/assets/*"` |

## Lambda

| Acción | Comando |
| --- | --- |
| Listar funciones | `aws lambda list-functions --query "Functions[].FunctionName" --output table` |
| Invocar con un payload JSON | `aws lambda invoke --function-name lambda-acme-portal-bridge --cli-binary-format raw-in-base64-out --payload '{"ping":true}' out.json` |
| Subir un nuevo código desde zip | `aws lambda update-function-code --function-name lambda-acme-portal-bridge --zip-file fileb://function.zip` |
| Ver la configuración de una función | `aws lambda get-function-configuration --function-name lambda-acme-portal-bridge` |
| Seguir los logs en vivo | `aws logs tail /aws/lambda/lambda-acme-portal-bridge --follow` |
| Ver logs de la última hora con filtro | `aws logs tail /aws/lambda/lambda-acme-portal-bridge --since 1h --filter-pattern ERROR` |

`--cli-binary-format raw-in-base64-out` es necesario en v2 para pasar el payload como JSON plano.

## DynamoDB

| Acción | Comando |
| --- | --- |
| Leer un ítem por clave | `aws dynamodb get-item --table-name ddb-acme-portal-orders --key '{"pk":{"S":"ORDER#123"}}'` |
| Consultar por clave de partición | `aws dynamodb query --table-name ddb-acme-portal-orders --key-condition-expression "pk = :pk" --expression-attribute-values '{":pk":{"S":"CUSTOMER#42"}}'` |
| Contar ítems con un scan (costoso en tablas grandes) | `aws dynamodb scan --table-name ddb-acme-portal-orders --select COUNT` |
| Describir la tabla (claves, índices) | `aws dynamodb describe-table --table-name ddb-acme-portal-orders` |

## Secrets Manager y ECR

| Acción | Comando |
| --- | --- |
| Leer el valor de un secreto | `aws secretsmanager get-secret-value --secret-id secret-acme-portal-db-credentials --query SecretString --output text` |
| Leer un campo del secreto JSON | `aws secretsmanager get-secret-value --secret-id secret-acme-portal-db-credentials --query SecretString --output text \| jq -r .username` |
| Listar secretos | `aws secretsmanager list-secrets --query "SecretList[].Name"` |
| Iniciar sesión de Docker en ECR | `aws ecr get-login-password --region us-east-1 \| docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com` |
| Listar repositorios de ECR | `aws ecr describe-repositories --query "repositories[].repositoryUri"` |

No imprimas secretos en logs de CI ni los pegues en tickets.

## Salida y filtros con --query

| Opción | Descripción |
| --- | --- |
| `--output json` | Salida por defecto, ideal para procesar con `jq`. |
| `--output table` | Tabla legible para humanos. |
| `--output text` | Texto separado por tabuladores, ideal para scripts. |
| `--output yaml` | Salida en YAML. |
| `--query` | Filtra y proyecta la respuesta con JMESPath en el lado del cliente. |
| `--no-cli-pager` | Desactiva el paginador (`less`) para usar la salida en scripts. |

```bash
# Name of every running EC2 instance
aws ec2 describe-instances \
  --filters Name=instance-state-name,Values=running \
  --query "Reservations[].Instances[].Tags[?Key=='Name'].Value[]" --output text

# Lambdas on a given runtime, as a table
aws lambda list-functions \
  --query "Functions[?Runtime=='python3.13'].[FunctionName,LastModified]" --output table

# First element and a renamed projection
aws s3api list-buckets --query "Buckets[0].{name: Name, created: CreationDate}"
```
