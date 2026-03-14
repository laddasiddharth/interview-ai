'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { CodeEditor } from '@/components/code-editor'
import { Clock, ChevronLeft, AlertCircle, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Message = { role: 'user' | 'assistant'; content: string }

export default function InterviewRoomPage() {
  const params = useParams()
  const questionId = params.id as string
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [timeLeft, setTimeLeft] = useState<number | null>(7200)
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [topic, setTopic] = useState<string | null>(null)
  const [question, setQuestion] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI interviewer. I will be evaluating your problem solving, concept clarity, and communication. Please start by explaining your approach before you write code.' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)

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
    const fetchInterviewData = async () => {
      try {
        const token = localStorage.getItem('token')
        const reportRes = await fetch(`http://localhost:8000/interview/report/${questionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!reportRes.ok) throw new Error('Failed to fetch report')
        const reportData = await reportRes.json()
        setTopic(reportData.topic)
        // Set previous messages if they exist
        if (reportData.answers && reportData.answers.length > 0) {
          const pastMessages: Message[] = []
          reportData.answers.forEach((ans: any) => {
             pastMessages.push({ role: 'user', content: ans.answer_text })
             pastMessages.push({ role: 'assistant', content: `Score: ${ans.score}/100\nFeedback: ${ans.feedback}\nFollow-up: ${ans.follow_up_question || 'None'}` })
          })
          setMessages([
            { role: 'assistant', content: 'Hello! I am your AI interviewer. I will be evaluating your problem solving, concept clarity, and communication. Please start by explaining your approach before you write code.' },
            ...pastMessages
          ])
        }

        if (!question) {
          const qRes = await fetch(`http://localhost:8000/interview/question?topic=${encodeURIComponent(reportData.topic)}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (qRes.ok) {
            const qData = await qRes.json()
            setQuestion(qData.question)
            setDifficulty(qData.difficulty)
          }
        }
      } catch(e) {
        console.error(e)
      }
    }
    if (user && questionId) {
      fetchInterviewData()
    }
  }, [user, questionId])

  useEffect(() => {
    if (!topic) return

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
  }, [topic])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!question && topic) {
    // Wait until it loads completely. Can show skeleton.
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isTimeWarning = timeLeft !== null && timeLeft < 300 && timeLeft > 0

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: chatInput }])
    setChatInput('')
  }

  const handleSubmit = async (submittedCode: string) => {
    setCode(submittedCode)
    setIsTyping(true)

    const finalAnswerText = (chatInput ? chatInput + "\n" : "") + submittedCode

    const newMessages = [...messages]
    if (chatInput.trim()) {
      newMessages.push({ role: 'user', content: chatInput })
      setMessages(newMessages)
      setChatInput('')
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8000/interview/answer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          interview_id: Number(questionId),
          question_text: question,
          answer_text: finalAnswerText
        })
      })
      const data = await res.json()
      
      const assistantMessage = `Score: ${data.score}/100\nFeedback: ${data.feedback}\nFollow-up: ${data.follow_up_question || 'None'}`
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])

      setEvaluation({
        overall: data.score,
        feedback: data.feedback,
        follow_up_question: data.follow_up_question
      })
    } catch (e) {
      console.error(e)
      setEvaluation({
        overall: 0,
        feedback: "Could not retrieve evaluation.",
      })
      setMessages([...newMessages, { role: 'assistant', content: "An error occurred." }])
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
            <Card className="p-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">Interview Completed</h1>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Topic: {topic}</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{question}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-accent/5 border border-accent/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">Detailed AI Interview Report</h2>
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 mt-6">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Overall Score: {evaluation?.overall}/100</p>
                  <p className="text-sm text-green-800 dark:text-green-300 mb-2">{evaluation?.feedback}</p>
                </div>
                {evaluation?.follow_up_question && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-accent">Next Step: {evaluation.follow_up_question}</p>
                  </div>
                )}
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

          <h1 className="text-xl font-bold text-foreground">{topic || 'Loading...'} Interview</h1>

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
                  {question ? (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{question}</p>
                  ) : (
                    <p className="text-muted-foreground animate-pulse">Loading question...</p>
                  )}
                </div>

                {difficulty && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Difficulty: {difficulty}</h3>
                  </div>
                )}

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
                        : 'bg-card border border-border text-foreground rounded-bl-none shadow-sm whitespace-pre-wrap'
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

