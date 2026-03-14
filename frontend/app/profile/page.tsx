'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { User, Mail, Calendar, Award, LogOut, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token')
      if (!user || !token) return

      try {
        const res = await fetch('http://localhost:8000/analytics/user', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile stats', error)
      } finally {
        setLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchStats()
    }
  }, [user, authLoading])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2 border-r-transparent mr-4" />
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: User Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 text-center">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground capitalize">{user.name}</h2>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            
            <Button 
              variant="outline" 
              className="w-full mt-6 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Account Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recently'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email Verified</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Performance Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Performance Summary</h2>
            
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading stats...</div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Interviews</p>
                  <p className="text-4xl font-bold text-foreground">{stats.total_interviews}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-4xl font-bold text-accent">{stats.average_score}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Highest Score</p>
                  <p className="text-4xl font-bold text-purple-500">{stats.best_score}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Top Topic</p>
                  <p className="text-xl font-bold text-foreground capitalize">
                    {Object.keys(stats.topics)[0] || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No data available yet.</p>
            )}

            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">Mastery Badges</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-sm">
                  <Award className="w-4 h-4" />
                  Fast Learner
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full text-purple-500 text-sm">
                  <Award className="w-4 h-4" />
                  Consistency King
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>
            <p className="text-sm text-muted-foreground mb-6">Manage your account preferences and settings.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg opacity-50 cursor-not-allowed">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg opacity-50 cursor-not-allowed">
                <div>
                  <p className="font-semibold">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
