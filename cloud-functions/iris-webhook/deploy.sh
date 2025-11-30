#!/bin/bash

echo "🚀 Deploy Cloud Function - IRIS Webhook"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "📦 Deploy para GCP..."
gcloud functions deploy iris-webhook \
  --gen2 \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point iris_webhook \
  --region us-central1 \
  --project ticto-ml \
  --timeout 60s \
  --memory 512MB \
  --set-env-vars PROJECT_ID=ticto-ml

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📋 URL da função:"
gcloud functions describe iris-webhook --gen2 --region us-central1 --project ticto-ml --format="value(serviceConfig.uri)"

echo ""
echo "💡 Próximo passo: Atualizar .env com a URL acima"
echo "   VITE_CLOUD_FUNCTION_URL=<URL_ACIMA>"
