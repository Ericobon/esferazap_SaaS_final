# Guia de Deploy Manual - EsferaZap

Como não consigo acessar sua VM diretamente devido a restrições do meu terminal, preparei este guia para você fazer o deploy.

## Opção 1: Rodar Localmente (Para Testes Rápidos)

Se você quer apenas ver o app rodando agora:

1.  Abra seu terminal na pasta do projeto.
2.  Rode:
    ```bash
    npm run dev
    ```
3.  Acesse `http://localhost:5173`.

---

## Opção 2: Deploy na VM (GCP)

### Pré-requisitos
*   Acesso SSH à VM (`35.208.24.59`).
*   Nginx ou Docker instalado na VM.

### Passo 1: Gerar o Build
No seu terminal local (WSL), rode o script que criei:
```bash
chmod +x deploy.sh
./deploy.sh
```
Isso criará uma pasta `dist` com o site otimizado.

### Passo 2: Enviar para a VM

**Via SCP (Cópia de Arquivos):**
Substitua `SEU_USUARIO` pelo seu usuário da VM (ex: `ericobon` ou o da service account).
```bash
scp -r dist/* SEU_USUARIO@35.208.24.59:/var/www/html/
```
*(Assumindo que você tem Nginx rodando e apontando para `/var/www/html`)*

**Via Docker (Recomendado se tiver Docker na VM):**
1.  Copie os arquivos do projeto para a VM.
2.  Na VM, rode:
    ```bash
    docker build -t esferazap .
    docker run -d -p 80:80 esferazap
    ```

## Solução de Problemas

*   **Erro de Permissão**: Se o `npm run dev` falhar, tente deletar a pasta `node_modules` e rodar `npm install` novamente.
*   **Porta Fechada**: Verifique se o Firewall do GCP permite tráfego na porta 80 (HTTP) ou 5173 (Dev).
