import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockInterviews } from '@/lib/mock-data'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export function RecentInterviews() {
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
        {mockInterviews.slice(0, 5).map((interview) => (
          <div key={interview.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{interview.title}</h3>
                  <p className="text-sm text-muted-foreground">{interview.company || 'Practice'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(interview.score)}`}>
                  {interview.score}%
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {interview.score >= 75 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-medium px-2.5 py-1 rounded capitalize ${getDifficultyColor(interview.difficulty)}`}>
                {interview.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">
                {interview.duration} mins • {new Date(interview.date).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-3">{interview.feedback}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
