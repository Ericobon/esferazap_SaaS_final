#!/bin/bash

# ============================================
# SCRIPT DE DEPLOY - EsferaZap MVP
# Execute este script para fazer deploy completo
# ============================================

set -e

echo "🚀 DEPLOY ESFERAZAP MVP"
echo "======================="
echo ""

cd /home/ericobon/insightesfera/EsferaZap2/EsferaZap2

# PASSO 1: Autenticação
echo "📋 PASSO 1/5: Autenticação"
echo "Executando: firebase login"
firebase login

echo ""
echo "Executando: gcloud auth login"
gcloud auth login
gcloud config set project ticto-ml

echo ""
echo "✅ Autenticação concluída!"
echo ""

# PASSO 2: Deploy Security Rules
echo "📋 PASSO 2/5: Deploy Security Rules"
firebase deploy --only firestore:rules,storage:rules --project saasesfera

echo ""
echo "✅ Security Rules deployadas!"
echo ""

# PASSO 3: Deploy Cloud Function
echo "📋 PASSO 3/5: Deploy Cloud Function"
cd cloud-functions/iris-webhook
./deploy.sh

echo ""
echo "⚠️  IMPORTANTE: Copie a URL da Cloud Function que apareceu acima!"
echo ""
read -p "Cole a URL aqui: " FUNCTION_URL

cd ../..

# PASSO 4: Atualizar .env
echo ""
echo "📋 PASSO 4/5: Atualizar .env"

# Adicionar ou atualizar URL da Cloud Function no .env
if grep -q "VITE_CLOUD_FUNCTION_URL" .env; then
  sed -i "s|VITE_CLOUD_FUNCTION_URL=.*|VITE_CLOUD_FUNCTION_URL=$FUNCTION_URL|" .env
else
  echo "VITE_CLOUD_FUNCTION_URL=$FUNCTION_URL" >> .env
fi

echo "✅ .env atualizado!"
echo ""

# PASSO 5: Build e Deploy Frontend
echo "📋 PASSO 5/5: Build e Deploy Frontend"
echo "Fazendo build..."
pnpm build

echo ""
echo "Fazendo deploy..."
firebase deploy --only hosting --project saasesfera

echo ""
echo "🎉 ================================"
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "🎉 ================================"
echo ""
echo "🌐 Acesse seu MVP em: https://saasesfera.web.app"
echo ""
echo "📋 Próximos passos:"
echo "   1. Abrir https://saasesfera.web.app"
echo "   2. Criar uma conta de teste"
echo "   3. Testar o chat com IA"
echo ""
echo "📖 Guia completo: DEPLOY_FINAL.md"
echo ""
