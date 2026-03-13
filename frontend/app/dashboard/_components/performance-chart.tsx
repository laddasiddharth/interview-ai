'use client'

import { Card } from '@/components/ui/card'
import { performanceData } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function PerformanceChart() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Performance Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Line
            type="monotone"
            dataKey="score"
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
