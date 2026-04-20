# Painel de Acompanhamento de Crianças — Prefeitura

Sistema para técnicos de campo acompanharem crianças em situação de vulnerabilidade social, cruzando dados de **saúde**, **educação** e **assistência social**.

---

## Como rodar o projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados

### Subir tudo do zero

```bash
git clone <url-do-repositorio>
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
│   └── seed.json          # 25 crianças fictícias com casos-limite
├── backend/               # API Fastify + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── routes/        # auth, children, summary
│       ├── middleware/    # JWT auth
│       └── server.ts
├── frontend/              # Next.js 14 App Router
│   └── src/
│       ├── app/           # Pages (login, dashboard, children)
│       ├── components/    # UI + layout + feature components
│       ├── lib/           # api.ts, auth.ts, utils.ts
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
- `bairro` — filtra por bairro
- `alertas` — `true` (com alertas) | `false` (sem alertas)
- `revisado` — `true` (revisados) | `false` (pendentes)
- `page` — número da página (default: 1)
- `limit` — itens por página (default: 12, max: 50)

### JWT
O token contém o campo `preferred_username` com o e-mail do técnico autenticado, expiração de 8h.

---

## Decisões arquiteturais e trade-offs

### Backend: Node.js + Fastify (em vez de Go)

**Por quê:** O desafio permite Node.js ou Go. Optei por Node.js com TypeScript por:
- Tipagem compartilhada entre frontend e backend (`types/index.ts`)
- Fastify tem performance comparável ao Gin e ecossistema TypeScript maduro
- Prisma oferece migrações seguras e ORM tipado

**Trade-off:** Go teria menor uso de memória e startup mais rápido. Para um sistema de prefeitura com dezenas de usuários simultâneos, ambas são escolhas válidas.

### Banco: PostgreSQL + Prisma

**Por quê:** O seed tem dados relacionais (crianças ↔ saúde/educação/social ↔ revisões). PostgreSQL suporta arrays nativos (`String[]`), o que simplifica os campos `alertas` e `beneficios` sem tabela extra.

**Trade-off:** SQLite seria mais simples para desenvolvimento local mas não suporta arrays nativos, exigindo mudança de schema.

### Autenticação: JWT em localStorage

**Por quê:** Simplicidade de implementação para o desafio. O token tem 8h de expiração e é validado a cada navegação.

**Em produção:** Usaria `httpOnly cookies` para proteção contra XSS, com refresh token.

### API Proxy via Next.js rewrites

**Por quê:** Em vez de expor `NEXT_PUBLIC_API_URL`, o frontend faz chamadas para `/api/*` e o Next.js proxia internamente para `http://backend:3001`. Elimina CORS e não expõe a URL do backend no bundle JS.

### Campos ausentes nas 3 áreas

Crianças sem dados em uma área retornam `null` para aquela área. O frontend renderiza um estado explícito ("Sem dados de saúde") em vez de campo em branco, com a informação de que a criança não está cadastrada naquela área.

### Campo `temAlerta` no banco

Adicionado campo booleano `temAlerta` em cada tabela de área para evitar queries com `array_length` ou `IS NOT EMPTY` que variam por banco. Simplifica filtros e o endpoint de summary.

---

## Casos-limite do seed

O `data/seed.json` foi construído com casos intencionais:

| Caso | Crianças |
|------|----------|
| Sem dados em nenhuma área | Carlos Eduardo (#6), Camila Souza (#15) |
| Alertas em todas as 3 áreas | Pedro Henrique (#2), Diego Lima (#10), Emily Rodrigues (#23) |
| Somente dados de saúde | Luiza Santos (#3) |
| Somente dados de educação | Gabriel Oliveira (#4), Sophia Lima (#19) |
| Somente dados de assist. social | Mariana Costa (#5) |
| Sem alertas em nenhuma área | Leticia Rodrigues (#9), Enzo Santos (#18) |
| Frequência escolar crítica (<50%) | Diego Lima (#10) |

---

## O que faria diferente com mais tempo

1. **Testes** — Jest no backend (rotas, seed, JWT), Vitest + Testing Library no frontend, Playwright para E2E (login → revisão)
2. **httpOnly cookies** — em vez de localStorage para o JWT
3. **Refresh token** — renovação automática antes da expiração, sem re-login forçado
4. **RBAC** — diferentes perfis (técnico, supervisor, admin) com permissões distintas
5. **Auditoria completa** — log de todos os acessos e alterações
6. **Cache** — Redis para o endpoint `/summary` que faz múltiplas queries agregadas
7. **Filtro por área** — filtrar crianças por status em área específica (ex: só com alertas de saúde)
8. **PWA** — service worker para acesso offline em campo, sincronização quando voltar online
9. **Deploy** — CI/CD com GitHub Actions → Render (backend) + Vercel (frontend)
10. **Paginação infinita** — para listas longas em mobile em vez de paginação numérica

---

## Dark mode

O sistema suporta dark mode completo com detecção automática da preferência do sistema operacional. O toggle está disponível no header e na tela de login.

---

## Acessibilidade

- Navegação por teclado em todos os elementos interativos
- `aria-label` em botões sem texto visível
- `role="alert"` e `aria-live` em mensagens de erro e status
- `aria-current="page"` na navegação
- `role="progressbar"` na barra de frequência
- Contraste adequado em light e dark mode
