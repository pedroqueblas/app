# 🔍 Diagnóstico de Erro 500

## ❌ O que é Erro 500?

Erro 500 significa "Internal Server Error" - algo está errado no servidor backend.

---

## ✅ CHECKLIST - O que verificar antes de rodar a aplicação

### 1️⃣ MySQL está rodando?

**Verificar:**
- Abra o **Gerenciador de Tarefas** (Ctrl + Shift + Esc)
- Procure por **MySQL** nos processos
- Se não estiver, inicie o serviço MySQL

**Iniciar MySQL:**
- Win + R → digite `services.msc`
- Procure por **MySQL**
- Clique com botão direito → **Iniciar**

### 2️⃣ Banco de dados foi criado?

**Verificar:**
```bash
cd backend
npm run test-connection
```

**Se não foi criado, execute:**
```bash
npm run init-db
```

Você deve ver:
```
✅ Banco de dados inicializado com sucesso!
📊 Tabelas criadas:
   - donors
   - users
   - import_logs
```

### 3️⃣ Usuário admin foi criado?

**Verificar:**
```bash
npm run create-admin
```

Você deve ver:
```
✅ Usuário administrador criado com sucesso!
📋 Credenciais de acesso:
   Email: admin@hemope.pe.gov.br
   Senha: admin
```

### 4️⃣ Arquivo .env está configurado?

**Verificar se existe:**
```bash
cd backend
dir .env
```

**Verificar conteúdo:**
O arquivo `.env` deve ter:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=hemope_db
JWT_SECRET=algum_secret_aqui
```

### 5️⃣ Backend está rodando?

**Iniciar backend:**
```bash
cd backend
npm run dev
```

Você deve ver:
```
✅ Conectado ao banco de dados MySQL
🚀 Servidor rodando na porta 3000
📚 Documentação disponível em http://localhost:3000/api-docs
```

**⚠️ IMPORTANTE:** O backend DEVE estar rodando antes de usar o app!

---

## 🚀 SEQUÊNCIA CORRETA PARA RODAR A APLICAÇÃO

### PASSO 1: Verificar MySQL
```bash
# Testar conexão
cd backend
npm run test-connection
```

### PASSO 2: Criar banco (se ainda não criou)
```bash
npm run init-db
```

### PASSO 3: Criar admin (se ainda não criou)
```bash
npm run create-admin
```

### PASSO 4: Iniciar Backend
```bash
npm run dev
```

**Deixe este terminal aberto!** O backend precisa ficar rodando.

### PASSO 5: Iniciar App (em OUTRO terminal)
```bash
cd ..  # volta para pasta raiz
npm start
```

---

## 🔍 Diagnosticar Erro 500

### Ver logs do backend

Quando o backend está rodando, os erros aparecem no terminal. Procure por mensagens de erro.

### Testar endpoints manualmente

**1. Health Check:**
Abra no navegador: http://localhost:3000/health

Deve retornar:
```json
{"status":"OK","timestamp":"..."}
```

**2. Testar Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hemope.pe.gov.br\",\"password\":\"admin\"}"
```

**3. Ver documentação:**
Abra no navegador: http://localhost:3000/api-docs

---

## 🐛 Problemas Comuns e Soluções

### Erro: "Cannot connect to database"

**Causa:** MySQL não está rodando ou senha incorreta

**Solução:**
1. Verifique se MySQL está rodando
2. Verifique a senha no `.env`
3. Execute `npm run test-connection`

### Erro: "Table doesn't exist"

**Causa:** Banco de dados não foi inicializado

**Solução:**
```bash
npm run init-db
```

### Erro: "ER_NO_SUCH_TABLE"

**Causa:** Tabelas não foram criadas

**Solução:**
```bash
npm run init-db
```

### Erro: "JWT_SECRET is not defined"

**Causa:** JWT_SECRET não está no `.env`

**Solução:**
Adicione no `.env`:
```env
JWT_SECRET=seu_secret_super_seguro_aqui
```

### Erro: "Cannot read property of undefined"

**Causa:** Banco de dados não conectado ou tabelas vazias

**Solução:**
1. Verifique conexão: `npm run test-connection`
2. Crie admin: `npm run create-admin`

---

## ✅ Verificação Final

Antes de rodar o app, certifique-se:

- [ ] MySQL está rodando
- [ ] Arquivo `.env` configurado corretamente
- [ ] Banco de dados criado (`npm run init-db`)
- [ ] Admin criado (`npm run create-admin`)
- [ ] Backend rodando (`npm run dev`)
- [ ] Health check funciona: http://localhost:3000/health

---

## 📞 Próximos Passos

1. Execute o checklist acima
2. Inicie o backend: `npm run dev`
3. Teste o health check no navegador
4. Se tudo estiver OK, inicie o app: `npm start`

**Se ainda tiver erro 500, verifique os logs no terminal do backend!**




