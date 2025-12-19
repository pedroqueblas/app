# ⚡ Resumo Rápido - O Que Fazer Depois de Instalar MySQL

## 🎯 Checklist Rápido

- [ ] MySQL instalado e rodando
- [ ] Arquivo `.env` configurado na pasta `backend`
- [ ] Banco de dados criado (`npm run init-db`)
- [ ] Admin criado (`npm run create-admin`)
- [ ] Backend rodando (`npm run dev`)
- [ ] App rodando (`npm start`)

---

## 📝 Passos Resumidos

### 1️⃣ Configurar Backend

```bash
cd backend
copy env.example .env
# Edite o .env e coloque a senha do MySQL
npm install
npm run init-db
npm run create-admin
npm run dev
```

### 2️⃣ Rodar App (em outro terminal)

```bash
cd ..  # volta para pasta raiz
npm install  # se ainda não instalou
npm start
```

---

## 🔑 Credenciais Padrão

**Admin:**
- Email: `admin@hemope.pe.gov.br`
- Senha: `admin`

**MySQL:**
- Usuário: `root`
- Senha: (a que você criou na instalação)

---

## 🌐 URLs Importantes

- **Backend API**: http://localhost:3000
- **Documentação**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

---

## ⚠️ Lembre-se

1. **MySQL deve estar rodando** antes de iniciar o backend
2. **Backend deve estar rodando** antes de usar o app
3. **Senha do MySQL** deve estar correta no arquivo `.env`

---

**Para instruções detalhadas, veja `GUIA_INSTALACAO_MYSQL.md`**



