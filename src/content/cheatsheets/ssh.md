---
title: 'SSH y SCP'
description: 'Claves ed25519, alias en ~/.ssh/config, agente, túneles, saltos por bastión, copia de archivos con scp y rsync, y depuración.'
category: 'Terminal'
icon: 'mdi:ssh'
tags: ['ssh', 'scp', 'rsync', 'tuneles', 'seguridad']
lastUpdated: 2026-11-06
isDraft: false
---

Conéctate a servidores sin contraseñas y con alias cortos. Nunca compartas tu clave privada (`id_ed25519`); solo la pública (`id_ed25519.pub`) va a los servidores.

## Claves

| Acción | Comando |
| --- | --- |
| Generar una clave ed25519 (pide passphrase) | `ssh-keygen -t ed25519 -C "tu@correo.com"` |
| Generar una clave con nombre propio | `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_work -C "tu@empresa.com"` |
| Ver la clave pública para copiarla | `cat ~/.ssh/id_ed25519.pub` |
| Ver la huella (fingerprint) de una clave | `ssh-keygen -lf ~/.ssh/id_ed25519.pub` |
| Cambiar la passphrase de una clave | `ssh-keygen -p -f ~/.ssh/id_ed25519` |

## Copiar la clave y conectar

| Acción | Comando |
| --- | --- |
| Instalar tu clave pública en el servidor | `ssh-copy-id user@server.example.com` |
| Instalar una clave concreta | `ssh-copy-id -i ~/.ssh/id_ed25519_work.pub user@server.example.com` |
| Conectar | `ssh user@server.example.com` |
| Conectar a otro puerto | `ssh -p 2222 user@server.example.com` |
| Conectar con una clave concreta | `ssh -i ~/.ssh/id_ed25519_work user@server.example.com` |
| Ejecutar un comando remoto y volver | `ssh user@server.example.com 'df -h'` |
| Ejecutar un programa interactivo remoto | `ssh -t user@server.example.com htop` |

## Alias en ~/.ssh/config

Con este archivo basta con escribir `ssh prod` en lugar de usuario, host, puerto y clave.

```bash
Host prod
    HostName 203.0.113.10
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes

Host *
    AddKeysToAgent yes
    ServerAliveInterval 60
```

| Acción | Comando |
| --- | --- |
| Conectar usando el alias | `ssh prod` |
| Ver la configuración efectiva de un alias | `ssh -G prod` |

## Agente SSH

El agente guarda tus claves desbloqueadas para no escribir la passphrase en cada conexión.

| Acción | Comando |
| --- | --- |
| Iniciar el agente en la sesión actual | `eval "$(ssh-agent -s)"` |
| Añadir una clave al agente | `ssh-add ~/.ssh/id_ed25519` |
| Añadir una clave que caduca en 1 hora | `ssh-add -t 3600 ~/.ssh/id_ed25519` |
| Listar las claves cargadas | `ssh-add -l` |
| Quitar todas las claves del agente | `ssh-add -D` |

## Túneles

| Acción | Comando |
| --- | --- |
| Abrir en `localhost:8080` un puerto web del servidor | `ssh -L 8080:localhost:80 prod` |
| Llegar a una base de datos interna a través del servidor | `ssh -N -L 5433:db.internal:5432 prod` |
| Exponer tu puerto local 3000 en el servidor | `ssh -N -R 9000:localhost:3000 prod` |
| Proxy SOCKS en `localhost:1080` | `ssh -N -D 1080 prod` |
| Túnel en segundo plano | `ssh -f -N -L 5433:db.internal:5432 prod` |

| Flag | Significado |
| --- | --- |
| `-L local:destino:puerto` | Reenvío local: tu puerto lleva al destino visto desde el servidor |
| `-R remoto:destino:puerto` | Reenvío remoto: un puerto del servidor lleva a tu equipo |
| `-D puerto` | Proxy SOCKS dinámico |
| `-N` | No abre shell, solo mantiene el túnel |
| `-f` | Pasa a segundo plano tras autenticar |

## Saltos por bastión

| Acción | Comando |
| --- | --- |
| Conectar a un host interno pasando por un bastión | `ssh -J user@bastion.example.com user@10.0.1.20` |
| Encadenar varios saltos | `ssh -J bastion1,bastion2 user@10.0.1.20` |

O déjalo fijo en `~/.ssh/config`:

```bash
Host bastion
    HostName bastion.example.com
    User ec2-user

Host app-internal
    HostName 10.0.1.20
    User deploy
    ProxyJump bastion
```

## Copiar archivos (scp y rsync)

| Acción | Comando |
| --- | --- |
| Subir un archivo | `scp app.tar.gz prod:/tmp/` |
| Descargar un archivo | `scp prod:/var/log/app.log .` |
| Copiar una carpeta completa | `scp -r dist/ prod:/var/www/app/` |
| Usar otro puerto (ojo: `-P` mayúscula) | `scp -P 2222 app.tar.gz user@server.example.com:/tmp/` |
| Sincronizar con compresión y progreso | `rsync -avz --progress dist/ prod:/var/www/app/` |
| Simular sin copiar nada | `rsync -avzn --delete dist/ prod:/var/www/app/` |
| Espejo exacto (borra en destino lo que sobra) | `rsync -avz --delete dist/ prod:/var/www/app/` |
| rsync por un puerto distinto | `rsync -avz -e "ssh -p 2222" dist/ user@server.example.com:/var/www/app/` |

En rsync, `dist/` copia el contenido de la carpeta y `dist` copia la carpeta misma.

## Permisos correctos de ~/.ssh

SSH ignora claves y archivos con permisos demasiado abiertos.

| Acción | Comando |
| --- | --- |
| Carpeta solo para ti | `chmod 700 ~/.ssh` |
| Clave privada | `chmod 600 ~/.ssh/id_ed25519` |
| Clave pública | `chmod 644 ~/.ssh/id_ed25519.pub` |
| Configuración y claves autorizadas | `chmod 600 ~/.ssh/config ~/.ssh/authorized_keys` |

## known_hosts

| Acción | Comando |
| --- | --- |
| Borrar la huella vieja de un host reinstalado | `ssh-keygen -R server.example.com` |
| Buscar si un host ya está registrado | `ssh-keygen -F server.example.com` |
| Registrar la clave del host antes de conectar | `ssh-keyscan -t ed25519 server.example.com >> ~/.ssh/known_hosts` |
| Aceptar hosts nuevos pero rechazar cambios | `ssh -o StrictHostKeyChecking=accept-new prod` |

Si aparece `REMOTE HOST IDENTIFICATION HAS CHANGED`, confirma con el administrador antes de borrar la huella: puede ser un ataque.

## Depuración

| Acción | Comando |
| --- | --- |
| Ver qué claves y pasos intenta SSH | `ssh -v prod` |
| Máximo detalle | `ssh -vvv prod` |
| Probar tu clave con GitHub | `ssh -T git@github.com` |
| Validar la configuración del servidor (en el servidor) | `sudo sshd -t` |
| Ver los logs del servidor SSH (Debian y Ubuntu) | `sudo journalctl -u ssh -f` |
| Ver los logs del servidor SSH (Fedora y RHEL) | `sudo journalctl -u sshd -f` |
