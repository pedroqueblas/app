# 🔧 Solução para Erro de Conexão MySQL

## ❌ Erro: "Access denied for user 'root'@'localhost' (using password: NO)"

Este erro significa que o arquivo `.env` não existe ou não está configurado corretamente.

---

## ✅ SOLUÇÃO PASSO A PASSO

### PASSO 1: Criar arquivo .env

No terminal, dentro da pasta `backend`, execute:

**Windows (PowerShell ou CMD):**
```bash
copy env.example .env
```

**Ou manualmente:**
1. Abra a pasta `backend`
2. Copie o arquivo `env.example`
3. Cole e renomeie para `.env` (sem extensão)

### PASSO 2: Editar o arquivo .env

Abra o arquivo `.env` com um editor de texto (Notepad++, VS Code, etc.) e configure:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_DO_MYSQL_AQUI
DB_NAME=hemope_db

JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA_DO_MYSQL_AQUI` pela senha que você criou ao instalar o MySQL!

**Exemplo:**
```env
DB_PASSWORD=root123
```

### PASSO 3: Verificar se MySQL está rodando

1. Abra o **Gerenciador de Tarefas** (Ctrl + Shift + Esc)
2. Procure por **MySQL** nos processos
3. Se não estiver rodando:
   - Abra **Serviços** (Win + R, digite `services.msc`)
   - Procure por **MySQL**
   - Clique com botão direito → **Iniciar**

### PASSO 4: Testar conexão manualmente

No Prompt de Comando, teste se consegue conectar:

```bash
mysql -u root -p
```

Digite a senha. Se conectar, está tudo certo! Digite `exit` para sair.

### PASSO 5: Executar novamente

```bash
npm run init-db
```

---

## ❌ Erro: "connect ECONNREFUSED ::1:3306"

Este erro significa que o MySQL não está rodando ou não está acessível.

### Solução:

1. **Verificar se MySQL está rodando:**
   - Abra **Gerenciador de Tarefas** → Procure por "MySQL"
   - Se não estiver, inicie o serviço MySQL

2. **Iniciar MySQL manualmente:**
   - Abra **Serviços** (Win + R → `services.msc`)
   - Procure por **MySQL**
   - Clique com botão direito → **Iniciar**

3. **Verificar porta:**
   - Por padrão, MySQL usa a porta 3306
   - Se você mudou a porta, atualize no `.env`:
     ```env
     DB_PORT=3306
     ```

4. **Testar conexão:**
   ```bash
   mysql -u root -p
   ```

---

## 🔍 Verificar Configuração

### Checklist:

- [ ] Arquivo `.env` existe na pasta `backend`
- [ ] Arquivo `.env` tem a linha `DB_PASSWORD=sua_senha`
- [ ] MySQL está rodando (verificar no Gerenciador de Tarefas)
- [ ] Consegue conectar manualmente: `mysql -u root -p`

---

## 📝 Exemplo de arquivo .env correto

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=minhasenha123
DB_NAME=hemope_db

# Configurações JWT
JWT_SECRET=meu_secret_super_seguro_123456
JWT_EXPIRES_IN=7d

# Configurações de Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Substitua `minhasenha123` pela sua senha real do MySQL!**

---

## 🐛 Problemas Comuns

### Problema: "Não consigo lembrar a senha do MySQL"

**Solução:**
1. Tente senhas comuns que você usa
2. Se não lembrar, pode precisar resetar a senha do MySQL
3. Ou criar um novo usuário MySQL

### Problema: "MySQL não inicia"

**Solução:**
1. Verifique se já existe outro MySQL rodando
2. Verifique os logs do MySQL em:
   - `C:\ProgramData\MySQL\MySQL Server X.X\Data\*.err`
3. Tente reinstalar o MySQL

### Problema: "Arquivo .env não é reconhecido"

**Solução:**
1. Certifique-se de que o arquivo se chama exatamente `.env` (sem extensão)
2. Não deve ser `.env.txt` ou `env.example`
3. No Windows, pode precisar mostrar arquivos ocultos

---

## ✅ Após corrigir, execute:

```bash
npm run init-db
```

Se tudo estiver correto, você verá:

```
✅ Conectado ao MySQL
✅ Banco de dados inicializado com sucesso!
📊 Tabelas criadas:
   - donors
   - users
   - import_logs
```

---

**Ainda com problemas? Consulte `GUIA_INSTALACAO_MYSQL.md` para mais detalhes!**



