#!/bin/bash

# ============================================
# Deploy EsferaZap para Firebase Hosting
# ============================================

set -e

echo "🚀 Deploy do EsferaZap para Firebase Hosting"
echo ""

# 1. Build do projeto
echo "📦 Fazendo build do projeto..."
cd /home/ericobon/insightesfera/EsferaZap2/EsferaZap2
pnpm build

echo ""
echo "✅ Build concluído! Arquivos em ./dist"
echo ""

# 2. Inicializar Firebase (se ainda não tiver)
if [ ! -f "firebase.json" ]; then
  echo "🔧 Inicializando Firebase..."

  # Criar firebase.json
  cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
EOF

  echo "✅ firebase.json criado!"
fi

# 3. Deploy para Firebase
echo "🚀 Fazendo deploy para Firebase..."
echo ""

# Verificar se firebase-tools está instalado
if ! command -v firebase &> /dev/null; then
  echo "📥 Instalando firebase-tools..."
  pnpm add -g firebase-tools
fi

# Fazer login se necessário
firebase login --no-localhost

# Selecionar projeto
firebase use saasesfera

# Deploy
firebase deploy --only hosting

echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "🌐 Sua aplicação está disponível em:"
echo "   https://saasesfera.web.app"
echo "   ou"
echo "   https://saasesfera.firebaseapp.com"
echo ""
echo "💡 Para configurar domínio customizado:"
echo "   firebase hosting:channel:deploy production"
echo ""
