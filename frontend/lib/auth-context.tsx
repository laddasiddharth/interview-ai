'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '@/lib/config'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt?: string
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
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setUser({
              id: String(data.id),
              name: data.full_name || data.email.split('@')[0],
              email: data.email,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
              createdAt: data.created_at,
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

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })

      if (!res.ok) throw new Error('Login failed')
      
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      
      // Fetch user profile
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
      })
      const meData = await meRes.json()
      
      setUser({
        id: String(meData.id),
        name: meData.full_name || meData.email.split('@')[0],
        email: meData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${meData.email}`,
        createdAt: meData.created_at,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: name })
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
      const res = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`)
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
    setUser(null)
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
