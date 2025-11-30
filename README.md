# EsferaZap SaaS

Plataforma SaaS de automação WhatsApp com IA para atendimento, vendas e marketing.

---

## Tech Stack

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.1.0 | Biblioteca principal de UI |
| **Vite** | 6.3.5 | Build tool e dev server |
| **Tailwind CSS** | 4.1.7 | Framework CSS utility-first |
| **React Router DOM** | 7.6.1 | Roteamento SPA |
| **Firebase** | 12.3.0 | Auth, Firestore, Hosting |
| **Radix UI** | latest | Componentes acessíveis headless |
| **Framer Motion** | 12.15.0 | Animações |
| **Recharts** | 2.15.3 | Gráficos e dashboards |
| **React Hook Form** | 7.56.3 | Gerenciamento de formulários |
| **Zod** | 3.24.4 | Validação de schemas |
| **Lucide React** | 0.510.0 | Ícones |
| **Sonner** | 2.0.3 | Toast notifications |
| **date-fns** | 3.6.0 | Manipulação de datas |
| **cmdk** | 1.1.1 | Command palette |
| **Embla Carousel** | 8.6.0 | Carrosséis |

### Backend / Cloud

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Firebase Auth** | - | Autenticação de usuários |
| **Cloud Firestore** | - | Banco de dados NoSQL |
| **Firebase Hosting** | - | Hospedagem do frontend |
| **Google Cloud Functions** | - | Serverless functions |
| **Google Cloud AI Platform** | 1.x | Vertex AI / Gemini |
| **Flask** | 3.x | Framework Python para webhooks |
| **Python** | 3.11+ | Runtime das Cloud Functions |

### Integrações

| Serviço | Descrição |
|---------|-----------|
| **WhatsApp Business API** | Automação de mensagens |
| **Evolution API** | Gateway WhatsApp não-oficial |
| **Vertex AI (Gemini)** | IA conversacional |

### DevOps / Tooling

| Ferramenta | Descrição |
|------------|-----------|
| **pnpm** | Package manager |
| **ESLint** | Linting de código |
| **Docker** | Containerização |
| **Nginx** | Reverse proxy |
| **GitHub Actions** | CI/CD |

---

## Quick Start

```bash
# Clone o repositório
git clone https://github.com/Ericobon/esferazap_SaaS_final.git
cd esferazap_SaaS_final

# Instale as dependências
npm install --legacy-peer-deps

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## Estrutura do Projeto

```
EsferaZap2/
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # AppLayout, Sidebar
│   │   └── brand/       # Logo, branding
│   ├── pages/           # Páginas da aplicação
│   │   ├── Auth/        # Login, Register
│   │   ├── Dashboard/   # Dashboard principal
│   │   ├── Chat/        # Interface WhatsApp
│   │   ├── KnowledgeBase/
│   │   ├── Settings/
│   │   └── Onboarding/
│   ├── hooks/           # Custom hooks (useAuth)
│   ├── services/        # Serviços externos
│   └── lib/             # Utils, Firebase config
├── cloud-functions/     # Google Cloud Functions
│   └── iris-webhook/    # Webhook para WhatsApp
├── agents/              # Documentação dos agentes
└── public/              # Assets estáticos
```

---

## Rotas da Aplicação

| Rota | Componente | Proteção |
|------|------------|----------|
| `/` | Redirect | - |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/dashboard` | DashboardOverview | Autenticado |
| `/chat` | ChatPage | Autenticado |
| `/leads` | CompraLeads | Autenticado |
| `/knowledge` | KnowledgeBasePage | Autenticado |
| `/settings` | AgentConfigPage | Autenticado |
| `/onboarding` | OnboardingWizard | Autenticado |

---

## Variáveis de Ambiente

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

---

# Roadmap Evoluído: SaaS Chatbot Multi-tenant WhatsApp

**Status Atual:** Autenticação e Multi-tenant implementados

**Stack Principal:**
- **IA/LLM:** Vertex AI (Gemini 2.5 Flash/Pro)
- **Backend:** Cloud Run (Serverless)
- **Dados:** Cloud Firestore + BigQuery
- **Frontend:** React/Next.js (Firebase Hosting)
- **Mensageria:** Meta WhatsApp Business API

---

## FASE 1: Core de Conversação e IA (PRIORIDADE MÁXIMA)

### 1.1 Pipeline de Mensagens WhatsApp
**Objetivo:** Estabelecer o fluxo bidirecional de mensagens

- [ ] **Webhook Handler (Cloud Run)**
  - Endpoint POST `/webhook/whatsapp` para receber mensagens da Meta
  - Validação de assinatura da Meta (segurança)
  - Extração de `tenant_id` via `whatsapp_business_account_id`
  - Sistema de filas para processar mensagens (Cloud Tasks/Pub/Sub)
  - Rate limiting por tenant (evitar sobrecarga)

- [ ] **Message Sender Service**
  - Função centralizada para envio via Meta API
  - Retry logic com backoff exponencial
  - Cache de tokens da Meta por tenant
  - Log estruturado de todas as mensagens (entrada/saída)

- [ ] **Session Management**
  - Armazenar contexto de conversação no Firestore
  - TTL de 24h para sessões (alinhado com janela do WhatsApp)
  - Estrutura: `sessions/{tenant_id}/conversations/{phone_number}`

### 1.2 Motor de IA Personalizado
**Objetivo:** IA que se adapta a cada cliente

- [ ] **Dynamic Prompt Builder**
- [ ] **RAG per Tenant (Vertex AI Search)**
- [ ] **Fallback Strategy**

### 1.3 Observabilidade e Debug
- [ ] **Structured Logging**
- [ ] **Cost Tracking**

---

## FASE 2: Gestão de Leads e Campanhas B2B

### 2.1 Motor de Segmentação Avançado
- [ ] **Query Builder Service**
- [ ] **Lead Enrichment Pipeline**
- [ ] **Preview de Audiência**

### 2.2 Orquestrador de Campanhas
- [ ] **Campaign Scheduler**
- [ ] **Personalization Engine**
- [ ] **Smart Throttling**

### 2.3 CRM Simplificado
- [ ] **Lead Inbox**
- [ ] **Conversation Analytics**

---

## FASE 3: UI/UX de Excelência

### 3.1 Dashboard Estratégico
- [ ] **Métricas em Tempo Real**
- [ ] **Gráficos Interativos (Recharts)**

### 3.2 Configurador de Agente (No-Code)
- [ ] **Prompt Wizard**
- [ ] **Knowledge Base Manager**
- [ ] **Business Rules Engine**

### 3.3 Campaign Builder
- [ ] **Fluxo Simplificado**
- [ ] **Campaign Simulator**

---

## FASE 4: Escalabilidade e DevOps

### 4.1 Infrastructure as Code
- [ ] **Terraform/Pulumi Setup**
- [ ] **CI/CD Pipeline (Cloud Build)**

### 4.2 Resiliência e Disaster Recovery
- [ ] **Multi-Region Setup**
- [ ] **Backup Automático**
- [ ] **Health Checks**

### 4.3 Security Hardening
- [ ] **API Security**
- [ ] **Data Privacy**
- [ ] **Audit Trail**

---

## FASE 5: Monetização e Growth

### 5.1 Billing Inteligente
- [ ] **Planos Tier-Based**
- [ ] **Usage-Based Add-ons**
- [ ] **Payment Gateway**

### 5.2 Analytics para Vendas
- [ ] **Customer Health Score**
- [ ] **Feature Usage Tracking**

### 5.3 Viral Loop
- [ ] **Referral Program**
- [ ] **White-Label (Enterprise)**

---

## Métricas de Sucesso (North Star)

| Métrica | Meta MVP | Meta 6 meses |
|---------|----------|--------------|
| **MRR** | R$ 10k | R$ 100k |
| **Tenants Ativos** | 30 | 300 |
| **Churn Mensal** | < 10% | < 5% |
| **NPS** | > 30 | > 50 |
| **Uptime** | 99% | 99.9% |

---

## Licença

Propriedade de InsightEsfera - Todos os direitos reservados.

**Última Atualização:** Novembro 2024
