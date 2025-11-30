# 🚀 Comandos para Iniciar o EsferaZap2

Há um problema com a execução automática de comandos WSL. Por favor, execute manualmente:

## Opção 1: Usando o script criado

Abra o **Windows Terminal** ou **WSL** e execute:

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2
chmod +x start-dev.sh
./start-dev.sh
```

## Opção 2: Comando direto

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2
npm run dev
```

## Opção 3: Comando completo (com limpeza)

```bash
cd ~/insightesfera/EsferaZap2/EsferaZap2 && pkill -9 node; pkill -9 vite; npm run dev
```

---

## ✅ O que esperar

Após executar, você deve ver:

```
VITE v6.3.5  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🌐 Abrir no navegador

Acesse: **http://localhost:5173**

---

## 📋 Próximos passos após iniciar

1. Acesse http://localhost:5173
2. Verifique se a página de login aparece
3. Me avise que está funcionando para eu validar a interface
