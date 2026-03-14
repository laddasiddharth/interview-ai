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
import { Plus, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface AnalyticsData {
  total_interviews: number
  average_score: number
  best_score: number
  performance_data: Array<{ date: string; score: number }>
  topics: Record<string, number>
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!user || !token) return

      try {
        const [analyticsRes, detailsRes] = await Promise.all([
          fetch('http://localhost:8000/analytics/user', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/analytics/user/details', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (analyticsRes.ok) {
          const data = await analyticsRes.json()
          setAnalytics(data)
        }
        
        if (detailsRes.ok) {
          const data = await detailsRes.json()
          setRecentInterviews(data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      } finally {
        setDataLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchData()
    }
  }, [user, authLoading])

  if (authLoading || (dataLoading && !analytics) || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2 border-r-transparent mr-4" />
        <div className="text-muted-foreground">Loading your progress...</div>
      </div>
    )
  }

  // Final fallback if analytics failed to fetch completely
  const safeAnalytics = analytics || {
    total_interviews: 0,
    average_score: 0,
    best_score: 0,
    performance_data: [],
    topics: {}
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
          <DashboardStats data={safeAnalytics} />
        </div>

        {/* Tips Section */}
        <Card className="p-6 mb-8 bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Focus Areas This Week</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {safeAnalytics.total_interviews === 0 ? (
                  <li>• Start your first interview to see personalized focus areas</li>
                ) : (
                  <>
                    <li>• Keep practicing your top topics: {Object.keys(safeAnalytics.topics).join(', ') || 'N/A'}</li>
                    <li>• Target an average score above 85% for mastery</li>
                    <li>• Try harder difficulty questions in your weak areas</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PerformanceChart data={safeAnalytics.performance_data} />
          <CategoryChart topics={safeAnalytics.topics} />
        </div>

        {/* Recent Interviews */}
        <RecentInterviews interviews={recentInterviews} />
      </div>
    </main>
  )
}
