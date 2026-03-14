'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  checkEmail: (email: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await fetch('http://localhost:8000/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setUser({
              id: String(data.id),
              name: data.email.split('@')[0],
              email: data.email,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
            })
          } else {
            localStorage.removeItem('token')
          }
        } catch (error) {
          console.error('Auth error', error)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })

      if (!res.ok) throw new Error('Login failed')
      
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      
      // Fetch user profile
      const meRes = await fetch('http://localhost:8000/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      })
      const meData = await meRes.json()
      
      setUser({
        id: String(meData.id),
        name: meData.email.split('@')[0],
        email: meData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${meData.email}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!res.ok) throw new Error('Signup failed')
        
      // Log them in automatically after signup
      await login(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const checkEmail = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(`http://localhost:8000/auth/check-email?email=${encodeURIComponent(email)}`)
      if (!res.ok) return false
      const data = await res.json()
      return data.exists
    } catch (error) {
      console.error('Check email error', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, checkEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
