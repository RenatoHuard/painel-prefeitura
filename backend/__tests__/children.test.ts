import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { childrenRoutes } from '../src/routes/children'

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    child: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    revisao: {
      create: jest.fn(),
    },
    tecnico: {
      findUnique: jest.fn(),
    },
  }
  return { PrismaClient: jest.fn(() => mockPrisma) }
})

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() as jest.Mocked<PrismaClient> & {
  child: { findMany: jest.Mock; findUnique: jest.Mock; count: jest.Mock }
  revisao: { create: jest.Mock }
  tecnico: { findUnique: jest.Mock }
}

const MOCK_TOKEN_PAYLOAD = {
  sub: 'uuid-1',
  preferred_username: 'tecnico@prefeitura.rio',
  nome: 'Técnico de Campo',
}

async function buildApp() {
  const app = Fastify()
  await app.register(cors, { origin: true })
  await app.register(jwt, { secret: 'test-secret' })
  await app.register(childrenRoutes, { prefix: '/children' })
  return app
}

function makeToken(app: Awaited<ReturnType<typeof buildApp>>) {
  return app.jwt.sign(MOCK_TOKEN_PAYLOAD, { expiresIn: '1h' })
}

const mockChild = {
  id: 'c001',
  nome: 'Ana Clara Silva',
  dataNascimento: new Date('2015-03-15'),
  bairro: 'Madureira',
  responsavel: 'Maria da Silva',
  telefone: '(21) 98765-4321',
  createdAt: new Date(),
  updatedAt: new Date(),
  saude: { temAlerta: true, alertas: ['Vacinas atrasadas'] },
  educacao: { temAlerta: false, alertas: [] },
  assistenciaSocial: { temAlerta: false, alertas: [] },
  revisoes: [],
}

describe('GET /children', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = makeToken(app)
  })

  afterAll(async () => { await app.close() })
  beforeEach(() => { jest.clearAllMocks() })

  it('retorna 401 sem token', async () => {
    const res = await app.inject({ method: 'GET', url: '/children' })
    expect(res.statusCode).toBe(401)
  })

  it('retorna lista paginada com token válido', async () => {
    prisma.child.findMany.mockResolvedValueOnce([mockChild])
    prisma.child.count.mockResolvedValueOnce(1)

    const res = await app.inject({
      method: 'GET',
      url: '/children',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('data')
    expect(body).toHaveProperty('total', 1)
    expect(body).toHaveProperty('totalPages', 1)
    expect(body.data[0].nome).toBe('Ana Clara Silva')
  })

  it('mapeia status da área corretamente — saude com alerta', async () => {
    prisma.child.findMany.mockResolvedValueOnce([mockChild])
    prisma.child.count.mockResolvedValueOnce(1)

    const res = await app.inject({
      method: 'GET',
      url: '/children',
      headers: { authorization: `Bearer ${token}` },
    })

    const child = res.json().data[0]
    expect(child.areas.saude).toBe('alerta')
    expect(child.areas.educacao).toBe('ok')
  })

  it('mapeia status sem_dados quando área é null', async () => {
    const childSemSaude = { ...mockChild, saude: null }
    prisma.child.findMany.mockResolvedValueOnce([childSemSaude])
    prisma.child.count.mockResolvedValueOnce(1)

    const res = await app.inject({
      method: 'GET',
      url: '/children',
      headers: { authorization: `Bearer ${token}` },
    })

    const child = res.json().data[0]
    expect(child.areas.saude).toBe('sem_dados')
  })

  it('filtra por semDados corretamente', async () => {
    prisma.child.findMany.mockResolvedValueOnce([])
    prisma.child.count.mockResolvedValueOnce(0)

    const res = await app.inject({
      method: 'GET',
      url: '/children?semDados=true',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().total).toBe(0)

    const whereArg = prisma.child.findMany.mock.calls[0][0]?.where
    expect(whereArg).toMatchObject({
      saude: null,
      educacao: null,
      assistenciaSocial: null,
    })
  })
})

describe('GET /children/:id', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = makeToken(app)
  })

  afterAll(async () => { await app.close() })
  beforeEach(() => { jest.clearAllMocks() })

  it('retorna 404 quando criança não existe', async () => {
    prisma.child.findUnique.mockResolvedValueOnce(null)

    const res = await app.inject({
      method: 'GET',
      url: '/children/nao-existe',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(404)
  })

  it('retorna detalhe completo da criança', async () => {
    prisma.child.findUnique.mockResolvedValueOnce({
      ...mockChild,
      saude: {
        cartaoSus: '123 4567',
        ultimaConsulta: new Date('2024-01-01'),
        vacinasEmDia: false,
        alertas: ['Vacinas atrasadas'],
      },
      educacao: null,
      assistenciaSocial: null,
      revisoes: [],
    })

    const res = await app.inject({
      method: 'GET',
      url: '/children/c001',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.nome).toBe('Ana Clara Silva')
    expect(body.saude).not.toBeNull()
    expect(body.educacao).toBeNull()
    expect(body.assistenciaSocial).toBeNull()
  })
})

describe('PATCH /children/:id/review', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = makeToken(app)
  })

  afterAll(async () => { await app.close() })
  beforeEach(() => { jest.clearAllMocks() })

  it('retorna 401 sem token', async () => {
    const res = await app.inject({ method: 'PATCH', url: '/children/c001/review' })
    expect(res.statusCode).toBe(401)
  })

  it('retorna 404 quando criança não existe', async () => {
    prisma.child.findUnique.mockResolvedValueOnce(null)

    const res = await app.inject({
      method: 'PATCH',
      url: '/children/nao-existe/review',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(404)
  })

  it('registra revisão com sucesso', async () => {
    prisma.child.findUnique.mockResolvedValueOnce({ id: 'c001', nome: 'Ana Clara' })
    prisma.tecnico.findUnique.mockResolvedValueOnce({ id: 'uuid-1', email: 'tecnico@prefeitura.rio', nome: 'Técnico' })
    prisma.revisao.create.mockResolvedValueOnce({
      id: 'rev-1',
      childId: 'c001',
      tecnicoId: 'uuid-1',
      criadoEm: new Date(),
      tecnico: { email: 'tecnico@prefeitura.rio', nome: 'Técnico de Campo' },
    })

    const res = await app.inject({
      method: 'PATCH',
      url: '/children/c001/review',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().success).toBe(true)
    expect(res.json().revisao).toHaveProperty('id', 'rev-1')
  })
})
