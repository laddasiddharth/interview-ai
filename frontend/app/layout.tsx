import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Syne } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { Nav } from '@/components/nav'
import './globals.css'

const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
})

const fontDisplay = Syne({ 
  subsets: ["latin"],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'InterviewAI - AI Interview Coach',
  description: 'Master technical interviews with AI-powered coaching, realistic simulations, and personalized feedback.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased bg-background text-foreground bg-pattern min-h-screen`}>
        <div className="fixed inset-0 z-[-1] bg-gradient-radial from-background-glow to-transparent opacity-50 blur-3xl pointer-events-none" />
        <AuthProvider>
          <Nav />
          <main className="animate-fade-in-up">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
