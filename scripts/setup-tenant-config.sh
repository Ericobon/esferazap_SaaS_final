#!/bin/bash

# ============================================
# Script: Criar arquivos de configuração do tenant
# ============================================

set -e

PROJECT_ID="silent-text-458716-c9"
BUCKET_NAME="chatbot-iris-platform"
TENANT_ID="insightesfera"

echo "🔧 Criando arquivos de configuração para tenant: $TENANT_ID"
echo ""

# Criar diretório temporário
TMP_DIR=$(mktemp -d)
cd $TMP_DIR

# ============================================
# 1. tenant.json
# ============================================
echo "📝 Criando tenant.json..."
cat > tenant.json << 'EOF'
{
  "tenant_id": "insightesfera",
  "name": "InsightEsfera",
  "active": true,
  "created_at": "2025-11-29T00:00:00Z",
  "whatsapp": {
    "instance_name": "insightesfera-whatsapp",
    "phone_number": null,
    "phone_number_id": null,
    "business_account_id": null,
    "meta_app_id": null,
    "webhook_verify_token": "insightesfera-webhook-2025"
  },
  "ai": {
    "model": "gemini-1.5-flash-002",
    "max_tokens": 500,
    "temperature": 0.7,
    "language": "pt-BR"
  },
  "features": {
    "text_chat": true,
    "voice_chat": false,
    "lead_capture": true,
    "handoff_to_human": true,
    "rag_enabled": true
  },
  "branding": {
    "bot_name": "IRIS",
    "company_name": "InsightEsfera",
    "primary_color": "#3B82F6",
    "logo_url": null
  },
  "contacts": {
    "email": "contato@insightesfera.io",
    "phone": "(11) 99999-9999",
    "website": "www.insightesfera.io"
  }
}
EOF

# ============================================
# 2. System Prompt
# ============================================
echo "📝 Criando system prompt..."
cat > default.txt << 'EOF'
Você é IRIS, assistente virtual da InsightEsfera.

SOBRE A INSIGHTESFERA:
A InsightEsfera é uma consultoria especializada em transformação digital através de dados e inteligência artificial. Fundada em 2024, atendemos empresas de todos os portes no Brasil.

SUAS RESPONSABILIDADES:
- Responder perguntas sobre nossos serviços de forma clara e objetiva
- Ser profissional, prestativa e empática
- Usar sempre a base de conhecimento fornecida no CONTEXTO
- Manter respostas concisas (máximo 500 caracteres quando possível)
- Identificar oportunidades de negócio e capturar leads qualificados

SERVIÇOS PRINCIPAIS:
1. Consultoria em Business Intelligence (BI)
2. Data Science & Machine Learning
3. Automação com IA
4. Engenharia de Dados

REGRAS IMPORTANTES:
1. Se a informação estiver no CONTEXTO fornecido, use-a para responder
2. Se NÃO souber a resposta, seja honesta e ofereça contato com um humano
3. Sempre seja educada, empática e profissional
4. NUNCA invente informações que não estejam na base de conhecimento
5. Respostas devem ser em português brasileiro
6. Use emojis quando apropriado para tornar a conversa mais amigável
7. Se detectar interesse comercial, ofereça agendar reunião

INFORMAÇÕES DE CONTATO:
- Email: contato@insightesfera.io
- WhatsApp: (11) 99999-9999
- Site: www.insightesfera.io

EXEMPLO DE BOA RESPOSTA:
"Olá! 👋 A InsightEsfera oferece consultoria em BI, Data Science, Automação com IA e Engenharia de Dados. Posso te passar mais detalhes sobre algum serviço específico?"

EXEMPLO DE RESPOSTA RUIM:
"Não sei. Tchau."

FORMATO DE RESPOSTA:
Sempre estruture suas respostas de forma clara, usando:
- Listas numeradas ou com bullet points quando listar itens
- Emojis para destacar pontos importantes
- Perguntas de acompanhamento para engajar o usuário
EOF

# ============================================
# 3. Base de Conhecimento
# ============================================
echo "📝 Criando base de conhecimento..."
cat > insightesfera_completo.md << 'EOF'
# Base de Conhecimento - InsightEsfera

## Sobre Nós

A InsightEsfera é uma consultoria especializada em transformação digital através de dados e inteligência artificial.

Fundada em 2024, atendemos empresas de todos os portes no Brasil, com foco em entregar soluções práticas e mensuráveis.

Nossa missão é democratizar o acesso a tecnologias avançadas de dados e IA, tornando-as acessíveis e aplicáveis para empresas de qualquer porte.

## Serviços Oferecidos

### 1. Consultoria em Business Intelligence (BI)

Transformamos dados em insights acionáveis para tomada de decisão estratégica.

**O que oferecemos:**
- Implementação de dashboards executivos e operacionais
- Desenvolvimento em Power BI, Tableau, Looker e Google Data Studio
- Integração de múltiplas fontes de dados (ERP, CRM, bancos de dados)
- Criação de cultura data-driven nas organizações
- KPI design e frameworks de mensuração
- Self-service BI e capacitação de equipes

**Benefícios:**
- Tomada de decisão baseada em dados reais
- Visibilidade completa do negócio em tempo real
- Redução de custos através de insights operacionais
- Aumento de receita através de análise de oportunidades

**Casos de uso comuns:**
- Dashboard de vendas e faturamento
- Análise de performance de marketing
- Controle de estoque e logística
- Análise financeira e orçamentária

### 2. Data Science & Machine Learning

Desenvolvemos modelos preditivos e prescritivos para otimizar processos e prever tendências.

**Serviços incluem:**
- Modelos preditivos customizados
- Análise de churn (previsão de cancelamento)
- Sistemas de recomendação personalizada
- Otimização de processos e recursos
- Análise de séries temporais e forecasting
- Detecção de anomalias e fraudes
- Segmentação avançada de clientes (clustering)

**Tecnologias:**
- Python (scikit-learn, TensorFlow, PyTorch)
- R para análises estatísticas
- MLOps e deploy de modelos em produção
- AutoML para democratização

**Resultados típicos:**
- 20-30% de redução em churn
- 15-25% de aumento em conversão através de recomendações
- 30-40% de melhoria em previsões de demanda

### 3. Automação com IA

Automatizamos processos repetitivos usando inteligência artificial.

**Soluções:**
- Chatbots inteligentes para atendimento ao cliente
- Processamento de linguagem natural (NLP)
- OCR e análise inteligente de documentos
- RPA (Robotic Process Automation) com IA
- Assistentes virtuais corporativos
- Automação de respostas em redes sociais
- Classificação automática de tickets e demandas

**Casos de sucesso:**
- Chatbot que atende 80% das dúvidas de clientes automaticamente
- OCR que processa 1000+ notas fiscais por dia
- Automação de triagem de currículos com 90% de precisão

**Benefícios:**
- Redução de 60-80% em tempo de processos manuais
- Disponibilidade 24/7 para atendimento
- Escalabilidade sem aumento proporcional de custos
- Melhoria na experiência do cliente

### 4. Engenharia de Dados

Construímos a fundação necessária para projetos de dados e IA.

**Serviços:**
- Arquitetura de data lakes e data warehouses
- Pipelines de ETL/ELT robustos e escaláveis
- Governança e qualidade de dados
- Migração para cloud (GCP, AWS, Azure)
- Streaming de dados em tempo real
- Data catalog e metadados
- Implementação de DataOps

**Tecnologias:**
- Google Cloud Platform (BigQuery, Dataflow, Pub/Sub)
- AWS (Redshift, Glue, Kinesis)
- Apache Spark, Airflow, dbt
- Ferramentas de orquestração modernas

**Entregas típicas:**
- Data warehouse dimensional (Kimball ou Data Vault)
- Pipelines automatizados de ingestão de dados
- Catálogo de dados corporativo
- Framework de qualidade de dados

## Metodologia de Trabalho

### Processo de Consultoria

**1. Discovery (1-2 semanas)**
- Entendimento do negócio e desafios
- Mapeamento de dados disponíveis
- Definição de objetivos e KPIs
- Proposta técnica detalhada

**2. Prova de Conceito - PoC (2-4 semanas)**
- Validação da viabilidade técnica
- Protótipo funcional
- Demonstração de valor rápido
- Ajustes baseados em feedback

**3. Desenvolvimento (4-12 semanas)**
- Implementação completa da solução
- Testes e validações
- Documentação técnica
- Capacitação da equipe

**4. Deploy e Acompanhamento (contínuo)**
- Colocação em produção
- Monitoramento e otimização
- Suporte técnico
- Evolução incremental

## Modelos de Precificação

### Consultoria por Hora
- **Valor:** R$ 300/hora
- **Ideal para:** Projetos pequenos, consultorias pontuais
- **Inclui:** Reuniões, análises, desenvolvimento
- **Mínimo:** 10 horas

### Projetos Fechados
- **Valor:** Sob consulta (a partir de R$ 15.000)
- **Ideal para:** Projetos com escopo bem definido
- **Inclui:** Discovery, desenvolvimento, deploy, 30 dias de suporte
- **Formas de pagamento:** Parcelado conforme milestones

### Retainer Mensal
- **Valor:** A partir de R$ 10.000/mês
- **Ideal para:** Empresas que precisam de suporte contínuo
- **Inclui:**
  - Horas dedicadas mensais (40-160h/mês)
  - Acesso prioritário ao time
  - Evolução contínua de soluções
  - Relatórios mensais
- **Disponível em:** Contratos de 6 ou 12 meses

### Equity/Revenue Share
- **Para startups selecionadas**
- Investimos expertise em troca de participação
- Avaliação caso a caso

## Tecnologias e Ferramentas

### Linguagens
- Python, R, SQL, JavaScript
- Scala para big data

### Cloud Platforms
- Google Cloud Platform (GCP) - preferencial
- Amazon Web Services (AWS)
- Microsoft Azure

### BI Tools
- Power BI, Tableau, Looker, Metabase
- Google Data Studio

### Big Data
- Apache Spark, Hadoop
- Google BigQuery, AWS Redshift
- Databricks

### Machine Learning
- TensorFlow, PyTorch, scikit-learn
- Vertex AI, SageMaker
- MLflow para MLOps

### Orquestração
- Apache Airflow, Prefect
- dbt para transformações

## Diferenciais

### Por que escolher a InsightEsfera?

1. **Expertise Prático:** Time com experiência em empresas Fortune 500 e startups unicórnio
2. **Foco em ROI:** Todas as soluções são mensuráveis e entregam valor tangível
3. **Flexibilidade:** Adaptamos nossa metodologia ao seu contexto
4. **Transparência:** Comunicação clara e alinhamento constante
5. **Capacitação:** Transferimos conhecimento para seu time
6. **Suporte Pós-Projeto:** Não abandonamos você após o deploy

## Clientes e Casos de Uso

### Segmentos Atendidos
- E-commerce e Varejo
- Serviços Financeiros
- Saúde e Farmacêutico
- Indústria e Manufatura
- Tecnologia e SaaS
- Educação

### Tamanho de Empresas
- **Pequenas empresas:** Soluções acessíveis e escaláveis
- **Médias empresas:** Estruturação completa de dados
- **Grandes corporações:** Projetos enterprise complexos

## Processo de Contratação

### Como começar?

**1. Primeiro Contato**
- Entre em contato via email, WhatsApp ou site
- Conte-nos sobre seu desafio de negócio
- Agende uma conversa inicial (gratuita)

**2. Reunião de Discovery**
- Conversa de 30-60 minutos
- Entendimento do contexto e necessidades
- Discussão de possíveis abordagens

**3. Proposta Comercial**
- Proposta técnica detalhada
- Cronograma e investimento
- Termos contratuais

**4. Kick-off do Projeto**
- Assinatura do contrato
- Alinhamento de expectativas
- Início imediato do trabalho

### Tempo de Resposta
- Email: até 24 horas úteis
- WhatsApp: até 4 horas úteis
- Urgências: contato direto com nosso time

## Perguntas Frequentes (FAQ)

### Sobre Atendimento

**P: Atendem empresas pequenas?**
R: Sim! Temos soluções para empresas de todos os portes. Para pequenas empresas, oferecemos pacotes mais enxutos e ferramentas com melhor custo-benefício.

**P: Atendem todo o Brasil?**
R: Sim, atendemos empresas em todo o Brasil. Trabalhamos 100% remotamente, mas podemos fazer visitas presenciais quando necessário.

**P: Atendem empresas internacionais?**
R: Sim, temos experiência com projetos internacionais. Nosso time fala inglês fluentemente.

### Sobre Projetos

**P: Quanto tempo leva um projeto?**
R: Depende do escopo:
- Projetos pequenos (dashboard, análise): 2-4 semanas
- Projetos médios (data warehouse, chatbot): 6-12 semanas
- Projetos grandes (plataforma completa): 3-6 meses

**P: Vocês fazem manutenção depois do projeto?**
R: Sim! Todos os projetos incluem 30 dias de suporte gratuito. Depois, oferecemos planos de manutenção mensal.

**P: Posso começar com uma PoC (Prova de Conceito)?**
R: Sim! Recomendamos PoCs para projetos mais complexos. Normalmente custam 20-30% do projeto completo.

**P: Vocês assinam NDA?**
R: Sim, sem problemas. Confidencialidade é fundamental para nós.

### Sobre Tecnologia

**P: Trabalham com que tecnologias?**
R: Python, SQL, R, Power BI, Tableau, GCP, AWS, Azure, TensorFlow, PyTorch, Apache Spark, entre muitas outras.

**P: Posso escolher as ferramentas?**
R: Sim! Podemos trabalhar com suas ferramentas atuais ou recomendar as melhores para seu caso.

**P: Vocês fazem integração com nossos sistemas?**
R: Sim, integramos com ERPs, CRMs, APIs e qualquer fonte de dados que você tenha.

**P: As soluções são cloud ou on-premise?**
R: Preferimos cloud (GCP, AWS, Azure) pela escalabilidade e custo, mas podemos trabalhar on-premise se necessário.

### Sobre Pagamento

**P: Quais formas de pagamento aceitam?**
R: Transferência bancária, boleto, PIX. Para projetos maiores, parcelamos conforme milestones.

**P: Precisam de adiantamento?**
R: Para projetos fechados, normalmente 30-50% ao iniciar. Para retainer, pagamento mensal adiantado.

**P: Emitem nota fiscal?**
R: Sim, emitimos NF-e para todos os serviços.

### Sobre Suporte

**P: Oferecem suporte após o projeto?**
R: Sim! 30 dias de suporte gratuito em todos os projetos. Depois, planos mensais disponíveis.

**P: Fazem treinamento da equipe?**
R: Sim! Capacitação é parte fundamental de nossos projetos. Garantimos transferência de conhecimento.

**P: Como funciona o suporte emergencial?**
R: Para clientes com retainer, oferecemos SLA de 4h para urgências. Para outros, melhor esforço.

## Contato

### Informações para Contato

📧 **Email:** contato@insightesfera.io
📱 **Telefone/WhatsApp:** (11) 99999-9999
🌐 **Site:** www.insightesfera.io
📍 **Localização:** São Paulo, SP - Brasil

### Redes Sociais

💼 **LinkedIn:** /company/insightesfera
🐦 **Twitter:** @insightesfera
📘 **Medium:** blog.insightesfera.io

### Horário de Atendimento

- **Segunda a Sexta:** 9h às 18h (horário de Brasília)
- **WhatsApp:** Respondemos em até 4 horas úteis
- **Email:** Respondemos em até 24 horas úteis

### Como Agendar uma Reunião

1. Entre em contato por email ou WhatsApp
2. Informe sua disponibilidade
3. Receberá link do Google Meet
4. Primeira reunião sempre gratuita!

---

**Última atualização:** Novembro 2025
**Versão:** 1.0
EOF

# ============================================
# 4. RAG Index (placeholder)
# ============================================
echo "📝 Criando RAG index..."
cat > index.json << 'EOF'
{
  "version": "1.0",
  "created_at": "2025-11-29T00:00:00Z",
  "last_updated": "2025-11-29T00:00:00Z",
  "documents": [
    {
      "id": "knowledge-base-main",
      "name": "insightesfera_completo.md",
      "path": "tenants/insightesfera/knowledge/normalized/pt-BR/insightesfera_completo.md",
      "type": "markdown",
      "size_bytes": 0,
      "chunks": 0,
      "indexed": false
    }
  ],
  "index_method": "simple_rag",
  "language": "pt-BR"
}
EOF

# ============================================
# Upload para GCS
# ============================================
echo ""
echo "📤 Fazendo upload dos arquivos para GCS..."

gsutil cp tenant.json "gs://$BUCKET_NAME/tenants/$TENANT_ID/config/tenant.json"
echo "  ✓ tenant.json"

gsutil cp default.txt "gs://$BUCKET_NAME/tenants/$TENANT_ID/prompts/pt-BR/v1/system/default.txt"
echo "  ✓ default.txt (system prompt)"

gsutil cp insightesfera_completo.md "gs://$BUCKET_NAME/tenants/$TENANT_ID/knowledge/normalized/pt-BR/insightesfera_completo.md"
echo "  ✓ insightesfera_completo.md (knowledge base)"

gsutil cp index.json "gs://$BUCKET_NAME/tenants/$TENANT_ID/rag/index.json"
echo "  ✓ index.json (RAG index)"

# Limpar arquivos temporários
cd -
rm -rf $TMP_DIR

echo ""
echo "✅ Configuração do tenant criada com sucesso!"
echo ""
echo "📂 Arquivos criados em GCS:"
echo "  • gs://$BUCKET_NAME/tenants/$TENANT_ID/config/tenant.json"
echo "  • gs://$BUCKET_NAME/tenants/$TENANT_ID/prompts/pt-BR/v1/system/default.txt"
echo "  • gs://$BUCKET_NAME/tenants/$TENANT_ID/knowledge/normalized/pt-BR/insightesfera_completo.md"
echo "  • gs://$BUCKET_NAME/tenants/$TENANT_ID/rag/index.json"
echo ""
echo "🔍 Verificar arquivos:"
echo "  gsutil ls -r gs://$BUCKET_NAME/tenants/$TENANT_ID/"
echo ""
echo "🎯 Próximo passo: Criar Cloud Function para processar mensagens"
