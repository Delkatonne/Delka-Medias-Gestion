import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ onGoRegister, onGoReset }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError('')
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('dmg_users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      if (user) { login(user) }
      else { setError('Email ou mot de passe incorrect.') }
      setLoading(false)
    }, 700)
  }

  const handleGoogleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      const mockUser = { name: 'Utilisateur Google', email: 'user@gmail.com', id: 'google_1' }
      const users = JSON.parse(localStorage.getItem('dmg_users') || '[]')
      if (!users.find(u => u.email === mockUser.email)) {
        users.push({ ...mockUser, password: '' })
        localStorage.setItem('dmg_users', JSON.stringify(users))
      }
      login(mockUser)
      setLoading(false)
    }, 900)
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="brand-logo">
          <div className="brand-icon">📁</div>
          <div>
            <div className="brand-name">Delka Médias</div>
            <div className="brand-sub">Gestion</div>
          </div>
        </div>

        <div className="auth-title">Bon retour 👋</div>
        <div className="auth-subtitle">Connectez-vous pour accéder à vos médias</div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26 9.77A7.3 7.3 0 0 1 12 4.73c1.94 0 3.68.7 5.03 1.84l3.74-3.74A12.26 12.26 0 0 0 12 0C7.37 0 3.36 2.7 1.38 6.65l3.88 3.12Z"/>
            <path fill="#34A853" d="M16.04 18.01A7.25 7.25 0 0 1 12 19.27c-2.96 0-5.5-1.77-6.73-4.33l-3.9 3.01C3.27 21.25 7.34 24 12 24c2.95 0 5.77-1.02 7.89-2.87l-3.85-3.12Z"/>
            <path fill="#FBBC05" d="M19.89 21.13C22.37 18.85 24 15.6 24 12c0-.9-.1-1.78-.28-2.62H12v5.25h6.74a5.82 5.82 0 0 1-2.85 3.38l3.99 3.12Z"/>
            <path fill="#EA4335" d="M5.27 14.94A7.3 7.3 0 0 1 4.73 12c0-1.01.18-1.99.5-2.9L1.38 6.65A12.2 12.2 0 0 0 0 12c0 1.92.44 3.74 1.22 5.37l4.05-2.43Z"/>
          </svg>
          Continuer avec Gmail
        </button>

        <div className="divider">ou avec votre email</div>

        <div className="field-group">
          <label className="field-label">Adresse email</label>
          <input
            className="field-input" type="email" placeholder="vous@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="field-group">
          <label className="field-label">Mot de passe</label>
          <input
            className="field-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
          <span className="auth-link" onClick={onGoReset}>Mot de passe oublié ?</span>
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="auth-footer">
          Pas encore de compte ?{' '}
          <span className="auth-link" onClick={onGoRegister}>Créer un compte</span>
        </div>
      </div>
    </div>
  )
}
