# 🔧 Solução para Problemas de Instalação SDK 54

## ⚠️ PROBLEMA IDENTIFICADO

Você está usando **Node.js v18.20.8**, mas o **Expo SDK 54 requer Node.js >= 20.19.4**.

Além disso, há conflitos de dependências que precisam ser resolvidos.

---

## ✅ SOLUÇÃO PASSO A PASSO

### OPÇÃO 1: Atualizar Node.js (RECOMENDADO)

#### PASSO 1: Verificar versão atual do Node.js

```bash
node --version
```

Se mostrar `v18.x.x`, você precisa atualizar.

#### PASSO 2: Atualizar Node.js para v20 ou v22

**Opção A: Usando nvm (Node Version Manager) - Recomendado**

1. **Instalar nvm-windows:**
   - Baixe: https://github.com/coreybutler/nvm-windows/releases
   - Instale o `nvm-setup.exe`

2. **Instalar Node.js 20:**
   ```bash
   nvm install 20.19.4
   nvm use 20.19.4
   ```

3. **Verificar:**
   ```bash
   node --version
   ```
   Deve mostrar `v20.19.4` ou superior.

**Opção B: Download direto**

1. Baixe Node.js 20 LTS: https://nodejs.org/
2. Instale a versão mais recente do Node.js 20
3. Reinicie o terminal

#### PASSO 3: Após atualizar Node.js

```bash
# Limpar tudo
Remove-Item -Recurse -Force node_modules, package-lock.json

# Instalar com legacy-peer-deps (resolve conflitos)
npm install --legacy-peer-deps

# Deixar Expo corrigir as versões
npx expo install --fix
```

---

### OPÇÃO 2: Usar --legacy-peer-deps (SOLUÇÃO RÁPIDA)

Se não puder atualizar o Node.js agora, use esta solução temporária:

#### PASSO 1: Limpar tudo

```bash
Remove-Item -Recurse -Force node_modules, package-lock.json
```

#### PASSO 2: Instalar com --legacy-peer-deps

```bash
npm install --legacy-peer-deps
```

#### PASSO 3: Deixar Expo corrigir versões

```bash
npx expo install --fix
```

#### PASSO 4: Se ainda houver problemas

```bash
npm install --legacy-peer-deps --force
```

---

## 🔧 CORREÇÕES APLICADAS

### 1. Removido `sdkVersion` do app.json

O Expo detecta automaticamente a versão do SDK baseado na versão do pacote `expo`. O `sdkVersion` no `app.json` pode causar conflitos.

### 2. Ajustado `react-native-safe-area-context`

Mudado de `4.15.0` para `~4.15.0` para permitir atualizações de patch.

---

## 📋 SEQUÊNCIA COMPLETA RECOMENDADA

### 1. Atualizar Node.js (se possível)

```bash
# Verificar versão
node --version

# Se for v18, atualizar para v20
# (usar nvm ou download direto)
```

### 2. Limpar projeto

```bash
Remove-Item -Recurse -Force node_modules, package-lock.json
```

### 3. Instalar dependências

```bash
npm install --legacy-peer-deps
```

### 4. Corrigir versões com Expo

```bash
npx expo install --fix
```

### 5. Verificar instalação

```bash
npx expo-doctor
```

### 6. Testar

```bash
npx expo start --clear
```

---

## ⚠️ AVISOS IMPORTANTES

### 1. Node.js v18 vs v20

- **SDK 54 requer Node.js >= 20.19.4**
- Com Node.js v18, você pode ter problemas de compatibilidade
- **Recomendação:** Atualize para Node.js 20 LTS

### 2. Warnings sobre engine

Os warnings sobre `EBADENGINE` aparecem porque você está usando Node.js v18. Eles não impedem a instalação, mas podem causar problemas.

### 3. Expo Go e SDK 54

SDK 54 pode não ser totalmente compatível com Expo Go. Considere usar Development Build.

---

## 🐛 Problemas Comuns e Soluções

### Erro: "react-native-safe-area-context@undefined"

**Solução:**
```bash
npm install react-native-safe-area-context@~4.15.0 --legacy-peer-deps
```

### Erro: "Could not resolve react-native"

**Solução:**
```bash
npm install --legacy-peer-deps
npx expo install --fix
```

### Erro: "expo is not installed"

**Solução:**
```bash
npm install expo@~54.0.0 --legacy-peer-deps
npx expo install --fix
```

### Warnings sobre Node.js version

**Solução:**
Atualize o Node.js para v20 ou use `--legacy-peer-deps` (pode ter problemas).

---

## ✅ Checklist Final

- [ ] Node.js atualizado para v20 (ou usando --legacy-peer-deps)
- [ ] `node_modules` removido
- [ ] `package-lock.json` removido
- [ ] `npm install --legacy-peer-deps` executado
- [ ] `npx expo install --fix` executado
- [ ] `npx expo-doctor` sem erros críticos
- [ ] `npx expo start --clear` funciona

---

## 🚀 Comandos Rápidos (Copiar e Colar)

```bash
# Limpar
Remove-Item -Recurse -Force node_modules, package-lock.json

# Instalar
npm install --legacy-peer-deps

# Corrigir
npx expo install --fix

# Verificar
npx expo-doctor

# Testar
npx expo start --clear
```

---

## 📚 Recursos

- [Node.js Downloads](https://nodejs.org/)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Expo SDK 54 Docs](https://docs.expo.dev/)

---

**Execute os comandos acima na ordem e teste! 🎯**



