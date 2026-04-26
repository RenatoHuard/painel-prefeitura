'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Painel Geral', icon: LayoutDashboard },
  { href: '/children', label: 'Crianças', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 flex-col border-r border-border bg-background/95 p-3 z-20">
      <nav aria-label="Navegação principal">
        <ul role="list" className="space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
