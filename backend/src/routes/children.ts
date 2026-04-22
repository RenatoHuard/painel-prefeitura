import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'
import { JwtPayload, ChildListItem } from '../types'

const prisma = new PrismaClient()

function getAreaStatus(temDados: boolean, temAlerta: boolean): 'ok' | 'alerta' | 'sem_dados' {
  if (!temDados) return 'sem_dados'
  return temAlerta ? 'alerta' : 'ok'
}

export async function childrenRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: {
      bairro?: string; alertas?: string; revisado?: string
      area?: string; nome?: string; semDados?: string
      page?: string; limit?: string
    }
  }>('/', {
    preHandler: authenticate,
    handler: async (request, reply) => {
      const { bairro, alertas, revisado, area, nome, semDados, page = '1', limit = '12' } = request.query
      const pageNum = Math.max(1, parseInt(page))
      const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
      const skip = (pageNum - 1) * limitNum

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {}

      if (nome && nome.trim()) {
        where.nome = { contains: nome.trim(), mode: 'insensitive' }
      }

      if (bairro && bairro !== 'todos') {
        where.bairro = bairro
      }

      // Crianças SEM dados em nenhuma área
      if (semDados === 'true') {
        where.saude = null
        where.educacao = null
        where.assistenciaSocial = null
      } else if (area && area !== 'todos') {
        if (area === 'saude') where.saude = { temAlerta: true }
        else if (area === 'educacao') where.educacao = { temAlerta: true }
        else if (area === 'social') where.assistenciaSocial = { temAlerta: true }
      } else if (alertas === 'true') {
        where.OR = [
          { saude: { temAlerta: true } },
          { educacao: { temAlerta: true } },
          { assistenciaSocial: { temAlerta: true } },
        ]
      } else if (alertas === 'false') {
        where.AND = [
          { OR: [{ saude: null }, { saude: { temAlerta: false } }] },
          { OR: [{ educacao: null }, { educacao: { temAlerta: false } }] },
          { OR: [{ assistenciaSocial: null }, { assistenciaSocial: { temAlerta: false } }] },
        ]
      }

      if (revisado === 'true') where.revisoes = { some: {} }
      else if (revisado === 'false') where.revisoes = { none: {} }

      const [children, total] = await Promise.all([
        prisma.child.findMany({
          where, skip, take: limitNum, orderBy: { nome: 'asc' },
          include: {
            saude: { select: { temAlerta: true, alertas: true } },
            educacao: { select: { temAlerta: true, alertas: true } },
            assistenciaSocial: { select: { temAlerta: true, alertas: true } },
            revisoes: { orderBy: { criadoEm: 'desc' }, take: 1, include: { tecnico: { select: { email: true } } } },
          },
        }),
        prisma.child.count({ where }),
      ])

      const data: ChildListItem[] = children.map((child) => {
        const alertasCount = [child.saude?.temAlerta, child.educacao?.temAlerta, child.assistenciaSocial?.temAlerta].filter(Boolean).length
        return {
          id: child.id, nome: child.nome, dataNascimento: child.dataNascimento.toISOString(),
          bairro: child.bairro, responsavel: child.responsavel, telefone: child.telefone,
          alertasCount,
          areas: {
            saude: getAreaStatus(!!child.saude, child.saude?.temAlerta ?? false),
            educacao: getAreaStatus(!!child.educacao, child.educacao?.temAlerta ?? false),
            assistenciaSocial: getAreaStatus(!!child.assistenciaSocial, child.assistenciaSocial?.temAlerta ?? false),
          },
          revisado: child.revisoes.length > 0,
          ultimaRevisao: child.revisoes[0]?.criadoEm.toISOString() ?? null,
        }
      })

      return reply.send({ data, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) })
    },
  })

  app.get<{ Params: { id: string } }>('/:id', {
    preHandler: authenticate,
    handler: async (request, reply) => {
      const { id } = request.params
      const child = await prisma.child.findUnique({
        where: { id },
        include: {
          saude: true, educacao: true, assistenciaSocial: true,
          revisoes: { orderBy: { criadoEm: 'desc' }, include: { tecnico: { select: { email: true, nome: true } } } },
        },
      })
      if (!child) return reply.status(404).send({ error: 'Criança não encontrada' })
      return reply.send({
        id: child.id, nome: child.nome, dataNascimento: child.dataNascimento.toISOString(),
        bairro: child.bairro, responsavel: child.responsavel, telefone: child.telefone,
        saude: child.saude ? { cartaoSus: child.saude.cartaoSus, ultimaConsulta: child.saude.ultimaConsulta?.toISOString() ?? null, vacinasEmDia: child.saude.vacinasEmDia, alertas: child.saude.alertas } : null,
        educacao: child.educacao ? { escola: child.educacao.escola, serie: child.educacao.serie, frequenciaPercentual: child.educacao.frequenciaPercentual, alertas: child.educacao.alertas } : null,
        assistenciaSocial: child.assistenciaSocial ? { nis: child.assistenciaSocial.nis, beneficios: child.assistenciaSocial.beneficios, statusBeneficios: child.assistenciaSocial.statusBeneficios, alertas: child.assistenciaSocial.alertas } : null,
        revisoes: child.revisoes.map((r) => ({ id: r.id, tecnico: r.tecnico.email, nomeTecnico: r.tecnico.nome, criadoEm: r.criadoEm.toISOString() })),
      })
    },
  })

  app.patch<{ Params: { id: string } }>('/:id/review', {
    preHandler: authenticate,
    handler: async (request, reply) => {
      const { id } = request.params
      const payload = request.user as JwtPayload
      const child = await prisma.child.findUnique({ where: { id } })
      if (!child) return reply.status(404).send({ error: 'Criança não encontrada' })
      const tecnico = await prisma.tecnico.findUnique({ where: { email: payload.preferred_username } })
      if (!tecnico) return reply.status(401).send({ error: 'Técnico não encontrado' })
      const revisao = await prisma.revisao.create({
        data: { childId: id, tecnicoId: tecnico.id },
        include: { tecnico: { select: { email: true, nome: true } } },
      })
      return reply.send({ success: true, revisao: { id: revisao.id, tecnico: revisao.tecnico.email, nomeTecnico: revisao.tecnico.nome, criadoEm: revisao.criadoEm.toISOString() } })
    },
  })
}
