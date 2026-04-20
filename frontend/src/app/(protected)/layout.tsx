'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [router])

  // Periodic token check
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        router.replace('/login')
      }
    }, 60_000) // check every minute
    return () => clearInterval(interval)
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 md:ml-56"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
