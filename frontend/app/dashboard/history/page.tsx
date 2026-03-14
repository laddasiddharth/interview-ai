'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, Calendar, BarChart2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface Interview {
  interview_id: number
  topic: string
  start_time: string
  end_time: string | null
  total_questions: number
  average_score: number
}

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:8000/analytics/user/details', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setInterviews(data)
        }
      } catch (e) {
        console.error('Failed to fetch history:', e)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchHistory()
    }
  }, [user])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading history...</div>
      </div>
    )
  }

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-accent hover:underline mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Interview History</h1>
            <p className="text-muted-foreground mt-2">View all your past interview sessions and performance.</p>
          </div>
        </div>

        <Card className="overflow-hidden">
          {interviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No interviews yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Complete your first interview to see it here.</p>
              <Link href="/interview/select">
                <Button>Start Interview</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => (
                  <TableRow key={interview.interview_id} className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/interview/room/${interview.interview_id}`)}>
                    <TableCell className="font-medium">{interview.topic}</TableCell>
                    <TableCell>{new Date(interview.start_time).toLocaleDateString()}</TableCell>
                    <TableCell>{interview.total_questions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          interview.average_score >= 80 ? 'text-green-500' : 
                          interview.average_score >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {interview.average_score}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </main>
  )
}
