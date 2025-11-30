#!/bin/bash
echo "🚀 Iniciando EsferaZap Premium Interface..."

# Matar processos antigos
pkill -f "vite" 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

# Limpar cache
rm -rf node_modules/.vite

# Iniciar na porta 3000
echo "✨ Servidor iniciando em http://localhost:3000"
npm run dev -- --port 3000 --host
