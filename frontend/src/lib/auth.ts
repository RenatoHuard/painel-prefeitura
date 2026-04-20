import { parseJwt, isTokenExpired } from './utils'

const TOKEN_KEY = 'painel_token'
const USER_KEY = 'painel_user'

export interface StoredUser {
  email: string
  nome: string
}

export function saveToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function saveUser(user: StoredUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired(token)
}

export function getUserFromToken(): StoredUser | null {
  const token = getToken()
  if (!token) return null
  const payload = parseJwt(token)
  if (!payload) return null
  return {
    email: payload.preferred_username,
    nome: payload.nome,
  }
}

export function logout() {
  removeToken()
  window.location.href = '/login'
}
