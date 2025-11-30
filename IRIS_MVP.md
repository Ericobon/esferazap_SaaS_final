# 🤖 IRIS MVP - Agente Conversacional WhatsApp

**Data:** 2025-10-17
**Versão:** 1.0 - MVP Básico
**Status:** Planejamento

---

## ⚡ Quick Start

**Infraestrutura Disponível:**
- ✅ VPS GCP: `saas-chatbot` | IP: `35.208.24.59` | Zone: `us-central1-c`
- ✅ Bucket GCS: `chatbot-iris-platform` (estrutura multi-tenant pronta)
- ✅ Projeto: `silent-text-458716-c9`
- ⏳ Evolution API: A configurar no VPS
- ⏳ Cloud Function: A fazer deploy

**Tempo Estimado:** 4-6 horas
**Custo Mensal:** ~R$ 72/mês (1.000 msgs/dia)

---

## 📋 Visão Geral

IRIS é um agente conversacional inteligente que opera no WhatsApp através da Evolution API (hospedada no VPS `saas-chatbot` com IP fixo 35.208.24.59), com conhecimento base armazenado no Google Cloud Storage (GCS) e processamento via Cloud Functions.

### Objetivos do MVP

✅ **Responder mensagens de texto** no WhatsApp automaticamente
✅ **Buscar conhecimento** na base de dados (RAG simples)
✅ **Processar via Cloud Functions** (serverless)
✅ **Armazenar no GCS** (configurações, conhecimento, logs)
✅ **Usar Evolution API** para integração WhatsApp

❌ **NÃO incluído no MVP:**
- Áudio (STT/TTS)
- Multi-idioma (só PT-BR)
- Interface web complexa
- Pagamentos/Leads
- Analytics avançado

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   WhatsApp      │
│   (Usuário)     │
└────────┬────────┘
         │
         ▼
┌───────────────────────────────────┐
│  VPS GCP: saas-chatbot            │
│  IP: 35.208.24.59                 │
│  Zone: us-central1-c              │
│                                   │
│  ┌─────────────────────────────┐ │
│  │  Evolution API (Docker)     │ │
│  │  Port: 8080                 │ │
│  │  + PostgreSQL               │ │
│  └─────────────────────────────┘ │
└──────────┬────────────────────────┘
           │
           ▼ Webhook POST /iris-webhook
┌─────────────────────────────────────┐
│   Cloud Function (iris-webhook)     │
│   Region: us-central1               │
│                                     │
│  1. Recebe mensagem                 │
│  2. Busca contexto no GCS (RAG)     │
│  3. Gera resposta com Gemini        │
│  4. Salva log no GCS                │
│  5. POST Evolution API → WhatsApp   │
└────────┬────────────────────────────┘
         │
         ├──► ┌─────────────────────────────┐
         │    │  Google Cloud Storage (GCS) │
         │    │  chatbot-iris-platform      │
         │    │                             │
         │    │  ├─ config/                 │
         │    │  ├─ knowledge/              │
         │    │  ├─ logs/                   │
         │    │  ├─ prompts/                │
         │    │  └─ rag/                    │
         │    └─────────────────────────────┘
         │
         └──► ┌─────────────────┐
              │  Vertex AI      │
              │  Gemini 1.5     │
              │  us-central1    │
              └─────────────────┘
```

**Fluxo de Dados:**
1. Usuário envia mensagem no WhatsApp
2. Evolution API (VPS) recebe via WhatsApp Web/Business API
3. Evolution API chama webhook da Cloud Function
4. Cloud Function processa com RAG + Gemini
5. Cloud Function envia resposta de volta para Evolution API
6. Evolution API entrega mensagem ao WhatsApp
7. Logs salvos no GCS

---

## 📂 Estrutura do Bucket GCS

```
gs://chatbot-iris-platform/
└── tenants/
    └── insightesfera/
        ├── config/
        │   ├── tenant.json          # Configurações do tenant
        │   ├── router.json          # Regras de roteamento
        │   └── config.json          # Config geral
        │
        ├── knowledge/
        │   ├── faq.md               # Base de conhecimento FAQ
        │   ├── servicos.md          # Serviços oferecidos
        │   ├── manifest.json        # Índice dos documentos
        │   ├── datasets/
        │   │   └── pt-BR/v1/
        │   │       ├── files.list
        │   │       └── meta.json
        │   └── normalized/
        │       └── pt-BR/
        │           └── insightesfera_completo.md
        │
        ├── logs/
        │   └── 2025/
        │       └── 10/
        │           └── 17.jsonl     # Logs diários
        │
        ├── prompts/
        │   └── pt-BR/v1/
        │       └── system/
        │           └── default.txt  # Prompt do sistema
        │
        ├── rag/
        │   └── index.json           # Índice RAG (TF-IDF)
        │
        ├── recordings/              # (Futuro: áudios)
        │   └── .placeholder
        │
        └── workflows/               # (Futuro: fluxos)
            └── .placeholder
```

---

## 🖥️ Infraestrutura GCP

### Instância VPS (Compute Engine)

**Configuração:**
- **Nome:** `saas-chatbot`
- **Zona:** `us-central1-c`
- **IP Interno:** `10.128.0.9`
- **IP Externo (Fixo):** `35.208.24.59`
- **Status:** Running
- **Projeto:** `silent-text-458716-c9`

**Propósito:**
Esta instância hospeda a **Evolution API** com IP fixo, garantindo estabilidade para a conexão WhatsApp e webhooks.

**Acessar via SSH:**
```bash
# SSH direto
gcloud compute ssh saas-chatbot --zone=us-central1-c

# Ou via IP externo
ssh -i ~/.ssh/gcp_key user@35.208.24.59
```

**URLs de Acesso:**
- Evolution API: `http://35.208.24.59:8080` (ou com domínio configurado)
- Webhook URL para Cloud Function: `https://us-central1-silent-text-458716-c9.cloudfunctions.net/iris-webhook`

---

## 🔧 Componentes Técnicos

### 1. Evolution API (no VPS saas-chatbot)

**O que é:**
API self-hosted que conecta aplicações ao WhatsApp via WhatsApp Business API ou WhatsApp Web.

**Instalação na Instância GCP:**
```bash
# 1. Conectar na instância
gcloud compute ssh saas-chatbot --zone=us-central1-c

# 2. Instalar Docker (se necessário)
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 3. Criar diretório de trabalho
mkdir -p ~/evolution-api
cd ~/evolution-api

# 4. Criar docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  evolution-api:
    image: atendai/evolution-api:latest
    container_name: evolution-api
    restart: always
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
      - SERVER_URL=http://35.208.24.59:8080
      - CORS_ORIGIN=*
      - CORS_METHODS=GET,POST,PUT,DELETE
      - CORS_CREDENTIALS=true
      - DEL_INSTANCE=false
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://postgres:postgres@postgres:5432/evolution
    volumes:
      - evolution_instances:/evolution/instances
      - evolution_store:/evolution/store
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    container_name: evolution-postgres
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=evolution
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  evolution_instances:
  evolution_store:
  postgres_data:
EOF

# 5. Criar arquivo .env
cat > .env << EOF
EVOLUTION_API_KEY=$(openssl rand -hex 32)
EOF

# 6. Iniciar Evolution API
docker-compose up -d

# 7. Verificar se está rodando
docker-compose ps
curl http://localhost:8080/manager/status
```

**Configurar Firewall GCP:**
```bash
# Permitir tráfego na porta 8080
gcloud compute firewall-rules create allow-evolution-api \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:8080 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=evolution-api

# Aplicar tag à instância
gcloud compute instances add-tags saas-chatbot \
  --zone=us-central1-c \
  --tags=evolution-api
```

**Endpoints principais:**
```bash
# Criar instância
POST /instance/create
{
  "instanceName": "iris-whatsapp",
  "token": "seu-token-aqui"
}

# Enviar mensagem de texto
POST /message/sendText/iris-whatsapp
{
  "number": "5",
  "text": "Olá! Como posso ajudar?"
}

# Configurar webhook
POST /webhook/set/iris-whatsapp
{
  "webhook": "https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/iris-webhook",
  "webhookEvents": ["messages.upsert"]
}
```

**Webhook Payload (recebido pela Cloud Function):**
```json
{
  "event": "messages.upsert",
  "instance": "iris-whatsapp",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "msg-id-123"
    },
    "message": {
      "conversation": "Olá, quero saber sobre os serviços"
    },
    "messageTimestamp": 1697548800,
    "pushName": "Cliente Exemplo"
  }
}
```

---

### 2. Cloud Function (iris-webhook)

**Arquivo: `main.py`**

```python
import functions_framework
from google.cloud import storage
from google.cloud import aiplatform
import json
import requests
from datetime import datetime
import re

# Configurações
PROJECT_ID = "silent-text-458716-c9"
BUCKET_NAME = "chatbot-iris-platform"
TENANT_ID = "insightesfera"
EVOLUTION_API_URL = "https://sua-evolution-api.com"
EVOLUTION_API_KEY = "sua-chave-aqui"
INSTANCE_NAME = "iris-whatsapp"

# Cliente GCS
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

# Vertex AI
aiplatform.init(project=PROJECT_ID, location="us-central1")
from vertexai.generative_models import GenerativeModel
model = GenerativeModel("gemini-1.5-flash-002")


def load_knowledge_base():
    """Carrega base de conhecimento do GCS"""
    try:
        blob = bucket.blob(f"tenants/{TENANT_ID}/knowledge/normalized/pt-BR/insightesfera_completo.md")
        knowledge = blob.download_as_text()
        return knowledge
    except Exception as e:
        print(f"Erro ao carregar conhecimento: {e}")
        return ""


def load_system_prompt():
    """Carrega prompt do sistema"""
    try:
        blob = bucket.blob(f"tenants/{TENANT_ID}/prompts/pt-BR/v1/system/default.txt")
        prompt = blob.download_as_text()
        return prompt
    except Exception as e:
        default_prompt = """Você é IRIS, assistente virtual da InsightEsfera.
Seja profissional, prestativa e objetiva.
Use a base de conhecimento fornecida para responder perguntas.
Se não souber a resposta, seja honesta e ofereça ajuda de um humano."""
        return default_prompt


def simple_rag(query, knowledge_base, top_k=3):
    """RAG simples: busca por palavras-chave"""
    query_lower = query.lower()
    lines = knowledge_base.split('\n\n')

    # Ranquear por número de palavras em comum
    scores = []
    for line in lines:
        if len(line.strip()) < 10:  # Ignorar linhas muito curtas
            continue
        line_lower = line.lower()
        # Contar palavras da query que aparecem na linha
        words = re.findall(r'\w+', query_lower)
        score = sum(1 for word in words if word in line_lower and len(word) > 3)
        if score > 0:
            scores.append((score, line))

    # Ordenar e pegar top_k
    scores.sort(reverse=True, key=lambda x: x[0])
    relevant_chunks = [chunk for _, chunk in scores[:top_k]]

    return '\n\n'.join(relevant_chunks) if relevant_chunks else ""


def generate_response(user_message, context):
    """Gera resposta com Gemini"""
    system_prompt = load_system_prompt()

    prompt = f"""{system_prompt}

CONTEXTO RELEVANTE:
{context}

MENSAGEM DO USUÁRIO:
{user_message}

RESPOSTA (máximo 500 caracteres, seja concisa e direta):"""

    response = model.generate_content(prompt)
    return response.text.strip()


def send_whatsapp_message(phone_number, message):
    """Envia mensagem via Evolution API"""
    url = f"{EVOLUTION_API_URL}/message/sendText/{INSTANCE_NAME}"
    headers = {
        "Content-Type": "application/json",
        "apikey": EVOLUTION_API_KEY
    }
    payload = {
        "number": phone_number,
        "text": message
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()


def save_log(conversation_data):
    """Salva log da conversa no GCS"""
    now = datetime.now()
    log_path = f"tenants/{TENANT_ID}/logs/{now.year}/{now.month:02d}/{now.day:02d}.jsonl"

    blob = bucket.blob(log_path)

    # Append ao arquivo (download + append + upload)
    try:
        existing_logs = blob.download_as_text()
    except:
        existing_logs = ""

    new_log = json.dumps(conversation_data, ensure_ascii=False) + "\n"
    blob.upload_from_string(existing_logs + new_log)


@functions_framework.http
def iris_webhook(request):
    """Função principal - Webhook da Evolution API"""

    # CORS (se necessário)
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)

    try:
        # Parse payload
        data = request.get_json()

        # Verificar se é mensagem válida
        if data.get('event') != 'messages.upsert':
            return {'status': 'ignored', 'reason': 'not a message event'}, 200

        message_data = data.get('data', {})

        # Ignorar mensagens enviadas por nós
        if message_data.get('key', {}).get('fromMe', False):
            return {'status': 'ignored', 'reason': 'message from me'}, 200

        # Extrair dados
        phone_number = message_data.get('key', {}).get('remoteJid', '').replace('@s.whatsapp.net', '')
        user_message = message_data.get('message', {}).get('conversation', '')
        push_name = message_data.get('pushName', 'Usuário')

        if not user_message:
            return {'status': 'ignored', 'reason': 'empty message'}, 200

        print(f"📩 Mensagem de {push_name} ({phone_number}): {user_message}")

        # 1. Carregar base de conhecimento
        knowledge_base = load_knowledge_base()

        # 2. RAG: buscar contexto relevante
        context = simple_rag(user_message, knowledge_base)

        # 3. Gerar resposta com Gemini
        response_text = generate_response(user_message, context)

        print(f"🤖 Resposta: {response_text}")

        # 4. Enviar resposta via Evolution API
        send_result = send_whatsapp_message(phone_number, response_text)

        # 5. Salvar log
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'phone': phone_number,
            'user_name': push_name,
            'user_message': user_message,
            'bot_response': response_text,
            'context_used': context[:200] + '...' if len(context) > 200 else context,
            'send_status': send_result.get('status', 'unknown')
        }
        save_log(log_data)

        return {
            'status': 'success',
            'message': 'Message processed and response sent',
            'response': response_text
        }, 200

    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        import traceback
        traceback.print_exc()
        return {'status': 'error', 'message': str(e)}, 500
```

**Arquivo: `requirements.txt`**
```txt
functions-framework==3.8.2
google-cloud-storage==2.18.2
google-cloud-aiplatform==1.64.0
requests==2.32.3
```

---

### 3. Deploy da Cloud Function

**Arquivo: `deploy.sh`**
```bash
#!/bin/bash

# Configurações
PROJECT_ID="silent-text-458716-c9"
REGION="us-central1"
FUNCTION_NAME="iris-webhook"

# Deploy
gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=python311 \
  --region=$REGION \
  --source=. \
  --entry-point=iris_webhook \
  --trigger-http \
  --allow-unauthenticated \
  --memory=512MB \
  --timeout=60s \
  --set-env-vars PROJECT_ID=$PROJECT_ID,BUCKET_NAME=chatbot-iris-platform,TENANT_ID=insightesfera \
  --set-secrets 'EVOLUTION_API_KEY=evolution-api-key:latest,EVOLUTION_API_URL=evolution-api-url:latest'

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📌 Configurar webhook na Evolution API:"
echo "POST https://sua-evolution-api.com/webhook/set/iris-whatsapp"
echo '{"webhook": "https://REGION-PROJECT_ID.cloudfunctions.net/iris-webhook", "webhookEvents": ["messages.upsert"]}'
```

**Comandos:**
```bash
# 1. Obter API Key da Evolution API (da instância saas-chatbot)
# SSH na instância e pegar a chave do .env
gcloud compute ssh saas-chatbot --zone=us-central1-c --command="cd ~/evolution-api && cat .env | grep EVOLUTION_API_KEY"

# 2. Criar secrets no GCP
echo -n "http://35.208.24.59:8080" | gcloud secrets create evolution-api-url --data-file=-
echo -n "SUA_CHAVE_OBTIDA_DO_PASSO_1" | gcloud secrets create evolution-api-key --data-file=-

# 3. Deploy
chmod +x deploy.sh
./deploy.sh

# 4. Testar Cloud Function
curl -X POST https://us-central1-silent-text-458716-c9.cloudfunctions.net/iris-webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "messages.upsert", "data": {"key": {"remoteJid": "5511999999999@s.whatsapp.net", "fromMe": false}, "message": {"conversation": "Olá"}, "pushName": "Teste"}}'

# 5. Configurar webhook na Evolution API (apontar para Cloud Function)
curl -X POST http://35.208.24.59:8080/webhook/set/iris-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_CHAVE_API" \
  -d '{
    "webhook": "https://us-central1-silent-text-458716-c9.cloudfunctions.net/iris-webhook",
    "webhookEvents": ["messages.upsert"]
  }'
```

---

## 📄 Arquivos de Configuração GCS

### `tenants/insightesfera/config/tenant.json`
```json
{
  "tenant_id": "insightesfera",
  "name": "InsightEsfera",
  "active": true,
  "whatsapp": {
    "instance_name": "iris-whatsapp",
    "phone_number": "5511999999999"
  },
  "ai": {
    "model": "gemini-1.5-flash-002",
    "max_tokens": 500,
    "temperature": 0.7
  },
  "features": {
    "text_chat": true,
    "voice_chat": false,
    "lead_capture": false,
    "handoff_to_human": false
  }
}
```

### `tenants/insightesfera/prompts/pt-BR/v1/system/default.txt`
```txt
Você é IRIS, assistente virtual da InsightEsfera.

SOBRE A INSIGHTESFERA:
A InsightEsfera é uma empresa especializada em soluções de dados e inteligência artificial.

SUAS RESPONSABILIDADES:
- Responder perguntas sobre nossos serviços
- Ser profissional, prestativa e objetiva
- Usar sempre a base de conhecimento fornecida
- Manter respostas curtas (máximo 500 caracteres)

REGRAS:
1. Se a informação estiver no CONTEXTO, use-a para responder
2. Se NÃO souber a resposta, seja honesta e ofereça contato humano
3. Sempre seja educada e empática
4. Nunca invente informações
5. Respostas devem ser em português brasileiro

EXEMPLO DE RESPOSTA BOA:
"Olá! A InsightEsfera oferece consultoria em BI, Data Science e IA. Posso te passar mais detalhes sobre algum serviço específico?"

EXEMPLO DE RESPOSTA RUIM:
"Não sei. Tchau."
```

### `tenants/insightesfera/knowledge/normalized/pt-BR/insightesfera_completo.md`
```markdown
# Base de Conhecimento - InsightEsfera

## Sobre Nós

A InsightEsfera é uma consultoria especializada em transformação digital através de dados e inteligência artificial.

Fundada em 2024, atendemos empresas de todos os portes no Brasil.

## Serviços Oferecidos

### 1. Consultoria em Business Intelligence (BI)
- Implementação de dashboards executivos
- Power BI, Tableau, Looker
- Integração de fontes de dados
- Cultura data-driven

### 2. Data Science & Machine Learning
- Modelos preditivos
- Análise de churn
- Recomendação personalizada
- Otimização de processos

### 3. Automação com IA
- Chatbots inteligentes
- Processamento de linguagem natural
- OCR e análise de documentos
- RPA com IA

### 4. Engenharia de Dados
- Data lakes e data warehouses
- Pipelines ETL/ELT
- Governança de dados
- Cloud (GCP, AWS, Azure)

## Preços

Trabalhamos com modelos flexíveis:
- Consultoria por hora: R$ 300/h
- Projetos fechados: sob consulta
- Retainer mensal: a partir de R$ 10.000/mês

## Contato

- Email: contato@insightesfera.io
- Telefone: (11) 99999-9999
- Site: www.insightesfera.io

## FAQ

**P: Atendem empresas pequenas?**
R: Sim! Temos soluções para empresas de todos os portes.

**P: Quanto tempo leva um projeto?**
R: Depende do escopo. Projetos pequenos: 2-4 semanas. Grandes: 3-6 meses.

**P: Trabalham com que tecnologias?**
R: Python, SQL, GCP, AWS, Power BI, Tableau, TensorFlow, PyTorch, entre outras.

**P: Oferecem suporte após o projeto?**
R: Sim! Todos os projetos incluem 30 dias de suporte gratuito. Depois, oferecemos planos de manutenção.

**P: Como agendar uma reunião?**
R: Entre em contato pelo email contato@insightesfera.io ou WhatsApp (11) 99999-9999.
```

---

## 🚀 Checklist de Implementação

### Fase 0: Preparação da Infraestrutura (30 min)
- [ ] Verificar acesso à instância GCP `saas-chatbot` (35.208.24.59)
- [ ] Configurar regra de firewall para porta 8080
- [ ] SSH na instância e instalar Docker + Docker Compose

### Fase 1: Setup da Evolution API no VPS (1 hora)
- [ ] Conectar via SSH: `gcloud compute ssh saas-chatbot --zone=us-central1-c`
- [ ] Criar docker-compose.yml com PostgreSQL
- [ ] Gerar e salvar EVOLUTION_API_KEY
- [ ] Iniciar containers: `docker-compose up -d`
- [ ] Testar acesso: `curl http://35.208.24.59:8080/manager/status`
- [ ] Criar instância WhatsApp na Evolution API
- [ ] Conectar QR Code ao WhatsApp
- [ ] Testar envio/recebimento de mensagens manuais via Postman

### Fase 2: GCS e Conhecimento (2 horas)
- [ ] Criar estrutura de pastas no bucket
- [ ] Upload de tenant.json
- [ ] Upload de default.txt (system prompt)
- [ ] Upload de insightesfera_completo.md (conhecimento)
- [ ] Validar acesso aos arquivos

### Fase 3: Cloud Function (3 horas)
- [ ] Criar main.py com código da função
- [ ] Criar requirements.txt
- [ ] Testar localmente com Functions Framework
- [ ] Deploy via gcloud
- [ ] Testar endpoint com curl
- [ ] Verificar logs no Cloud Logging

### Fase 4: Integração (1 hora)
- [ ] Configurar webhook na Evolution API
- [ ] Testar fluxo completo WhatsApp → Cloud Function → Resposta
- [ ] Validar salvamento de logs no GCS
- [ ] Ajustar prompts se necessário

### Fase 5: Testes e Refinamento (2 horas)
- [ ] Testar diversos tipos de perguntas
- [ ] Verificar qualidade das respostas
- [ ] Ajustar RAG se necessário
- [ ] Testar edge cases (mensagens vazias, erros, etc)
- [ ] Documentar comportamentos observados

---

## 🧪 Testes

### Teste 1: Pergunta sobre serviços
```
Usuário: "Quais serviços vocês oferecem?"
Esperado: IRIS lista os 4 serviços principais
```

### Teste 2: Pergunta de FAQ
```
Usuário: "Atendem empresas pequenas?"
Esperado: IRIS responde que sim e menciona soluções flexíveis
```

### Teste 3: Pergunta fora do conhecimento
```
Usuário: "Qual o clima hoje?"
Esperado: IRIS informa que não tem essa informação e oferece ajuda sobre a empresa
```

### Teste 4: Saudação
```
Usuário: "Oi"
Esperado: IRIS saúda e se apresenta
```

### Teste 5: Preços
```
Usuário: "Quanto custa?"
Esperado: IRIS menciona modelos de precificação
```

---

## 📊 Monitoramento

### Logs no Cloud Logging
```bash
# Ver logs da função
gcloud functions logs read iris-webhook --region=us-central1 --limit=50

# Filtrar erros
gcloud functions logs read iris-webhook --region=us-central1 --filter="severity=ERROR"
```

### Logs de conversas no GCS
```bash
# Ver logs de hoje
gsutil cat gs://chatbot-iris-platform/tenants/insightesfera/logs/2025/10/17.jsonl

# Últimas 10 conversas
gsutil cat gs://chatbot-iris-platform/tenants/insightesfera/logs/2025/10/17.jsonl | tail -10
```

### Métricas
- Tempo de resposta médio: < 3 segundos
- Taxa de sucesso: > 95%
- Custo por mensagem: ~R$ 0,01

---

## 💰 Estimativa de Custos (MVP)

### Compute Engine (VPS saas-chatbot)
- Instância e2-micro ou similar
- 24/7 running
- **Total:** ~R$ 35/mês

### Cloud Functions (1.000 mensagens/dia)
- Invocações: 30.000/mês × R$ 0,0004 = R$ 12
- Compute: 30.000 × 1s × R$ 0,0000024 = R$ 0,72
- **Total:** ~R$ 13/mês

### Vertex AI (Gemini)
- Input: 30.000 msg × 500 tokens = 15M tokens × $0,0001 = R$ 7,50
- Output: 30.000 msg × 200 tokens = 6M tokens × $0,0003 = R$ 9
- **Total:** ~R$ 17/mês

### Cloud Storage
- Armazenamento: 1GB × R$ 0,12 = R$ 0,12
- Operações: Negligível
- **Total:** ~R$ 0,12/mês

### IP Externo Fixo
- Reserva de IP estático
- **Total:** ~R$ 7/mês

### **TOTAL MVP: ~R$ 72/mês** (1.000 mensagens/dia)

**Nota:** A maior parte do custo é a VPS (R$ 35/mês). É possível otimizar usando:
- Instância preemptible (economia de 60-80%)
- Cloud Run para Evolution API (serverless, paga por uso)
- IP dinâmico + DNS (economiza R$ 7/mês)

---

## 🔜 Próximos Passos (Pós-MVP)

### V2: Áudio
- [ ] Implementar STT (Speech-to-Text)
- [ ] Implementar TTS (Text-to-Speech)
- [ ] Salvar gravações no GCS

### V3: Leads
- [ ] Detectar intenção de compra
- [ ] Salvar leads no BigQuery
- [ ] Notificar vendedor via email/Slack

### V4: Handoff
- [ ] Detectar quando precisa humano
- [ ] Integrar com Chatwoot ou similar
- [ ] Sistema de fila de atendimento

### V5: Multi-tenant
- [ ] Suporte a múltiplos clientes
- [ ] Dashboard de admin
- [ ] Billing por tenant

---

## 📚 Referências

- [Evolution API Docs](https://doc.evolution-api.com/)
- [Cloud Functions Python](https://cloud.google.com/functions/docs/writing)
- [Vertex AI Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini)
- [Cloud Storage Python](https://cloud.google.com/storage/docs/reference/libraries#client-libraries-install-python)

---

## 🆘 Troubleshooting

### VPS (saas-chatbot) não está acessível
1. Verificar se instância está rodando:
   ```bash
   gcloud compute instances list --filter="name=saas-chatbot"
   ```
2. Verificar firewall:
   ```bash
   gcloud compute firewall-rules list --filter="name=allow-evolution-api"
   ```
3. Testar conectividade:
   ```bash
   curl -v http://35.208.24.59:8080/manager/status
   ```
4. SSH e verificar logs do Docker:
   ```bash
   gcloud compute ssh saas-chatbot --zone=us-central1-c
   cd ~/evolution-api
   docker-compose logs -f evolution-api
   ```

### Evolution API não responde
1. Verificar se containers estão rodando:
   ```bash
   docker-compose ps
   ```
2. Reiniciar containers:
   ```bash
   docker-compose restart
   ```
3. Ver logs detalhados:
   ```bash
   docker-compose logs --tail=100 evolution-api
   docker-compose logs --tail=100 postgres
   ```
4. Verificar variáveis de ambiente:
   ```bash
   cat .env
   ```

### Webhook não recebe mensagens
1. Verificar URL do webhook na Evolution API:
   ```bash
   curl http://35.208.24.59:8080/webhook/find/iris-whatsapp \
     -H "apikey: SUA_CHAVE"
   ```
2. Testar manualmente:
   ```bash
   curl -X POST https://us-central1-silent-text-458716-c9.cloudfunctions.net/iris-webhook \
     -H "Content-Type: application/json" \
     -d '{"event": "messages.upsert", "data": {...}}'
   ```
3. Verificar logs da Evolution API (via SSH)
4. Verificar se Cloud Function permite traffic público

### Resposta não é enviada
1. Verificar credenciais da Evolution API
2. Testar envio manual via Postman
3. Verificar logs da Cloud Function
4. Verificar formato da mensagem

### RAG não encontra contexto relevante
1. Verificar se arquivo de conhecimento foi carregado
2. Testar busca manualmente
3. Ajustar lógica de ranking
4. Adicionar mais sinônimos/palavras-chave

### Gemini retorna erro
1. Verificar quotas do projeto
2. Verificar permissões da Cloud Function
3. Testar Gemini diretamente no console
4. Verificar tamanho do prompt (não exceder limite)

---

**Autor:** Orchestrator Agent
**Data:** 2025-10-17
**Contato:** Para dúvidas, consulte a documentação ou abra uma issue no repositório.

---

✅ **MVP IRIS pronto para implementação!**
