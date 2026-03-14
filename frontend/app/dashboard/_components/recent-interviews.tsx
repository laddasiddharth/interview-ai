import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

interface RecentInterviewsProps {
  interviews: Array<{
    interview_id: number
    topic: string
    start_time: string
    average_score: number
    total_questions: number
  }>
}

export function RecentInterviews({ interviews }: RecentInterviewsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-700'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Recent Interviews</h2>
        <Link href="/dashboard/history">
          <Button variant="ghost" className="gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No interviews completed yet.</p>
            <Link href="/interview/select" className="inline-block mt-4">
              <Button variant="outline" size="sm">Start your first interview</Button>
            </Link>
          </div>
        ) : (
          interviews.slice(0, 5).map((interview) => (
            <div key={interview.interview_id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{interview.topic}</h3>
                    <p className="text-sm text-muted-foreground">Practice Session</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(interview.average_score)}`}>
                    {interview.average_score}%
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {interview.average_score >= 75 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {interview.total_questions} questions • {new Date(interview.start_time).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
