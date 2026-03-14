'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { DashboardStats } from './_components/dashboard-stats'
import { RecentInterviews } from './_components/recent-interviews'
import { PerformanceChart } from './_components/performance-chart'
import { CategoryChart } from './_components/category-chart'
import { mockMetrics } from '@/lib/mock-data'
import { Plus, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Welcome back, {user.name}! 👋</h1>
            <p className="text-muted-foreground mt-2">Let's keep improving your interview skills</p>
          </div>
          <Link href="/interview/select">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Start Interview
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Tips Section */}
        <Card className="p-6 mb-8 bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Focus Areas This Week</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Improve {mockMetrics.weakAreas[0]} skills (Currently: 80%)</li>
                <li>• Keep practicing {mockMetrics.strongAreas[0]} - you're doing great!</li>
                <li>• Try harder difficulty questions in your weak areas</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PerformanceChart />
          <CategoryChart />
        </div>

        {/* Recent Interviews */}
        <RecentInterviews />
      </div>
    </main>
  )
}
