import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem('dmg_session')
    if (session) {
      try { setUser(JSON.parse(session)) } catch (_) {}
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('dmg_session', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dmg_session')
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('dmg_users') || '[]')
    users.push(userData)
    localStorage.setItem('dmg_users', JSON.stringify(users))
    login(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
