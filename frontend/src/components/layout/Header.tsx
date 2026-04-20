'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout, getUserFromToken } from '@/lib/auth'
import { ThemeToggle } from './ThemeToggle'
import { Shield, LogOut, Menu, X, LayoutDashboard, Users } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const user = getUserFromToken()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
    { href: '/children', label: 'Crianças', icon: Users },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm hidden sm:block">Painel Prefeitura</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-xs text-muted-foreground max-w-[200px]">
                <span className="truncate">{user.nome || user.email}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <nav
            className="absolute left-0 top-14 bottom-0 w-64 bg-background border-r border-border p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {user && (
              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-xs text-muted-foreground px-3">Logado como</p>
                <p className="text-sm font-medium px-3 mt-0.5 truncate">{user.email}</p>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
