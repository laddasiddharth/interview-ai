export interface Interview {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  date: Date
  score: number
  feedback: string
  company?: string
}

export interface InterviewMetrics {
  totalInterviews: number
  averageScore: number
  bestScore: number
  weakAreas: string[]
  strongAreas: string[]
}

export const mockInterviews: Interview[] = [
  {
    id: '1',
    title: 'Two Sum Problem',
    difficulty: 'easy',
    duration: 15,
    date: new Date('2024-03-12'),
    score: 92,
    feedback: 'Great solution with optimal time complexity. Consider edge cases earlier.',
    company: 'Google',
  },
  {
    id: '2',
    title: 'Binary Search Tree Operations',
    difficulty: 'medium',
    duration: 35,
    date: new Date('2024-03-11'),
    score: 78,
    feedback: 'Good understanding of tree structure. Work on traversal efficiency.',
    company: 'Microsoft',
  },
  {
    id: '3',
    title: 'Graph Algorithms - DFS',
    difficulty: 'hard',
    duration: 50,
    date: new Date('2024-03-10'),
    score: 65,
    feedback: 'Need more practice with complex graph patterns. Keep practicing!',
  },
  {
    id: '4',
    title: 'Array Manipulation',
    difficulty: 'easy',
    duration: 20,
    date: new Date('2024-03-09'),
    score: 88,
    feedback: 'Excellent approach. Communication could be clearer.',
    company: 'Amazon',
  },
  {
    id: '5',
    title: 'Linked List Reversal',
    difficulty: 'medium',
    duration: 25,
    date: new Date('2024-03-08'),
    score: 85,
    feedback: 'Good solution. Next time explain your approach first.',
    company: 'Meta',
  },
  {
    id: '6',
    title: 'Dynamic Programming Optimization',
    difficulty: 'hard',
    duration: 55,
    date: new Date('2024-03-07'),
    score: 72,
    feedback: 'Strong fundamentals. DP optimization needs more work.',
  },
]

export const mockMetrics: InterviewMetrics = {
  totalInterviews: 23,
  averageScore: 82,
  bestScore: 95,
  weakAreas: ['Behavioral', 'Machine Learning'],
  strongAreas: ['Algorithms', 'System Design'],
}

export const performanceData = [
  { name: 'Week 1', score: 65, algorithms: 70, systemDesign: 60, machineLearning: 65, behavioral: 60 },
  { name: 'Week 2', score: 68, algorithms: 75, systemDesign: 65, machineLearning: 65, behavioral: 65 },
  { name: 'Week 3', score: 72, algorithms: 78, systemDesign: 70, machineLearning: 70, behavioral: 68 },
  { name: 'Week 4', score: 76, algorithms: 82, systemDesign: 75, machineLearning: 72, behavioral: 70 },
  { name: 'Week 5', score: 79, algorithms: 85, systemDesign: 78, machineLearning: 75, behavioral: 72 },
  { name: 'Week 6', score: 82, algorithms: 88, systemDesign: 82, machineLearning: 78, behavioral: 75 },
  { name: 'Week 7', score: 85, algorithms: 90, systemDesign: 85, machineLearning: 80, behavioral: 78 },
  { name: 'Week 8', score: 88, algorithms: 92, systemDesign: 88, machineLearning: 82, behavioral: 80 },
]

export const difficultyDistribution = [
  { name: 'Easy', value: 6, fill: '#3b82f6' },
  { name: 'Medium', value: 10, fill: '#8b5cf6' },
  { name: 'Hard', value: 7, fill: '#06b6d4' },
]

export const categoryScores = [
  { name: 'Algorithms', score: 92 },
  { name: 'System Design', score: 88 },
  { name: 'Machine Learning', score: 82 },
  { name: 'Behavioral', score: 80 },
]
