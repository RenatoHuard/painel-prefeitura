import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function authRoutes(app: FastifyInstance) {
  app.post<{
    Body: { email: string; password: string }
  }>('/token', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body

      const tecnico = await prisma.tecnico.findUnique({ where: { email } })

      if (!tecnico) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }

      const senhaValida = await bcrypt.compare(password, tecnico.senha)
      if (!senhaValida) {
        return reply.status(401).send({ error: 'Credenciais inválidas' })
      }

      const token = app.jwt.sign(
        {
          sub: tecnico.id,
          preferred_username: tecnico.email,
          nome: tecnico.nome,
        },
        { expiresIn: '8h' }
      )

      return reply.send({
        token,
        tecnico: {
          id: tecnico.id,
          email: tecnico.email,
          nome: tecnico.nome,
        },
      })
    },
  })
}
