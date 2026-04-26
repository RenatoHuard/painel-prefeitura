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

> ⚠️ **Primeiro acesso online:** o backend está no plano gratuito do Render, que adormece após períodos de inatividade. A primeira requisição pode demorar até 60 segundos. As seguintes são rápidas.

> ⚠️ **Dados independentes:** o banco local (Docker) e o banco online (Render) são instâncias separadas. Revisões feitas no localhost não aparecem no deploy público e vice-versa.

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

O relatório HTML abre automaticamente no browser ao final de cada execução.

Os testes cobrem (em Chromium e Mobile/iPhone 12):
- Login com credenciais corretas e inválidas
- Proteção de rotas sem autenticação
- Cards do dashboard clicáveis com navegação para filtros corretos
- Lista de crianças com filtros por bairro, alertas e nome
- Detalhe da criança com as 3 áreas
- Registro de revisão com feedback visual
- Responsividade mobile

> O Playwright usa `storageState` para autenticar uma vez antes de todos os testes, evitando login repetido e tornando a suite mais rápida e confiável.

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
│   ├── Dockerfile                 # Docker Compose local
│   └── Dockerfile.render          # Deploy no Render
├── frontend/
│   ├── e2e/                       # Testes Playwright
│   │   ├── global.setup.ts        # Setup de autenticação global
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
│       ├── components/
│       │   ├── ui/                # Componentes shadcn/ui
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   └── select.tsx
│       │   ├── layout/            # Header, Sidebar, ThemeToggle
│       │   ├── dashboard/         # SummaryCards, AlertsChart, BairroChart, MapaCalor
│       │   ├── children/          # ChildCard, FiltersPanel, Pagination
│       │   └── child-detail/      # HealthSection, EducationSection, SocialSection, ReviewButton
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
| `area` | `saude` \| `educacao` \| `social` | Alerta em área específica |
| `alertas` | `true` \| `false` | Com ou sem qualquer alerta |
| `semDados` | `true` | Sem dados em nenhuma área |
| `revisado` | `true` \| `false` | Status de revisão |
| `page` | número | Página (default: 1) |
| `limit` | número | Itens por página (default: 12, max: 50) |

### JWT
Contém `preferred_username` com o e-mail do técnico autenticado. Expiração de 8h.

---

## Funcionalidades implementadas

**Autenticação**
- Login com JWT (expiração 8h)
- Proteção de rotas com redirecionamento automático
- Verificação periódica de expiração (a cada 60 segundos)
- Campo `autocomplete` nos inputs para gerenciadores de senha

**Dashboard**
- Cards de resumo clicáveis — navegam para a lista com o filtro correspondente aplicado
- Gráfico de pizza — alertas por área (Saúde, Educação, Assist. Social)
- Gráfico de barras — alertas por bairro (top 8)
- Mapa de calor — bairros coloridos por intensidade de alertas (Leaflet + OpenStreetMap, sem chave de API)

**Lista de Crianças**
- Busca por nome (parcial, debounce 350ms, case insensitive)
- Filtro por bairro
- Filtro por alertas: com alertas / sem alertas / ⊘ sem dados cadastrados
- Filtro por área de alerta (saúde / educação / assistência social)
- Filtro por status de revisão
- Paginação (12 por página)
- Badge visual diferenciado: `alerta` (âmbar), `ok` (verde), `sem dados` (cinza com ⊘)

**Detalhe da Criança**
- Exibição das 3 áreas com estado explícito para áreas sem registro
- Barra de frequência escolar com indicador visual de criticidade
- Status dos benefícios com badge colorido (ativo/suspenso/cancelado)
- Histórico de revisões
- Botão "Marcar como Revisado" com feedback visual

**Interface**
- Dark mode com detecção automática da preferência do sistema
- Tela de login com identidade visual da Prefeitura do Rio (azul #005B9A, verde #00A86B)
- Responsivo de 375px (mobile) a 1440px (desktop)
- Componentes shadcn/ui: Button, Card, Badge, Input, Label, Select
- Skip link para navegação por teclado (WCAG 2.4.1)
- `aria-label`, `aria-hidden`, `aria-expanded`, `aria-current` em todos os elementos relevantes
- Favicon personalizado

---

## Diferenciais implementados

| Diferencial | Status |
|---|---|
| shadcn/ui | ✅ Button, Card, Badge, Input, Label, Select |
| Testes unitários backend (Jest) | ✅ 18 testes |
| Testes de componente frontend (Vitest) | ✅ 27 testes |
| Testes E2E (Playwright) | ✅ 38 testes — Chromium + Mobile |
| Acessibilidade WCAG AA | ✅ Skip link, ARIA, focus visible |
| Visualizações | ✅ Gráfico pizza, barras e mapa de calor |
| Dark mode | ✅ Com detecção automática |
| Deploy público | ✅ https://desafiorj.renatohuard.com.br |

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

O desafio permite Node.js ou Go. Escolhi Node.js com TypeScript pela mesma linguagem do frontend, permitindo compartilhar tipos entre as duas camadas. Fastify foi escolhido sobre Express por melhor performance nativa e suporte TypeScript mais direto.

**Trade-off:** Go teria consumo de memória menor e startup mais rápido. Para o volume de usuários de um sistema municipal, ambas são adequadas.

### Banco de dados: PostgreSQL + Prisma

Relacionamentos claros (criança → saúde/educação/social → revisões) e suporte nativo a arrays no PostgreSQL simplificou os campos `alertas` e `beneficios`. Prisma oferece migrações versionadas e cliente tipado.

### Seed via script TypeScript

`data/seed.json` é carregado por `prisma/seed.ts` na inicialização. O script tenta múltiplos caminhos para o arquivo, funcionando tanto no Docker local quanto no Render (onde o contexto é apenas a pasta `backend/`).

### Frontend: Next.js 14 App Router + Tailwind + shadcn/ui

App Router simplificou proteção de rotas via layout wrapper. shadcn/ui foi implementado com Button, Card, Badge, Input, Label e Select — os componentes mais visíveis da interface.

### Proxy de API via Next.js rewrites

Chamadas vão para `/api/*` e o Next.js proxia para o backend. Elimina CORS e não expõe a URL do backend no bundle JavaScript.

### Mapa de calor: Leaflet via CDN

Leaflet carregado como script CDN para evitar conflitos com o webpack do Next.js. Polígonos dos bairros aproximados cobrindo os 15 bairros do seed.

### Autenticação: JWT em localStorage

JWT com expiração de 8h. **Em produção:** `httpOnly cookies` + refresh token.

### Dois Dockerfiles no backend

`Dockerfile` para Docker Compose local (acessa `data/seed.json` na raiz). `Dockerfile.render` para o Render (contexto é apenas `backend/`, seed copiado internamente).

### Testes E2E com storageState

O Playwright faz login uma vez via `global.setup.ts` e salva o token no `storageState`. Todos os specs reutilizam esse estado, tornando a suite mais rápida e eliminando falhas por timeout de login no mobile.

---

## Deploy

| Serviço | Plataforma | URL |
|---------|-----------|-----|
| Frontend | Vercel | https://desafiorj.renatohuard.com.br |
| Backend | Render (Free) | https://painel-prefeitura.onrender.com |
| Banco | Render PostgreSQL (Free) | — |

Deploy automático a cada push na branch `main`.

---

## O que faria diferente com mais tempo

**Segurança:** `httpOnly cookies` para o JWT + refresh token para renovação automática sem re-login.

**Performance:** Redis para cache do `/summary`. Plano pago no Render para eliminar o cold start de 60 segundos.

**Mapa:** GeoJSON oficial dos bairros do Rio (dados.rio) em vez dos polígonos aproximados, cobrindo todos os bairros com precisão geográfica real.

**PWA:** service worker para acesso offline em campo e sincronização ao reconectar — especialmente útil para técnicos em áreas com conexão instável.

**RBAC:** perfis distintos (técnico, supervisor, admin) com permissões diferentes — supervisores veriam todos os casos, técnicos apenas os da sua região.

**Testes:** expandir cobertura E2E para cenários de erro de rede e sessão expirada.
