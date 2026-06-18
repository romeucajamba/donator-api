# 🩸 Donator API — Sistema Inteligente de Gestão de Doação de Sangue

O **Donator API** é uma plataforma backend robusta desenvolvida para gerir todo o ecossistema de doação de sangue, incluindo doadores, hospitais, pedidos de sangue, stock, gamificação, notificações e auditoria.

A arquitetura foi desenhada com foco em **escalabilidade, segurança, modularidade e rastreabilidade total das operações clínicas**.

---

## Funcionalidades Principais

###  Gestão de Doadores
- Registo, autenticação e gestão de perfis de doadores  
- Recuperação e redefinição de senha  
- Consulta por email, telefone e ID  
- Histórico completo de interações  

### Gestão de Hospitais
- Registo e autenticação de hospitais  
- Gestão de perfis hospitalares  
- Controle de acesso e permissões  

### 🩸 Sistema de Pedidos de Sangue
- Pedidos urgentes de sangue  
- Pedidos de doação direta  
- Trocas entre hospitais  
- Respostas a solicitações em tempo real  

###  Gestão de Stock
- Controlo de inventário de sangue por hospital  
- Registo de entradas e saídas (movimentos)  
- Atualização e monitorização em tempo real  

### Gamificação
- Sistema de pontos por doação  
- Ranking de doadores  
- Níveis e regras de classificação  
- Estatísticas de performance  

###  Notificações & Comunicação
- Notificações automáticas para doadores  
- Sistema de mensagens entre entidades  
- Inbox e histórico de comunicação  

###  Geografia
- Gestão de províncias e municípios  
- Organização territorial de hospitais e doadores  

###  Auditoria e Segurança
- Registo de logs de ações críticas  
- Sessões autenticadas com JWT  
- Rastreamento de IP e user-agent  
- Proteção de rotas com middleware  

---

## 🛠️ Stack Tecnológica

### Core Backend
- Node.js  
- Express.js  
- TypeScript  

### Base de Dados
- PostgreSQL  
- Prisma ORM  

### Autenticação & Segurança
- JWT (ES256 - ECDSA)  
- Cookies HTTP-only  
- bcrypt (hash de passwords)  
- Middleware de autenticação customizado  

### Validação & Estrutura
- Zod (validação de schemas)  
- Arquitetura em camadas (Controller → Service → Repository)  
- Factories para injeção de dependências  

### Infraestrutura
- Docker + Docker Compose  
- CORS configurado por ambiente  
- Rate Limiting  

---

## Como Iniciar o Projeto

### Pré-requisitos
- Node.js (v18+)  
- Docker & Docker Compose  
- PostgreSQL (via Docker)  

---

### 🐳 Subir o Banco de Dados

```bash
docker compose up -d

### 🐳 Rodar o prisma

```bash
npx prisma migrate dev

```bash
npx prisma generate