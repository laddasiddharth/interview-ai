'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { getQuestionById } from '@/lib/interview-questions'
import { CodeEditor } from '@/components/code-editor'
import { Clock, ChevronLeft, AlertCircle, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Message = { role: 'user' | 'assistant'; content: string }

export default function InterviewRoomPage() {
  const params = useParams()
  const questionId = params.id as string
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI interviewer. I will be evaluating your problem solving, concept clarity, and communication. Please start by explaining your approach before you write code.' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  const question = getQuestionById(questionId)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages])

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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const newMessages = [...messages, { role: 'user' as const, content: chatInput }]
    setMessages(newMessages)
    setChatInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          questionTitle: question?.title,
          questionDescription: question?.description
        })
      })
      const data = await res.json()
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting." }])
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, an error occurred." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = async (submittedCode: string) => {
    setCode(submittedCode)
    setIsTyping(true)
    
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: submittedCode,
          messages,
          questionTitle: question?.title,
          questionDescription: question?.description
        })
      })
      const data = await res.json()
      setEvaluation({
        clarity: data.clarity || 0,
        quality: data.quality || 0,
        complexity: data.complexity || 0,
        overall: data.overall || 0,
        feedback: data.feedback || "Evaluation complete.",
        nextDifficulty: data.nextDifficulty || "medium"
      })
    } catch (e) {
      setEvaluation({
        clarity: 5,
        quality: 5,
        complexity: 5,
        overall: 50,
        feedback: "Could not retrieve evaluation.",
        nextDifficulty: "medium"
      })
    } finally {
      setIsTyping(false)
      setSubmitted(true)
    }
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Detailed AI Interview Report</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-accent mb-2">Code Quality: {evaluation?.quality}/10</h3>
                  <p className="text-sm text-muted-foreground">Your solution is structured reasonably well.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">Time Complexity: {evaluation?.complexity}/10</h3>
                  <p className="text-sm text-muted-foreground">{evaluation?.complexity > 7 ? 'Optimal approach demonstrated.' : 'Could be improved for better efficiency.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">Concept Clarity & Communication: {evaluation?.clarity}/10</h3>
                  <p className="text-sm text-muted-foreground">{evaluation?.clarity > 7 ? 'Great job explaining your thoughts.' : 'Try to explain the algorithm more clearly during coding.'}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mt-6">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Overall Score: {evaluation?.overall}%</p>
                  <p className="text-sm text-green-800 dark:text-green-300 mb-2">{evaluation?.feedback}</p>
                  {evaluation?.overall > 80 ? (
                    <p className="text-xs font-semibold text-accent mt-2">🌟 Adaptive Difficulty: You nailed this! Next time, try a {evaluation?.nextDifficulty} question.</p>
                  ) : (
                    <p className="text-xs font-semibold text-orange-500 mt-2">📉 Adaptive Difficulty: Consider practicing {evaluation?.nextDifficulty} questions before moving up.</p>
                  )}
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
          {/* Left Panel - Problem Description & Chat */}
          <div className="w-full md:w-1/2 border-r border-border bg-card flex flex-col">
            {/* Problem Area (scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 border-b border-border">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Problem</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{question.description}</p>
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
                    <strong>Tip:</strong> Think out loud! Discuss your approach with the AI Interviewer below before coding.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="h-1/2 flex flex-col bg-muted/20">
              <div className="p-3 border-b border-border bg-card flex items-center justify-between">
                <h3 className="font-semibold text-foreground">AI Interviewer Chat</h3>
              </div>
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-muted-foreground mb-1 px-1">
                      {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                    </span>
                    <div className={`px-4 py-2 rounded-xl max-w-[85%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-accent text-accent-foreground rounded-br-none' 
                        : 'bg-card border border-border text-foreground rounded-bl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex flex-col items-start px-2">
                     <span className="text-xs text-muted-foreground mb-1 px-1">AI Interviewer</span>
                     <div className="px-4 py-2 rounded-xl bg-card border border-border text-foreground rounded-bl-none shadow-sm text-sm flex gap-1">
                        <span className="animate-bounce inline-block">.</span>
                        <span className="animate-bounce inline-block delay-100">.</span>
                        <span className="animate-bounce inline-block delay-200">.</span>
                     </div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-card border-t border-border mt-auto">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Explain your approach..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage()
                    }}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!chatInput.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
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
