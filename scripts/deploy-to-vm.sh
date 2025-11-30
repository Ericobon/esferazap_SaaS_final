#!/bin/bash

# ============================================
# Deploy EsferaZap para VM GCP
# ============================================

set -e

VM_NAME="saas-chatbot"
ZONE="us-central1-c"
VM_IP="35.208.24.59"

echo "🚀 Deploy do EsferaZap para VM: $VM_NAME"
echo "📍 IP: $VM_IP"
echo ""

# 1. Build do projeto
echo "📦 Fazendo build do projeto..."
cd /home/ericobon/insightesfera/EsferaZap2/EsferaZap2
pnpm build

echo ""
echo "✅ Build concluído! Arquivos em ./dist"
echo ""

# 2. Conectar na VM e preparar ambiente
echo "🔧 Preparando VM..."

gcloud compute ssh $VM_NAME --zone=$ZONE --command="
  # Instalar nginx se não tiver
  if ! command -v nginx &> /dev/null; then
    echo '📥 Instalando nginx...'
    sudo apt update
    sudo apt install -y nginx
  fi

  # Criar diretório para o app
  sudo mkdir -p /var/www/esferazap
  sudo chown -R \$USER:\$USER /var/www/esferazap
"

echo ""
echo "✅ VM preparada!"
echo ""

# 3. Copiar arquivos do build
echo "📤 Copiando arquivos para VM..."
gcloud compute scp --recurse ./dist/* $VM_NAME:/var/www/esferazap --zone=$ZONE

echo ""
echo "✅ Arquivos copiados!"
echo ""

# 4. Configurar nginx
echo "⚙️ Configurando nginx..."

gcloud compute ssh $VM_NAME --zone=$ZONE --command="
  # Criar arquivo de configuração nginx
  sudo tee /etc/nginx/sites-available/esferazap > /dev/null << 'EOF'
server {
    listen 80;
    server_name $VM_IP esferazap.insightesfera.io;

    root /var/www/esferazap;
    index index.html;

    # Logs
    access_log /var/log/nginx/esferazap-access.log;
    error_log /var/log/nginx/esferazap-error.log;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # SPA - todas as rotas vão para index.html
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # Cache de assets
    location ~* \\.(?:ico|css|js|gif|jpe?g|png|woff2?|ttf|svg|eot)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # Sem cache para index.html
    location = /index.html {
        add_header Cache-Control \"no-cache, no-store, must-revalidate\";
    }
}
EOF

  # Ativar site
  sudo ln -sf /etc/nginx/sites-available/esferazap /etc/nginx/sites-enabled/esferazap

  # Remover default se existir
  sudo rm -f /etc/nginx/sites-enabled/default

  # Testar configuração
  sudo nginx -t

  # Recarregar nginx
  sudo systemctl reload nginx
  sudo systemctl enable nginx
"

echo ""
echo "✅ Nginx configurado!"
echo ""

# 5. Configurar firewall
echo "🔥 Configurando firewall..."

# Verificar se regra já existe
if ! gcloud compute firewall-rules describe allow-http &> /dev/null; then
  gcloud compute firewall-rules create allow-http \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:80 \
    --source-ranges=0.0.0.0/0
  echo "✅ Regra de firewall criada!"
else
  echo "✅ Regra de firewall já existe!"
fi

echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "🌐 Acessar aplicação:"
echo "   http://$VM_IP"
echo ""
echo "📊 Verificar logs nginx:"
echo "   gcloud compute ssh $VM_NAME --zone=$ZONE --command='sudo tail -f /var/log/nginx/esferazap-access.log'"
echo ""
echo "🔄 Para fazer novo deploy, execute este script novamente!"
echo ""
