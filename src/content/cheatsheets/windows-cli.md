---
title: 'Windows CLI'
description: 'PowerShell para el día a día en Windows: archivos, procesos, red, variables, winget, Windows Terminal, WSL y equivalencias con CMD.'
category: 'Terminal'
icon: 'mdi:powershell'
tags: ['windows', 'powershell', 'cmd', 'winget', 'wsl']
lastUpdated: 2026-11-06
isDraft: false
---

PowerShell trabaja con objetos, no con texto: puedes filtrar y ordenar por propiedades sin `grep` ni `awk`. Los alias `ls`, `cd`, `cat`, `cp`, `mv`, `rm` y `pwd` funcionan y apuntan a los cmdlets equivalentes.

## Navegación y archivos

| Acción | Comando |
| --- | --- |
| Ver la carpeta actual (`pwd`) | `Get-Location` |
| Cambiar de carpeta (`cd`) | `Set-Location C:\Projects` |
| Listar incluyendo archivos ocultos (`ls`) | `Get-ChildItem -Force` |
| Crear una carpeta | `New-Item -ItemType Directory -Path logs` |
| Crear un archivo vacío | `New-Item -ItemType File -Path notes.txt` |
| Copiar una carpeta completa (`cp -r`) | `Copy-Item -Path src -Destination backup -Recurse` |
| Mover o renombrar (`mv`) | `Move-Item -Path old.txt -Destination new.txt` |
| Borrar una carpeta sin confirmación (`rm -rf`) | `Remove-Item -Path build -Recurse -Force` |
| Leer un archivo (`cat`) | `Get-Content .\app.log` |
| Seguir las últimas líneas de un log (`tail -f`) | `Get-Content .\app.log -Tail 20 -Wait` |

## Búsqueda

| Acción | Comando |
| --- | --- |
| Buscar texto en archivos (`grep`) | `Select-String -Pattern "TODO" -Path *.ts` |
| Buscar archivos por nombre en subcarpetas (`find`) | `Get-ChildItem -Recurse -Filter *.log` |
| Buscar texto en todos los `.ts` del proyecto | `Get-ChildItem -Recurse -Filter *.ts \| Select-String "TODO"` |
| Los 10 archivos más grandes | `Get-ChildItem -Recurse -File \| Sort-Object Length -Descending \| Select-Object -First 10 FullName, Length` |
| Ubicar un ejecutable (`which`) | `Get-Command git` |
| Ver ejemplos de uso de un cmdlet | `Get-Help Get-Process -Examples` |

## Pipeline de objetos

| Acción | Comando |
| --- | --- |
| Filtrar por una propiedad | `Get-Process \| Where-Object CPU -gt 100` |
| Elegir columnas | `Get-Process \| Select-Object Name, Id, CPU` |
| Ordenar y quedarte con los primeros 5 | `Get-Process \| Sort-Object WorkingSet64 -Descending \| Select-Object -First 5` |
| Mostrar como tabla ajustada | `Get-Service \| Format-Table Name, Status -AutoSize` |
| Descubrir propiedades y métodos de un objeto | `Get-Process \| Get-Member` |
| Contar resultados | `Get-ChildItem -File \| Measure-Object` |
| Exportar a CSV | `Get-Process \| Export-Csv procs.csv -NoTypeInformation` |
| Convertir a JSON | `Get-Service \| Select-Object Name, Status \| ConvertTo-Json` |

## Procesos y servicios

| Acción | Comando |
| --- | --- |
| Listar procesos de un programa | `Get-Process -Name node` |
| Terminar todos los procesos con ese nombre | `Stop-Process -Name node` |
| Forzar la terminación por PID | `Stop-Process -Id 1234 -Force` |
| Abrir PowerShell como administrador | `Start-Process pwsh -Verb RunAs` |
| Listar servicios en ejecución | `Get-Service \| Where-Object Status -eq Running` |
| Ver el estado de un servicio | `Get-Service -Name Spooler` |
| Reiniciar un servicio (requiere admin) | `Restart-Service -Name Spooler` |
| Detener un servicio (`Start-Service` lo inicia) | `Stop-Service -Name Spooler` |

## Red

| Acción | Comando |
| --- | --- |
| Probar si un puerto remoto responde | `Test-NetConnection example.com -Port 443` |
| Hacer ping (`ping`) | `Test-Connection example.com -Count 4` |
| Ver quién escucha en un puerto | `Get-NetTCPConnection -LocalPort 8080 -State Listen` |
| Obtener el proceso que usa el puerto | `Get-Process -Id (Get-NetTCPConnection -LocalPort 8080 -State Listen).OwningProcess` |
| Alternativa clásica con CMD | `netstat -ano \| findstr :8080` |
| Ver la configuración IP completa | `ipconfig /all` |
| Limpiar la caché DNS | `ipconfig /flushdns` |
| Resolver un dominio (`dig`) | `Resolve-DnsName example.com` |
| Llamar a una API y obtener objetos | `Invoke-RestMethod https://api.github.com` |

## Variables de entorno

| Acción | Comando |
| --- | --- |
| Listar todas las variables | `Get-ChildItem Env:` |
| Ver el PATH una ruta por línea | `$env:PATH -split ';'` |
| Definir una variable solo en esta sesión | `$env:NODE_ENV = "development"` |
| Eliminar una variable de la sesión | `Remove-Item Env:NODE_ENV` |
| Guardar una variable de usuario permanente | `[Environment]::SetEnvironmentVariable("NODE_ENV", "development", "User")` |
| Alternativa permanente desde CMD o PowerShell | `setx NODE_ENV "development"` |
| Editar tu perfil de PowerShell (alias, funciones) | `notepad $PROFILE` |

Los cambios permanentes solo se ven en terminales nuevas. No uses `setx` para modificar el `PATH`: trunca los valores de más de 1024 caracteres.

## winget: instalar software

| Acción | Comando |
| --- | --- |
| Buscar un paquete | `winget search vscode` |
| Instalar por ID exacto | `winget install --id Microsoft.VisualStudioCode -e` |
| Ver detalles de un paquete | `winget show --id Git.Git` |
| Listar lo instalado | `winget list` |
| Ver actualizaciones disponibles | `winget upgrade` |
| Actualizar todo | `winget upgrade --all` |
| Desinstalar | `winget uninstall --id Git.Git` |
| Exportar tu lista de apps (`winget import` la restaura) | `winget export -o apps.json` |

## Ejecución de scripts

| Acción | Comando |
| --- | --- |
| Ver la política en cada ámbito | `Get-ExecutionPolicy -List` |
| Permitir scripts locales para tu usuario | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Desbloquear un script descargado | `Unblock-File .\setup.ps1` |
| Ejecutar un script en la carpeta actual | `.\setup.ps1` |
| Ejecutar una vez saltando la política | `pwsh -ExecutionPolicy Bypass -File .\setup.ps1` |

| Política | Descripción |
| --- | --- |
| `Restricted` | No ejecuta scripts. Valor por defecto en Windows cliente |
| `RemoteSigned` | Scripts locales sí; los descargados deben estar firmados. Recomendada |
| `AllSigned` | Solo scripts firmados por un editor de confianza |
| `Bypass` | No bloquea nada ni avisa. Solo para automatizaciones controladas |

## Atajos de Windows Terminal

| Acción | Atajo |
| --- | --- |
| Nueva pestaña con el perfil por defecto | `Ctrl + Shift + t` |
| Nueva pestaña con el perfil N | `Ctrl + Shift + 1` |
| Cambiar a la pestaña siguiente / anterior | `Ctrl + Tab` / `Ctrl + Shift + Tab` |
| Dividir panel duplicando el perfil | `Alt + Shift + d` |
| Dividir a la derecha / hacia abajo | `Alt + Shift + Plus` / `Alt + Shift + Minus` |
| Mover el foco entre paneles | `Alt + ←` / `Alt + →` |
| Cerrar el panel actual | `Ctrl + Shift + w` |
| Paleta de comandos | `Ctrl + Shift + p` |
| Buscar en la salida | `Ctrl + Shift + f` |
| Abrir la configuración | `Ctrl + ,` |

## WSL básico

| Acción | Comando |
| --- | --- |
| Instalar WSL con Ubuntu (como admin) | `wsl --install` |
| Ver distribuciones disponibles para instalar | `wsl --list --online` |
| Instalar una distribución concreta | `wsl --install -d Debian` |
| Listar distros instaladas con su versión | `wsl -l -v` |
| Entrar a una distro concreta | `wsl -d Ubuntu` |
| Apagar todas las distros (libera memoria) | `wsl --shutdown` |
| Actualizar el kernel de WSL | `wsl --update` |
| Abrir la carpeta actual de Linux en el Explorador | `explorer.exe .` |

## Equivalencias CMD y PowerShell

| CMD | PowerShell |
| --- | --- |
| `dir` | `Get-ChildItem` (alias `ls`, `dir`) |
| `cd` | `Set-Location` (alias `cd`) |
| `copy` / `xcopy` | `Copy-Item` (con `-Recurse` para carpetas) |
| `move` | `Move-Item` |
| `del` / `rmdir /s` | `Remove-Item` (con `-Recurse` para carpetas) |
| `type` | `Get-Content` (alias `cat`) |
| `findstr` | `Select-String` |
| `tasklist` / `taskkill` | `Get-Process` / `Stop-Process` |
| `set VAR=valor` | `$env:VAR = "valor"` |
| `where` | `Get-Command` |
