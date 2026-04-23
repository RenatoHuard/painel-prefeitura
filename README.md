# Painel de Acompanhamento de Crianças — Prefeitura do Rio de Janeiro

Sistema para técnicos de campo acompanharem crianças em situação de vulnerabilidade social, cruzando dados de **saúde**, **educação** e **assistência social**.

---

## Acesso rápido

| Ambiente | URL |
|----------|-----|
| **Deploy público** | https://desafiorj.renatohuard.com.br |
| **Local** | http://localhost:3000 |

### Credenciais de teste

| Campo | Valor |
|-------|-------|
| E-mail | `tecnico@prefeitura.rio` |
| Senha | `painel@2024` |

> ⚠️ **Atenção — primeiro acesso online:** o backend está hospedado no plano gratuito do Render, que adormece após períodos de inatividade. A primeira requisição após um período sem uso pode demorar até 60 segundos. As requisições seguintes são rápidas. Aguarde o login carregar na primeira vez.

> ⚠️ **Dados independentes:** o banco de dados local (Docker) e o banco online (Render) são instâncias separadas. Revisões feitas no localhost não aparecem no deploy público e vice-versa.

---

## Como rodar localmente

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e em execução

### Subir tudo do zero

```bash
git clone https://github.com/RenatoHuard/painel-prefeitura.git
cd painel-prefeitura
docker compose up --build
```

Aguarde ~2 minutos na primeira execução. O processo realiza automaticamente:
1. Build das imagens Docker
2. Inicialização do PostgreSQL
3. Aplicação das migrações de banco
4. Seed das 25 crianças fictícias
5. Inicialização do backend e frontend

Acesse: **http://localhost:3000**

---

## Como rodar os testes

### Testes unitários — Backend (Jest)

```bash
cd backend
npm install
npm test
```

Resultado esperado: **18 testes passando** em 3 suites (auth, children, summary).

### Testes de componente — Frontend (Vitest + Testing Library)

```bash
cd frontend
npm install
npm test
```

Resultado esperado: **27 testes passando** em 4 suites (utils, ChildCard, FiltersPanel, ReviewButton).

### Testes E2E — Playwright (requer app rodando)

Com o Docker rodando (`docker compose up`), em outro terminal:

```bash
cd frontend
npx playwright install  # apenas na primeira vez
npm run test:e2e
```

Os testes E2E cobrem (em Chromium e Mobile):
- Login com credenciais corretas e inválidas
- Proteção de rotas sem autenticação
- Cards do dashboard e navegação com filtros
- Lista de crianças com filtros (bairro, alertas, área, nome)
- Detalhe da criança e registro de revisão
- Responsividade mobile (iPhone 12)

---

## Estrutura do projeto

```
painel-prefeitura/
├── data/
│   └── seed.json                  # 25 crianças fictícias com casos-limite
├── backend/
│   ├── __tests__/                 # Testes Jest
│   │   ├── auth.test.ts
│   │   ├── children.test.ts
│   │   └── summary.test.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── routes/                # auth, children, summary
│   │   ├── middleware/            # autenticação JWT
│   │   └── server.ts
│   ├── Dockerfile                 # Para Docker Compose local
│   └── Dockerfile.render          # Para deploy no Render
├── frontend/
│   ├── e2e/                       # Testes Playwright
│   │   ├── auth.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── children.spec.ts
│   │   └── helpers.ts
│   └── src/
│       ├── __tests__/             # Testes Vitest
│       │   ├── setup.ts
│       │   ├── utils.test.ts
│       │   └── components/
│       ├── app/                   # Pages Next.js App Router
│       ├── components/            # Componentes UI
│       ├── lib/                   # api.ts, auth.ts, utils.ts
│       └── types/
├── docker-compose.yml
└── README.md
```

---

## Endpoints da API

| Método | Path | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/auth/token` | ❌ | Login — retorna JWT |
| `GET` | `/children` | ✅ | Lista com filtros e paginação |
| `GET` | `/children/:id` | ✅ | Detalhe completo de uma criança |
| `GET` | `/summary` | ✅ | Dados agregados para o painel |
| `PATCH` | `/children/:id/review` | ✅ | Registra revisão do caso |

### Filtros disponíveis em `GET /children`

| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `nome` | string | Busca parcial, case insensitive |
| `bairro` | nome do bairro | Filtra por bairro |
| `area` | `saude` \| `educacao` \| `social` | Filtra por alerta em área específica |
| `alertas` | `true` \| `false` | Com ou sem qualquer alerta |
| `semDados` | `true` | Sem dados em nenhuma área |
| `revisado` | `true` \| `false` | Status de revisão |
| `page` | número | Página (default: 1) |
| `limit` | número | Itens por página (default: 12, max: 50) |

### JWT
O token contém o campo `preferred_username` com o e-mail do técnico autenticado. Expiração de 8h.

---

## Funcionalidades implementadas

**Autenticação**
- Login com JWT (expiração 8h)
- Proteção de rotas com redirecionamento automático
- Verificação periódica de expiração do token (a cada 60 segundos)

**Dashboard**
- Cards de resumo clicáveis (total, alertas, revisados, sem dados)
- Gráfico de pizza — alertas por área (Saúde, Educação, Assist. Social)
- Gráfico de barras — alertas por bairro (top 8)
- Mapa de calor — bairros coloridos por intensidade de alertas (Leaflet + OpenStreetMap)

**Lista de Crianças**
- Filtro por nome (busca parcial com debounce de 350ms)
- Filtro por bairro
- Filtro por alertas (com alertas / sem alertas / sem dados cadastrados)
- Filtro por área de alerta (saúde / educação / assistência social)
- Filtro por status de revisão
- Paginação (12 por página)
- Badge visual diferenciado: `alerta` (âmbar), `ok` (verde), `sem dados` (cinza com ícone ⊘)

**Detalhe da Criança**
- Exibição das 3 áreas (saúde, educação, assistência social)
- Estado explícito "Sem dados cadastrados" para áreas sem registro
- Barra de frequência escolar com indicador visual de criticidade
- Status dos benefícios com badge colorido (ativo/suspenso/cancelado)
- Histórico de revisões com data e técnico responsável
- Botão "Marcar como Revisado" com feedback visual de sucesso/erro

**Dark mode**
- Detecção automática da preferência do sistema
- Toggle manual disponível no header e na tela de login
- Cores da Prefeitura do Rio na tela de login (azul #005B9A e verde #00A86B)

**Responsividade**
- Layout adaptado de 375px (mobile) a 1440px (desktop)
- Menu lateral colapsável no mobile
- Cards em grid responsivo (1/2/3 colunas)

---

## Casos-limite do seed

| Caso | Crianças |
|------|----------|
| Sem dados em nenhuma área | Carlos Eduardo (#6), Camila Souza (#15) |
| Alertas nas 3 áreas simultaneamente | Pedro Henrique (#2), Diego Lima (#10), Emily Rodrigues (#23) |
| Somente dados de saúde | Luiza Santos (#3) |
| Somente dados de educação | Gabriel Oliveira (#4), Sophia Lima (#19) |
| Somente dados de assistência social | Mariana Costa (#5) |
| Sem alertas em nenhuma área | Leticia Rodrigues (#9), Enzo Santos (#18) |
| Frequência escolar crítica abaixo de 50% | Diego Lima (#10) |
| Benefício cancelado + alertas múltiplos | Emily Rodrigues (#23) |

---

## Decisões arquiteturais e trade-offs

### Backend: Node.js + Fastify + TypeScript

O desafio permite Node.js ou Go. Escolhi Node.js com TypeScript por dois motivos principais: mesma linguagem do frontend, permitindo compartilhar tipos entre as duas camadas sem duplicação; e ecossistema maduro para o que o projeto precisava (JWT, ORM, validação). Fastify foi escolhido sobre Express por ter melhor performance nativa e suporte a TypeScript mais direto.

**Trade-off:** Go teria consumo de memória menor e startup mais rápido. Para o volume de usuários de um sistema municipal com dezenas de técnicos simultâneos, ambas as escolhas são tecnicamente adequadas.

### Banco de dados: PostgreSQL + Prisma

Os dados têm relacionamentos claros (criança → saúde/educação/social → revisões) e o PostgreSQL suporta arrays nativos (`String[]`), o que simplificou o armazenamento dos campos `alertas` e `beneficios` sem precisar de tabela extra. Prisma oferece migrações versionadas e cliente totalmente tipado.

**Trade-off:** SQLite seria mais simples para desenvolvimento local, mas não suporta arrays nativos e não reflete um ambiente de produção real.

### Seed: seed.json carregado via script TypeScript

O arquivo `data/seed.json` é lido pelo script `prisma/seed.ts` na inicialização do container. A decisão foi manter os dados de seed separados do código para facilitar a substituição por dados reais no futuro. O script tenta múltiplos caminhos para localizar o arquivo, funcionando tanto no Docker local quanto no Render.

### Frontend: Next.js 14 App Router + Tailwind CSS + shadcn/ui

Next.js foi requisito do desafio. App Router permite colocação de layouts por segmento de rota, o que simplificou a proteção de rotas autenticadas via layout wrapper. Tailwind CSS foi requisito. shadcn/ui foi usado como diferencial solicitado no desafio.

### Proxy de API via Next.js rewrites

O frontend não chama o backend diretamente pelo IP/porta. As chamadas vão para `/api/*` e o Next.js proxia internamente para o backend. Isso elimina CORS e não expõe a URL do backend no bundle JavaScript.

### Mapa de calor: Leaflet + OpenStreetMap (gratuito)

Implementado sem chave de API. O Leaflet é carregado via CDN para evitar problemas de bundling com o webpack do Next.js. Os polígonos dos bairros são aproximados e cobrem os 15 bairros presentes no seed.

### Autenticação: JWT em localStorage

JWT com expiração de 8h. A escolha por localStorage foi pragmática para o escopo do desafio.

**Em produção:** usaria `httpOnly cookies` para proteção contra XSS, com endpoint de refresh token para renovação automática sem re-login.

### Campo `temAlerta` desnormalizado

Cada tabela de área tem um campo booleano `temAlerta` calculado no momento do seed. Isso evita queries complexas a cada requisição e simplifica os filtros.

### Dois Dockerfiles no backend

`Dockerfile` é usado pelo `docker compose` local — acessa `data/seed.json` na raiz do repositório. `Dockerfile.render` é usado pelo Render — o contexto é apenas a pasta `backend/`, então o `seed.json` foi copiado para dentro dela.

---

## Deploy

| Serviço | Plataforma | URL |
|---------|-----------|-----|
| Frontend | Vercel | https://desafiorj.renatohuard.com.br |
| Backend | Render (Free) | https://painel-prefeitura.onrender.com |
| Banco | Render PostgreSQL (Free) | — |

O deploy é automático: qualquer push na branch `main` dispara redeploy na Vercel e no Render.

---

## O que faria diferente com mais tempo

**Segurança:** substituiria o localStorage por `httpOnly cookies` para o JWT, eliminando a superfície de ataque XSS. Adicionaria refresh token para renovação automática da sessão sem re-login.

**Performance:** adicionaria cache com Redis para o endpoint `/summary`, que agrega múltiplas queries. O plano gratuito do Render adormece após inatividade — em produção usaria um plano pago ou configuraria um ping periódico para manter o serviço ativo.

**PWA:** para técnicos de campo que trabalham em áreas com conexão instável, um service worker com cache offline permitiria consultar os dados sem internet e sincronizar as revisões ao reconectar.

**Mapa:** substituiria os polígonos aproximados por GeoJSON oficial dos bairros do Rio de Janeiro (disponível em dados.rio), cobrindo todos os bairros com precisão.

**Testes:** expandiria a cobertura E2E para incluir cenários de erro de rede, sessão expirada e casos-limite do seed (crianças sem dados em nenhuma área).

**RBAC:** diferentes perfis (técnico, supervisor, admin) com permissões distintas — supervisores veriam todos os casos, técnicos apenas os da sua região.
