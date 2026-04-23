import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { authRoutes } from '../src/routes/auth'

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    tecnico: {
      findUnique: jest.fn(),
    },
  }
  return { PrismaClient: jest.fn(() => mockPrisma) }
})

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

import * as bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() as jest.Mocked<PrismaClient> & {
  tecnico: { findUnique: jest.Mock }
}

async function buildApp() {
  const app = Fastify()
  await app.register(cors, { origin: true })
  await app.register(jwt, { secret: 'test-secret' })
  await app.register(authRoutes, { prefix: '/auth' })
  return app
}

describe('POST /auth/token', () => {
  let app: Awaited<ReturnType<typeof buildApp>>

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retorna 400 quando body está ausente', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: {},
    })
    expect(res.statusCode).toBe(400)
  })

  it('retorna 401 quando técnico não existe', async () => {
    prisma.tecnico.findUnique.mockResolvedValueOnce(null)

    const res = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { email: 'naoexiste@prefeitura.rio', password: 'senha123' },
    })

    expect(res.statusCode).toBe(401)
    expect(res.json()).toMatchObject({ error: 'Credenciais inválidas' })
  })

  it('retorna 401 quando senha está errada', async () => {
    prisma.tecnico.findUnique.mockResolvedValueOnce({
      id: 'uuid-1',
      email: 'tecnico@prefeitura.rio',
      senha: 'hash-errado',
      nome: 'Técnico',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

    const res = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { email: 'tecnico@prefeitura.rio', password: 'senhaErrada' },
    })

    expect(res.statusCode).toBe(401)
    expect(res.json()).toMatchObject({ error: 'Credenciais inválidas' })
  })

  it('retorna token JWT quando credenciais são válidas', async () => {
    prisma.tecnico.findUnique.mockResolvedValueOnce({
      id: 'uuid-1',
      email: 'tecnico@prefeitura.rio',
      senha: 'hash-correto',
      nome: 'Técnico de Campo',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

    const res = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { email: 'tecnico@prefeitura.rio', password: 'painel@2024' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body).toHaveProperty('token')
    expect(body).toHaveProperty('tecnico')
    expect(body.tecnico.email).toBe('tecnico@prefeitura.rio')
  })

  it('o JWT contém preferred_username com o email do técnico', async () => {
    prisma.tecnico.findUnique.mockResolvedValueOnce({
      id: 'uuid-1',
      email: 'tecnico@prefeitura.rio',
      senha: 'hash-correto',
      nome: 'Técnico de Campo',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

    const res = await app.inject({
      method: 'POST',
      url: '/auth/token',
      payload: { email: 'tecnico@prefeitura.rio', password: 'painel@2024' },
    })

    const { token } = res.json()
    const payload = app.jwt.decode(token) as Record<string, unknown>
    expect(payload.preferred_username).toBe('tecnico@prefeitura.rio')
  })
})
