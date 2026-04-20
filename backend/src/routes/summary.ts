import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const prisma = new PrismaClient()

export async function summaryRoutes(app: FastifyInstance) {
  app.get('/summary', {
    preHandler: authenticate,
    handler: async (_request, reply) => {
      const [
        total,
        comAlertaSaude,
        comAlertaEducacao,
        comAlertaSocial,
        revisadas,
        allChildren,
      ] = await Promise.all([
        prisma.child.count(),
        prisma.saude.count({ where: { temAlerta: true } }),
        prisma.educacao.count({ where: { temAlerta: true } }),
        prisma.assistenciaSocial.count({ where: { temAlerta: true } }),
        prisma.child.count({ where: { revisoes: { some: {} } } }),
        prisma.child.findMany({
          include: {
            saude: { select: { temAlerta: true } },
            educacao: { select: { temAlerta: true } },
            assistenciaSocial: { select: { temAlerta: true } },
          },
        }),
      ])

      // Crianças com pelo menos um alerta em qualquer área
      const comAlertas = allChildren.filter(
        (c) =>
          c.saude?.temAlerta ||
          c.educacao?.temAlerta ||
          c.assistenciaSocial?.temAlerta
      ).length

      // Crianças sem dados em nenhuma área
      const semDados = allChildren.filter(
        (c) => !c.saude && !c.educacao && !c.assistenciaSocial
      ).length

      // Agrupamento por bairro
      const bairroMap = new Map<string, { total: number; comAlertas: number }>()

      for (const child of allChildren) {
        const entry = bairroMap.get(child.bairro) ?? { total: 0, comAlertas: 0 }
        entry.total++
        if (child.saude?.temAlerta || child.educacao?.temAlerta || child.assistenciaSocial?.temAlerta) {
          entry.comAlertas++
        }
        bairroMap.set(child.bairro, entry)
      }

      const porBairro = Array.from(bairroMap.entries())
        .map(([bairro, data]) => ({ bairro, ...data }))
        .sort((a, b) => b.comAlertas - a.comAlertas)

      return reply.send({
        total,
        comAlertas,
        semDados,
        revisadas,
        porArea: {
          saude: comAlertaSaude,
          educacao: comAlertaEducacao,
          assistenciaSocial: comAlertaSocial,
        },
        porBairro,
      })
    },
  })
}
