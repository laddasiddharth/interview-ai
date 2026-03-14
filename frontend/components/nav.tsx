'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export function Nav() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const isHome = pathname === '/'
  const isAuth = pathname === '/login' || pathname === '/signup'
  const isApp = pathname.startsWith('/dashboard') || pathname.startsWith('/interview') || pathname.startsWith('/profile')

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isHome) {
    return (
      <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            InterviewAI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  if (isAuth) {
    return (
      <nav className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            InterviewAI
          </Link>
        </div>
      </nav>
    )
  }

  if (isApp) {
    return (
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            InterviewAI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">Profile</Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
          </div>
        </div>
      </nav>
    )
  }

  return null
}
