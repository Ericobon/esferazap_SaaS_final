#!/bin/bash

# ============================================
# Script: Criar estrutura GCS para tenant
# ============================================

set -e

# Configurações
PROJECT_ID="silent-text-458716-c9"
BUCKET_NAME="chatbot-iris-platform"
TENANT_ID="insightesfera"

echo "🚀 Configurando GCP..."
gcloud config set project $PROJECT_ID

echo ""
echo "📁 Criando estrutura de pastas no GCS..."

# Criar estrutura de diretórios
DIRS=(
  "tenants/$TENANT_ID/config"
  "tenants/$TENANT_ID/knowledge"
  "tenants/$TENANT_ID/knowledge/datasets/pt-BR/v1"
  "tenants/$TENANT_ID/knowledge/normalized/pt-BR"
  "tenants/$TENANT_ID/logs"
  "tenants/$TENANT_ID/prompts/pt-BR/v1/system"
  "tenants/$TENANT_ID/rag"
  "tenants/$TENANT_ID/recordings"
  "tenants/$TENANT_ID/workflows"
)

for dir in "${DIRS[@]}"; do
  echo "  ✓ Criando: gs://$BUCKET_NAME/$dir/"
  # Criar arquivo placeholder para forçar criação do diretório
  echo "" | gsutil cp - "gs://$BUCKET_NAME/$dir/.keep"
done

echo ""
echo "✅ Estrutura de pastas criada com sucesso!"
echo ""
echo "📂 Estrutura criada:"
echo "gs://$BUCKET_NAME/"
echo "└── tenants/"
echo "    └── $TENANT_ID/"
echo "        ├── config/"
echo "        ├── knowledge/"
echo "        │   ├── datasets/pt-BR/v1/"
echo "        │   └── normalized/pt-BR/"
echo "        ├── logs/"
echo "        ├── prompts/pt-BR/v1/system/"
echo "        ├── rag/"
echo "        ├── recordings/"
echo "        └── workflows/"
echo ""
echo "🎯 Próximo passo: Executar setup-tenant-config.sh"
