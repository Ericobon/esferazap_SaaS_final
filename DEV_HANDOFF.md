# 📋 Documento de Implementação - EsferaZap SaaS

**Projeto**: EsferaZap - Plataforma SaaS Multi-Tenant WhatsApp com IA  
**Data**: 29/11/2025  
**Versão**: 1.0  
**Status**: Pronto para Implementação  

---

## 📁 Estrutura do Projeto

```
EsferaZap2/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx ✅
│   │   │   └── AppLayout.jsx ✅
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx ✅
│   │   │   └── ContactList.jsx ✅
│   │   └── CompraLeads.jsx ✅
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx ✅
│   │   │   └── Register.jsx ✅
│   │   ├── Dashboard/
│   │   │   └── DashboardOverview.jsx ✅
│   │   ├── Chat/
│   │   │   └── ChatPage.jsx ✅
│   │   ├── Settings/
│   │   │   └── AgentConfigPage.jsx ✅
│   │   └── KnowledgeBase/
│   │       └── KnowledgeBasePage.jsx ✅
│   ├── hooks/
│   │   └── useAuth.js ✅
│   ├── lib/
│   │   └── firebase.js ✅
│   └── services/
│       ├── aiChatService.js ⚠️ (mock - precisa backend)
│       └── chatService.js ✅
├── .env ✅
└── index.html ✅
```

---

## 🎯 Objetivos do Projeto

### MVP (Minimum Viable Product)
1. **Autenticação Multi-Tenant**: Cada empresa é isolada com `tenantId` único
2. **Chat com IA**: Assistente virtual (IRIS) usando Gemini 1.5 Flash
3. **Base de Conhecimento**: Usuário faz upload de arquivos que alimentam a IA
4. **WhatsApp Integration**: Conexão com API oficial do Meta
5. **Interface Premium**: Dark mode com glassmorphism

---

## 🔑 Credenciais e Configurações

### Firebase (Autenticação e Banco de Dados)
```env
Projeto: saasesfera
API Key: AIzaSyCDLfacyV6-FAWb76_UMybO4Raifsp7X-Y
Auth Domain: saasesfera.firebaseapp.com
Project ID: saasesfera
```

### Google Cloud Platform
```
Projeto: ticto-ml
VM: saas-chatbot
IP Externo: 35.258.24.59
Porta Evolution API: 8080
```

### Firestore Collections

**1. `users/{uid}`**
```typescript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  company: string,
  sector: string,
  companySize: string,
  city: string,
  state: string,
  tenantId: string,        // Gerado automaticamente
  role: 'admin' | 'user',
  isTenantAdmin: boolean,
  onboardingCompleted: boolean,
  createdAt: string,       // ISO8601
  updatedAt: string
}
```

**2. `tenants/{tenantId}`**
```typescript
{
  name: string,
  adminUserId: string,
  sector: string,
  companySize: string,
  location: {
    city: string,
    state: string
  },
  plan: 'free' | 'pro' | 'enterprise',
  status: 'active' | 'inactive',
  createdAt: string
}
```

**3. `agent_configs/{tenantId}`**
```typescript
{
  name: string,            // Ex: "IRIS"
  model: string,           // Ex: "gemini-1.5-flash"
  temperature: number,     // 0.0 - 1.0
  systemPrompt: string,    // Configurável pelo usuário
  isActive: boolean,
  useRAG: boolean,
  whatsapp: {
    phoneNumberId: string,
    accessToken: string,
    verifyToken: string
  },
  createdAt: string,
  updatedAt: string
}
```

**4. `knowledge_base/{tenantId}/documents/{docId}`**
```typescript
{
  name: string,
  uploadedBy: string,      // userId
  uploadedAt: string,
  fileUrl: string,         // GCS URL
  status: 'indexed' | 'processing' | 'error',
  content: string,         // Texto extraído
  metadata: {
    size: number,
    type: string,
    pages?: number
  }
}
```

---

## 🔐 Regras de Segurança Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    // Usuários - cada um acessa só seus dados
    match /users/{userId} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Tenants - apenas membros do tenant podem acessar
    match /tenants/{tenantId} {
      allow read: if isAuthenticated() && getUserData().tenantId == tenantId;
      allow create: if isAuthenticated() && request.resource.data.adminUserId == request.auth.uid;
      allow update: if isAuthenticated() && getUserData().tenantId == tenantId && getUserData().isTenantAdmin == true;
    }
    
    // Configurações de Agente
    match /agent_configs/{tenantId} {
      allow read, write: if isAuthenticated() && getUserData().tenantId == tenantId;
    }
    
    // Base de Conhecimento
    match /knowledge_base/{tenantId}/documents/{docId} {
      allow read, write: if isAuthenticated() && getUserData().tenantId == tenantId;
    }
  }
}
```

---

## 🚀 Implementação Pendente

### 1. Backend - Cloud Function (Agente IA)

**Arquivo**: `cloud-functions/iris-webhook/main.py`

```python
import functions_framework
from flask import jsonify, request
from google.cloud import firestore, storage
from vertexai.preview.generative_models import GenerativeModel
import vertexai

PROJECT_ID = "ticto-ml"
LOCATION = "us-central1"

db = firestore.Client(project=PROJECT_ID)
vertexai.init(project=PROJECT_ID, location=LOCATION)

@functions_framework.http
def iris_webhook(request):
    """
    Endpoint para processar mensagens do usuário com IA
    
    Input:
    {
        "tenantId": "empresa-teste",
        "message": "Como funciona o produto X?",
        "userId": "user123"
    }
    
    Output:
    {
        "success": true,
        "response": "Resposta da IA...",
        "usedRAG": true
    }
    """
    
    # CORS
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)
    
    headers = {'Access-Control-Allow-Origin': '*'}
    
    try:
        data = request.get_json()
        tenant_id = data.get('tenantId')
        message = data.get('message')
        
        if not tenant_id or not message:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # 1. Carregar configuração do agente
        config_ref = db.collection('agent_configs').document(tenant_id)
        config_doc = config_ref.get()
        
        if not config_doc.exists:
            return jsonify({'error': 'Agent not configured'}), 404
        
        config = config_doc.to_dict()
        
        if not config.get('isActive'):
            return jsonify({'error': 'Agent is inactive'}), 403
        
        # 2. Buscar contexto da base de conhecimento (se RAG ativo)
        context = ""
        used_rag = False
        
        if config.get('useRAG'):
            kb_ref = db.collection('knowledge_base').document(tenant_id)\
                      .collection('documents')\
                      .where('status', '==', 'indexed')\
                      .limit(5)
            
            docs = kb_ref.stream()
            kb_contents = []
            
            for doc in docs:
                doc_data = doc.to_dict()
                if 'content' in doc_data:
                    kb_contents.append(doc_data['content'])
            
            if kb_contents:
                context = "\n\n".join(kb_contents)
                used_rag = True
        
        # 3. Gerar prompt completo
        system_prompt = config.get('systemPrompt', '')
        
        full_prompt = f"""{system_prompt}

{'CONTEXTO (Base de Conhecimento):' if context else ''}
{context}

PERGUNTA DO USUÁRIO:
{message}

Responda de forma objetiva, profissional e baseando-se no contexto fornecido quando disponível.
"""
        
        # 4. Chamar Gemini
        model_name = config.get('model', 'gemini-1.5-flash')
        temperature = config.get('temperature', 0.7)
        
        model = GenerativeModel(model_name)
        response = model.generate_content(
            full_prompt,
            generation_config={
                'temperature': temperature,
                'max_output_tokens': 1024,
            }
        )
        
        answer = response.text
        
        return jsonify({
            'success': True,
            'response': answer,
            'usedRAG': used_rag,
            'model': model_name
        }), 200, headers
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500, headers
```

**Deploy:**
```bash
cd cloud-functions/iris-webhook

gcloud functions deploy iris-webhook \
  --gen2 \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point iris_webhook \
  --region us-central1 \
  --project ticto-ml \
  --set-env-vars PROJECT_ID=ticto-ml
```

**requirements.txt:**
```
functions-framework==3.*
google-cloud-firestore==2.*
google-cloud-aiplatform==1.*
google-cloud-storage==2.*
```

---

### 2. Processamento de Arquivos (Base de Conhecimento)

**Cloud Function**: `process-knowledge-file`

```python
import functions_framework
from google.cloud import firestore, storage
from cloudevents.http import CloudEvent
import PyPDF2
import io

db = firestore.Client()
storage_client = storage.Client()

@functions_framework.cloud_event
def process_knowledge_file(cloud_event: CloudEvent):
    """
    Triggered quando um arquivo é enviado para GCS
    Extrai texto e atualiza Firestore
    """
    
    data = cloud_event.data
    bucket_name = data['bucket']
    file_name = data['name']
    
    # Path format: {tenantId}/knowledge/{filename}
    parts = file_name.split('/')
    if len(parts) < 3 or parts[1] != 'knowledge':
        return
    
    tenant_id = parts[0]
    filename = parts[-1]
    
    # Download file
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    content = blob.download_as_bytes()
    
    # Extract text based on file type
    text = ""
    
    if filename.endswith('.pdf'):
        pdf_file = io.BytesIO(content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    
    elif filename.endswith('.txt'):
        text = content.decode('utf-8', errors='ignore')
    
    # Update Firestore
    docs_ref = db.collection('knowledge_base').document(tenant_id)\
                 .collection('documents')
    
    # Find document by filename
    query = docs_ref.where('name', '==', filename).limit(1)
    docs = query.stream()
    
    for doc in docs:
        doc.reference.update({
            'content': text,
            'status': 'indexed',
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
    
    print(f"Processed {filename} for tenant {tenant_id}")
```

**Deploy:**
```bash
gcloud functions deploy process-knowledge-file \
  --gen2 \
  --runtime python311 \
  --trigger-event-filters type=google.cloud.storage.object.v1.finalized \
  --trigger-event-filters bucket=YOUR_BUCKET_NAME \
  --region us-central1 \
  --project ticto-ml
```

---

### 3. Frontend - Atualizar aiChatService

**Arquivo**: `src/services/aiChatService.js`

```javascript
const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || 
  'https://us-central1-ticto-ml.cloudfunctions.net/iris-webhook';

export async function processUserMessage(message, tenantId, userId) {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tenantId: tenantId,
        message: message,
        userId: userId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
}
```

Adicionar ao `.env`:
```env
VITE_CLOUD_FUNCTION_URL=https://us-central1-ticto-ml.cloudfunctions.net/iris-webhook
```

---

### 4. Upload de Arquivos (Knowledge Base)

**Arquivo**: `src/pages/KnowledgeBase/KnowledgeBasePage.jsx`

Adicionar função de upload:

```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

async function handleFileUpload(file, tenantId, userId) {
  try {
    const storage = getStorage();
    
    // Upload para Storage
    const storageRef = ref(storage, `${tenantId}/knowledge/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    
    // Criar documento no Firestore
    const docRef = await addDoc(
      collection(db, 'knowledge_base', tenantId, 'documents'),
      {
        name: file.name,
        fileUrl: fileUrl,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
        metadata: {
          size: file.size,
          type: file.type
        }
      }
    );
    
    toast.success('Arquivo enviado! Processamento iniciado.');
    return docRef.id;
    
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Erro ao fazer upload do arquivo');
    throw error;
  }
}
```

---

### 5. WhatsApp Integration (Webhook)

**Cloud Function**: `whatsapp-webhook`

```python
@functions_framework.http
def whatsapp_webhook(request):
    """Webhook para receber mensagens do WhatsApp"""
    
    # GET - Verificação
    if request.method == 'GET':
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        
        if mode == 'subscribe' and token == 'insightesfera_token':
            return challenge, 200
        return 'Forbidden', 403
    
    # POST - Mensagem recebida
    data = request.get_json()
    
    try:
        entry = data['entry'][0]
        changes = entry['changes'][0]
        value = changes['value']
        
        # Identificar tenant pelo phoneNumberId
        phone_number_id = value['metadata']['phone_number_id']
        
        # Buscar configuração
        agents = db.collection('agent_configs')\
                   .where('whatsapp.phoneNumberId', '==', phone_number_id)\
                   .limit(1).stream()
        
        for agent_doc in agents:
            tenant_id = agent_doc.id
            config = agent_doc.to_dict()
            
            # Extrair mensagem
            messages = value.get('messages', [])
            if not messages:
                continue
            
            message = messages[0]
            from_number = message['from']
            text = message.get('text', {}).get('body', '')
            
            # Processar com IA
            response_text = process_with_gemini(text, tenant_id, config)
            
            # Enviar resposta
            send_whatsapp_message(
                phone_number_id,
                config['whatsapp']['accessToken'],
                from_number,
                response_text
            )
        
        return jsonify({'status': 'ok'}), 200
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return jsonify({'status': 'error'}), 200
```

---

## 🧪 Testes

### Teste Local (Dev)

1. **Ambiente**:
```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2
npm install
npm run dev
```

2. **Verificar**:
- ✅ Login funciona
- ✅ Registro cria usuário e tenant no Firestore
- ✅ Dashboard carrega
- ✅ Sidebar mostra nome do usuário
- ✅ Chat UI aparece (mock)

### Teste em Produção (VM)

1. **Build**:
```bash
npm run build
```

2. **Deploy na VM**:
```bash
# Copiar build
scp -r dist/ usuario@35.258.24.59:/var/www/esferazap/

# Na VM, configurar Nginx
sudo systemctl reload nginx
```

3. **Acessar**: `http://35.258.24.59`

---

## 📦 Deploy Checklist

- [ ] Firebase Firestore Rules aplicadas
- [ ] Cloud Function `iris-webhook` deployada
- [ ] Cloud Function `process-knowledge-file` deployada
- [ ] Cloud Function `whatsapp-webhook` deployada (opcional)
- [ ] Frontend build e deploy na VM
- [ ] Nginx configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de registro de usuário
- [ ] Teste de chat com IA
- [ ] Teste de upload de arquivo

---

## 🆘 Troubleshooting

### Problema: Página não carrega
**Solução**: Execute `./fix.sh` ou siga `QUICK_FIX.md`

### Problema: Firebase error
**Verificar**: `.env` existe e tem todas as variáveis

### Problema: Cloud Function timeout
**Causa**: Model Gemini demorado  
**Solução**: Aumentar timeout para 60s

### Problema: Upload de arquivo falha
**Verificar**: Firebase Storage Rules e permissões

---

## 📞 Contatos e Links

- **Firebase Console**: https://console.firebase.google.com/project/saasesfera
- **GCP Console**: https://console.cloud.google.com/
- **VM**: `35.258.24.59`
- **Meta Developer**: https://developers.facebook.com/

---

## 🎯 Próximas Features (Pós-MVP)

1. Analytics dashboard
2. Webhooks customizáveis
3. Templates de mensagem
4. Integração com CRM
5. API pública
6. White-label

---

**Documento gerado em**: 29/11/2025  
**Responsável Técnico**: Antigravity AI  
**Versão**: 1.0
