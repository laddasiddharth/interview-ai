
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Play, Code, Database, Brain, Users } from "lucide-react"

const topics = [
  { id: "Algorithms", title: "Algorithms & Data Structures", icon: Code, desc: "Practice core computer science concepts." },
  { id: "Database", title: "Database & SQL", icon: Database, desc: "Master database querying and table manipulation techniques." },
  { id: "Machine Learning", title: "Machine Learning", icon: Brain, desc: "Test your knowledge on AI, ML algorithms, and deep learning." },
  { id: "Behavioral", title: "Behavioral", icon: Users, desc: "Prepare for culture fit and past experience discussions." }
]

export default function InterviewSelectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [startingTopic, setStartingTopic] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const startInterview = async (topic: string) => {
    try {
      setStartingTopic(topic)
      const res = await fetch("http://localhost:8000/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ topic }),
      })
      if (!res.ok) throw new Error("Failed to start interview")
      const data = await res.json()
      router.push(`/interview/room/${data.id}`)
    } catch (e) {
      console.error(e)
      setStartingTopic(null)
    }
  }

  return (
    <main className="pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Interview Topic</h1>
          <p className="text-muted-foreground text-lg">Select a topic to generate a dynamic AI interview session</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="p-8 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-6">
                <topic.icon className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{topic.title}</h2>
              <p className="text-muted-foreground mb-8 flex-1">{topic.desc}</p>

              <Button
                className="w-full gap-2 text-lg py-6"
                onClick={() => startInterview(topic.id)}
                disabled={startingTopic !== null}
              >
                {startingTopic === topic.id ? "Starting..." : <> <Play className="w-5 h-5" /> Start {topic.id} Session</>}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
