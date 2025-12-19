# 🚀 Como Rodar a Aplicação Completa

## ⚠️ IMPORTANTE: Ordem de Execução

A aplicação precisa de **2 processos rodando simultaneamente**:
1. **Backend (API)** - deve rodar primeiro
2. **App React Native** - roda depois

---

## 📋 CHECKLIST ANTES DE COMEÇAR

Execute este comando para verificar se tudo está configurado:

```bash
cd backend
npm run check
```

Este comando verifica:
- ✅ Arquivo .env configurado
- ✅ MySQL conectado
- ✅ Banco de dados criado
- ✅ Tabelas criadas
- ✅ Usuário admin criado

**Se algo estiver faltando, o script vai te dizer o que fazer!**

---

## 🚀 PASSO A PASSO COMPLETO

### PASSO 1: Verificar Configuração

```bash
cd backend
npm run check
```

**Se tudo estiver OK, continue.**
**Se houver erros, corrija antes de continuar.**

### PASSO 2: Iniciar Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**Você deve ver:**
```
✅ Conectado ao banco de dados MySQL
🚀 Servidor rodando na porta 3000
📚 Documentação disponível em http://localhost:3000/api-docs
🏥 Health check em http://localhost:3000/health
```

**⚠️ DEIXE ESTE TERMINAL ABERTO!** O backend precisa ficar rodando.

### PASSO 3: Testar Backend (Opcional)

Abra no navegador:
- **Health Check**: http://localhost:3000/health
- **Documentação**: http://localhost:3000/api-docs

Se abrir, está funcionando! ✅

### PASSO 4: Iniciar App React Native (Terminal 2)

**Abra um NOVO terminal** (deixe o backend rodando no primeiro)

```bash
cd C:\Users\SSTI\Documents\app-main
npm start
```

**Ou se já estiver na pasta raiz:**
```bash
npm start
```

### PASSO 5: Escolher Plataforma

No terminal do Expo, escolha:
- Pressione **`a`** para Android
- Pressione **`i`** para iOS
- Escaneie o **QR Code** com Expo Go no celular
- Pressione **`w`** para web

---

## ✅ Verificação Rápida

### Backend está rodando?
- Abra: http://localhost:3000/health
- Deve retornar: `{"status":"OK",...}`

### App está rodando?
- Você vê o QR Code no terminal
- Ou o app abre no emulador/simulador

---

## 🐛 Problemas Comuns

### Erro 500 no App

**Causa:** Backend não está rodando ou há problema na configuração

**Solução:**
1. Verifique se o backend está rodando (Terminal 1)
2. Teste: http://localhost:3000/health
3. Execute: `npm run check` na pasta backend
4. Verifique os logs do backend no terminal

### "Cannot connect to API"

**Causa:** Backend não está rodando ou porta errada

**Solução:**
1. Certifique-se de que o backend está rodando
2. Verifique a porta no `.env` (padrão: 3000)
3. No app, verifique se a URL da API está correta

### "Network request failed"

**Causa:** Backend não está acessível

**Solução:**
1. Verifique se o backend está rodando
2. Se estiver usando emulador Android, use `10.0.2.2` ao invés de `localhost`
3. Se estiver usando dispositivo físico, use o IP da sua máquina

---

## 📱 Configurar URL da API no App

Se o app não conseguir conectar ao backend, você pode precisar configurar a URL da API.

**Para emulador Android:**
- Use: `http://10.0.2.2:3000`

**Para dispositivo físico:**
- Use o IP da sua máquina: `http://192.168.x.x:3000`
- Descubra seu IP: `ipconfig` (Windows)

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────┐
│  TERMINAL 1: Backend                 │
│  cd backend                          │
│  npm run dev                         │
│  ✅ Deve ficar rodando              │
└─────────────────────────────────────┘
              ↓
    http://localhost:3000
              ↓
┌─────────────────────────────────────┐
│  TERMINAL 2: App React Native       │
│  cd .. (pasta raiz)                  │
│  npm start                           │
│  ✅ Escolhe plataforma              │
└─────────────────────────────────────┘
```

---

## ✅ Checklist Final

Antes de usar o app, certifique-se:

- [ ] MySQL está rodando
- [ ] Backend está rodando (`npm run dev` no Terminal 1)
- [ ] Health check funciona: http://localhost:3000/health
- [ ] App está rodando (`npm start` no Terminal 2)
- [ ] Consegue ver a tela de login no app

---

## 🆘 Ainda com problemas?

1. Execute: `npm run check` na pasta backend
2. Verifique os logs no terminal do backend
3. Teste o health check no navegador
4. Consulte `backend/DIAGNOSTICO_ERRO_500.md`

---

**Agora você está pronto para usar a aplicação! 🎉**



