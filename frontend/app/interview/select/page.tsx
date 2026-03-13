'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { interviewQuestions } from '@/lib/interview-questions'
import { Play, Clock, Zap } from 'lucide-react'

export default function InterviewSelectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

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

  const filteredQuestions = selectedDifficulty
    ? interviewQuestions.filter((q) => q.difficulty === selectedDifficulty)
    : interviewQuestions

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      default:
        return ''
    }
  }

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Interview</h1>
          <p className="text-muted-foreground text-lg">Select a question and start practicing</p>
        </div>

        {/* Difficulty Filter */}
        <div className="mb-8 flex gap-3">
          <Button
            variant={selectedDifficulty === null ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty(null)}
          >
            All Questions
          </Button>
          <Button
            variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('easy')}
            className={selectedDifficulty === 'easy' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('medium')}
            className={selectedDifficulty === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
          >
            Medium
          </Button>
          <Button
            variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
            onClick={() => setSelectedDifficulty('hard')}
            className={selectedDifficulty === 'hard' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Hard
          </Button>
        </div>

        {/* Questions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-foreground flex-1">{question.title}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded capitalize whitespace-nowrap ml-2 ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{question.description}</p>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{question.timeLimit} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>{question.category}</span>
                </div>
                {question.company && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <span className="font-semibold">{question.company}</span>
                  </div>
                )}
              </div>

              <Link href={`/interview/room/${question.id}`} className="w-full">
                <Button className="w-full gap-2">
                  <Play className="w-4 h-4" />
                  Start Interview
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
