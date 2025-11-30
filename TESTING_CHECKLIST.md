# Checklist de Testes - EsferaZap

## Pré-requisitos
- [ ] Servidor rodando (`npm run dev` na pasta correta)
- [ ] Firebase configurado (`.env` presente)
- [ ] Navegador acessando `http://localhost:5173`

---

## 1. Autenticação & Registro

### Registro de Novo Usuário
- [ ] Acessar `/register`
- [ ] Preencher formulário completo (Nome, Email, Senha, Empresa, etc.)
- [ ] Clicar em "Criar Conta"
- [ ] **Verificar**: Redirecionou para `/onboarding`?
- [ ] **Verificar no Firebase Console**: Usuário apareceu na coleção `users` com todos os dados?

### Login
- [ ] Fazer logout (se estiver logado)
- [ ] Acessar `/login`
- [ ] Entrar com as credenciais criadas
- [ ] **Verificar**: Redirecionou para `/dashboard`?

### Google Sign-In (Opcional)
- [ ] Clicar em "Continuar com Google"
- [ ] **Verificar**: Popup do Google abre e permite login?

---

## 2. Dashboard

### Visão Geral
- [ ] Ver cards de estatísticas (Conversas, Taxa de Resposta, etc.)
- [ ] **Verificar**: Números aparecem (mesmo que mockados)?
- [ ] **Verificar**: Gráfico de atividade renderiza?

### Navegação
- [ ] Clicar em cada item do menu lateral (Dashboard, Chat, Knowledge Base, Settings, Leads)
- [ ] **Verificar**: Todas as páginas carregam sem erro?

---

## 3. Chat Interface

### Visualização
- [ ] Acessar `/chat`
- [ ] **Verificar**: Lista de contatos aparece à esquerda?
- [ ] **Verificar**: Área de mensagens aparece à direita?

### Interação (Mock)
- [ ] Clicar em um contato
- [ ] Digitar mensagem no input inferior
- [ ] Pressionar Enter ou clicar em enviar
- [ ] **Verificar**: Mensagem aparece no histórico?

---

## 4. Base de Conhecimento

### Gerenciamento de Arquivos
- [ ] Acessar `/knowledge`
- [ ] **Verificar**: Lista de arquivos mockados aparece?
- [ ] Clicar em "Upload File" (mesmo que não funcione ainda)
- [ ] **Verificar**: Área de upload aparece?

---

## 5. Configuração do Agente

### Aba "General Settings"
- [ ] Acessar `/settings`
- [ ] Alterar nome do agente
- [ ] Editar System Prompt
- [ ] Mudar temperatura do modelo
- [ ] Clicar em "Save Changes"
- [ ] **Verificar**: Notificação de sucesso aparece?

### Aba "WhatsApp Connection"
- [ ] Clicar na aba "WhatsApp Connection"
- [ ] Inserir Phone Number ID (mock: `123456789`)
- [ ] Inserir Access Token (mock: `EAAG...`)
- [ ] Clicar em "Verify Connection"
- [ ] **Verificar**: Faz chamada à API (pode falhar se token for inválido)?

---

## 6. Compra de Leads

### Filtros e Seleção
- [ ] Acessar `/leads`
- [ ] Selecionar Estado
- [ ] Selecionar Cidade
- [ ] Selecionar Setor
- [ ] **Verificar**: Lista de leads filtra corretamente?

### Simulação de Compra
- [ ] Selecionar alguns leads
- [ ] Clicar em "Comprar Leads"
- [ ] **Verificar**: Modal de confirmação abre?
- [ ] Confirmar compra
- [ ] **Verificar**: Notificação de sucesso aparece?

---

## 7. Responsividade

### Mobile
- [ ] Redimensionar navegador para 375px largura
- [ ] **Verificar**: Menu lateral colapsa em hamburger?
- [ ] **Verificar**: Formulários ficam legíveis?
- [ ] **Verificar**: Chat adapta layout (lista/janela)?

### Tablet
- [ ] Testar em 768px largura
- [ ] **Verificar**: Layout se ajusta adequadamente?

---

## 8. Testes de Erro

### Registro
- [ ] Tentar registrar com email já existente
- [ ] **Verificar**: Erro adequado aparece?
- [ ] Tentar senha muito curta
- [ ] **Verificar**: Validação funciona?

### Login
- [ ] Tentar login com senha errada
- [ ] **Verificar**: Mensagem de erro aparece?

---

## Resumo de Resultados

**Testes Passados**: _____ / _____

**Problemas Encontrados**:
1. 
2. 
3. 

**Screenshots de Erros** (se houver):
- Cole aqui ou me envie
