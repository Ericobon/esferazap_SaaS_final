# 🚀 GUIA DEFINITIVO - EsferaZap MVP

**Atualizado**: 29/11/2025  
**Status**: Pronto para uso  
**Tempo estimado**: 5 minutos  

---

## 📋 Pré-requisitos

- ✅ Node.js instalado (v18+)
- ✅ npm instalado
- ✅ Terminal WSL/Bash

---

## 🎯 Passo a Passo - COPIE E COLE

### 1️⃣ Navegue para a pasta do projeto

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2
```

### 2️⃣ Limpe TUDO e reinstale (comando ÚNICO)

```bash
pkill -9 node; pkill -9 vite; rm -rf node_modules package-lock.json dist .vite; npm install --legacy-peer-deps && npm run dev
```

**Isso vai:**
- ✅ Matar processos Node/Vite
- ✅ Remover node_modules e cache
- ✅ Reinstalar dependências (com --legacy-peer-deps para resolver conflitos)
- ✅ Iniciar servidor automaticamente

---

## 🌐 Acessar a Aplicação

**Após o comando acima executar**, abra o navegador em:

**http://localhost:5173**

---

## ❌ Se der erro "Port already in use"

```bash
lsof -ti:5173 | xargs kill -9; npm run dev
```

---

## ❌ Se a tela ficar preta

**Pressione F12 no navegador** → Aba **Console** → Tire screenshot e me envie.

---

## 📁 Estrutura do Projeto

```
EsferaZap2/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── lib/            # Configurações (Firebase)
│   └── services/       # Serviços (API calls)
├── agents/             # ⚠️ MANTER - Subagents Claude
├── .env                # Variáveis Firebase
├── package.json        # Dependências
└── vite.config.js      # Config Vite
```

---

## 🔑 Variáveis de Ambiente (.env)

O arquivo `.env` já deve existir com:

``env
VITE_FIREBASE_API_KEY=AIzaSyCDLfacyV6-FAWb76_UMybO4Raifsp7X-Y
VITE_FIREBASE_AUTH_DOMAIN=saasesfera.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=saasesfera
VITE_FIREBASE_STORAGE_BUCKET=saasesfera.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=235565482869
VITE_FIREBASE_APP_ID=1:235565482869:web:1caef424e756fd93f5093c
VITE_FIREBASE_MEASUREMENT_ID=G-0ZCXVCV00R
```

---

## 🧪 Testar Funcionalidades

### 1. Registro de Usuário
- Acesse: `/register`
- Preencha o formulário
- Clique em "Criar Conta"
- ✅ Deve redirecionar para `/onboarding`

### 2. Login
- Acesse: `/login`
- Entre com email/senha criados
- ✅ Deve redirecionar para `/dashboard`

### 3. Dashboard
- Veja métricas (valores mockados)
- Navegue entre páginas no menu lateral

### 4. Chat
- Acesse: `/chat`
- Veja interface do chat (mock)
- Digite mensagem e envie

---

## 🚀 Deploy em Produção

### Opção 1: Firebase Hosting

```bash
# Build
npm run build

# Deploy
firebase login
firebase deploy --only hosting
```

**URL**: https://saasesfera.web.app

### Opção 2: VM GCP (35.258.24.59)

```bash
# Build
npm run build

# Copiar para VM
scp -r dist/ usuario@35.258.24.59:/var/www/esferazap/

# Na VM, configurar Nginx (se necessário)
```

---

## 📚 Documentação Adicional

| Arquivo | Descrição |
|---------|-----------|
| `DEV_HANDOFF.md` | Guia completo para desenvolvedor |
| `IMPLEMENTATION_GUIDE.md` | Detalhes técnicos de implementação |
| `agents/` | Prompts dos subagents Claude (MANTER) |

---

## 🐛 Troubleshooting

### Problema: npm install falha com erro ERESOLVE

**Solução:**
```bash
npm install --legacy-peer-deps
```

### Problema: "Cannot find module vite"

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problema: Tela preta no navegador

**Diagnóstico:**
1. Pressione F12
2. Vá na aba Console
3. Veja erros em vermelho
4. Me envie screenshot

**Possíveis causas:**
- Firebase .env faltando
- Erro em algum componente
- Dark mode sem conteúdo

**Solução rápida:**
```bash
# Remover dark mode temporariamente
sed -i 's/class="dark"//g' index.html

# Reiniciar
pkill -f vite; npm run dev
```

---

## ✅ Checklist de Verificação

- [ ] Projeto está na pasta correta (`~/insightesfera/EsferaZap2/EsferaZap2`)
- [ ] `.env` existe com todas as variáveis
- [ ] `npm install --legacy-peer-deps` executou sem erros
- [ ] Servidor rodando em `http://localhost:5173`
- [ ] Página carrega (não está preta)
- [ ] Consegue acessar `/login` e `/register`
- [ ] Pasta `agents/` está preservada

---

## 🆘 Suporte Rápido

**Se NADA funcionar:**

```bash
# Reset TOTAL
cd ~/insightesfera/EsferaZap2/EsferaZap2
git stash  # Salvar mudanças (se tiver git)
git clean -fdx  # Limpar tudo (se tiver git)

# OU manualmente:
rm -rf node_modules package-lock.json dist .vite
npm install --legacy-peer-deps
npm run dev
```

**Ainda com problemas?**
- Me envie screenshot do console (F12)
- Me envie output do terminal onde roda `npm run dev`

---

## 🎯 Comandos Resumidos

```bash
# Todo o processo em 1 comando
cd ~/insightesfera/EsferaZap2/EsferaZap2 && pkill -9 node; pkill -9 vite; rm -rf node_modules package-lock.json .vite; npm install --legacy-peer-deps && npm run dev
```

**Após executar**, acesse: **http://localhost:5173**

---

**Última atualização**: 29/11/2025 21:15  
**Versão**: 1.0 - Definitiva
