# Delivery Platform - Frontend

Aplicação web moderna desenvolvida em ReactJS para gerenciamento de pedidos e entregas, integrada com backend Spring Boot.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Autenticação](#autenticação)
- [API Integration](#api-integration)
- [Deploy](#deploy)
- [Arquitetura](#arquitetura)

## 🎯 Visão Geral

Esta aplicação é uma plataforma completa de gerenciamento de entregas que permite:

- **Gerenciamento de Pedidos**: Criar, visualizar, listar e excluir pedidos
- **Gerenciamento de Entregas**: Criar, visualizar, listar e atualizar status de entregas
- **Autenticação OAuth2**: Login com Google usando OAuth2 e JWT
- **Integração com APIs Externas**: Busca automática de endereços via ViaCEP
- **Interface Responsiva**: Design adaptável para desktop, tablet e mobile

## 🛠 Tecnologias

### Core
- **React 19.2.3** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.9.3** - Superset do JavaScript com tipagem estática
- **Vite 7.2.4** - Build tool e dev server de alta performance

### UI/UX
- **Material-UI (MUI) 7.3.6** - Biblioteca de componentes React
- **@mui/icons-material** - Ícones do Material Design
- **@emotion/react & @emotion/styled** - CSS-in-JS para estilização

### Gerenciamento de Estado e Formulários
- **Zustand 5.0.9** - Biblioteca leve para gerenciamento de estado global
- **React Hook Form 7.69.0** - Biblioteca para gerenciamento de formulários
- **Zod 4.2.1** - Validação de schemas TypeScript-first
- **@hookform/resolvers** - Integração React Hook Form + Zod

### Roteamento e HTTP
- **React Router DOM 7.11.0** - Roteamento declarativo para React
- **Axios 1.13.2** - Cliente HTTP para requisições à API

### Notificações
- **React Toastify 11.0.5** - Sistema de notificações toast

## ✅ Requisitos do Desafio

### ✅ User Interface Design
- [x] Interface limpa e intuitiva usando ReactJS
- [x] Design responsivo funcionando em diferentes tamanhos de tela
- [x] Suporte para tablet 10" (1024x768) e mobile

### ✅ CRUD Operations
- [x] **Create (POST)**: Criar pedidos e entregas
- [x] **Read (GET)**: Listar e visualizar detalhes de pedidos e entregas
- [x] **Update (PUT/PATCH)**: Atualizar status de entregas
- [x] **Delete (DELETE)**: Excluir pedidos
- [x] Integração com backend Spring Boot (REST API)

### ✅ External API Integration
- [x] Integração com ViaCEP via backend para busca automática de endereços
- [x] Busca automática ao digitar CEP completo (8 dígitos)
- [x] Cache de endereços no backend

### ✅ Form Validation
- [x] Validação de formulários com React Hook Form + Zod
- [x] Mensagens de erro em português
- [x] Validação em tempo real
- [x] Feedback visual de erros

### ✅ Login Form
- [x] Autenticação OAuth2 com Google
- [x] JWT token para autenticação
- [x] Mensagens de erro para credenciais inválidas
- [x] Proteção de rotas

### ✅ API Specifications
- [x] Estruturas de request/response alinhadas com backend
- [x] Tratamento de diferentes tipos de resposta da API
- [x] Paginação implementada

### ✅ Responsive Design
- [x] Design totalmente responsivo
- [x] Funciona em desktop, tablet (1024x768) e mobile
- [x] Uso de Material-UI com breakpoints responsivos
- [x] Layout adaptável com CSS Grid e Flexbox

### ✅ Authentication
- [x] OAuth2 com Google
- [x] JWT token armazenado em localStorage
- [x] Rotas protegidas (PrivateRoute)
- [x] Interceptors Axios para adicionar token automaticamente
- [x] Logout funcional

### ✅ Documentation
- [x] README completo com instruções
- [x] Comentários no código explicando lógica
- [x] Estrutura de pastas documentada

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x ou **yarn** >= 1.22
- Backend Spring Boot rodando em `http://localhost:8080`

### Passos

1. **Clone o repositório** (ou navegue até a pasta do projeto)

```bash
cd delivery-fe
```

2. **Instale as dependências**

```bash
npm install
```

ou

```bash
yarn install
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080/api
```

**Importante**: No Vite, variáveis de ambiente devem começar com `VITE_` para serem expostas ao código do frontend.

### Configuração do Backend

Certifique-se de que o backend Spring Boot está configurado para:

- Aceitar requisições de `http://localhost:5173` (CORS)
- Ter OAuth2 configurado com Google
- Ter os endpoints de autenticação funcionando:
  - `GET /oauth2/authorization/google`
  - `GET /api/auth/login-success`
  - `GET /api/auth/user`
  - `POST /api/auth/logout`

## 🏃 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

ou

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

ou

```bash
yarn build
```

Os arquivos compilados estarão na pasta `dist/`

### Preview do Build

```bash
npm run preview
```

ou

```bash
yarn preview
```

## 📁 Estrutura do Projeto

```
delivery-fe/
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/               # Configuração da aplicação
│   │   ├── routes.tsx     # Definição de rotas
│   │   ├── router.tsx     # Configuração do React Router
│   │   ├── providers.tsx  # Providers (Router, Theme, Toast)
│   │   └── PrivateRoute.tsx # Componente de rota protegida
│   │
│   ├── features/          # Features organizadas por domínio
│   │   ├── auth/          # Feature de autenticação
│   │   │   ├── api/       # Chamadas de API
│   │   │   ├── pages/     # Páginas (Login, Callback)
│   │   │   ├── store/     # Estado global (Zustand)
│   │   │   └── types.ts   # Tipos TypeScript
│   │   │
│   │   ├── orders/        # Feature de pedidos
│   │   │   ├── services/  # Serviços de API
│   │   │   ├── pages/     # Páginas (List, Create, Detail)
│   │   │   └── types.ts   # Tipos TypeScript
│   │   │
│   │   └── deliveries/    # Feature de entregas
│   │       ├── services/  # Serviços de API
│   │       ├── pages/     # Páginas (List, Create, Detail)
│   │       └── types.ts   # Tipos TypeScript
│   │
│   ├── shared/            # Código compartilhado
│   │   ├── api/           # HTTP Client (Axios)
│   │   ├── layouts/       # Layouts compartilhados
│   │   ├── types/         # Tipos compartilhados
│   │   └── utils/         # Utilitários
│   │
│   ├── assets/            # Assets (imagens, SVGs)
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globais
│
├── .env                   # Variáveis de ambiente
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── vite.config.ts        # Configuração Vite
└── README.md             # Este arquivo
```

## 🎨 Funcionalidades

### Autenticação

- **Login com Google OAuth2**
  - Redireciona para Google para autenticação
  - Recebe token JWT após autenticação bem-sucedida
  - Armazena token em localStorage
  - Redireciona para página de pedidos após login

- **Proteção de Rotas**
  - Rotas protegidas requerem autenticação
  - Redireciona para login se não autenticado
  - Token é adicionado automaticamente nas requisições

- **Logout**
  - Limpa token do localStorage
  - Chama endpoint de logout no backend
  - Redireciona para página de login

### Pedidos (Orders)

- **Listagem de Pedidos**
  - Tabela responsiva com paginação
  - Filtro por status (apenas CREATED para criar entregas)
  - Visualização de ID, cliente, itens, total, status e data
  - Ações: visualizar detalhes e excluir

- **Criação de Pedidos**
  - Formulário com validação
  - Adicionar múltiplos itens
  - Cálculo automático do total
  - Validação de campos obrigatórios

- **Detalhes do Pedido**
  - Informações do cliente
  - Lista de itens com quantidades e preços
  - Total do pedido
  - Botão para criar entrega (se status CREATED)
  - Link para entrega existente (se já houver)

### Entregas (Deliveries)

- **Listagem de Entregas**
  - Tabela responsiva com paginação
  - Visualização de ID, pedido, endereço, entregador, status e data
  - Tooltip com endereço completo ao passar o mouse
  - Ações: visualizar detalhes

- **Criação de Entregas**
  - Seleção de pedido (apenas status CREATED)
  - Busca automática de endereço por CEP (ViaCEP via backend)
  - Preenchimento automático de campos após digitar CEP
  - Validação de todos os campos
  - Feedback visual durante busca de CEP

- **Detalhes da Entrega**
  - Informações da entrega
  - Endereço completo formatado
  - Histórico de rastreamento (traduzido para português)
  - Ações para atualizar status:
    - Iniciar Entrega (PENDING → IN_TRANSIT)
    - Marcar como Entregue (IN_TRANSIT → DELIVERED)
    - Marcar como Falhou (qualquer status → FAILED)
  - Link para pedido relacionado

## 🔐 Autenticação

### Fluxo OAuth2

1. Usuário clica em "Continuar com Google"
2. Redireciona para `/oauth2/authorization/google`
3. Google autentica o usuário
4. Backend processa OAuth e gera JWT
5. Backend redireciona para frontend com token na URL
6. Frontend extrai token e salva em localStorage
7. Frontend redireciona para página de pedidos

### Armazenamento de Token

- Token JWT armazenado em `localStorage` como `token`
- Token é adicionado automaticamente no header `Authorization: Bearer <token>`
- Interceptor Axios adiciona token em todas as requisições

### Rotas Protegidas

- Todas as rotas exceto `/login` e `/auth/callback` são protegidas
- Componente `PrivateRoute` verifica autenticação
- Redireciona para login se não autenticado

## 🌐 API Integration

### Backend Spring Boot

A aplicação se comunica com o backend através de:

- **Base URL**: Configurada via `VITE_API_URL` (padrão: `http://localhost:8080/api`)
- **Autenticação**: JWT token no header `Authorization`
- **CORS**: Backend deve aceitar requisições de `http://localhost:5173`

### Endpoints Utilizados

#### Autenticação
- `GET /oauth2/authorization/google` - Iniciar login OAuth
- `GET /api/auth/login-success` - Callback após login
- `GET /api/auth/user` - Obter usuário atual
- `POST /api/auth/logout` - Logout

#### Pedidos
- `GET /orders?page={page}&size={size}` - Listar pedidos (paginado)
- `GET /orders/{id}` - Obter pedido por ID
- `POST /orders` - Criar pedido
- `DELETE /orders/{id}` - Excluir pedido

#### Entregas
- `GET /deliveries?page={page}&size={size}` - Listar entregas (paginado)
- `GET /deliveries/{id}?includeTracking=true` - Obter entrega por ID com tracking
- `POST /deliveries/{orderId}` - Criar entrega para pedido
- `PATCH /deliveries/{id}/status` - Atualizar status da entrega

#### Endereços
- `GET /addresses/{cep}` - Buscar endereço por CEP (ViaCEP)

### Integração ViaCEP

- Busca automática ao digitar CEP completo (8 dígitos)
- Debounce de 500ms para evitar requisições excessivas
- Preenchimento automático de campos:
  - Rua
  - Bairro
  - Cidade
  - Estado
  - Complemento (se disponível)
- Cache no backend para CEPs já consultados

## 🚀 Deploy

### Netlify

1. **Build do projeto**:
```bash
npm run build
```

2. **No Netlify**:
   - Conecte seu repositório Git
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Adicione variável de ambiente:
     - `VITE_API_URL`: URL do seu backend em produção

### Vercel

1. **Instale Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Configure variáveis de ambiente** no dashboard da Vercel:
   - `VITE_API_URL`: URL do seu backend em produção

### Outros Serviços

Para outros serviços de hospedagem (GitHub Pages, AWS S3, etc.):

1. Execute `npm run build`
2. Faça upload da pasta `dist/` para o serviço
3. Configure a variável de ambiente `VITE_API_URL` apontando para seu backend

### Notas de Deploy

- Certifique-se de que o backend está acessível publicamente
- Configure CORS no backend para aceitar requisições do domínio de produção
- Use HTTPS em produção
- Configure variáveis de ambiente no serviço de hospedagem

## 🏗 Arquitetura

### Feature-Based Architecture

O projeto segue uma arquitetura baseada em features, onde cada domínio (auth, orders, deliveries) é organizado de forma independente:

```
features/
  ├── auth/        # Tudo relacionado a autenticação
  ├── orders/      # Tudo relacionado a pedidos
  └── deliveries/  # Tudo relacionado a entregas
```

Cada feature contém:
- `api/` ou `services/`: Chamadas à API
- `pages/`: Componentes de página
- `components/`: Componentes reutilizáveis da feature
- `store/`: Estado global (se necessário)
- `types.ts`: Definições de tipos TypeScript

### Estado Global

- **Zustand**: Usado para estado de autenticação
- **React Hook Form**: Gerenciamento de estado de formulários
- **React State**: Estado local de componentes

### HTTP Client

- **Axios**: Cliente HTTP centralizado em `src/shared/api/httpClient.ts`
- **Interceptors**: Adiciona token automaticamente e trata erros
- **Type-safe**: Tipagem completa com TypeScript

### Roteamento

- **React Router DOM**: Roteamento declarativo
- **PrivateRoute**: Componente para proteger rotas
- **Nested Routes**: Rotas aninhadas com layout compartilhado

## 📝 Comentários no Código

O código inclui comentários explicativos em:

- Arquivos principais (`main.tsx`, `router.tsx`)
- Componentes complexos
- Lógica de negócio importante
- Integrações com APIs externas
- Validações e transformações de dados

## 🎯 Conclusão

Este projeto atende **todos os requisitos** do desafio:

✅ Interface limpa e intuitiva  
✅ CRUD completo (Create, Read, Update, Delete)  
✅ Integração com API externa (ViaCEP)  
✅ Validação de formulários  
✅ Autenticação OAuth2 + JWT  
✅ Design responsivo  
✅ Documentação completa  

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique se o backend está rodando
2. Verifique as variáveis de ambiente
3. Verifique o console do navegador para erros
4. Verifique a configuração de CORS no backend

---

**Desenvolvido com ❤️ usando React, TypeScript e Material-UI**


