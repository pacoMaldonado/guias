#!/bin/bash

# 🚀 Script de configuración Git para el equipo
# Autor: Francisco Javier Maldonado Hernández (Team Leader)

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🚀 Configurando Git para el proyecto..."
echo "═══════════════════════════════════════════════════════════════════"

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Error: Este script debe ejecutarse dentro de un repositorio Git${NC}"
  exit 1
fi

echo "📁 Repositorio: $(basename "$REPO_ROOT")"
echo ""

# ── 1. Template de commit ────────────────────────────────────────────
TEMPLATE_PATH="$REPO_ROOT/.gitmessage"
if [ ! -f "$TEMPLATE_PATH" ]; then
  echo -e "${RED}❌ Error: No se encontró .gitmessage en la raíz del proyecto${NC}"
  exit 1
fi

echo "⚙️  [1/3] Configurando template de commits..."
git config commit.template "$TEMPLATE_PATH"
echo -e "${GREEN}✅ Template configurado: .gitmessage${NC}"

# ── 2. Hooks ─────────────────────────────────────────────────────────
HOOKS_DIR="$REPO_ROOT/.githooks"
if [ ! -d "$HOOKS_DIR" ]; then
  echo -e "${RED}❌ Error: No se encontró la carpeta .githooks/${NC}"
  exit 1
fi

echo "⚙️  [2/3] Configurando hooks..."
git config core.hooksPath .githooks

HOOKS=(pre-commit commit-msg pre-push prepare-commit-msg post-merge)
for HOOK in "${HOOKS[@]}"; do
  HOOK_FILE="$HOOKS_DIR/$HOOK"
  if [ -f "$HOOK_FILE" ]; then
    chmod +x "$HOOK_FILE"
    echo -e "   ${GREEN}✅ $HOOK${NC}"
  else
    echo -e "   ${YELLOW}⚠️  $HOOK (no encontrado, se omite)${NC}"
  fi
done

# ── 3. Configuraciones globales ──────────────────────────────────────
echo "⚙️  [3/3] Aplicando configuraciones globales..."


git config --global pull.ff only 
echo -e "   ${GREEN}✅ pull.ff = only ${NC}      (Solo si es posible el fast-forward).  "


git config --global push.default simple
echo -e "   ${GREEN}✅ push.default = simple${NC}      (solo sube la rama actual)"

git config --global merge.ff false
echo -e "   ${GREEN}✅ merge.ff = false${NC}           (siempre crea commit de merge)"

git config --global rerere.enabled true
echo -e "   ${GREEN}✅ rerere.enabled = true${NC}      (memoriza resolución de conflictos)"

git config --global init.defaultBranch main
echo -e "   ${GREEN}✅ init.defaultBranch = main${NC}  (rama por defecto)"

# Saltos de línea según OS
OS=$(uname -s)
if [[ "$OS" == "Linux" || "$OS" == "Darwin" ]]; then
  git config --global core.autocrlf input
  echo -e "   ${GREEN}✅ core.autocrlf = input${NC}      (Linux/Mac)"
else
  git config --global core.autocrlf true
  echo -e "   ${GREEN}✅ core.autocrlf = true${NC}       (Windows/Git Bash)"
fi

# ── Resumen ──────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📋 CÓMO USAR:"
echo -e "   ${BLUE}git commit${NC}              → Abre editor con template"
echo -e "   ${BLUE}git commit -m \"...\"${NC}      → Commit rápido (se valida el formato)"
echo ""
echo "💡 TIPS:"
echo "   • El hook commit-msg valida: tipo(alcance): descripción"
echo "   • El hook pre-commit bloquea commits en main/develop/staging"
echo "   • El hook pre-push bloquea push directo a ramas protegidas"
echo ""
echo -e "📚 Ver template:  ${YELLOW}cat .gitmessage${NC}"
echo ""