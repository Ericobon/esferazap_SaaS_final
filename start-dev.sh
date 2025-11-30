#!/bin/bash
# Script para iniciar o servidor de desenvolvimento do EsferaZap2

echo "🚀 Iniciando EsferaZap2..."

# Matar processos na porta 5173
echo "🔄 Liberando porta 5173..."
fuser -k 5173/tcp 2>/dev/null || lsof -ti:5173 | xargs -r kill -9 2>/dev/null

# Matar processos antigos do node/vite
pkill -f "vite" 2>/dev/null || true

# Navegar para o diretório correto
cd ~/insightesfera/EsferaZap2/EsferaZap2

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
fi

# Iniciar servidor
echo "✨ Iniciando servidor de desenvolvimento..."
npm run dev
