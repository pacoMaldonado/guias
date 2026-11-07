---
title: 'Kubernetes (kubectl)'
description: 'kubectl para el día a día: contextos, namespaces, consultas, pods, despliegues, depuración y manifests mínimos.'
category: 'DevOps'
icon: 'mdi:kubernetes'
tags: ['kubernetes', 'kubectl', 'k8s', 'contenedores', 'devops']
lastUpdated: 2026-11-06
isDraft: false
---

Comandos de `kubectl` para operar un clúster de Kubernetes. Antes de cualquier cambio confirma en qué contexto y namespace estás: es el error más común.

## Contexto y namespaces

| Acción | Comando |
| --- | --- |
| Listar los contextos disponibles | `kubectl config get-contexts` |
| Ver el contexto actual | `kubectl config current-context` |
| Cambiar de contexto (clúster) | `kubectl config use-context my-cluster` |
| Fijar el namespace por defecto del contexto | `kubectl config set-context --current --namespace=my-app` |
| Listar namespaces | `kubectl get namespaces` |
| Crear un namespace | `kubectl create namespace my-app` |

## Consultar recursos

| Acción | Comando |
| --- | --- |
| Listar pods con nodo e IP | `kubectl get pods -o wide` |
| Listar pods de todos los namespaces | `kubectl get pods -A` |
| Filtrar por etiqueta | `kubectl get pods -l app=web` |
| Vigilar cambios en vivo | `kubectl get pods --watch` |
| Ver varios tipos a la vez | `kubectl get deploy,svc,ingress` |
| Ver el manifest completo de un recurso | `kubectl get deployment web -o yaml` |
| Extraer un campo con JSONPath | `kubectl get pods -o jsonpath='{.items[*].metadata.name}'` |
| Ver detalle y eventos de un recurso | `kubectl describe pod web-7d9c6b5f4-abcde` |

## Pods

| Acción | Comando |
| --- | --- |
| Seguir los logs de un pod | `kubectl logs -f web-7d9c6b5f4-abcde` |
| Ver logs del contenedor anterior (tras un crash) | `kubectl logs web-7d9c6b5f4-abcde --previous` |
| Logs de un contenedor concreto del pod | `kubectl logs -f web-7d9c6b5f4-abcde -c sidecar` |
| Logs de todos los pods de un despliegue | `kubectl logs -f deployment/web` |
| Abrir una shell en el pod | `kubectl exec -it web-7d9c6b5f4-abcde -- sh` |
| Redirigir un puerto local a un servicio | `kubectl port-forward svc/web 8080:80` |
| Copiar un archivo desde el pod | `kubectl cp web-7d9c6b5f4-abcde:/app/app.log ./app.log` |

## Despliegues

| Acción | Comando |
| --- | --- |
| Ver qué cambiaría antes de aplicar | `kubectl diff -f k8s/` |
| Aplicar manifests de un archivo o carpeta | `kubectl apply -f k8s/` |
| Esperar a que termine el despliegue | `kubectl rollout status deployment/web` |
| Ver el historial de revisiones | `kubectl rollout history deployment/web` |
| Volver a la revisión anterior | `kubectl rollout undo deployment/web` |
| Reiniciar los pods sin cambiar el manifest | `kubectl rollout restart deployment/web` |
| Escalar réplicas | `kubectl scale deployment/web --replicas=3` |
| Cambiar la imagen de un contenedor | `kubectl set image deployment/web web=registry.example.com/web:1.2.0` |

## Depuración

| Acción | Comando |
| --- | --- |
| Ver eventos ordenados por fecha | `kubectl get events --sort-by=.metadata.creationTimestamp` |
| Ver eventos con el comando dedicado | `kubectl events --for pod/web-7d9c6b5f4-abcde` |
| Consumo de CPU y memoria por pod | `kubectl top pods` |
| Consumo por nodo | `kubectl top nodes` |
| Añadir un contenedor de depuración a un pod | `kubectl debug -it web-7d9c6b5f4-abcde --image=busybox --target=web` |
| Lanzar un pod temporal para probar la red | `kubectl run tmp --rm -it --image=busybox --restart=Never -- sh` |

`kubectl top` requiere metrics-server instalado en el clúster.

## Crear manifests rápido

| Acción | Comando |
| --- | --- |
| Generar un Deployment sin crearlo | `kubectl create deployment web --image=nginx:1.27 --replicas=2 --dry-run=client -o yaml > deployment.yaml` |
| Generar un Service para un Deployment | `kubectl expose deployment web --port=80 --target-port=8080 --dry-run=client -o yaml > service.yaml` |
| Generar un ConfigMap desde un archivo | `kubectl create configmap web-config --from-file=config.json --dry-run=client -o yaml` |
| Generar un Job | `kubectl create job migrate --image=my-app:1.0.0 --dry-run=client -o yaml` |
| Consultar la documentación de un campo | `kubectl explain deployment.spec.strategy` |

## Borrar recursos

| Acción | Comando |
| --- | --- |
| Borrar lo definido en un manifest | `kubectl delete -f k8s/deployment.yaml` |
| Borrar un recurso por nombre | `kubectl delete deployment web` |
| Borrar pods por etiqueta | `kubectl delete pods -l app=web` |
| Borrar un namespace y todo su contenido | `kubectl delete namespace my-app` |

## Manifest mínimo: Deployment y Service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits: { memory: 256Mi }
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
```

Aplícalo con `kubectl apply -f web.yaml` y pruébalo con `kubectl port-forward svc/web 8080:80`.
