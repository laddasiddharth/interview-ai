'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Terminal } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -top-40 w-[800px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl pt-20">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-accent/30 bg-accent/5 backdrop-blur-md text-accent text-xs font-mono uppercase tracking-widest animate-fade-in-up" 
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            System V2.0 Online
          </div>

          <h1 
            className="text-6xl md:text-8xl font-black mb-6 text-foreground tracking-tighter leading-[0.9] animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            CRACK THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
              ALGORITHM.
            </span>
          </h1>

          <p 
            className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed font-light animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Bypass generic interview prep. Train against an adaptive AI that simulates brutal technical interviews, finds your edge cases, and optimizes your code in real-time.
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-base rounded-none bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                INITIALIZE_SESSION <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-none border-border hover:border-accent hover:bg-accent/5 transition-all duration-300">
                AUTHENTICATE
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Terminal Element */}
        <div 
          className="absolute right-12 bottom-12 hidden lg:flex flex-col w-[400px] border border-border/50 bg-background/40 backdrop-blur-xl p-6 shadow-2xl animate-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
            <Terminal className="w-5 h-5 text-accent" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Live_Analysis_Feed</span>
          </div>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex gap-4"><span className="text-muted-foreground">01</span><span className="text-blue-400">const</span> <span className="text-accent">optimize</span> = (code) =&gt; {'{'}</div>
            <div className="flex gap-4"><span className="text-muted-foreground">02</span>  <span className="text-foreground pl-4">return AI.analyze(code, O_N_TIME)</span></div>
            <div className="flex gap-4"><span className="text-muted-foreground">03</span>{'}'}</div>
            <div className="mt-4 text-xs font-mono text-accent/80 border border-accent/20 p-2 bg-accent/5">
              &gt; Pattern recognized: Sliding Window<br/>
              &gt; Complexity optimized successfully.
            </div>
          </div>
        </div>
      </section>

      {/* Structured Minimal Modules Section */}
      <section className="py-24 border-t border-border/50 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50">
          {/* Module 1 */}
          <div className="bg-background p-10 group hover:bg-muted/20 transition-colors">
            <div className="text-accent font-mono text-sm mb-8">01 — ADAPTIVE AI</div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Evolving Scenarios</h3>
            <p className="text-muted-foreground leading-relaxed">
              The neural engine dynamically adjusts the difficulty of the prompt based on your initial approach, ensuring you are constantly operating at your limit.
            </p>
          </div>

          {/* Module 2 */}
          <div className="bg-background p-10 group hover:bg-muted/20 transition-colors">
            <div className="text-blue-500 font-mono text-sm mb-8">02 — PERFORMANCE</div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Micro-Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every keystroke, pause, and algorithmic decision is mapped. Uncover your cognitive bottlenecks with ruthless precision before real interviews.
            </p>
          </div>

          {/* Module 3 */}
          <div className="bg-background p-10 group hover:bg-muted/20 transition-colors">
            <div className="text-purple-500 font-mono text-sm mb-8">03 — EMULATION</div>
            <h3 className="text-3xl font-bold mb-4 tracking-tight">FAANG Thresholds</h3>
            <p className="text-muted-foreground leading-relaxed">
              Calibrated against modern interview rubrics from top-tier tech companies. We do not just teach you to code; we teach you how to pass the systemic filter.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
