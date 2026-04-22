# Painel de Acompanhamento de Crianças — Prefeitura

Sistema para técnicos de campo acompanharem crianças em situação de vulnerabilidade social, cruzando dados de **saúde**, **educação** e **assistência social**.

---

## Como rodar o projeto

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e em execução

### Subir tudo do zero

```bash
git clone https://github.com/RenatoHuard/painel-prefeitura.git
cd painel-prefeitura
docker compose up --build
```

Aguarde ~2 minutos na primeira execução (build das imagens + migração do banco + seed).

Acesse: **http://localhost:3000**

### Credenciais de teste

| Campo | Valor |
|-------|-------|
| E-mail | `tecnico@prefeitura.rio` |
| Senha | `painel@2024` |

---

## Estrutura do projeto

```
painel-prefeitura/
├── data/
│   └── seed.json              # 25 crianças fictícias com casos-limite
├── backend/                   # API Fastify + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── routes/            # auth, children, summary
│       ├── middleware/        # autenticação JWT
│       └── server.ts
├── frontend/                  # Next.js 14 App Router
│   └── src/
│       ├── app/               # login, dashboard, children, children/[id]
│       ├── components/        # layout, dashboard, children, child-detail, ui
│       ├── lib/               # api.ts, auth.ts, utils.ts
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
- `nome` — busca por nome (case insensitive, busca parcial)
- `bairro` — filtra por bairro
- `area` — `saude` | `educacao` | `social` (filtra crianças com alerta nessa área específica)
- `alertas` — `true` (com qualquer alerta) | `false` (sem alertas)
- `revisado` — `true` (revisados) | `false` (pendentes)
- `page` — número da página (default: 1)
- `limit` — itens por página (default: 12, max: 50)

### JWT
O token contém o campo `preferred_username` com o e-mail do técnico autenticado. Expiração de 8h.

---

## Decisões arquiteturais e trade-offs

### Backend: Node.js + Fastify + TypeScript

O desafio permite Node.js ou Go. Escolhi Node.js com TypeScript por dois motivos principais: mesma linguagem do frontend, permitindo compartilhar tipos entre as duas camadas sem duplicação; e ecossistema maduro para o que o projeto precisava (JWT, ORM, validação). Fastify foi escolhido sobre Express por ter melhor performance nativa e suporte a TypeScript mais direto.

**Trade-off:** Go teria consumo de memória menor e startup mais rápido. Para o volume de usuários de um sistema municipal com dezenas de técnicos simultâneos, ambas as escolhas são tecnicamente adequadas.

### Banco de dados: PostgreSQL + Prisma

Os dados têm relacionamentos claros (criança → saúde/educação/social → revisões) e o PostgreSQL suporta arrays nativos (`String[]`), o que simplificou o armazenamento dos campos `alertas` e `beneficios` sem precisar de tabela extra. Prisma oferece migrações versionadas e cliente totalmente tipado.

**Trade-off:** SQLite seria mais simples para desenvolvimento local, mas não suporta arrays nativos e não reflete um ambiente de produção real.

### Seed: seed.json carregado via script TypeScript

O arquivo `data/seed.json` é lido pelo script `prisma/seed.ts` na inicialização do container. A decisão foi manter os dados de seed separados do código para facilitar a substituição por dados reais no futuro, e usar um script TypeScript em vez de SQL puro para ter validação de tipos na importação.

### Frontend: Next.js 14 App Router + Tailwind CSS + shadcn/ui

Next.js foi requisito do desafio. App Router permite colocação de layouts por segmento de rota, o que simplificou a proteção de rotas autenticadas via layout wrapper. Tailwind CSS foi requisito. shadcn/ui foi usado como diferencial solicitado no desafio — os componentes base (toast, toaster) foram implementados manualmente seguindo o padrão shadcn.

### Proxy de API via Next.js rewrites

O frontend não chama o backend diretamente pelo IP/porta. As chamadas vão para `/api/*` e o Next.js proxia internamente para `http://backend:3001`. Isso elimina CORS, não expõe a URL do backend no bundle JavaScript e permite trocar o endereço do backend sem alterar o frontend.

### Autenticação: JWT armazenado em localStorage

JWT com expiração de 8h. A escolha por localStorage foi pragmática para o escopo do desafio. A página verifica o token a cada navegação e a cada 60 segundos em background, redirecionando para login se expirado.

**Em produção:** usaria `httpOnly cookies` para proteção contra XSS, com endpoint de refresh token para renovação automática sem re-login.

### Campo `temAlerta` desnormalizado

Cada tabela de área (Saude, Educacao, AssistenciaSocial) tem um campo booleano `temAlerta` calculado no momento do seed. Isso evita queries com `array_length` ou `cardinality` no banco a cada requisição e simplifica os filtros. O trade-off é que esse campo precisa ser atualizado sempre que os alertas mudarem — aceitável para um sistema onde os dados vêm de importação periódica.

---

## Casos-limite do seed

O `data/seed.json` cobre os casos-limite mencionados no desafio:

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

Crianças sem dados em uma área exibem estado explícito ("Sem dados de saúde") em vez de campo em branco, com indicação de que a criança não está cadastrada naquela área.

---

## O que faria diferente com mais tempo

**Testes:** o projeto não tem cobertura de testes automatizados. Implementaria testes unitários no backend com Jest (rotas, validação de JWT, seed), testes de componente no frontend com Vitest e Testing Library, e testes E2E com Playwright cobrindo o fluxo completo de login até marcar um caso como revisado.

**Segurança:** substituiria o localStorage por httpOnly cookies para o JWT, eliminando a superfície de ataque XSS. Adicionaria refresh token para renovação automática da sessão.

**Deploy:** configuraria CI/CD com GitHub Actions publicando o backend no Render e o frontend na Vercel, com URL pública acessível sem configuração local.

**PWA:** para técnicos de campo que trabalham em áreas com conexão instável, um service worker com cache offline permitiria consultar os dados sem internet e sincronizar as revisões ao reconectar.

**Performance:** adicionaria cache com Redis para o endpoint `/summary`, que agrega múltiplas queries. Para listas longas em mobile, paginação infinita (scroll) seria mais ergonômica que a paginação numérica atual.
