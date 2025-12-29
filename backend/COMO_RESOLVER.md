# 🚨 Como Resolver o Erro de Conexão

## ❌ Erro que você está vendo:

```
❌ Erro ao inicializar banco de dados: Access denied for user 'root'@'localhost' (using password: NO)
```

Isso significa que o arquivo `.env` existe, mas **a senha não está configurada**.

---

## ✅ SOLUÇÃO RÁPIDA (3 passos)

### PASSO 1: Abrir o arquivo .env

Na pasta `backend`, abra o arquivo `.env` com um editor de texto.

**No VS Code:**
```bash
code backend/.env
```

**Ou abra manualmente:**
- Navegue até `C:\Users\SSTI\Documents\app-main\backend`
- Abra o arquivo `.env` (pode estar oculto, então mostre arquivos ocultos)

### PASSO 2: Configurar a senha

Encontre esta linha:
```env
DB_PASSWORD=
```

E adicione sua senha do MySQL:
```env
DB_PASSWORD=SUA_SENHA_AQUI
```

**Exemplo:**
```env
DB_PASSWORD=root123
```

**⚠️ IMPORTANTE:** Use a senha que você criou ao instalar o MySQL!

### PASSO 3: Salvar e testar

1. **Salve o arquivo** (Ctrl + S)

2. **Teste a conexão:**
   ```bash
   npm run test-connection
   ```

3. **Se der certo, execute:**
   ```bash
   npm run init-db
   ```

---

## 🔍 Não lembra a senha do MySQL?

### Opção 1: Testar senhas comuns

Tente conectar manualmente:
```bash
mysql -u root -p
```

Teste senhas que você costuma usar.

### Opção 2: Resetar senha do MySQL

Se não conseguir, pode precisar resetar a senha. Consulte:
- https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html

---

## 🧪 Testar se MySQL está rodando

Antes de tudo, verifique se o MySQL está rodando:

1. **Abra o Gerenciador de Tarefas** (Ctrl + Shift + Esc)
2. Procure por **MySQL** nos processos
3. Se não estiver:
   - Win + R → digite `services.msc`
   - Procure por **MySQL**
   - Clique com botão direito → **Iniciar**

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

**⚠️ Substitua `minhasenha123` pela sua senha real!**

---

## ✅ Checklist

Antes de executar `npm run init-db`, verifique:

- [ ] Arquivo `.env` existe na pasta `backend`
- [ ] Arquivo `.env` tem `DB_PASSWORD=sua_senha` (não pode estar vazio)
- [ ] MySQL está rodando (verificar no Gerenciador de Tarefas)
- [ ] Consegue conectar manualmente: `mysql -u root -p`

---

## 🆘 Ainda com problemas?

Execute o teste de conexão:
```bash
npm run test-connection
```

Este comando vai mostrar exatamente qual é o problema!

---

**Depois de corrigir, execute:**
```bash
npm run init-db
```




