import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage({ onGoLogin }) {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = () => {
    setError('')
    if (!name || !email || !password || !confirm) { setError('Tous les champs sont obligatoires.'); return }
    if (!email.includes('@')) { setError('Adresse email invalide.'); return }
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }

    setLoading(true)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('dmg_users') || '[]')
      if (users.find(u => u.email === email)) {
        setError('Cet email est déjà utilisé.')
        setLoading(false)
        return
      }
      const newUser = { id: Date.now().toString(), name, email, password }
      register(newUser)
      setLoading(false)
    }, 800)
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

        <div className="auth-title">Créer un compte</div>
        <div className="auth-subtitle">Votre espace personnel de stockage à vie</div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="field-group">
          <label className="field-label">Nom complet</label>
          <input className="field-input" type="text" placeholder="Jean Dupont" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Adresse Gmail</label>
          <input className="field-input" type="email" placeholder="vous@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Mot de passe</label>
          <input className="field-input" type="password" placeholder="Min. 6 caractères" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Confirmer le mot de passe</label>
          <input
            className="field-input" type="password" placeholder="Répétez le mot de passe"
            value={confirm} onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
          />
        </div>

        <button className="btn-primary" onClick={handleRegister} disabled={loading}>
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>

        <div className="auth-footer">
          Déjà un compte ?{' '}
          <span className="auth-link" onClick={onGoLogin}>Se connecter</span>
        </div>
      </div>
    </div>
  )
}
