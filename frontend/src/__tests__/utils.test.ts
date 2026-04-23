import { describe, it, expect } from 'vitest'
import { calcularIdade, formatarData, formatarDataHora, isTokenExpired } from '@/lib/utils'

describe('calcularIdade', () => {
  it('calcula idade corretamente', () => {
    const hoje = new Date()
    const anoNasc = hoje.getFullYear() - 10
    const nascimento = `${anoNasc}-01-01`
    const idade = calcularIdade(nascimento)
    expect(idade).toBeGreaterThanOrEqual(9)
    expect(idade).toBeLessThanOrEqual(10)
  })

  it('retorna 0 para recém-nascido', () => {
    const hoje = new Date().toISOString().split('T')[0]
    expect(calcularIdade(hoje)).toBe(0)
  })
})

describe('formatarData', () => {
  it('formata data no padrão brasileiro', () => {
    const resultado = formatarData('2024-03-15T00:00:00.000Z')
    expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })
})

describe('formatarDataHora', () => {
  it('inclui hora na formatação', () => {
    const resultado = formatarDataHora('2024-03-15T14:30:00.000Z')
    expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    expect(resultado).toMatch(/\d{2}:\d{2}/)
  })
})

describe('isTokenExpired', () => {
  it('retorna true para token inválido', () => {
    expect(isTokenExpired('token-invalido')).toBe(true)
  })

  it('retorna true para token expirado', () => {
    // JWT com exp no passado (1970)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({ exp: 1, sub: 'test' }))
    const token = `${header}.${payload}.signature`
    expect(isTokenExpired(token)).toBe(true)
  })

  it('retorna false para token válido', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    const payload = btoa(JSON.stringify({ exp: futureExp, sub: 'test' }))
    const token = `${header}.${payload}.signature`
    expect(isTokenExpired(token)).toBe(false)
  })
})
