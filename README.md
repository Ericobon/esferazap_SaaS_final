# 🚀 Roadmap Evoluído: SaaS Chatbot Multi-tenant WhatsApp

**Status Atual:** Autenticação e Multi-tenant implementados ✅

**Stack Principal:**
- **IA/LLM:** Vertex AI (Gemini 2.5 Flash/Pro)
- **Backend:** Cloud Run (Serverless)
- **Dados:** Cloud Firestore + BigQuery
- **Frontend:** React/Next.js (Firebase Hosting)
- **Mensageria:** Meta WhatsApp Business API

---

## 🎯 FASE 1: Core de Conversação e IA (PRIORIDADE MÁXIMA)

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
  ```typescript
  interface PromptContext {
    tenantConfig: {
      persona: string;
      businessRules: string[];
      tone: 'formal' | 'casual' | 'technical';
    };
    ragContext: string[];
    conversationHistory: Message[];
    userMessage: string;
  }
  ```

- [ ] **RAG per Tenant (Vertex AI Search)**
  - Script de provisionamento automático de Data Store por tenant
  - API de ingestão de documentos com parsing inteligente
  - Suporte a múltiplos formatos: PDF, DOCX, CSV, TXT, JSON
  - Chunking strategy otimizada (overlap de 50 tokens)
  - Embeddings storage no Vector Search

- [ ] **Fallback Strategy**
  - Se RAG não encontrar resposta relevante (score < 0.7)
  - Usar conhecimento base do Gemini com disclaimer
  - Opção de escalar para humano (futuro)

### 1.3 Observabilidade e Debug
**Objetivo:** Visibilidade total do que está acontecendo

- [ ] **Structured Logging**
  - Cloud Logging com labels: `tenant_id`, `conversation_id`, `intent`
  - Trace de cada mensagem: recebimento → processamento → resposta
  - Latência de cada etapa (webhook, RAG, LLM, envio)

- [ ] **Cost Tracking**
  - Contador de tokens por tenant (input + output)
  - Estimativa de custo em tempo real
  - Dashboard de consumo no admin

---

## 📊 FASE 2: Gestão de Leads e Campanhas B2B

### 2.1 Motor de Segmentação Avançado
**Objetivo:** Targeting preciso de leads

- [ ] **Query Builder Service**
  - API que recebe filtros complexos e gera SQL BigQuery
  - Filtros suportados:
    - CNAEs (múltiplos, com operador OR/AND)
    - Localização (Estado, Cidade, Região)
    - Faturamento estimado (ranges)
    - Número de funcionários
    - Data de abertura da empresa
  
- [ ] **Lead Enrichment Pipeline**
  - Ao criar campanha, enrichar leads com dados públicos
  - Validar telefones (formato WhatsApp válido)
  - Deduplicação automática
  - Score de qualidade do lead (1-100)

- [ ] **Preview de Audiência**
  - Antes de lançar campanha, mostrar:
    - Total de leads que serão impactados
    - Distribuição geográfica (mapa)
    - Distribuição por CNAE (gráfico)
    - Custo estimado da campanha

### 2.2 Orquestrador de Campanhas
**Objetivo:** Disparos inteligentes e escaláveis

- [ ] **Campaign Scheduler**
  - Usar Cloud Scheduler + Cloud Tasks
  - Respeitar limites da Meta (1000 msg/segundo)
  - Distribuição temporal (evitar spam em horários ruins)
  - Configuração de janelas de envio (ex: 9h-18h)

- [ ] **Personalization Engine**
  - Template de mensagem com variáveis: `{empresa}`, `{cnae}`, `{cidade}`
  - Testes A/B de mensagens (até 3 variações)
  - Rotação de templates para evitar ban

- [ ] **Smart Throttling**
  - Adaptar velocidade de envio baseado em:
    - Taxa de resposta em tempo real
    - Feedback negativo (bloqueios, reports)
    - Qualidade da conta WhatsApp (rating da Meta)

### 2.3 CRM Simplificado
**Objetivo:** Gestão pós-campanha

- [ ] **Lead Inbox**
  - View de todos os leads que responderam
  - Filtros: respondeu, não respondeu, qualificado, não qualificado
  - Ações rápidas: marcar como qualificado, agendar follow-up

- [ ] **Conversation Analytics**
  - Usar Gemini para classificar intenção do lead:
    - Interessado (hot lead)
    - Informação (precisa nurturing)
    - Negativo (não abordar novamente)
  - Extrair entidades: nome, cargo, dor mencionada

---

## 🎨 FASE 3: UI/UX de Excelência

### 3.1 Dashboard Estratégico
**Objetivo:** Cliente vê valor imediatamente

- [ ] **Métricas em Tempo Real**
  - Cards principais:
    - Conversas ativas (últimas 24h)
    - Taxa de resposta (% de leads que responderam)
    - Leads qualificados (classificados pela IA)
    - Custo total do mês (R$ e USD)
  
- [ ] **Gráficos Interativos (Recharts)**
  - Linha temporal: mensagens enviadas vs. recebidas
  - Funil: campanha enviada → aberto → respondido → qualificado
  - Heatmap: melhores horários de resposta

### 3.2 Configurador de Agente (No-Code)
**Objetivo:** Cliente configura sem código

- [ ] **Prompt Wizard**
  - Templates pré-definidos por indústria:
    - "Vendedor SaaS B2B agressivo"
    - "Consultor técnico educado"
    - "Atendente de suporte empático"
  - Editor rico com preview em tempo real
  - Validação: prompt não pode ter > 2000 caracteres

- [ ] **Knowledge Base Manager**
  - Drag-and-drop de arquivos
  - Preview de documentos antes do upload
  - Status de indexação em tempo real
  - Busca teste: cliente digita pergunta e vê resposta da IA

- [ ] **Business Rules Engine**
  - IF-THEN rules visuais:
    - "SE lead mencionar 'preço' → enviar tabela de preços"
    - "SE lead pedir demo → agendar via Calendly"
  - Limite de 10 regras por tenant (MVP)

### 3.3 Campaign Builder
**Objetivo:** Criar campanha em 3 cliques

- [ ] **Fluxo Simplificado**
  1. **Targeting:** Seletor visual de filtros
  2. **Mensagem:** Editor com preview do WhatsApp
  3. **Agendamento:** Calendário + horários permitidos
  
- [ ] **Campaign Simulator**
  - Antes de lançar, simular com 10 leads fake
  - Ver como a IA responderia perguntas comuns
  - Ajustar prompt se necessário

---

## 🔧 FASE 4: Escalabilidade e DevOps

### 4.1 Infrastructure as Code
**Objetivo:** Deploy reproduzível e versionado

- [ ] **Terraform/Pulumi Setup**
  - Provisionar toda infra via código
  - Ambientes separados: dev, staging, prod
  - State remoto no GCS (Google Cloud Storage)

- [ ] **CI/CD Pipeline (Cloud Build)**
  ```yaml
  # Fluxo automático
  1. Push na branch main
  2. Run tests (unit + integration)
  3. Build container image
  4. Deploy no Cloud Run (staging)
  5. Smoke tests
  6. Deploy no Cloud Run (prod) se aprovado
  ```

### 4.2 Resiliência e Disaster Recovery
**Objetivo:** SLA de 99.9%

- [ ] **Multi-Region Setup**
  - Cloud Run em `us-central1` (primary)
  - Failover automático para `southamerica-east1`
  - Firestore em modo multi-region

- [ ] **Backup Automático**
  - Firestore: export diário para GCS
  - BigQuery: snapshots semanais
  - Retenção de 30 dias

- [ ] **Health Checks**
  - Endpoint `/health` em todos os serviços
  - Cloud Monitoring alerta se downtime > 2min
  - PagerDuty integration para emergências

### 4.3 Security Hardening
**Objetivo:** Conformidade e segurança

- [ ] **API Security**
  - Rate limiting global: 100 req/min por tenant
  - API Keys com rotação trimestral
  - CORS restritivo (apenas domínios autorizados)

- [ ] **Data Privacy**
  - Criptografia at-rest (Firestore nativo)
  - Criptografia in-transit (TLS 1.3)
  - Anonymização de dados em logs
  - LGPD compliance: direito ao esquecimento (delete tenant)

- [ ] **Audit Trail**
  - Toda ação crítica logada:
    - Criação/edição de campanha
    - Upload de documentos
    - Alteração de configuração de IA
  - Logs imutáveis (WORM) por 1 ano

---

## 📈 FASE 5: Monetização e Growth

### 5.1 Billing Inteligente
**Objetivo:** Revenue recorrente previsível

- [ ] **Planos Tier-Based**
  ```
  Starter:   R$ 297/mês - 1k mensagens, 1 agente
  Growth:    R$ 997/mês - 10k mensagens, 3 agentes
  Enterprise: Custom   - Ilimitado, white-label
  ```

- [ ] **Usage-Based Add-ons**
  - Mensagens extras: R$ 0,10/msg
  - IA avançada (Gemini Pro): R$ 0,05/msg
  - Suporte prioritário: R$ 500/mês

- [ ] **Payment Gateway**
  - Integração Stripe (internacional)
  - Integração Asaas/Iugu (Brasil)
  - Cobrança automática via cartão/boleto
  - Suspensão automática se inadimplência > 7 dias

### 5.2 Analytics para Vendas
**Objetivo:** Dados para vender upgrade

- [ ] **Customer Health Score**
  - Algoritmo que calcula risco de churn:
    - Baixo uso (< 100 msg/mês)
    - Taxa de resposta caindo
    - Não acessa dashboard há 7 dias
  - Alerta para time de CS fazer outreach

- [ ] **Feature Usage Tracking**
  - Mixpanel/Amplitude integration
  - Track: criou campanha, configurou agente, fez upload
  - Identificar features pouco usadas

### 5.3 Viral Loop
**Objetivo:** Crescimento orgânico

- [ ] **Referral Program**
  - Gerar link único por tenant
  - Recompensa: 20% de desconto para ambos
  - Dashboard de referrals

- [ ] **White-Label (Enterprise)**
  - Tenant pode customizar:
    - Logo e cores
    - Domínio próprio (CNAME)
    - Remover branding do SaaS
  - Cobrar 3x o plano base

---

## 🎁 FASE 6: Diferenciais Competitivos

### 6.1 IA Multimodal
**Objetivo:** Suportar áudio, imagem e vídeo

- [ ] **Voice Notes**
  - Detectar áudio no webhook
  - Transcrever com Speech-to-Text
  - Processar como texto normal

- [ ] **Image Understanding**
  - Cliente envia foto de produto/documento
  - Gemini Vision API analisa
  - IA responde com base na imagem

- [ ] **Video Analysis** (Futuro)
  - Vertex AI Video Intelligence
  - Use case: leads enviam vídeo da empresa

### 6.2 Integrações Nativas
**Objetivo:** Ecossistema conectado

- [ ] **CRM Integration**
  - Webhook para RD Station, HubSpot, Pipedrive
  - Sincronizar leads qualificados automaticamente
  - Evitar trabalho manual

- [ ] **Calendar Integration**
  - Google Calendar / Calendly
  - IA pode agendar reunião automaticamente
  - "Você está livre terça às 14h?" → Agenda e envia link

- [ ] **Payment Links**
  - Integrar Stripe Payment Links
  - IA pode enviar link de pagamento no chat
  - Use case: vendas conversacionais

### 6.3 Humanização da IA
**Objetivo:** Conversas mais naturais

- [ ] **Response Timing**
  - Adicionar delay proporcional ao tamanho da resposta
  - Simular "digitando..." (typing indicator da Meta)
  - Máximo 5s de delay

- [ ] **Emotion Detection**
  - Analisar sentimento da mensagem do lead
  - Se negativo, suavizar tom da resposta
  - Se muito negativo, escalar para humano

- [ ] **Multilingual Support**
  - Auto-detect idioma do lead
  - Responder no mesmo idioma
  - Suporte inicial: PT-BR, EN, ES

---

## 🔮 FASE 7: Machine Learning Avançado

### 7.1 Predictive Lead Scoring
**Objetivo:** Focar nos leads certos

- [ ] **ML Model Training**
  - Treinar modelo no Vertex AI AutoML
  - Features: CNAE, localização, tamanho, interações
  - Label: lead converteu ou não
  - Re-treinar mensalmente com novos dados

- [ ] **Real-Time Scoring**
  - Ao receber mensagem, calcular score 0-100
  - Priorizar conversas com score > 70
  - Alertar vendedor humano para hot leads

### 7.2 Conversation Optimization
**Objetivo:** IA que aprende sozinha

- [ ] **A/B Testing Automático**
  - Testar 2-3 variações de prompt
  - Medir: taxa de resposta, satisfação, conversão
  - Vencedor vira padrão após 100 conversas

- [ ] **Reinforcement Learning** (Avançado)
  - RLHF (Reinforcement Learning from Human Feedback)
  - Cliente marca respostas boas/ruins
  - Fine-tune Gemini com esses dados

---

## 📋 Checklist de Lançamento (Go-Live)

### Pré-Lançamento
- [ ] Load testing: 1000 mensagens simultâneas
- [ ] Security audit: penetration testing
- [ ] Legal review: Termos de Uso, Política de Privacidade, LGPD
- [ ] Meta Business Verification (obrigatório)
- [ ] Configurar domínio com SSL
- [ ] Onboarding de 5 beta customers

### Lançamento
- [ ] Soft launch: liberar para 50 usuários
- [ ] Monitorar 24/7 por 1 semana
- [ ] Coletar feedback e iterar
- [ ] Public launch: anunciar em redes sociais

### Pós-Lançamento
- [ ] Customer success check-in (7, 30, 90 dias)
- [ ] Roadmap público (Trello/Notion compartilhado)
- [ ] Blog com case studies de clientes

---

## 🎯 Métricas de Sucesso (North Star)

| Métrica | Meta MVP | Meta 6 meses |
|---------|----------|--------------|
| **MRR** | R$ 10k | R$ 100k |
| **Tenants Ativos** | 30 | 300 |
| **Churn Mensal** | < 10% | < 5% |
| **NPS** | > 30 | > 50 |
| **Uptime** | 99% | 99.9% |
| **Tempo de Resposta (p95)** | < 3s | < 2s |

---

## 💡 Dicas de Execução

### Priorização
1. **Faça funcionar** (MVP feio mas funcional)
2. **Faça escalar** (otimize gargalos)
3. **Faça bonito** (UX refinada)

### Anti-Patterns a Evitar
- ❌ Overengineering: não construa para 1M de usuários se tem 10
- ❌ Feature creep: resista a adicionar "só mais uma feature"
- ❌ Perfeccionismo: ship com 80% de qualidade, itere depois

### Quando Pedir Ajuda
- Contratar dev se roadmap > 6 meses solo
- Consultor GCP se custos > R$ 5k/mês
- Advogado para contrato enterprise

---

**Última Atualização:** Novembro 2024  
**Versão:** 2.0  
**Autor:** Roadmap Evolutivo
