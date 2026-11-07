@echo off
setlocal enabledelayedexpansion

echo.
echo =================================================================
echo  Configurando Git para el proyecto...
echo =================================================================

REM Obtener raiz del repositorio
for /f "tokens=*" %%i in ('git rev-parse --show-toplevel 2^>nul') do set REPO_ROOT=%%i
if errorlevel 1 (
    echo [ERROR] Este script debe ejecutarse dentro de un repositorio Git
    pause & exit /b 1
)

echo [INFO] Repositorio: %REPO_ROOT%
echo.

REM ── 1. Template de commit ─────────────────────────────────────────
set TEMPLATE_PATH=%REPO_ROOT%\.gitmessage
if not exist "%TEMPLATE_PATH%" (
    echo [ERROR] No se encontro .gitmessage en la raiz del proyecto
    pause & exit /b 1
)

echo [1/3] Configurando template de commits...
git config commit.template "%TEMPLATE_PATH%"
if errorlevel 1 ( echo [ERROR] Fallo al configurar template & pause & exit /b 1 )
echo [OK] Template configurado: .gitmessage

REM ── 2. Hooks ──────────────────────────────────────────────────────
set HOOKS_DIR=%REPO_ROOT%\.githooks
if not exist "%HOOKS_DIR%" (
    echo [ERROR] No se encontro la carpeta .githooks\
    pause & exit /b 1
)

echo [2/3] Configurando hooks...
git config core.hooksPath .githooks
if errorlevel 1 ( echo [ERROR] Fallo al configurar hooksPath & pause & exit /b 1 )

for %%H in (pre-commit commit-msg pre-push prepare-commit-msg post-merge) do (
    if exist "%HOOKS_DIR%\%%H" (
        echo    [OK] %%H
    ) else (
        echo    [AVISO] %%H no encontrado, se omite
    )
)

REM ── 3. Configuraciones globales ───────────────────────────────────
echo [3/3] Aplicando configuraciones globales...

git config --global pull.ff only 
echo    [OK] pull.ff = only 

git config --global push.default simple
echo    [OK] push.default = simple

git config --global merge.ff false
echo    [OK] merge.ff = false

git config --global rerere.enabled true
echo    [OK] rerere.enabled = true

git config --global init.defaultBranch main
echo    [OK] init.defaultBranch = main

git config --global core.autocrlf true
echo    [OK] core.autocrlf = true (Windows)

REM ── Resumen ───────────────────────────────────────────────────────
echo.
echo =================================================================
echo  Configuracion completada!
echo =================================================================
echo.
echo  COMO USAR:
echo    git commit           Abre editor con template
echo    git commit -m "..."  Commit rapido (se valida el formato)
echo.
echo  TIPS:
echo    * El hook commit-msg valida: tipo(alcance): descripcion
echo    * El hook pre-commit bloquea commits en main/develop/staging
echo    * El hook pre-push bloquea push directo a ramas protegidas
echo.
pause