# HEMOPE Backend API

Backend completo desenvolvido em Node.js + Express + MySQL para o sistema de gerenciamento de doadores de sangue HEMOPE.

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **Multer** - Upload de arquivos
- **XLSX** - Processamento de arquivos Excel
- **Swagger** - Documentação da API

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- MySQL >= 5.7 ou MariaDB >= 10.2
- npm ou yarn

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=hemope_db

JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 3. Criar banco de dados

Execute o script de inicialização:

```bash
npm run init-db
```

Este script irá:
- Criar o banco de dados `hemope_db`
- Criar todas as tabelas necessárias
- Configurar índices e relacionamentos

### 4. Criar usuário administrador

```bash
npm run create-admin
```

Isso criará um usuário admin com as seguintes credenciais:
- **Email**: admin@hemope.pe.gov.br
- **Senha**: admin

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 🏃 Executando

### Modo desenvolvimento (com nodemon)

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Documentação da API

A documentação Swagger está disponível em:

```
http://localhost:3000/api-docs
```

## 🔐 Endpoints Principais

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login

### Usuários

- `GET /api/users/me` - Obter dados do usuário autenticado (protegido)

### Upload

- `POST /api/upload/xls` - Upload de arquivo XLS/XLSX (protegido, admin apenas)

## 📊 Estrutura do Banco de Dados

### Tabela `donors`

Armazena informações dos doadores importados via XLS.

- `id` (PK)
- `codigo_doador` (UNIQUE) - Código único do doador
- `nome_completo`
- `tipo_sanguineo`
- `data_nascimento`
- `sexo`
- `telefone`
- `email`
- `cpf`, `rg`, `endereco`, `cidade`, `estado`, `cep`
- `created_at`, `updated_at`

### Tabela `users`

Armazena usuários do sistema vinculados aos doadores.

- `id` (PK)
- `email` (UNIQUE)
- `password_hash`
- `donor_id` (FK → donors.id)
- `role` (user/admin)
- `is_active`
- `created_at`, `updated_at`

### Tabela `import_logs`

Registra logs de importação de arquivos XLS.

- `id` (PK)
- `filename`
- `total_rows`
- `successful_imports`
- `failed_imports`
- `errors` (JSON)
- `imported_by` (FK → users.id)
- `created_at`

## 🔄 Fluxo de Cadastro

1. Administrador faz upload de arquivo XLS com dados dos doadores
2. Sistema processa e cria/atualiza registros na tabela `donors`
3. Doador acessa o app e se cadastra informando:
   - Email
   - Senha
   - Código do doador
4. Sistema valida se o código existe e vincula o usuário ao doador
5. Usuário pode fazer login e acessar seus dados

## 📁 Estrutura do Projeto

```
backend/
├── controllers/       # Controladores (lógica de requisições)
├── services/          # Serviços (lógica de negócio)
├── models/            # Modelos (acesso ao banco)
├── routes/            # Rotas da API
├── middlewares/       # Middlewares (auth, validação, erros)
├── database/          # Configuração e migrations
├── utils/             # Utilitários (validadores, helpers)
├── scripts/           # Scripts de inicialização
├── uploads/           # Diretório de uploads (criado automaticamente)
├── server.js          # Arquivo principal
└── package.json       # Dependências
```

## 🛡️ Segurança

- ✅ Senhas com bcrypt (hash)
- ✅ JWT com expiração configurável
- ✅ Middleware de autenticação
- ✅ Validação de dados com Joi
- ✅ Proteção contra SQL Injection (prepared statements)
- ✅ Rate limiting
- ✅ Helmet para headers de segurança
- ✅ CORS configurável

## 📝 Formato do Arquivo XLS

O arquivo Excel deve conter pelo menos as seguintes colunas:

- `codigo_doador` (obrigatório) - Código único do doador
- `nome_completo` ou `nome` (obrigatório)
- `tipo_sanguineo` ou `tipo_sangue` (obrigatório)
- `data_nascimento` (opcional)
- `sexo` (opcional)
- `telefone` ou `celular` (opcional)
- `email` (opcional)
- Outras colunas serão mapeadas automaticamente

## 🧪 Testando a API

### Registrar usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "codigo_doador": "1234567891"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hemope.pe.gov.br",
    "password": "admin"
  }'
```

### Obter dados do usuário

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Upload XLS (admin)

```bash
curl -X POST http://localhost:3000/api/upload/xls \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -F "file=@/caminho/para/arquivo.xlsx"
```

## 🐛 Troubleshooting

### Erro de conexão com MySQL

- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão manualmente

### Erro ao criar banco de dados

- Certifique-se de ter permissões de criação de banco
- Execute o script `init-db` com um usuário que tenha privilégios

### Erro ao processar XLS

- Verifique se o arquivo tem a coluna `codigo_doador`
- Confirme que o formato é .xls ou .xlsx
- Verifique o tamanho do arquivo (limite padrão: 10MB)

## 📄 Licença

Este projeto é privado e pertence à Fundação HEMOPE.




