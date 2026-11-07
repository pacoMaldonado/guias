---
title: 'Linux'
description: 'Administración diaria de Linux: archivos, permisos, usuarios, procesos, systemd, disco, red, paquetes, compresión y cron.'
category: 'Terminal'
icon: 'mdi:linux'
tags: ['linux', 'sysadmin', 'permisos', 'systemd', 'redes']
lastUpdated: 2026-11-06
isDraft: false
---

Comandos para administrar un servidor o tu equipo Linux. Los que modifican el sistema necesitan `sudo`; para atajos de shell y productividad consulta la hoja de Bash y Zsh.

## Archivos y directorios

| Acción | Comando |
| --- | --- |
| Crear una ruta de carpetas completa | `mkdir -p app/logs/2026` |
| Copiar una carpeta con todo su contenido | `cp -r src/ backup/` |
| Mover o renombrar un archivo | `mv old-name.txt new-name.txt` |
| Borrar una carpeta y su contenido (sin papelera) | `rm -rf build/` |
| Crear un enlace simbólico | `ln -s /opt/app/current app` |
| Ver metadatos (tamaño, fechas, permisos) | `stat config.yaml` |
| Detectar el tipo real de un archivo | `file archive.bin` |
| Leer un archivo largo con paginación | `less /var/log/syslog` |

## Permisos y propietarios

| Acción | Comando |
| --- | --- |
| Asignar permisos en notación octal | `chmod 755 deploy.sh` |
| Dar permiso de ejecución al dueño | `chmod u+x deploy.sh` |
| Dar escritura al grupo de forma recursiva | `chmod -R g+w shared/` |
| Cambiar dueño y grupo | `sudo chown www-data:www-data index.html` |
| Cambiar dueño de forma recursiva | `sudo chown -R $USER:$USER /opt/app` |
| Ver la máscara de permisos por defecto | `umask` |

### Notación octal

Cada dígito es la suma de `r` = 4, `w` = 2 y `x` = 1, en orden: dueño, grupo y otros.

| Valor | Significado |
| --- | --- |
| `7` | `rwx`: leer, escribir y ejecutar |
| `6` | `rw-`: leer y escribir |
| `5` | `r-x`: leer y ejecutar |
| `4` | `r--`: solo lectura |
| `755` | Scripts y carpetas: el dueño todo, el resto lee y entra |
| `644` | Archivos normales: el dueño escribe, el resto lee |
| `600` | Privado: solo el dueño lee y escribe (claves, `.env`) |
| `700` | Carpeta privada: solo el dueño accede |

## Usuarios, grupos y sudo

| Acción | Comando |
| --- | --- |
| Ver tu usuario, UID y grupos | `id` |
| Crear un usuario con carpeta personal y Bash | `sudo useradd -m -s /bin/bash deploy` |
| Asignar o cambiar la contraseña de un usuario | `sudo passwd deploy` |
| Añadir un usuario a un grupo (sin quitarle otros) | `sudo usermod -aG docker $USER` |
| Aplicar el grupo nuevo sin cerrar sesión | `newgrp docker` |
| Abrir una shell de root | `sudo -i` |
| Cambiar a otro usuario con su entorno | `sudo su - deploy` |
| Editar la configuración de sudo de forma segura | `sudo visudo` |

## Procesos

| Acción | Comando |
| --- | --- |
| Top 10 de procesos por CPU | `ps aux --sort=-%cpu \| head -n 11` |
| Buscar procesos por nombre con su comando | `pgrep -a node` |
| Monitor interactivo de procesos | `htop` |
| Terminar un proceso de forma ordenada (`SIGTERM`) | `kill 1234` |
| Forzar la terminación (`SIGKILL`) | `kill -9 1234` |
| Terminar procesos por patrón del comando | `pkill -f "node server.js"` |
| Lanzar un proceso con menor prioridad | `nice -n 10 ./backup.sh` |
| Cambiar la prioridad de un proceso en marcha | `sudo renice -n 5 -p 1234` |
| Ejecutar algo que sobreviva al cerrar la sesión | `nohup ./worker.sh > worker.log 2>&1 &` |

### Señales frecuentes

| Señal | Significado |
| --- | --- |
| `SIGTERM` (15) | Pide terminar; el proceso puede limpiar. Es la de `kill` por defecto |
| `SIGKILL` (9) | Termina de inmediato; no se puede capturar. Último recurso |
| `SIGINT` (2) | Interrupción, la que envía `Ctrl + c` |
| `SIGHUP` (1) | Muchos demonios la usan para recargar su configuración |

## Servicios con systemd

| Acción | Comando |
| --- | --- |
| Ver estado y últimas líneas de log | `systemctl status nginx` |
| Iniciar, detener o reiniciar | `sudo systemctl restart nginx` |
| Recargar la configuración sin cortar conexiones | `sudo systemctl reload nginx` |
| Habilitar al arranque e iniciar ya | `sudo systemctl enable --now nginx` |
| Deshabilitar al arranque | `sudo systemctl disable nginx` |
| Listar servicios en ejecución | `systemctl list-units --type=service --state=running` |
| Ver servicios que fallaron | `systemctl --failed` |
| Releer archivos de unidad tras editarlos | `sudo systemctl daemon-reload` |

## Logs con journalctl

| Acción | Comando |
| --- | --- |
| Seguir los logs de un servicio en vivo | `journalctl -u nginx -f` |
| Logs de un servicio en la última hora | `journalctl -u nginx --since "1 hour ago"` |
| Últimas 50 líneas del sistema | `journalctl -n 50` |
| Solo errores desde el último arranque | `journalctl -b -p err` |
| Mensajes del kernel | `journalctl -k` |
| Ver cuánto disco ocupan los logs | `journalctl --disk-usage` |
| Borrar logs con más de 7 días | `sudo journalctl --vacuum-time=7d` |

## Disco y memoria

| Acción | Comando |
| --- | --- |
| Espacio libre por sistema de archivos | `df -h` |
| Inodos disponibles (disco "lleno" con espacio libre) | `df -i` |
| Tamaño total de una carpeta | `sudo du -sh /var/log` |
| Subcarpetas ordenadas por tamaño | `sudo du -h --max-depth=1 /var \| sort -h` |
| Memoria RAM y swap | `free -h` |
| Discos y particiones en árbol | `lsblk` |
| Particiones con sistema de archivos y UUID | `lsblk -f` |
| Montar una partición | `sudo mount /dev/sdb1 /mnt` |

## Red

| Acción | Comando |
| --- | --- |
| Ver interfaces y direcciones IP | `ip a` |
| Ver la tabla de rutas | `ip r` |
| Puertos en escucha con su proceso | `sudo ss -tulpn` |
| Probar conectividad (4 paquetes) | `ping -c 4 example.com` |
| Ver solo las cabeceras de una respuesta HTTP | `curl -I https://example.com` |
| Descargar un archivo siguiendo redirecciones | `curl -fsSL https://example.com/install.sh -o install.sh` |
| Resolver un dominio (solo la IP) | `dig +short example.com` |
| Consultar registros MX de un dominio | `dig MX example.com` |

## Paquetes (apt y dnf)

### Debian y Ubuntu (apt)

| Acción | Comando |
| --- | --- |
| Actualizar el índice de paquetes | `sudo apt update` |
| Actualizar los paquetes instalados | `sudo apt upgrade` |
| Instalar un paquete | `sudo apt install -y htop` |
| Desinstalar y limpiar dependencias huérfanas | `sudo apt remove htop && sudo apt autoremove` |
| Buscar un paquete | `apt search htop` |
| Ver detalles de un paquete | `apt show htop` |

### Fedora y RHEL (dnf)

| Acción | Comando |
| --- | --- |
| Actualizar todo el sistema | `sudo dnf upgrade` |
| Instalar un paquete | `sudo dnf install -y htop` |
| Desinstalar un paquete | `sudo dnf remove htop` |
| Buscar un paquete | `dnf search htop` |
| Saber qué paquete provee un comando | `dnf provides /usr/bin/dig` |

## Compresión

| Acción | Comando |
| --- | --- |
| Crear un `.tar.gz` de una carpeta | `tar -czvf backup.tar.gz app/` |
| Extraer un `.tar.gz` | `tar -xzvf backup.tar.gz` |
| Extraer en una carpeta concreta | `tar -xzvf backup.tar.gz -C /opt/restore` |
| Listar el contenido sin extraer | `tar -tzvf backup.tar.gz` |
| Crear un `.tar.xz` (más compresión) | `tar -cJvf backup.tar.xz app/` |
| Crear un `.zip` de una carpeta | `zip -r app.zip app/` |
| Extraer un `.zip` en una carpeta | `unzip app.zip -d app/` |

## Variables de entorno y PATH

| Acción | Comando |
| --- | --- |
| Listar todas las variables de entorno | `printenv` |
| Ver el PATH una ruta por línea | `echo $PATH \| tr ':' '\n'` |
| Definir una variable para la sesión y sus hijos | `export APP_ENV=production` |
| Añadir una carpeta al inicio del PATH | `export PATH="$HOME/.local/bin:$PATH"` |
| Eliminar una variable | `unset APP_ENV` |
| Saber qué ejecutable se usará | `command -v python3` |
| Variables globales para todos los usuarios | `sudo nano /etc/environment` |

## Cron

| Acción | Comando |
| --- | --- |
| Editar las tareas de tu usuario | `crontab -e` |
| Listar tus tareas | `crontab -l` |
| Listar las tareas de otro usuario | `sudo crontab -u deploy -l` |

Formato: minuto, hora, día del mes, mes, día de la semana y comando. Cron usa la zona horaria del sistema (en servidores suele ser UTC).

```bash
# m  h  dom mon dow  command
*/5  *  *   *   *    /opt/app/healthcheck.sh
0    3  *   *   *    /opt/app/backup.sh >> /var/log/backup.log 2>&1
30   8  *   *   1-5  /opt/app/report.sh
@reboot              /opt/app/start.sh
```
