import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { childrenRoutes } from './routes/children'
import { summaryRoutes } from './routes/summary'

const app = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
  },
})

async function bootstrap() {
  // CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  })

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // Routes
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(childrenRoutes, { prefix: '/children' })
  await app.register(summaryRoutes)

  // Start server
  const port = parseInt(process.env.PORT || '3001')
  const host = '0.0.0.0'

  await app.listen({ port, host })
  console.log(`🚀 Backend rodando em http://${host}:${port}`)
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar servidor:', err)
  process.exit(1)
})
