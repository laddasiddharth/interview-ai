import { Card } from '@/components/ui/card'
import { mockMetrics } from '@/lib/mock-data'
import { TrendingUp, Award, Zap, Target } from 'lucide-react'

interface DashboardStatsProps {
  data: {
    total_interviews: number
    average_score: number
    best_score: number
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Interviews Completed',
      value: data.total_interviews,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Average Score',
      value: `${data.average_score}%`,
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Best Score',
      value: `${data.best_score}%`,
      icon: TrendingUp,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'This Week',
      value: data.total_interviews > 0 ? 'Recent' : '0', // Fallback since weekly isn't explicitly in API yet
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
