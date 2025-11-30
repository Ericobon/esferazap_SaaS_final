# 🔧 Guia Completo de Implementação - EsferaZap MVP

**Data**: 29/11/2025  
**VM**: saas-chatbot (35.258.24.59)  
**GCP Project**: ticto-ml  
**Firebase Project**: saasesfera  

---

## 📋 Índice

1. [Problema Atual e Solução](#problema-atual)
2. [Deploy na VM GCP](#deploy-vm)
3. [Autenticação Firebase](#autenticacao)
4. [Multi-Tenant (Isolamento de Clientes)](#multi-tenant)
5. [Agente de IA (Gemini)](#agente-ia)
6. [Base de Conhecimento](#base-conhecimento)
7. [Integração WhatsApp](#whatsapp)
8. [Checklist Final](#checklist)

---

## 🚨 Problema Atual e Solução {#problema-atual}

### Sintoma
Página não carrega (tela branca ou erro no console).

### Causas Possíveis
1. Erro no `useAuth.js` (edição anterior quebrou o código)
2. Firebase não configurado corretamente
3. Variáveis de ambiente faltando (`.env`)

### ✅ Solução Imediata

#### 1. Verifique o Console do Navegador (F12)
Procure erros. Se houver algo como:
- `Cannot read property 'uid' of undefined`
- `Firebase not initialized`

#### 2. Corrija o `useAuth.js`

Substitua o conteúdo de `src/hooks/useAuth.js` por:

```javascript
import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...firebaseUser,
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email
            });
          } else {
            setUser(firebaseUser);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, additionalData) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: `${additionalData.firstName} ${additionalData.lastName}`
      });

      const tenantId = additionalData.company
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await setDoc(doc(db, 'users', user.uid), {
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        email: user.email,
        phone: additionalData.phone,
        company: additionalData.company,
        sector: additionalData.sector,
        companySize: additionalData.companySize,
        city: additionalData.city,
        state: additionalData.state,
        tenantId: tenantId,
        role: 'admin',
        isTenantAdmin: true,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const tenantRef = doc(db, 'tenants', tenantId);
      const tenantDoc = await getDoc(tenantRef);
      
      if (!tenantDoc.exists()) {
        await setDoc(tenantRef, {
          name: additionalData.company,
          adminUserId: user.uid,
          sector: additionalData.sector,
          companySize: additionalData.companySize,
          location: {
            city: additionalData.city,
            state: additionalData.state
          },
          createdAt: new Date().toISOString(),
          plan: 'free',
          status: 'active'
        });
      }

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout
  };
}
```

#### 3. Verifique o `.env`

```env
VITE_FIREBASE_API_KEY=AIzaSyCDLfacyV6-FAWb76_UMybO4Raifsp7X-Y
VITE_FIREBASE_AUTH_DOMAIN=saasesfera.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=saasesfera
VITE_FIREBASE_STORAGE_BUCKET=saasesfera.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=235565482869
VITE_FIREBASE_APP_ID=1:235565482869:web:1caef424e756fd93f5093c
VITE_FIREBASE_MEASUREMENT_ID=G-0ZCXVCV00R
```

#### 4. Reinicie o servidor

```bash
# Mate qualquer processo rodando
pkill -f vite

# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install

# Rode novamente
npm run dev
```

---

## 🌐 Deploy na VM GCP {#deploy-vm}

### Pré-requisitos
- VM `saas-chatbot` rodando (IP: 35.258.24.59)
- Acesso SSH à VM
- Nginx ou Docker instalado

### Opção 1: Deploy com Docker (Recomendado)

#### 1. Na sua máquina local (WSL):

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2

# Build da aplicação
npm run build

# Crie um arquivo tar
tar -czf dist.tar.gz dist/
```

#### 2. Copie para a VM:

```bash
scp dist.tar.gz seu_usuario@35.258.24.59:/home/seu_usuario/
scp Dockerfile seu_usuario@35.258.24.59:/home/seu_usuario/
scp nginx.conf seu_usuario@35.258.24.59:/home/seu_usuario/
```

#### 3. Na VM, rode:

```bash
# Extrair build
tar -xzf dist.tar.gz

# Build Docker image
docker build -t esferazap-frontend .

# Rodar container
docker stop esferazap 2>/dev/null || true
docker rm esferazap 2>/dev/null || true
docker run -d \
  --name esferazap \
  -p 80:80 \
  --restart unless-stopped \
  esferazap-frontend

# Verificar
docker logs esferazap
```

#### 4. Acesse:
`http://35.258.24.59`

### Opção 2: Deploy com Nginx (Direto)

#### Na VM:

```bash
# Instalar Nginx
sudo apt update
sudo apt install -y nginx

# Copiar build
sudo mkdir -p /var/www/esferazap
sudo tar -xzf dist.tar.gz -C /var/www/esferazap
sudo chown -R www-data:www-data /var/www/esferazap

# Configurar Nginx
sudo nano /etc/nginx/sites-available/esferazap
```

**Conteúdo do arquivo:**

```nginx
server {
    listen 80;
    server_name 35.258.24.59;

    root /var/www/esferazap/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/esferazap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 Autenticação Firebase {#autenticacao}

### Estrutura Atual

#### Firebase Authentication
- **Providers**: Email/Password, Google
- **Projeto**: saasesfera

#### Firestore Collections

**1. `users/{uid}`**
```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  displayName: string,
  phone: string,
  company: string,
  sector: string,
  companySize: string,
  city: string,
  state: string,
  tenantId: string,        // ID único da empresa
  role: 'admin' | 'user',  // Papel do usuário
  isTenantAdmin: boolean,  // Se é admin da empresa
  onboardingCompleted: boolean,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

**2. `tenants/{tenantId}`**
```javascript
{
  name: string,            // Nome da empresa
  adminUserId: string,     // UID do admin
  sector: string,
  companySize: string,
  location: {
    city: string,
    state: string
  },
  plan: 'free' | 'pro' | 'enterprise',
  status: 'active' | 'inactive',
  createdAt: ISO8601
}
```

### Regras de Segurança Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários
    match /users/{userId} {
      // Usuário pode ler seus próprios dados
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Usuário pode criar seus próprios dados no registro
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Usuário pode atualizar seus próprios dados
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tenants
    match /tenants/{tenantId} {
      // Tenant admin pode ler dados da empresa
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId;
      
      // Apenas tenant admin pode criar
      allow create: if request.auth != null && 
                       request.resource.data.adminUserId == request.auth.uid;
      
      // Apenas tenant admin pode atualizar
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isTenantAdmin == true &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId;
    }
    
    // Configurações de Agente (por tenant)
    match /agent_configs/{tenantId} {
      allow read, write: if request.auth != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId;
    }
    
    // Base de Conhecimento (por tenant)
    match /knowledge_base/{tenantId}/documents/{docId} {
      allow read, write: if request.auth != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId;
    }
  }
}
```

---

## 🏢 Multi-Tenant (Isolamento de Clientes) {#multi-tenant}

### Conceito

Cada empresa (cliente) tem um `tenantId` único. Todos os dados são isolados por `tenantId`.

### Como Funciona

**1. No Registro:**
- Nome da empresa → `tenantId` (normalizando: "Minha Empresa" → "minha-empresa")
- Primeiro usuário é automaticamente `role: 'admin'` e `isTenantAdmin: true`

**2. No Login:**
- Usuário carrega `tenantId` do Firestore
- Frontend armazena `tenantId` no state global (via `useAuth`)

**3. Em Cada Operação:**
- Sempre filtra por `tenantId`
- Firestore Rules garantem que não há acesso cruzado

### Exemplo de Uso no Frontend

```javascript
import { useAuth } from '@/hooks/useAuth';

function AgentConfigPage() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  useEffect(() => {
    // Carregar configuração do agente para este tenant
    const configRef = doc(db, 'agent_configs', tenantId);
    const unsubscribe = onSnapshot(configRef, (doc) => {
      setConfig(doc.data());
    });
    return () => unsubscribe();
  }, [tenantId]);

  const saveConfig = async (newConfig) => {
    await setDoc(doc(db, 'agent_configs', tenantId), {
      ...newConfig,
      updatedAt: new Date().toISOString()
    });
  };
}
```

---

## 🤖 Agente de IA (Gemini) {#agente-ia}

### Arquitetura

```
Frontend (EsferaZap)
    ↓
Cloud Function (iris-webhook)
    ↓
Gemini 1.5 Flash (Vertex AI)
    ↓
Knowledge Base (GCS)
```

### Estrutura Firestore para Configuração

**Collection: `agent_configs/{tenantId}`**

```javascript
{
  name: "IRIS",
  model: "gemini-1.5-flash",
  temperature: 0.7,
  systemPrompt: "Você é IRIS, assistente virtual da {company}...",
  isActive: true,
  useRAG: true,
  whatsapp: {
    phoneNumberId: "",
    accessToken: "",
    verifyToken: "insightesfera_token"
  },
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### Cloud Function

**Deploy:**
```bash
cd cloud-functions/iris-webhook
gcloud functions deploy iris-webhook \
  --gen2 \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point webhook \
  --set-env-vars PROJECT_ID=ticto-ml
```

**Código (`main.py`):**

```python
import functions_framework
from flask import jsonify
from google.cloud import firestore
from vertexai.preview.generative_models import GenerativeModel
import vertexai

db = firestore.Client()

@functions_framework.http
def webhook(request):
    data = request.get_json()
    
    # Extrair mensagem do usuário
    message = data.get('message', {}).get('text', '')
    tenant_id = data.get('tenantId')
    
    if not message or not tenant_id:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Carregar config do tenant
    config_ref = db.collection('agent_configs').document(tenant_id)
    config = config_ref.get().to_dict()
    
    if not config or not config.get('isActive'):
        return jsonify({'error': 'Agent not configured'}), 404
    
    # Processar com RAG se ativado
    context = ""
    if config.get('useRAG'):
        # Buscar na base de conhecimento
        kb_docs = db.collection('knowledge_base').document(tenant_id)\
                    .collection('documents').stream()
        context = "\n".join([doc.to_dict().get('content', '') for doc in kb_docs])
    
    # Chamar Gemini
    vertexai.init(project="ticto-ml", location="us-central1")
    model = GenerativeModel(config.get('model', 'gemini-1.5-flash'))
    
    prompt = f"""
{config.get('systemPrompt', '')}

CONTEXTO (Base de Conhecimento):
{context}

PERGUNTA DO USUÁRIO:
{message}

Responda de forma objetiva e profissional.
"""
    
    response = model.generate_content(prompt)
    answer = response.text
    
    return jsonify({
        'success': True,
        'response': answer
    })
```

### Integração Frontend → Cloud Function

**Service: `src/services/aiChatService.js`**

```javascript
const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || 
                           'https://us-central1-ticto-ml.cloudfunctions.net/iris-webhook';

export async function processUserMessage(message, tenantId) {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tenantId: tenantId,
        message: {
          text: message
        }
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
}
```

---

## 📚 Base de Conhecimento {#base-conhecimento}

### Estrutura Firestore

**Collection: `knowledge_base/{tenantId}/documents/{docId}`**

```javascript
{
  name: "Manual do Produto.pdf",
  uploadedBy: "userId",
  uploadedAt: ISO8601,
  fileUrl: "gs://bucket/tenantId/files/doc.pdf",
  status: "indexed" | "processing" | "error",
  content: "Texto extraído do arquivo...",
  metadata: {
    size: 1024000,
    type: "application/pdf",
    pages: 10
  }
}
```

### Upload de Arquivos

**Frontend (`src/pages/KnowledgeBase/KnowledgeBasePage.jsx`):**

```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

async function handleFileUpload(file, tenantId, userId) {
  const storage = getStorage();
  const fileRef = ref(storage, `${tenantId}/knowledge/${file.name}`);
  
  // Upload para Storage
  await uploadBytes(fileRef, file);
  const fileUrl = await getDownloadURL(fileRef);
  
  // Salvar metadata no Firestore
  await addDoc(collection(db, 'knowledge_base', tenantId, 'documents'), {
    name: file.name,
    fileUrl: fileUrl,
    uploadedBy: userId,
    uploadedAt: new Date().toISOString(),
    status: 'processing',
    metadata: {
      size: file.size,
      type: file.type
    }
  });
  
  // Processar arquivo (extração de texto)
  // Pode ser feito via Cloud Function triggered por Storage
}
```

### Cloud Function para Processar Arquivos

**Trigger**: Storage Upload

```python
@functions_framework.cloud_event
def process_knowledge_file(cloud_event):
    data = cloud_event.data
    bucket_name = data['bucket']
    file_name = data['name']
    
    # Extrair tenant_id do path
    tenant_id = file_name.split('/')[0]
    
    # Download do arquivo
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    content = blob.download_as_bytes()
    
    # Extrair texto (PDF, DOCX, TXT)
    if file_name.endswith('.pdf'):
        text = extract_pdf_text(content)
    elif file_name.endswith('.txt'):
        text = content.decode('utf-8')
    
    # Atualizar Firestore
    db = firestore.Client()
    docs_ref = db.collection('knowledge_base').document(tenant_id)\
                 .collection('documents')
    
    # Find document by file name
    query = docs_ref.where('name', '==', file_name.split('/')[-1]).limit(1)
    for doc in query.stream():
        doc.reference.update({
            'content': text,
            'status': 'indexed',
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
```

---

## 📱 Integração WhatsApp {#whatsapp}

### Opção 1: API Oficial do Meta

**Configuração no Frontend:**

```javascript
// src/services/whatsappService.js
export async function sendWhatsAppMessage(phoneNumberId, accessToken, to, message) {
  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message }
    })
  });
  
  return response.json();
}
```

**Backend (Cloud Function para Webhooks):**

```python
@functions_framework.http
def whatsapp_webhook(request):
    if request.method == 'GET':
        # Verificação do webhook
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        
        if mode == 'subscribe' and token == 'insightesfera_token':
            return challenge
        return 'Forbidden', 403
    
    # POST - Mensagem recebida
    data = request.get_json()
    
    # Extrair mensagem
    entry = data.get('entry', [])[0]
    changes = entry.get('changes', [])[0]
    value = changes.get('value', {})
    messages = value.get('messages', [])
    
    if not messages:
        return jsonify({'status': 'ok'})
    
    message = messages[0]
    from_number = message.get('from')
    text = message.get('text', {}).get('body', '')
    
    # Identificar tenant (por phoneNumberId)
    phone_number_id = value.get('metadata', {}).get('phone_number_id')
    
    # Buscar tenant por phoneNumberId
    db = firestore.Client()
    agents = db.collection('agent_configs').where('whatsapp.phoneNumberId', '==', phone_number_id).stream()
    
    for agent in agents:
        tenant_id = agent.id
        config = agent.to_dict()
        
        # Processar mensagem com IA
        response_text = process_with_gemini(text, tenant_id, config)
        
        # Enviar resposta
        send_whatsapp_message(
            phone_number_id,
            config['whatsapp']['accessToken'],
            from_number,
            response_text
        )
    
    return jsonify({'status': 'ok'})
```

### Opção 2: Evolution API (Simples para testes)

Já está configurada na VM `saas-chatbot` na porta 8080.

**Endpoint**: `http://35.258.24.59:8080`

---

## ✅ Checklist Final {#checklist}

### Correções Urgentes
- [ ] Corrigir `useAuth.js` (código fornecido acima)
- [ ] Verificar `.env` existe e tem todas as variáveis
- [ ] Limpar `node_modules` e reinstalar
- [ ] Testar `npm run dev` localmente

### Deploy na VM
- [ ] Build da aplicação (`npm run build`)
- [ ] Copiar para VM (via SCP ou Git)
- [ ] Configurar Nginx ou Docker
- [ ] Acessar via IP da VM: `http://35.258.24.59`

### Firebase
- [ ] Aplicar regras de segurança no Firestore
- [ ] Testar registro de usuário
- [ ] Verificar criação de `users/{uid}` e `tenants/{tenantId}`

### Agente de IA
- [ ] Deploy Cloud Function `iris-webhook`
- [ ] Testar endpoint manualmente (Postman/curl)
- [ ] Integrar no frontend (`aiChatService.js`)

### Base de Conhecimento
- [ ] Implementar upload de arquivos
- [ ] Deploy Cloud Function para processar arquivos
- [ ] Testar extração de texto

### WhatsApp (Opcional para MVP)
- [ ] Configurar webhook no Meta Dashboard
- [ ] Deploy Cloud Function `whatsapp_webhook`
- [ ] Testar envio/recebimento de mensagens

---

## 🆘 Suporte Rápido

Se der erro, verifique na ordem:

1. **Console do navegador** (F12) - veja erros JavaScript
2. **Terminal onde roda `npm run dev`** - veja erros de build
3. **Firebase Console** - veja se usuários estão sendo criados
4. **Network Tab (F12)** - veja se chamadas API falham

---

**Arquivos Importantes:**
- `useAuth.js` - Autenticação
- `.env` - Variáveis do Firebase
- `firebase.js` - Inicialização do Firebase
- `App.jsx` - Rotas

**Próximo Passo:**
Corrija o `useAuth.js` e rode `npm run dev` novamente!
