'use client'

import { Card } from '@/components/ui/card'
import { performanceData } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
          <Line
            type="monotone"
            dataKey="algorithms"
            name="Algorithms"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="systemDesign"
            name="System Design"
            stroke="#8b5cf6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="machineLearning"
            name="Machine Learning"
            stroke="#10b981"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="behavioral"
            name="Behavioral"
            stroke="#f59e0b"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
