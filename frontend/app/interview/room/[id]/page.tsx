'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { getQuestionById } from '@/lib/interview-questions'
import { CodeEditor } from '@/components/code-editor'
import { Clock, ChevronLeft, AlertCircle } from 'lucide-react'

export default function InterviewRoomPage() {
  const params = useParams()
  const questionId = params.id as string
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const question = getQuestionById(questionId)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!question) return

    // Initialize timer on mount
    setTimeLeft(question.timeLimit * 60)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [question])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Question not found</h2>
          <p className="text-muted-foreground mb-6">The interview question you're looking for doesn't exist.</p>
          <Link href="/interview/select">
            <Button>Back to Selection</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isTimeWarning = timeLeft !== null && timeLeft < 300 && timeLeft > 0

  const handleSubmit = (submittedCode: string) => {
    setCode(submittedCode)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/interview/select" className="inline-flex items-center gap-2 text-accent hover:underline mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to Selection
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem */}
            <Card className="p-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">{question.title}</h1>
              <p className="text-muted-foreground mb-6">{question.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Examples:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {question.examples.map((example, i) => (
                      <li key={i} className="font-mono bg-muted p-2 rounded">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Feedback */}
            <Card className="p-6 bg-accent/5 border border-accent/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">AI Feedback</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-accent mb-2">Code Quality: 8/10</h3>
                  <p className="text-sm text-muted-foreground">Your solution is well-structured and readable.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">Time Complexity: 9/10</h3>
                  <p className="text-sm text-muted-foreground">Optimal O(n) solution. Great work!</p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">Explanation: 7/10</h3>
                  <p className="text-sm text-muted-foreground">Could have explained the algorithm more clearly during coding.</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mt-6">
                  <p className="font-semibold text-green-700 dark:text-green-400">Overall Score: 82%</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full">Back to Dashboard</Button>
                </Link>
                <Link href="/interview/select" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Next Interview
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Code Review */}
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Your Solution</h2>
            <div className="bg-background p-4 rounded border border-border">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap overflow-x-auto">
                {code}
              </pre>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-full h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/interview/select" className="inline-flex items-center gap-2 text-accent hover:underline">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>

          <h1 className="text-xl font-bold text-foreground">{question.title}</h1>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              isTimeWarning
                ? 'bg-destructive/10 text-destructive'
                : 'bg-accent/10 text-accent'
            }`}
          >
            <Clock className="w-5 h-5" />
            {timeLeft !== null ? formatTime(timeLeft) : '...'}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Problem Description */}
          <div className="w-full md:w-1/2 border-r border-border bg-card overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Problem</h2>
                  <p className="text-muted-foreground leading-relaxed">{question.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Examples:</h3>
                  <div className="space-y-2">
                    {question.examples.map((example, i) => (
                      <div key={i} className="bg-muted p-3 rounded border border-border text-sm font-mono text-foreground">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Tip:</strong> Think out loud! Explain your approach before coding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="hidden md:flex w-1/2 flex-col">
            <CodeEditor onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Mobile Code Editor */}
        <div className="md:hidden border-t border-border bg-card p-4">
          <CodeEditor onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  )
}
