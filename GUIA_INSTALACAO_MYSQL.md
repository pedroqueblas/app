# 📥 Guia Completo de Instalação do MySQL

## 🔗 Links Diretos para Download

### 1. MySQL Community Server (OBRIGATÓRIO)
**Este é o servidor MySQL que você precisa instalar.**

**Link direto para Windows 64-bit:**
```
https://dev.mysql.com/downloads/mysql/
```

**Passos no site:**
1. Acesse o link acima
2. Role até encontrar "MySQL Community Server"
3. Clique em "Download" (versão mais recente)
4. Na próxima página, clique em **"No thanks, just start my download"** (não precisa fazer login)
5. O download começará automaticamente

**Link alternativo (página de downloads):**
```
https://dev.mysql.com/downloads/installer/
```
- Escolha: **"Windows (x86, 64-bit), MSI Installer"** (versão mais recente)

### 2. MySQL Workbench (OPCIONAL mas RECOMENDADO)
**Ferramenta gráfica para gerenciar o banco de dados visualmente.**

**Link direto:**
```
https://dev.mysql.com/downloads/workbench/
```

**Passos no site:**
1. Acesse o link acima
2. Clique em "Download" (versão Windows)
3. Clique em **"No thanks, just start my download"**
4. Baixe o instalador

---

## 📋 Instalação Passo a Passo

### PASSO 1: Instalar MySQL Community Server

1. **Execute o instalador baixado** (`mysql-installer-community-*.msi`)

2. **Escolha o tipo de instalação:**
   - Selecione **"Developer Default"** ou **"Full"**
   - Clique em **"Next"**

3. **Instalar dependências:**
   - O instalador pode pedir para instalar Visual C++ Redistributable
   - Clique em **"Execute"** e depois **"Next"**

4. **Configuração do servidor:**
   - Escolha **"Standalone MySQL Server"**
   - Clique em **"Next"**

5. **Tipo de configuração:**
   - Escolha **"Development Computer"**
   - Clique em **"Next"**

6. **Autenticação:**
   - Escolha **"Use Strong Password Encryption"**
   - Clique em **"Next"**

7. **Configurar senha do ROOT (IMPORTANTE!):**
   - Digite uma senha para o usuário `root`
   - **ANOTE ESTA SENHA!** Você vai precisar dela
   - Exemplo: `root123` (use uma senha segura)
   - Clique em **"Next"**

8. **Serviço Windows:**
   - Deixe marcado **"Start the MySQL Server at System Startup"**
   - Clique em **"Next"**

9. **Aplicar configurações:**
   - Clique em **"Execute"**
   - Aguarde a instalação terminar
   - Clique em **"Finish"**

10. **Concluir instalação:**
    - Clique em **"Next"** e depois **"Finish"**

### PASSO 2: Instalar MySQL Workbench (Opcional)

1. **Execute o instalador do Workbench**
2. Siga as instruções na tela (próximo, próximo, instalar)
3. Ao final, o Workbench abrirá automaticamente

---

## ✅ Verificar Instalação

### Teste 1: Verificar se MySQL está rodando

1. Abra o **Prompt de Comando** (cmd) ou **PowerShell**
2. Digite:
   ```bash
   mysql --version
   ```
3. Deve aparecer algo como: `mysql Ver 8.0.xx`

### Teste 2: Conectar ao MySQL

1. No Prompt de Comando, digite:
   ```bash
   mysql -u root -p
   ```
2. Digite a senha que você criou durante a instalação
3. Se aparecer `mysql>`, está funcionando! ✅
4. Digite `exit` para sair

### Teste 3: Usar MySQL Workbench (se instalou)

1. Abra o **MySQL Workbench**
2. Clique na conexão **"Local instance MySQL"** (ou crie uma nova)
3. Digite a senha do root
4. Se conectar, está tudo certo! ✅

---

## ⚙️ Configurar o Backend da Aplicação

### PASSO 1: Configurar arquivo .env

1. Navegue até a pasta `backend` do projeto:
   ```bash
   cd backend
   ```

2. Copie o arquivo de exemplo:
   ```bash
   copy env.example .env
   ```
   (ou copie manualmente e renomeie para `.env`)

3. **Edite o arquivo `.env`** com um editor de texto (Notepad++, VS Code, etc.)

4. **Configure as seguintes linhas:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=SUA_SENHA_DO_MYSQL_AQUI
   DB_NAME=hemope_db
   
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
   ```

   **Substitua `SUA_SENHA_DO_MYSQL_AQUI` pela senha que você criou para o root!**

### PASSO 2: Criar o Banco de Dados

No terminal, dentro da pasta `backend`, execute:

```bash
npm run init-db
```

Isso vai:
- Criar o banco de dados `hemope_db`
- Criar todas as tabelas necessárias
- Configurar tudo automaticamente

**Se der erro de conexão:**
- Verifique se o MySQL está rodando
- Verifique se a senha no `.env` está correta
- Tente conectar manualmente: `mysql -u root -p`

### PASSO 3: Criar Usuário Administrador

```bash
npm run create-admin
```

Isso cria um usuário admin com:
- **Email**: `admin@hemope.pe.gov.br`
- **Senha**: `admin`

---

## 🚀 Rodar a Aplicação

### PARTE 1: Rodar o Backend (API)

1. **Certifique-se de estar na pasta `backend`:**
   ```bash
   cd backend
   ```

2. **Instalar dependências (se ainda não instalou):**
   ```bash
   npm install
   ```

3. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

4. **Você deve ver:**
   ```
   ✅ Conectado ao banco de dados MySQL
   🚀 Servidor rodando na porta 3000
   📚 Documentação disponível em http://localhost:3000/api-docs
   ```

5. **Deixe este terminal aberto!** O servidor precisa ficar rodando.

### PARTE 2: Rodar o App React Native (Frontend)

1. **Abra um NOVO terminal** (deixe o backend rodando no outro)

2. **Navegue até a pasta raiz do projeto:**
   ```bash
   cd ..
   ```
   (ou navegue até a pasta `app-main`)

3. **Instalar dependências (se ainda não instalou):**
   ```bash
   npm install
   ```

4. **Iniciar o Expo:**
   ```bash
   npm start
   ```
   ou
   ```bash
   expo start
   ```

5. **Escolha como rodar:**
   - Pressione `a` para Android
   - Pressione `i` para iOS
   - Escaneie o QR Code com o app Expo Go no celular
   - Pressione `w` para web

---

## 📱 Testando a Aplicação

### 1. Testar o Backend

Abra o navegador e acesse:
- **Health Check**: http://localhost:3000/health
- **Documentação Swagger**: http://localhost:3000/api-docs

### 2. Testar Login no App

1. Abra o app no celular/emulador
2. Na tela de login, use:
   - **Email**: `admin@hemope.pe.gov.br`
   - **Senha**: `admin`

### 3. Fazer Upload de XLS (Admin)

1. Faça login como admin no app ou via API
2. Use o endpoint `/api/upload/xls` para fazer upload de um arquivo Excel
3. O arquivo deve ter colunas: `codigo_doador`, `nome_completo`, `tipo_sanguineo`

### 4. Registrar Novo Usuário

1. No app, vá para tela de registro
2. Informe:
   - Email
   - Senha
   - Código do doador (que está no arquivo XLS que você fez upload)

---

## 🐛 Solução de Problemas

### Erro: "Cannot connect to MySQL"

**Solução:**
1. Verifique se o MySQL está rodando:
   - Abra o **Gerenciador de Tarefas** (Ctrl + Shift + Esc)
   - Procure por `MySQL` nos processos
   - Se não estiver, inicie manualmente:
     - Abra **Serviços** (Win + R, digite `services.msc`)
     - Procure por **MySQL**
     - Clique com botão direito → **Iniciar**

2. Verifique a senha no arquivo `.env`

### Erro: "Access denied for user 'root'@'localhost'"

**Solução:**
- A senha no `.env` está errada
- Tente conectar manualmente: `mysql -u root -p`
- Se não conseguir, pode ser que precise resetar a senha

### Erro: "Database does not exist"

**Solução:**
```bash
cd backend
npm run init-db
```

### Erro: "Port 3000 already in use"

**Solução:**
- Altere a porta no arquivo `.env`:
  ```env
  PORT=3001
  ```
- Ou feche o programa que está usando a porta 3000

### MySQL não inicia automaticamente

**Solução:**
1. Abra **Serviços** (Win + R → `services.msc`)
2. Procure por **MySQL**
3. Clique com botão direito → **Propriedades**
4. Em **Tipo de inicialização**, escolha **Automático**
5. Clique em **Iniciar**

---

## 📞 Próximos Passos

Após instalar e configurar tudo:

1. ✅ MySQL instalado e rodando
2. ✅ Banco de dados criado (`npm run init-db`)
3. ✅ Admin criado (`npm run create-admin`)
4. ✅ Backend rodando (`npm run dev` na pasta backend)
5. ✅ App rodando (`npm start` na pasta raiz)

**Agora você pode:**
- Fazer upload de arquivos XLS com doadores
- Registrar novos usuários no app
- Fazer login e acessar os dados

---

## 🔗 Links Úteis

- **Documentação MySQL**: https://dev.mysql.com/doc/
- **MySQL Workbench Manual**: https://dev.mysql.com/doc/workbench/en/
- **Documentação da API**: http://localhost:3000/api-docs (após iniciar o backend)

---

**Dúvidas? Consulte o arquivo `backend/README.md` para mais detalhes!**



