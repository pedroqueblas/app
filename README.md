# HEMOPE - Aplicativo Mobile para Doadores de Sangue

Aplicativo mobile desenvolvido em React Native com Expo para a Fundação de Hematologia e Hemoterapia de Pernambuco (HEMOPE). O aplicativo permite que doadores de sangue gerenciem suas informações, agendem doações e acessem sua carteira virtual de doador.

## 📱 Sobre o Projeto

Este aplicativo foi desenvolvido para facilitar o acesso dos doadores de sangue aos serviços do HEMOPE, oferecendo uma interface intuitiva e moderna para:

- **Autenticação**: Login seguro com CPF e senha
- **Perfil do Doador**: Visualização de informações pessoais
- **Agendamento**: Acesso rápido ao sistema de agendamento de doações
- **Carteira Virtual**: Visualização da carteira digital do doador com informações de identificação
- **Localização**: Acesso rápido à localização do HEMOPE
- **Fidelização**: Informações sobre programas de fidelização

## 🛠️ Tecnologias Utilizadas

- **React Native** 0.74.5
- **Expo** 51.0.0
- **React Navigation** 7.x (Stack Navigator)
- **React Native Gesture Handler** 2.16.1
- **React Native Reanimated** 3.10.1
- **React Native Safe Area Context** 4.10.5
- **React Native Screens** 4.6.0

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Expo CLI** (instalado globalmente)
- **Git** (para clonar o repositório)

### Instalação do Expo CLI

```bash
npm install -g expo-cli
```

ou

```bash
npm install -g @expo/cli
```

## 🚀 Como Instalar e Executar

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd app-main
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

### 3. Execute o aplicativo

```bash
npm start
```

ou

```bash
expo start
```

### 4. Escolha a plataforma

Após iniciar o servidor Expo, você pode:

- **Pressionar `a`** no terminal para abrir no Android Emulator
- **Pressionar `i`** no terminal para abrir no iOS Simulator
- **Escanear o QR Code** com o aplicativo Expo Go no seu dispositivo móvel
- **Pressionar `w`** para abrir no navegador web

## 📱 Executando em Dispositivos Específicos

### Android

```bash
npm run android
```

ou

```bash
expo start --android
```

### iOS

```bash
npm run ios
```

ou

```bash
expo start --ios
```

### Web

```bash
npm run web
```

ou

```bash
expo start --web
```

## 📁 Estrutura do Projeto

```
app-main/
├── App.js                 # Componente principal e configuração de navegação
├── app.json              # Configuração do Expo
├── babel.config.js       # Configuração do Babel
├── package.json          # Dependências do projeto
├── theme.js              # Tema e estilos globais (cores, espaçamentos, tipografia)
├── components/           # Componentes reutilizáveis
│   ├── PrimaryButton.js # Botão primário customizado
│   └── SectionTitle.js  # Título de seção customizado
└── screens/              # Telas da aplicação
    ├── SplashScreen.js   # Tela de splash/boas-vindas
    ├── LoginScreen.js    # Tela de login
    ├── HomeScreen.js     # Tela inicial/home
    ├── VirtualCardScreen.js # Tela da carteira virtual
    └── ProfileScreen.js # Tela de perfil do usuário
```

## 🎨 Tema e Estilização

O aplicativo utiliza um sistema de design consistente definido em `theme.js`:

- **Cores**: Paleta de cores do HEMOPE (vermelho #C00017 como cor primária)
- **Espaçamentos**: Sistema de espaçamento padronizado (xs, sm, md, lg, xl)
- **Tipografia**: Estilos de texto padronizados (heading1, heading2, body, caption)

## 🔐 Funcionalidades

### Splash Screen
- Tela inicial com logo do HEMOPE
- Transição automática para a tela de login após 1.5 segundos

### Login Screen
- Autenticação com CPF e senha
- Validação de campos obrigatórios
- Interface responsiva com suporte a teclado virtual

### Home Screen
- Dashboard principal com informações do doador
- Acesso rápido a funcionalidades:
  - Agendar doação
  - Carteira virtual
  - Localização do HEMOPE
  - Programa de fidelização
- Exibição de datas de última e próxima doação
- Banner informativo

### Virtual Card Screen
- Visualização da carteira virtual do doador
- Exibição de informações:
  - Nome completo
  - Código do doador
  - Tipo sanguíneo
  - QR Code (placeholder)
- Visualização da frente e verso da carteira

### Profile Screen
- Visualização do perfil do usuário
- Avatar com iniciais
- Opção de logout

## 🔗 Integrações Externas

O aplicativo faz integração com:

- **Sistema de Agendamento**: `http://10.0.0.6:8000/agendar/`
- **Google Maps**: Localização do HEMOPE
- **Site do HEMOPE**: `https://www.hemope.pe.gov.br/`

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento Expo
- `npm run android` - Inicia no Android
- `npm run ios` - Inicia no iOS
- `npm run web` - Inicia no navegador web

## 🐛 Troubleshooting

### Problemas comuns:

1. **Erro ao instalar dependências**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Erro no Metro Bundler**
   ```bash
   npm start -- --reset-cache
   ```

3. **Problemas com cache do Expo**
   ```bash
   expo start -c
   ```

4. **Erro no Android/iOS**
   - Certifique-se de ter o Android Studio/Xcode instalado
   - Verifique se os emuladores/simuladores estão configurados corretamente

## 📄 Licença

Este projeto é privado e pertence à Fundação HEMOPE.

## 👥 Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento do HEMOPE.

---

**Desenvolvido para a Fundação HEMOPE - Recife, PE**



