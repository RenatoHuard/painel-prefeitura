import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface SeedSaude {
  cartao_sus?: string
  ultima_consulta?: string
  vacinas_em_dia: boolean
  alertas: string[]
}

interface SeedEducacao {
  escola?: string
  serie?: string
  frequencia_percentual?: number
  alertas: string[]
}

interface SeedAssistenciaSocial {
  nis?: string
  beneficios: string[]
  status_beneficios?: string
  alertas: string[]
}

interface SeedChild {
  id: string
  nome: string
  data_nascimento: string
  bairro: string
  responsavel: string
  telefone: string
  saude: SeedSaude | null
  educacao: SeedEducacao | null
  assistencia_social: SeedAssistenciaSocial | null
}

async function main() {
  console.log('🌱 Iniciando seed...')

  const existingTecnico = await prisma.tecnico.findUnique({
    where: { email: 'tecnico@prefeitura.rio' },
  })

  if (!existingTecnico) {
    const senhaHash = await bcrypt.hash('painel@2024', 10)
    await prisma.tecnico.create({
      data: { email: 'tecnico@prefeitura.rio', senha: senhaHash, nome: 'Técnico de Campo' },
    })
    console.log('✅ Técnico criado')
  }

  const existingChildren = await prisma.child.count()
  if (existingChildren > 0) {
    console.log(`⏭️  ${existingChildren} crianças já cadastradas, pulando...`)
    return
  }

  // Tenta múltiplos caminhos para o seed.json
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'data', 'seed.json'),   // Docker local
    path.join(__dirname, '..', 'seed.json'),                   // Render (backend/)
    path.join(process.cwd(), 'seed.json'),                     // raiz do processo
    path.join(process.cwd(), 'data', 'seed.json'),
  ]

  let seedPath = ''
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      seedPath = p
      break
    }
  }

  if (!seedPath) {
    console.error('❌ seed.json não encontrado em nenhum dos caminhos:', possiblePaths)
    process.exit(1)
  }

  console.log(`📋 Usando seed de: ${seedPath}`)
  const children: SeedChild[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
  console.log(`📋 Importando ${children.length} crianças...`)

  for (const child of children) {
    await prisma.child.create({
      data: {
        id: child.id,
        nome: child.nome,
        dataNascimento: new Date(child.data_nascimento),
        bairro: child.bairro,
        responsavel: child.responsavel,
        telefone: child.telefone,
        saude: child.saude ? {
          create: {
            cartaoSus: child.saude.cartao_sus,
            ultimaConsulta: child.saude.ultima_consulta ? new Date(child.saude.ultima_consulta) : null,
            vacinasEmDia: child.saude.vacinas_em_dia,
            alertas: child.saude.alertas,
            temAlerta: child.saude.alertas.length > 0,
          }
        } : undefined,
        educacao: child.educacao ? {
          create: {
            escola: child.educacao.escola,
            serie: child.educacao.serie,
            frequenciaPercentual: child.educacao.frequencia_percentual ?? null,
            alertas: child.educacao.alertas,
            temAlerta: child.educacao.alertas.length > 0,
          }
        } : undefined,
        assistenciaSocial: child.assistencia_social ? {
          create: {
            nis: child.assistencia_social.nis,
            beneficios: child.assistencia_social.beneficios,
            statusBeneficios: child.assistencia_social.status_beneficios,
            alertas: child.assistencia_social.alertas,
            temAlerta: child.assistencia_social.alertas.length > 0,
          }
        } : undefined,
      },
    })
  }

  console.log(`✅ ${children.length} crianças importadas!`)
  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => { console.error('❌ Erro no seed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
