'use client'

import { Card } from '@/components/ui/card'
import { categoryScores } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function CategoryChart() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Score by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryScores}>
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
          <Bar dataKey="score" fill="var(--accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
