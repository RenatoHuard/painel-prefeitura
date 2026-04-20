#!/bin/bash
# =============================================================
# Script de configuração do repositório Git
# Execute: bash setup.sh
# =============================================================

set -e

echo ""
echo "=================================================="
echo "  Painel Prefeitura — Configuração do Repositório"
echo "=================================================="
echo ""

# Verifica se git está instalado
if ! command -v git &> /dev/null; then
  echo "❌ Git não encontrado. Instale em: https://git-scm.com"
  exit 1
fi

# Configura identidade git se não estiver configurada
GIT_NAME=$(git config --global user.name 2>/dev/null || echo "")
GIT_EMAIL=$(git config --global user.email 2>/dev/null || echo "")

if [ -z "$GIT_NAME" ]; then
  read -p "Seu nome para o Git: " GIT_NAME
  git config --global user.name "$GIT_NAME"
fi

if [ -z "$GIT_EMAIL" ]; then
  read -p "Seu e-mail para o Git: " GIT_EMAIL
  git config --global user.email "$GIT_EMAIL"
fi

echo "✅ Git configurado como: $GIT_NAME <$GIT_EMAIL>"
echo ""

# Init repo
if [ ! -d ".git" ]; then
  git init
  echo "✅ Repositório Git inicializado"
else
  echo "ℹ️  Repositório Git já existe"
fi

# Primeiro commit
git add .
git commit -m "feat: projeto completo - painel acompanhamento crianças

- Backend: Fastify + Prisma + PostgreSQL
- Frontend: Next.js 14 + shadcn/ui + dark mode
- Docker Compose: sobe tudo com docker compose up
- 25 crianças seed com casos-limite cobertos
- Auth JWT, filtros, paginação, revisão de casos
- Gráficos: alertas por área e por bairro
- Responsivo 375px-1440px
- Acessibilidade: ARIA labels, navegação por teclado"

echo ""
echo "✅ Commit inicial criado"
echo ""
echo "=================================================="
echo "  Próximo passo: criar repositório no GitHub"
echo "=================================================="
echo ""
echo "1. Acesse https://github.com/new"
echo "2. Crie um repositório PÚBLICO com o nome: painel-prefeitura"
echo "3. NÃO inicialize com README (já temos)"
echo "4. Copie a URL do repositório (ex: https://github.com/SEU_USUARIO/painel-prefeitura.git)"
echo ""
read -p "Cole a URL do repositório GitHub aqui: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ URL não fornecida. Execute manualmente:"
  echo "   git remote add origin <URL>"
  echo "   git branch -M main"
  echo "   git push -u origin main"
  exit 0
fi

git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
git branch -M main
git push -u origin main

echo ""
echo "🎉 Repositório publicado com sucesso!"
echo "🔗 URL: $REPO_URL"
echo ""
echo "Para subir o projeto localmente:"
echo "  docker compose up --build"
echo ""
echo "Acesse: http://localhost:3000"
echo "Login:  tecnico@prefeitura.rio / painel@2024"
