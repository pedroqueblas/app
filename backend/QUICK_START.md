# 🚀 Guia Rápido de Início

## Passo a Passo para Começar

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados

Crie o arquivo `.env` copiando de `env.example`:

```bash
cp env.example .env
```

Edite o `.env` com suas credenciais do MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=hemope_db
JWT_SECRET=seu_secret_aqui_mude_em_producao
```

### 3. Inicializar Banco de Dados

```bash
npm run init-db
```

### 4. Criar Usuário Admin

```bash
npm run create-admin
```

Isso criará:
- **Email**: admin@hemope.pe.gov.br
- **Senha**: admin

### 5. Iniciar Servidor

```bash
npm run dev
```

O servidor estará em `http://localhost:3000`

## 📋 Testando a API

### 1. Login como Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hemope.pe.gov.br",
    "password": "admin"
  }'
```

Salve o `token` retornado.

### 2. Upload de Arquivo XLS

Primeiro, crie um arquivo Excel com pelo menos estas colunas:
- `codigo_doador` (obrigatório)
- `nome_completo` (obrigatório)
- `tipo_sanguineo` (obrigatório)

Depois faça o upload:

```bash
curl -X POST http://localhost:3000/api/upload/xls \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "file=@/caminho/para/seu/arquivo.xlsx"
```

### 3. Registrar Novo Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doador@example.com",
    "password": "senha123",
    "codigo_doador": "CODIGO_DO_XLS"
  }'
```

### 4. Login do Usuário

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doador@example.com",
    "password": "senha123"
  }'
```

### 5. Obter Dados do Usuário

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TOKEN_DO_USUARIO"
```

## 📚 Documentação Completa

Acesse a documentação Swagger em:
```
http://localhost:3000/api-docs
```

## 🔍 Verificar Saúde da API

```bash
curl http://localhost:3000/health
```

## ⚠️ Problemas Comuns

### Erro: "Cannot connect to MySQL"
- Verifique se o MySQL está rodando
- Confirme as credenciais no `.env`

### Erro: "Database does not exist"
- Execute `npm run init-db`

### Erro: "Table already exists"
- Normal, significa que o banco já foi criado

### Erro: "JWT_SECRET is not defined"
- Configure o `JWT_SECRET` no arquivo `.env`




