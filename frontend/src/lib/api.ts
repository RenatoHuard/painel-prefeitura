import { getToken, logout } from './auth'
import type { AuthResponse, ChildrenResponse, ChildDetail, Summary, Filters } from '@/types'

const BASE = '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (res.status === 401) { logout(); throw new Error('Sessão expirada') }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(err.error || `Erro ${res.status}`)
  }
  return res.json()
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/token', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function getSummary(): Promise<Summary> {
  return request<Summary>('/summary')
}

export async function getChildren(filters: Partial<Filters> = {}): Promise<ChildrenResponse> {
  const params = new URLSearchParams()
  if (filters.bairro && filters.bairro !== 'todos') params.set('bairro', filters.bairro)
  if (filters.area && filters.area !== 'todos') params.set('area', filters.area)
  else if (filters.alertas && filters.alertas !== 'todos') params.set('alertas', filters.alertas)
  if (filters.revisado && filters.revisado !== 'todos') params.set('revisado', filters.revisado)
  if (filters.page) params.set('page', String(filters.page))
  params.set('limit', '12')
  const query = params.toString()
  return request<ChildrenResponse>(`/children${query ? `?${query}` : ''}`)
}

export async function getChild(id: string): Promise<ChildDetail> {
  return request<ChildDetail>(`/children/${id}`)
}

export async function reviewChild(id: string) {
  return request<{ success: boolean; revisao: { id: string; tecnico: string; criadoEm: string } }>(`/children/${id}/review`, { method: 'PATCH' })
}
