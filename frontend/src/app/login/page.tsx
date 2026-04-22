'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api'
import { saveToken, saveUser, isAuthenticated } from '@/lib/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard')
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      saveToken(data.token)
      saveUser({ email: data.tecnico.email, nome: data.tecnico.nome })
      router.replace('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {/* Barra superior Prefeitura Rio */}
      <div style={{ backgroundColor: '#005B9A' }} className="w-full">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <circle cx="20" cy="20" r="18" fill="#005B9A" />
                <text x="20" y="25" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">RIO</text>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">PREFEITURA</p>
              <p className="text-white/80 text-xs leading-tight">Rio de Janeiro</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div style={{ backgroundColor: '#00A86B' }} className="w-full py-1" />

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#005B9A' }}>
              <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                <path d="M24 4L6 14v20l18 10 18-10V14L24 4z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2"/>
                <path d="M24 12a6 6 0 100 12 6 6 0 000-12z" fill="white"/>
                <path d="M16 34c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Painel de Acompanhamento</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sistema de monitoramento de crianças em vulnerabilidade social</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div style={{ backgroundColor: '#005B9A' }} className="px-8 py-4">
              <h2 className="text-white font-semibold text-lg">Acesso Restrito</h2>
              <p className="text-white/70 text-xs mt-0.5">Secretaria Municipal de Assistência Social</p>
            </div>

            <div className="px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail funcional</label>
                  <input
                    id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tecnico@prefeitura.rio"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 transition-all"
                    required disabled={loading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                  <div className="relative">
                    <input
                      id="password" type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 transition-all"
                      required disabled={loading}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      tabIndex={-1} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div role="alert" className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                    <span>⚠</span><span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#005B9A' }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Entrando...</> : 'Entrar'}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
            Prefeitura do Rio de Janeiro · Sistema Interno · Uso restrito a servidores autorizados
          </p>
        </div>
      </div>
    </div>
  )
}
