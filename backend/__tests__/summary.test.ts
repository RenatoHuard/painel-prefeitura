import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { summaryRoutes } from '../src/routes/summary'

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    child: { count: jest.fn(), findMany: jest.fn() },
    saude: { count: jest.fn() },
    educacao: { count: jest.fn() },
    assistenciaSocial: { count: jest.fn() },
  }
  return { PrismaClient: jest.fn(() => mockPrisma) }
})

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() as jest.Mocked<PrismaClient> & {
  child: { count: jest.Mock; findMany: jest.Mock }
  saude: { count: jest.Mock }
  educacao: { count: jest.Mock }
  assistenciaSocial: { count: jest.Mock }
}

async function buildApp() {
  const app = Fastify()
  await app.register(cors, { origin: true })
  await app.register(jwt, { secret: 'test-secret' })
  await app.register(summaryRoutes)
  return app
}

describe('GET /summary', () => {
  let app: Awaited<ReturnType<typeof buildApp>>
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = app.jwt.sign({ sub: 'uuid-1', preferred_username: 'tecnico@prefeitura.rio' }, { expiresIn: '1h' })
  })

  afterAll(async () => { await app.close() })
  beforeEach(() => { jest.clearAllMocks() })

  it('retorna 401 sem token', async () => {
    const res = await app.inject({ method: 'GET', url: '/summary' })
    expect(res.statusCode).toBe(401)
  })

  it('retorna estrutura correta do summary', async () => {
    prisma.child.count
      .mockResolvedValueOnce(25)  // total
      .mockResolvedValueOnce(5)   // revisadas
    prisma.saude.count.mockResolvedValueOnce(10)
    prisma.educacao.count.mockResolvedValueOnce(8)
    prisma.assistenciaSocial.count.mockResolvedValueOnce(6)
    prisma.child.findMany.mockResolvedValueOnce([
      { bairro: 'Madureira', saude: { temAlerta: true }, educacao: null, assistenciaSocial: null },
      { bairro: 'Madureira', saude: null, educacao: { temAlerta: false }, assistenciaSocial: null },
      { bairro: 'Bangu', saude: { temAlerta: true }, educacao: { temAlerta: true }, assistenciaSocial: null },
    ])

    const res = await app.inject({
      method: 'GET',
      url: '/summary',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('total', 25)
    expect(body).toHaveProperty('revisadas', 5)
    expect(body).toHaveProperty('porArea')
    expect(body.porArea).toMatchObject({ saude: 10, educacao: 8, assistenciaSocial: 6 })
    expect(body).toHaveProperty('porBairro')
    expect(Array.isArray(body.porBairro)).toBe(true)
  })

  it('conta crianças sem dados em nenhuma área', async () => {
    prisma.child.count.mockResolvedValueOnce(3).mockResolvedValueOnce(0)
    prisma.saude.count.mockResolvedValueOnce(0)
    prisma.educacao.count.mockResolvedValueOnce(0)
    prisma.assistenciaSocial.count.mockResolvedValueOnce(0)
    prisma.child.findMany.mockResolvedValueOnce([
      { bairro: 'Bangu', saude: null, educacao: null, assistenciaSocial: null },
      { bairro: 'Bangu', saude: null, educacao: null, assistenciaSocial: null },
      { bairro: 'Rocinha', saude: { temAlerta: true }, educacao: null, assistenciaSocial: null },
    ])

    const res = await app.inject({
      method: 'GET',
      url: '/summary',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().semDados).toBe(2)
  })
})
