export interface Question {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'Algorithms' | 'System Design' | 'Machine Learning' | 'Behavioral' | 'Frontend'
  subCategory?: string
  timeLimit: number
  examples: string[]
  company?: string
}

export const interviewQuestions: Question[] = [
  {
    id: 'q1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
    difficulty: 'easy',
    category: 'Algorithms',
    subCategory: 'Arrays',
    timeLimit: 15,
    examples: [
      'Input: nums = [2,7,11,15], target = 9 → Output: [0,1]',
      'Input: nums = [3,2,4], target = 6 → Output: [1,2]',
    ],
    company: 'Google',
  },
  {
    id: 'sd1',
    title: 'Design a URL Shortener',
    description: 'Design a service like TinyURL. Discuss scaling, database schema, and handling high availability.',
    difficulty: 'medium',
    category: 'System Design',
    subCategory: 'System Architecture',
    timeLimit: 45,
    examples: [
      'Focus on: APIs, Storage (SQL vs NoSQL), Caching, Load Balancing',
      'Explain how your system handles 10M writes per day.'
    ],
    company: 'Facebook',
  },
  {
    id: 'ml1',
    title: 'Recommendation System',
    description: 'Design a recommendation system for an e-commerce platform. Discuss the features, models, and cold-start problem.',
    difficulty: 'hard',
    category: 'Machine Learning',
    subCategory: 'Recommendation Systems',
    timeLimit: 40,
    examples: [
      'Focus on: Collaborative Filtering, Content-based Filtering',
      'Discuss metrics: Precision, Recall, NDCG'
    ],
    company: 'Amazon',
  },
  {
    id: 'q6',
    title: 'Word Ladder',
    description: 'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord.',
    difficulty: 'hard',
    category: 'Algorithms',
    subCategory: 'Graphs',
    timeLimit: 50,
    examples: [
      'Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"] → Output: 5',
    ],
    company: 'Meta',
  },
]

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
  return interviewQuestions.filter((q) => q.difficulty === difficulty)
}

export function getQuestionsByCategory(category: string) {
  return interviewQuestions.filter((q) => q.category === category)
}

export function getQuestionById(id: string) {
  return interviewQuestions.find((q) => q.id === id)
}
