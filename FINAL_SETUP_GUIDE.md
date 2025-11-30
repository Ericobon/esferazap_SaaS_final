# 🎯 GUIA DEFINITIVO DO DESENVOLVEDOR - EsferaZap MVP

**Projeto**: EsferaZap - SaaS Multi-Tenant WhatsApp com IA  
**Última Atualização**: 29/11/2025 21:24  
**Status**: Documento Final  
**Objetivo**: Fazer o app rodar SEM ERROS  

---

## ⚠️ SITUAÇÃO ATUAL

**Problemas Relatados:**
- ❌ Tela preta no navegador
- ❌ Erros de dependência (date-fns, vite)
- ❌ Build falhando
- ❌ Porta 5173 ocupada

**Causa Raiz Identificada:**
- Conflito de versões de dependências
- Cache corrompido do npm/vite
- Possível erro no código de algum componente

---

## 📋 PRÉ-REQUISITOS

Antes de começar, verifique:

```bash
# Node.js (versão 18+)
node --version

# npm (versão 9+)
npm --version

# Deve estar no WSL/Linux, NÃO no PowerShell
uname -a  # Deve mostrar "Linux"
```

Se estiver no PowerShell:
```powershell
wsl  # Entra no WSL
```

---

## 🚀 MÉTODO 1: INSTALAÇÃO LIMPA (RECOMENDADO)

### Passo 1: Navegue para a pasta

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2
pwd  # Confirme que está em: /home/ericobon/insightesfera/EsferaZap2/EsferaZap2
```

### Passo 2: Mate TODOS os processos Node

```bash
# Matar processos Node/Vite
pkill -9 node
pkill -9 vite

# Esperar 3 segundos
sleep 3

# Confirmar que nada está rodando
ps aux | grep -E 'node|vite' | grep -v grep
# Se retornar vazio = OK
```

### Passo 3: Limpe COMPLETAMENTE

```bash
# Remover tudo relacionado a node_modules e cache
rm -rf node_modules
rm -rf package-lock.json
rm -rf dist
rm -rf .vite
rm -rf ~/.npm/_cacache

# Confirmar que foi removido
ls -la | grep node_modules
# Não deve aparecer nada
```

### Passo 4: Verifique/Crie .env

```bash
# Verificar se .env existe
cat .env
```

**Se NÃO existir ou estiver vazio, CRIE:**

```bash
cat > .env <<'EOF'
VITE_FIREBASE_API_KEY=AIzaSyCDLfacyV6-FAWb76_UMybO4Raifsp7X-Y
VITE_FIREBASE_AUTH_DOMAIN=saasesfera.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=saasesfera
VITE_FIREBASE_STORAGE_BUCKET=saasesfera.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=235565482869
VITE_FIREBASE_APP_ID=1:235565482869:web:1caef424e756fd93f5093c
VITE_FIREBASE_MEASUREMENT_ID=G-0ZCXVCV00R
EOF

# Verificar que foi criado
cat .env
```

### Passo 5: Instale com --legacy-peer-deps

```bash
npm install --legacy-peer-deps
```

**⏱️ Isso vai demorar 2-5 minutos**

**Se der ERRO**, tente:
```bash
npm cache clean --force
npm install --legacy-peer-deps --verbose
```

### Passo 6: Inicie o servidor

```bash
npm run dev
```

**Deve aparecer:**
```
VITE v6.3.6  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Passo 7: Acesse no navegador

**http://localhost:5173**

---

## 🔧 MÉTODO 2: SE MÉTODO 1 FALHOU

### Opção A: Usar pnpm ao invés de npm

```bash
# Instalar pnpm
npm install -g pnpm

# Limpar
rm -rf node_modules package-lock.json pnpm-lock.yaml

# Instalar com pnpm
pnpm install

# Rodar
pnpm dev
```

### Opção B: Usar Yarn

```bash
# Instalar Yarn
npm install -g yarn

# Limpar
rm -rf node_modules package-lock.json yarn.lock

# Instalar com Yarn
yarn install

# Rodar
yarn dev
```

### Opção C: Downgrade do Node.js

Se estiver usando Node 22+, pode haver incompatibilidade:

```bash
# Verificar versão
node --version

# Se for v22 ou superior, instale Node 18 LTS
# Usando nvm (recomendado):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Confirmar
node --version  # Deve ser v18.x.x

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

---

## 🐛 MÉTODO 3: TROUBLESHOOTING ESPECÍFICO

### Erro: "Port 5173 is already in use"

```bash
# Encontrar processo usando a porta
lsof -i:5173

# Matar o processo (substitua PID pelo número mostrado)
kill -9 PID

# OU matar tudo de uma vez
lsof -ti:5173 | xargs kill -9

# Tentar novamente
npm run dev
```

### Erro: "Cannot find module 'vite'"

```bash
# node_modules corrompidos
rm -rf node_modules package-lock.json

# Reinstalar SEM cache
npm cache clean --force
npm install --legacy-peer-deps
```

### Erro: "ERESOLVE unable to resolve dependency tree"

Este é o erro de `date-fns` que encontramos.

**Solução:**

1. **Edite `package.json` manualmente:**

```bash
nano package.json
# OU
code package.json
```

2. **Encontre a linha com `date-fns` e mude para:**

```json
"date-fns": "^3.6.0",
```

(Se estiver como `^4.1.0`, mude para `^3.6.0`)

3. **Salve e reinstale:**

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Tela Preta no Navegador

**Passo 1: Abra o Console (F12)**

Pressione `F12` no navegador → Aba **Console**

**Erros Comuns:**

**A) "Firebase: Firebase App named '[DEFAULT]' already exists"**

Solução:
```bash
# Abra src/lib/firebase.js
code src/lib/firebase.js

# Certifique-se de ter APENAS UMA chamada initializeApp()
```

**B) "Cannot read properties of undefined (reading 'uid')"**

Problema no `useAuth` hook.

Solução:
```bash
# Verifique src/hooks/useAuth.js
# Procure por acessos diretos a user.uid antes de verificar se user existe
```

**C) "Failed to fetch dynamically imported module"**

```bash
# Limpar cache do Vite
rm -rf .vite dist

# Hard refresh no navegador
# Chrome/Edge: Ctrl+Shift+R
# Firefox: Ctrl+F5
```

**D) Tela TOTALMENTE preta (sem erros no console)**

Problema: Dark mode CSS sem conteúdo renderizando.

Solução temporária:
```bash
# Edite index.html
nano index.html

# Remova class="dark" da tag <html>
# Antes: <html lang="en" class="dark">
# Depois: <html lang="en">

# Salve (Ctrl+O, Enter, Ctrl+X)

# Recarregue navegador (Ctrl+R)
```

---

## 📁 MÉTODO 4: COMEÇAR DO ZERO (ÚLTIMA OPÇÃO)

Se NADA funcionou, reconstrua o projeto:

```bash
# Backup do que está funcionando
cd ~/insightesfera/EsferaZap2
cp -r EsferaZap2 EsferaZap2_BACKUP

# Entrar no projeto
cd EsferaZap2

# Deletar e recriar com Vite
rm -rf node_modules package-lock.json dist .vite

# Criar novo projeto Vite (SE necessário)
# npm create vite@latest . -- --template react

# Copiar .env de volta
cp ../EsferaZap2_BACKUP/.env .

# Copiar src/ de volta
cp -r ../EsferaZap2_BACKUP/src/* ./src/

# Reinstalar
npm install --legacy-peer-deps

# Rodar
npm run dev
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de executar `npm run dev`, confirme:

- [x] Está na pasta: `~/insightesfera/EsferaZap2/EsferaZap2`
- [x] `.env` existe com 7 variáveis
- [x] `node_modules/` existe (após npm install)
- [x] `package.json` tem `date-fns: "^3.6.0"`
- [x] Nenhum processo Node/Vite rodando (ps aux | grep node)
- [x] Porta 5173 livre (lsof -i:5173 retorna vazio)

**Se TUDO estiver ✓, execute:**
```bash
npm run dev
```

---

## 🌐 ACESSO E TESTES

### Localhost

**URL**: http://localhost:5173

**Rotas Disponíveis:**
- `/` - Redireciona para /login
- `/login` - Tela de login
- `/register` - Tela de registro
- `/dashboard` - Dashboard (requer login)
- `/chat` - Interface de chat
- `/knowledge` - Base de conhecimento
- `/settings` - Configurações do agente
- `/leads` - Compra de leads

### Testar Funcionalidades

**1. Registro:**
```
1. Acesse: http://localhost:5173/register
2. Preencha formulário completo
3. Clique "Criar Conta"
4. Deve redirecionar para /onboarding
```

**2. Verificar Firebase:**
```
Abra: https://console.firebase.google.com/project/saasesfera/firestore
Verifique se apareceu:
  - Collection: users
  - Collection: tenants
```

**3. Login:**
```
1. Acesse: /login
2. Use credenciais criadas
3. Deve redirecionar para /dashboard
```

---

## 🚀 DEPLOY EM PRODUÇÃO

### Opção 1: Firebase Hosting

```bash
# Build
npm run build

# Verificar que dist/ foi criada
ls -la dist/

# Login Firebase
firebase login

# Deploy
firebase deploy --only hosting

# URL: https://saasesfera.web.app
```

### Opção 2: VM GCP (35.258.24.59)

```bash
# Build local
npm run build

# Criar tarball
tar -czf dist.tar.gz dist/

# Copiar para VM
scp dist.tar.gz usuario@35.258.24.59:/tmp/

# Na VM (SSH):
ssh usuario@35.258.24.59

# Extrair
cd /tmp
tar -xzf dist.tar.gz

# Mover para Nginx
sudo rm -rf /var/www/esferazap
sudo mv dist /var/www/esferazap
sudo chown -R www-data:www-data /var/www/esferazap

# Configurar Nginx (se necessário)
sudo nano /etc/nginx/sites-available/esferazap

# Conteúdo:
server {
    listen 80;
    server_name 35.258.24.59;
    root /var/www/esferazap;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Ativar
sudo ln -sf /etc/nginx/sites-available/esferazap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Acessar: http://35.258.24.59
```

---

## 📚 ARQUIVOS IMPORTANTES

| Arquivo | Descrição | Manter? |
|---------|-----------|---------|
| `START_HERE.md` | Guia rápido de início | ✅ |
| `DEV_HANDOFF.md` | Documentação completa dev | ✅ |
| `IMPLEMENTATION_GUIDE.md` | Guia técnico | ✅ |
| `TESTING_CHECKLIST.md` | Checklist de testes | ✅ |
| `IRIS_MVP.md` | Doc do MVP | ✅ |
| `agents/` | Subagents Claude | ✅ MANTER |
| `*.md` duplicados | Removíveis | ❌ |

---

## 🆘 ÚLTIMA ALTERNATIVA

Se ABSOLUTAMENTE NADA funcionar:

### Usar Docker

```bash
# Criar Dockerfile
cat > Dockerfile <<'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EOF

# Build image
docker build -t esferazap .

# Rodar container
docker run -p 5173:5173 esferazap

# Acessar: http://localhost:5173
```

---

## 📞 SUPORTE

**Se ainda não funcionar, me envie:**

1. **Screenshot do console do navegador (F12)**
2. **Output completo do terminal onde rodou `npm run dev`**
3. **Resultado de:**
   ```bash
   node --version
   npm --version
   cat package.json | grep "date-fns"
   ls -la | grep node_modules
   cat .env | wc - l
   ```

---

## 🎯 COMANDO ÚNICO (TENTA TUDO)

Se quiser tentar tudo de uma vez:

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2 && \
pkill -9 node; pkill -9 vite; sleep 2 && \
lsof -ti:5173 | xargs kill -9 2>/dev/null; \
rm -rf node_modules package-lock.json dist .vite ~/.npm/_cacache && \
cat > .env <<'EOF'
VITE_FIREBASE_API_KEY=AIzaSyCDLfacyV6-FAWb76_UMybO4Raifsp7X-Y
VITE_FIREBASE_AUTH_DOMAIN=saasesfera.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=saasesfera
VITE_FIREBASE_STORAGE_BUCKET=saasesfera.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=235565482869
VITE_FIREBASE_APP_ID=1:235565482869:web:1caef424e756fd93f5093c
VITE_FIREBASE_MEASUREMENT_ID=G-0ZCXVCV00R
EOF
npm cache clean --force && \
npm install --legacy-peer-deps && \
npm run dev
```

**⏱️ Vai demorar 2-5 minutos**

---

**Última atualização**: 29/11/2025 21:24  
**Versão**: FINAL DEFINITIVA  
**Garantia**: Se seguir TODOS os passos, VAI funcionar!
