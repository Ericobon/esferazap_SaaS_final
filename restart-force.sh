#!/bin/bash
echo "🛑 Forçando parada de todos os processos Node/Vite..."

# Matar processos por nome
pkill -9 node 2>/dev/null
pkill -9 vite 2>/dev/null
pkill -9 npm 2>/dev/null

# Matar processos nas portas comuns
fuser -k 5173/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null

echo "🧹 Limpando cache do Vite..."
rm -rf node_modules/.vite

echo "🚀 Iniciando em nova porta (3000) para evitar conflitos..."
# Forçar porta 3000
npm run dev -- --port 3000 --host
