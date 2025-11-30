#!/usr/bin/env python3
"""
Criador de Agentes para EsferaZap2
Sistema de automação WhatsApp Business com IA
"""

import os
import json
from pathlib import Path
from datetime import datetime

# Agentes especializados para EsferaZap2
AGENTS = {
    "orchestrator": {
        "description": "🎯 Coordenador Principal - Delega e Supervisiona Todos os Agentes",
        "responsibilities": [
            "Analisar projeto completo e priorizar tarefas",
            "Criar roadmap detalhado de implementação",
            "Delegar tarefas para agentes especializados",
            "Coordenar dependências entre agentes",
            "Validar entregas e garantir integração",
            "Resolver conflitos entre implementações",
            "Manter documentação atualizada"
        ],
        "focus": ["project-overview", "task-delegation", "integration"],
        "icon": "🎯"
    },

    "frontend-architect": {
        "description": "Arquiteto Frontend - React, shadcn/ui, Tailwind",
        "responsibilities": [
            "Revisar estrutura React atual (src/)",
            "Melhorar organização de componentes",
            "Implementar design system consistente",
            "Otimizar performance (lazy loading, code splitting)",
            "Melhorar roteamento com React Router"
        ],
        "focus": ["src/components/", "src/pages/", "src/App.css"],
        "icon": "🎨"
    },

    "backend-integration": {
        "description": "Especialista em Backend Integration",
        "responsibilities": [
            "Criar camada de API consistente",
            "Integrar Firebase Auth com frontend",
            "Implementar sistema de leads (imagem 1)",
            "Criar hooks customizados para API",
            "Gerenciar estado global (Context/Zustand)"
        ],
        "focus": ["src/services/", "src/hooks/", "src/contexts/"],
        "icon": "🔌"
    },

    "firebase-specialist": {
        "description": "Especialista Firebase & Auth",
        "responsibilities": [
            "Configurar Firebase Auth completamente",
            "Implementar Firestore queries otimizadas",
            "Criar sistema de permissões/roles",
            "Implementar real-time updates",
            "Setup Cloud Functions (se necessário)"
        ],
        "focus": ["src/firebase/", "firestore.rules", "firebase.json"],
        "icon": "🔥"
    },

    "whatsapp-automation": {
        "description": "Especialista em Automação WhatsApp",
        "responsibilities": [
            "Integrar com WhatsApp Business API",
            "Criar sistema de bots de IA",
            "Implementar upload de documentos (imagem 1)",
            "Criar dashboard de conversas",
            "Implementar sistema de campanhas"
        ],
        "focus": ["src/features/whatsapp/", "src/features/campaigns/"],
        "icon": "💬"
    },

    "ui-components": {
        "description": "Especialista em Componentes UI",
        "responsibilities": [
            "Revisar componentes shadcn/ui atuais",
            "Criar componentes customizados",
            "Implementar sistema de leads (imagem 1)",
            "Melhorar formulários e validação",
            "Adicionar animações com Framer Motion"
        ],
        "focus": ["src/components/ui/", "src/components/"],
        "icon": "🧩"
    },

    "playwright-e2e": {
        "description": "Testes E2E com Playwright (MCP configurado)",
        "responsibilities": [
            "Criar testes E2E para fluxos principais",
            "Testar integração WhatsApp",
            "Testar sistema de leads",
            "Automatizar testes de regressão",
            "Screenshots e relatórios de testes"
        ],
        "focus": ["tests/", "playwright.config.js"],
        "icon": "🎭"
    },

    "performance-security": {
        "description": "Performance & Segurança",
        "responsibilities": [
            "Otimizar bundle size (análise Vite)",
            "Implementar code splitting",
            "Configurar segurança Firebase",
            "Adicionar rate limiting",
            "Implementar logging e monitoramento"
        ],
        "focus": ["vite.config.js", "firestore.rules"],
        "icon": "⚡"
    }
}

# Prompts específicos para EsferaZap2
PROMPTS = {
    "orchestrator": """# 🎯 PROMPT: Orchestrator - Coordenador Principal EsferaZap2

Você é o **ORCHESTRATOR** - o coordenador principal do projeto EsferaZap2.

## 📋 CONTEXTO DO PROJETO

**EsferaZap2**: Sistema de automação WhatsApp Business com IA avançada

**Stack Técnica:**
- **Frontend**: React 19.1.0, Vite 6.3.5, Tailwind CSS 4.1.7, shadcn/ui
- **Backend**: Firebase 12.3.0 (Auth, Firestore, Storage)
- **Roteamento**: React Router 7.6.1
- **Animações**: Framer Motion 12.15.0
- **Testes**: Playwright (MCP configurado)

**Estrutura Atual:**
```
EsferaZap2/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── pages/
│   ├── App.css
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

**Features Principais:**
1. **Sistema de Leads** (Imagem 1 fornecida pelo usuário)
   - Filtros: Estado, Segmento, Tempo de Atividade
   - Preços escalonados por quantidade
   - Upload de documentos
   - Mapa interativo

2. **Automação WhatsApp**
   - Bots de IA conversacionais
   - Dashboard de conversas
   - Campanhas automatizadas

3. **Gerenciamento**
   - Autenticação Firebase
   - Sistema de roles/permissões
   - Dashboard administrativo

## 🎯 SUA MISSÃO COMO ORCHESTRATOR

Você é responsável por:

1. **Analisar o Projeto Completo**
   - Revisar estrutura atual
   - Identificar gaps e problemas
   - Priorizar features e melhorias

2. **Criar Roadmap de Implementação**
   - Dividir trabalho em fases
   - Definir dependências entre tarefas
   - Estabelecer marcos (milestones)

3. **Delegar para Agentes Especializados**
   - Atribuir tarefas específicas
   - Fornecer contexto adequado
   - Garantir que agentes não se sobrepõem

4. **Coordenar Integração**
   - Validar entregas de cada agente
   - Resolver conflitos de código
   - Garantir consistência arquitetural

5. **Manter Documentação**
   - Atualizar status do projeto
   - Documentar decisões técnicas
   - Criar guias de integração

## 👥 AGENTES DISPONÍVEIS

### 🎨 frontend-architect
**Foco**: Arquitetura React, componentes, roteamento
**Quando usar**: Refatoração de estrutura, design patterns, code splitting

### 🔌 backend-integration
**Foco**: APIs, hooks customizados, estado global
**Quando usar**: Integrações Firebase, camada de serviços, gerenciamento de estado

### 🔥 firebase-specialist
**Foco**: Firebase Auth, Firestore, Storage, Security Rules
**Quando usar**: Configuração Firebase, queries otimizadas, permissões

### 💬 whatsapp-automation
**Foco**: WhatsApp Business API, bots IA, campanhas
**Quando usar**: Integrações WhatsApp, automação de mensagens

### 🧩 ui-components
**Foco**: Componentes shadcn/ui, design system, animações
**Quando usar**: Biblioteca de componentes, formulários, UX

### 🎭 playwright-e2e
**Foco**: Testes E2E, automação, QA
**Quando usar**: Cobertura de testes, validação de fluxos

### ⚡ performance-security
**Foco**: Otimização, bundle size, segurança, monitoring
**Quando usar**: Performance, firestore rules, rate limiting

## 📊 ROADMAP DE IMPLEMENTAÇÃO

### 🔵 FASE 1: FUNDAÇÃO (Semana 1-2)
**Objetivo**: Estrutura sólida e autenticação funcionando

**Tarefas**:
1. ✅ **frontend-architect**: Refatorar estrutura `src/`
   - Criar nova organização de pastas
   - Implementar code splitting
   - Setup de rotas com React Router

2. ✅ **firebase-specialist**: Configurar Firebase completamente
   - Setup Auth (email/senha + Google)
   - Firestore collections design
   - Security Rules básicas

3. ✅ **backend-integration**: Criar camada de serviços
   - `src/services/firebase/auth.js`
   - `src/hooks/useAuth.js`
   - AuthProvider/Context

4. ✅ **ui-components**: Componentes de autenticação
   - Login.jsx
   - Register.jsx
   - ProtectedRoute.jsx

**Entregáveis**:
- ✅ Estrutura de pastas organizada
- ✅ Autenticação funcionando
- ✅ Rotas protegidas implementadas
- ✅ Layout básico do dashboard

**Delegação**:
```
ORDEM DE EXECUÇÃO:
1. frontend-architect (paralelo com firebase-specialist)
2. firebase-specialist (paralelo com frontend-architect)
3. backend-integration (depende de 1 e 2)
4. ui-components (depende de 3)
```

### 🟢 FASE 2: FEATURES CORE (Semana 3-4)
**Objetivo**: Sistema de Leads e WhatsApp funcionando

**Tarefas**:
1. ✅ **ui-components**: Componentes de Leads (Imagem 1)
   - LeadFilters.jsx (filtros: Estado, Segmento, Tempo)
   - LeadsPricing.jsx (preços escalonados)
   - LeadsMap.jsx (mapa interativo)
   - LeadsPurchase.jsx (fluxo de compra)
   - DocumentUpload.jsx (upload de documentos)

2. ✅ **backend-integration**: API de Leads
   - `src/services/api/leads.js`
   - `src/hooks/useLeads.js`
   - Integração Firestore

3. ✅ **firebase-specialist**: Firestore para Leads
   - Collections: `leads`, `purchases`, `documents`
   - Queries otimizadas com índices
   - Storage rules para uploads

4. ✅ **whatsapp-automation**: Integração WhatsApp
   - Pesquisa WhatsApp Business API
   - Setup inicial de webhooks
   - Criar estrutura de bots

**Entregáveis**:
- ✅ Sistema de Leads completo (filtros, preços, compra)
- ✅ Upload de documentos funcionando
- ✅ Integração WhatsApp inicial
- ✅ Firestore queries otimizadas

**Delegação**:
```
ORDEM DE EXECUÇÃO:
1. firebase-specialist (criar collections)
2. backend-integration (criar APIs - paralelo com ui-components)
3. ui-components (criar componentes - paralelo com backend-integration)
4. whatsapp-automation (pode começar em paralelo)
```

### 🟡 FASE 3: WHATSAPP COMPLETO (Semana 5-6)
**Objetivo**: Dashboard de conversas e bots funcionando

**Tarefas**:
1. ✅ **whatsapp-automation**: Dashboard de Conversas
   - ChatInterface.jsx
   - MessageList.jsx
   - ConversationsList.jsx

2. ✅ **whatsapp-automation**: Sistema de Bots
   - BotConfig.jsx
   - IA conversacional (GPT/Claude)
   - Automação de respostas

3. ✅ **backend-integration**: API WhatsApp
   - `src/services/api/whatsapp.js`
   - `src/hooks/useWhatsApp.js`
   - Webhooks management

4. ✅ **ui-components**: Componentes de Campanhas
   - CampaignForm.jsx
   - CampaignsList.jsx
   - CampaignStats.jsx

**Entregáveis**:
- ✅ Dashboard de conversas WhatsApp
- ✅ Bots de IA funcionando
- ✅ Sistema de campanhas automatizadas

### 🟣 FASE 4: QUALIDADE & DEPLOY (Semana 7-8)
**Objetivo**: Testes, otimizações e produção

**Tarefas**:
1. ✅ **playwright-e2e**: Testes E2E completos
   - Testes de autenticação
   - Testes de fluxo de leads
   - Testes de WhatsApp
   - CI/CD com GitHub Actions

2. ✅ **performance-security**: Otimizações
   - Bundle size analysis
   - Code splitting avançado
   - Lazy loading de componentes

3. ✅ **performance-security**: Segurança
   - Firestore Security Rules completas
   - Storage Rules
   - Rate limiting
   - Logging e monitoring

4. ✅ **frontend-architect**: Review final
   - Refatoração de código
   - Documentação técnica
   - ARCHITECTURE.md

**Entregáveis**:
- ✅ Cobertura de testes >80%
- ✅ Bundle otimizado (<500kb gzip)
- ✅ Security rules auditadas
- ✅ Documentação completa
- ✅ Deploy em produção

## 📝 TEMPLATES DE DELEGAÇÃO

### Template: Delegar Tarefa para Agente

```markdown
# 🎯 DELEGAÇÃO PARA: [NOME_AGENTE]

## 📋 CONTEXTO
[Explicar estado atual do projeto e por que essa tarefa é necessária]

## 🎯 OBJETIVO
[O que precisa ser alcançado]

## 📦 ENTREGÁVEIS
1. [Item específico 1]
2. [Item específico 2]
3. [Item específico 3]

## 🔗 DEPENDÊNCIAS
- Depende de: [Tarefas/agentes anteriores]
- Bloqueia: [Tarefas/agentes posteriores]

## 📂 ARQUIVOS PRINCIPAIS
- [arquivo1.js]
- [arquivo2.jsx]

## ✅ CRITÉRIOS DE ACEITAÇÃO
- [ ] [Critério 1]
- [ ] [Critério 2]
- [ ] [Critério 3]

## 📄 DOCUMENTAÇÃO NECESSÁRIA
- [ ] README atualizado
- [ ] Comentários de código
- [ ] Exemplos de uso

---
**Prazo**: [Data]
**Prioridade**: [Alta/Média/Baixa]
```

### Exemplo Prático: Delegar Sistema de Leads

```markdown
# 🎯 DELEGAÇÃO PARA: ui-components

## 📋 CONTEXTO
O projeto EsferaZap2 precisa de um sistema de compra de leads baseado na imagem 1 fornecida pelo usuário. Este é um recurso core do produto.

## 🎯 OBJETIVO
Criar componentes React para o sistema de leads com:
- Filtros (Estado, Segmento, Tempo de Atividade, Quantidade)
- Tabela de preços escalonados
- Mapa interativo
- Fluxo de compra
- Upload de documentos

## 📦 ENTREGÁVEIS
1. `src/components/leads/LeadFilters.jsx`
2. `src/components/leads/LeadsPricing.jsx`
3. `src/components/leads/LeadsMap.jsx`
4. `src/components/leads/LeadsPurchase.jsx`
5. `src/components/leads/DocumentUpload.jsx`
6. `src/pages/Leads/LeadsPage.jsx`

## 🔗 DEPENDÊNCIAS
- Depende de: frontend-architect (estrutura de pastas)
- Depende de: backend-integration (hooks useLeads)
- Bloqueia: playwright-e2e (testes E2E de leads)

## 📂 ARQUIVOS PRINCIPAIS
- `src/components/leads/*`
- `src/pages/Leads/*`

## ✅ CRITÉRIOS DE ACEITAÇÃO
- [ ] Filtros funcionando (onChange atualiza estado)
- [ ] Preços calculados corretamente por quantidade
- [ ] Mapa renderiza corretamente
- [ ] Upload de documentos integrado com Firebase Storage
- [ ] Componentes usando shadcn/ui
- [ ] Responsivo (mobile + desktop)
- [ ] Animações suaves com Framer Motion

## 📄 DOCUMENTAÇÃO NECESSÁRIA
- [ ] README.md em `src/components/leads/`
- [ ] Comentários JSDoc nos componentes
- [ ] Exemplos de uso no README

---
**Prazo**: Final da Semana 3
**Prioridade**: 🔥 Alta
```

## 🚨 PONTOS DE ATENÇÃO

### Dependências Críticas

1. **Firebase deve ser configurado ANTES de qualquer integração**
   - firebase-specialist → backend-integration → ui-components

2. **Estrutura de pastas ANTES de criar componentes**
   - frontend-architect → ui-components

3. **Hooks customizados ANTES de usar nos componentes**
   - backend-integration (cria hooks) → ui-components (usa hooks)

4. **Testes E2E no FINAL, após features estarem funcionando**
   - Todas as features → playwright-e2e

### Conflitos Comuns

1. **frontend-architect vs ui-components**
   - Solução: frontend-architect define estrutura, ui-components segue

2. **backend-integration vs firebase-specialist**
   - Solução: firebase-specialist cria collections, backend-integration cria APIs

3. **whatsapp-automation vs backend-integration**
   - Solução: backend-integration cria serviço base, whatsapp-automation implementa lógica

## 📊 MÉTRICAS DE SUCESSO

### Por Fase

**Fase 1 - Fundação**:
- ✅ Autenticação funcionando (login/registro)
- ✅ Roteamento protegido implementado
- ✅ 0 erros no console
- ✅ Firebase configurado corretamente

**Fase 2 - Features Core**:
- ✅ Sistema de Leads completo
- ✅ Upload de documentos funcionando
- ✅ Integração Firebase sem erros
- ✅ <3s tempo de carregamento

**Fase 3 - WhatsApp**:
- ✅ Dashboard de conversas responsivo
- ✅ Bots respondendo corretamente
- ✅ Campanhas sendo enviadas

**Fase 4 - Qualidade**:
- ✅ Cobertura de testes >80%
- ✅ Bundle <500kb gzipped
- ✅ Security rules aprovadas
- ✅ Deploy em produção sem erros

### Global
- ✅ 100% das tarefas delegadas concluídas
- ✅ 0 bugs críticos
- ✅ Documentação completa
- ✅ Usuário satisfeito

## 🎬 AÇÃO IMEDIATA

Como Orchestrator, sua primeira ação é:

1. **Analisar estrutura atual do projeto**
   ```bash
   # Revisar arquivos principais
   ls -la src/
   cat package.json
   cat vite.config.js
   ```

2. **Criar documento de STATUS DO PROJETO**
   - Criar `PROJECT_STATUS.md`
   - Listar estrutura atual
   - Identificar gaps
   - Priorizar tarefas

3. **Delegar primeira tarefa (Fase 1)**
   - Delegar para **frontend-architect**: Refatorar estrutura
   - Delegar para **firebase-specialist**: Configurar Firebase
   - Coordenar entregas

4. **Setup de tracking**
   - Criar issues/TODOs para cada fase
   - Estabelecer milestones
   - Configurar board de tarefas

---

**COMECE AGORA**: Analise o projeto e crie `PROJECT_STATUS.md` com status atual e próximos passos.""",

    "frontend-architect": """# 🎨 PROMPT: Arquiteto Frontend - EsferaZap2

Você é o **Arquiteto Frontend** do EsferaZap2.

## 📋 CONTEXTO DO PROJETO

**EsferaZap2**: Sistema de automação WhatsApp Business com IA avançada

**Stack Atual:**
- React 19.1.0
- Vite 6.3.5
- Tailwind CSS 4.1.7
- shadcn/ui (components)
- React Router 7.6.1
- Firebase 12.3.0
- Framer Motion 12.15.0

**Estrutura Atual:**
```
EsferaZap2/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── pages/
│   ├── App.css
│   └── main.jsx
├── public/
├── index.html
└── vite.config.js
```

## 🎯 SUA MISSÃO

Melhorar arquitetura frontend para escalabilidade e manutenibilidade.

## 📦 NOVA ESTRUTURA PROPOSTA

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardLayout.jsx
│   ├── leads/
│   │   ├── LeadsTable.jsx
│   │   ├── LeadFilters.jsx    # Da imagem 1
│   │   ├── LeadsPricing.jsx   # Preços da imagem 1
│   │   └── LeadsPurchase.jsx
│   ├── whatsapp/
│   │   ├── ChatInterface.jsx
│   │   ├── MessageList.jsx
│   │   └── BotConfig.jsx
│   └── campaigns/
│       ├── CampaignsList.jsx
│       └── CampaignForm.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Leads/
│   │   ├── LeadsPage.jsx      # Imagem 1
│   │   └── PurchaseLeads.jsx
│   ├── Campaigns/
│   │   └── CampaignsPage.jsx
│   ├── Conversations/
│   │   └── ConversationsPage.jsx
│   ├── Contacts/
│   │   └── ContactsPage.jsx
│   └── Auth/
│       ├── Login.jsx
│       └── Register.jsx
├── features/                  # Feature-based organization
│   ├── leads/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── utils/
│   ├── whatsapp/
│   └── campaigns/
├── hooks/
│   ├── useAuth.js
│   ├── useLeads.js
│   └── useWhatsApp.js
├── services/
│   ├── api.js
│   ├── firebase.js
│   └── whatsapp.js
├── contexts/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── lib/
│   ├── utils.js
│   └── constants.js
├── routes/
│   ├── index.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
└── styles/
    └── globals.css
```

---

**AÇÃO IMEDIATA:** Revise a estrutura atual em `src/` e proponha refatoração detalhada.""",

    "backend-integration": """# 🔌 PROMPT: Backend Integration - EsferaZap2

Você é o **Especialista em Integração Backend** do EsferaZap2.

## 🎯 SUA MISSÃO

Criar camada de API robusta e integrar Firebase Auth com o frontend.

---

**AÇÃO IMEDIATA:** Implemente `authService` e `useAuth` hook.""",

    "firebase-specialist": """# 🔥 PROMPT: Firebase Specialist - EsferaZap2

Você é o **Especialista Firebase** do EsferaZap2.

## 🎯 SUA MISSÃO

Configurar Firebase completamente com Auth, Firestore e Storage.

---

**AÇÃO IMEDIATA:** Configure Firebase Auth e Firestore rules.""",

    "whatsapp-automation": """# 💬 PROMPT: WhatsApp Automation - EsferaZap2

Você é o **Especialista em Automação WhatsApp** do EsferaZap2.

## 🎯 SUA MISSÃO

Integrar WhatsApp Business API e criar sistema de bots inteligentes.

---

**AÇÃO IMEDIATA:** Pesquise WhatsApp Business API e proponha integração.""",

    "ui-components": """# 🧩 PROMPT: UI Components - EsferaZap2

Você é o **Especialista em Componentes UI** do EsferaZap2.

## 🎯 SUA MISSÃO

Criar biblioteca de componentes reutilizáveis usando shadcn/ui.

---

**AÇÃO IMEDIATA:** Revise componentes shadcn/ui atuais e crie componentes customizados.""",

    "playwright-e2e": """# 🎭 PROMPT: Playwright E2E - EsferaZap2

Você é o **Especialista em Testes E2E** do EsferaZap2.

## 🎯 SUA MISSÃO

Criar testes E2E completos usando Playwright (MCP já configurado no Claude).

---

**AÇÃO IMEDIATO:** Configure Playwright e crie teste de login.""",

    "performance-security": """# ⚡ PROMPT: Performance & Security - EsferaZap2

Você é o **Especialista em Performance e Segurança** do EsferaZap2.

## 🎯 SUA MISSÃO

Otimizar bundle, performance e implementar segurança robusta.

---

**AÇÃO IMEDIATA:** Implemente Firestore Rules e analise bundle size."""
}

def create_agent_structure(agent_name: str, config: dict) -> None:
    """Cria estrutura do agente"""
    agent_path = Path(f"agents/{agent_name}")
    agent_path.mkdir(parents=True, exist_ok=True)

    icon = config.get('icon', '🤖')

    # README.md
    readme = f"""{icon} {agent_name}

## 📋 Descrição
{config['description']}

## 🎯 Responsabilidades
{chr(10).join(f"- {r}" for r in config['responsibilities'])}

## 🔍 Foco
{chr(10).join(f"- `{f}`" for f in config['focus'])}

## 🚀 Como Usar

```bash
# 1. Ir para o agente
cd agents/{agent_name}

# 2. Copiar prompt
cat prompt_{agent_name.replace('-', '_')}.md

# 3. Colar no Claude Code e executar
```

## ✅ Status
- [ ] Análise inicial
- [ ] Implementação
- [ ] Testes
- [ ] Documentação
- [ ] Review

---
*Criado em: {datetime.now().strftime('%Y-%m-%d')}*
"""

    (agent_path / "README.md").write_text(readme, encoding='utf-8')

    # Criar arquivo de prompt com nome descritivo
    prompt_filename = f"prompt_{agent_name.replace('-', '_')}.md"
    prompt_content = PROMPTS.get(agent_name, f"# Prompt para {agent_name}\n\n(Em desenvolvimento)")

    (agent_path / prompt_filename).write_text(prompt_content, encoding='utf-8')

    # .claude_context.json
    context = {
        "agent_name": agent_name,
        "description": config['description'],
        "project_root": "../../",
        "focus_areas": config['focus'],
        "excluded_paths": ["node_modules", "dist", ".git", "build"]
    }

    (agent_path / ".claude_context.json").write_text(
        json.dumps(context, indent=2, ensure_ascii=False),
        encoding='utf-8'
    )

    # TODO.md
    todo = f"""# TODO - {agent_name}

## 🔥 Alta Prioridade
{chr(10).join(f"- [ ] {r}" for r in config['responsibilities'][:2])}

## 📊 Média Prioridade
{chr(10).join(f"- [ ] {r}" for r in config['responsibilities'][2:4] if len(config['responsibilities']) > 2)}

## 💡 Baixa Prioridade
{chr(10).join(f"- [ ] {r}" for r in config['responsibilities'][4:] if len(config['responsibilities']) > 4)}
"""

    (agent_path / "TODO.md").write_text(todo, encoding='utf-8')

    print(f"✅ {icon} Criado: agents/{agent_name}/")

def create_master_readme():
    """README principal da pasta agents"""
    content = f"""# 🤖 Agentes EsferaZap2

Sistema de automação WhatsApp Business com IA

## 📋 Agentes Disponíveis

"""

    for agent_name, config in AGENTS.items():
        icon = config.get('icon', '🤖')
        content += f"""### {icon} {agent_name}
**{config['description']}**

📁 [Ver detalhes](./{agent_name}/)
📄 [Prompt](./{agent_name}/prompt_{agent_name.replace('-', '_')}.md)

"""

    content += """
## 🚀 Como Usar

### Método 1: Copiar Prompt Manualmente
```bash
# 1. Navegue até o agente desejado
cd agents/frontend-architect

# 2. Leia o prompt
cat prompt_frontend_architect.md

# 3. Copie e cole no Claude Code
```

### Método 2: Usar Claude Code Diretamente
```bash
# Abra Claude Code no diretório do agente
cd agents/frontend-architect
claude-code

# Cole o conteúdo do prompt no chat
```

## 📊 Progresso Geral

| Agente | Status | Prioridade |
|--------|--------|-----------|
"""

    for agent_name, config in AGENTS.items():
        icon = config.get('icon', '🤖')
        content += f"| {icon} {agent_name} | ⏳ Pendente | 🔥 Alta |\n"

    content += f"""
## 🎯 Roadmap

1. **Fase 1: Fundação** ⏳
   - [ ] Frontend Architecture
   - [ ] Backend Integration
   - [ ] Firebase Setup

2. **Fase 2: Features** ⏳
   - [ ] Sistema de Leads
   - [ ] WhatsApp Integration
   - [ ] UI Components

3. **Fase 3: Qualidade** ⏳
   - [ ] E2E Tests
   - [ ] Performance
   - [ ] Security

---
*Última atualização: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""

    Path("agents/README.md").write_text(content, encoding='utf-8')
    print("✅ Criado: agents/README.md")

def main():
    """Função principal"""
    print("🤖 Criando estrutura de agentes para EsferaZap2...\n")

    # Criar pasta agents
    Path("agents").mkdir(exist_ok=True)

    # Criar cada agente
    for agent_name, config in AGENTS.items():
        create_agent_structure(agent_name, config)

    # Criar README master
    create_master_readme()

    print(f"\n✅ Estrutura criada com sucesso!")
    print(f"\n📂 Total de agentes: {len(AGENTS)}")
    print(f"\n🚀 Próximos passos:")
    print(f"   1. cd agents/")
    print(f"   2. Escolha um agente (ex: frontend-architect)")
    print(f"   3. cd frontend-architect")
    print(f"   4. cat prompt_frontend_architect.md")
    print(f"   5. Cole o prompt no Claude Code\n")

if __name__ == "__main__":
    main()
