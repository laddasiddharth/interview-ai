'use client'

import { Card } from '@/components/ui/card'
import { performanceData } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceChartProps {
  data: Array<{ date: string; score: number }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Performance Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--muted-foreground)" 
            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name="Overall Score"
            stroke="var(--accent)"
            dot={{ fill: 'var(--accent)', r: 5 }}
            activeDot={{ r: 7 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
