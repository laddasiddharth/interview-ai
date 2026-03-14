'use client'

import { Card } from '@/components/ui/card'
import { categoryScores } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CategoryChartProps {
  topics: Record<string, number>
}

export function CategoryChart({ topics }: CategoryChartProps) {
  const data = Object.entries(topics).map(([name, count]) => ({
    name,
    count
  }))

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Interviews by Topic</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Bar dataKey="count" name="Interviews" fill="var(--accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
