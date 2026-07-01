import { useState } from 'react'

// In a real app, this would be a securely generated, time-limited code sent by a backend email service.
const MOCK_CODE = '145872'

export default function ResetPage({ onGoLogin }) {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('request') // request | sent | reset
  const [code, setCode] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleRequest = () => {
    setError('')
    if (!email || !email.includes('@')) { setError('Email invalide.'); return }
    setStep('sent')
  }

  const handleVerify = () => {
    setError('')
    if (code !== MOCK_CODE) { setError('Code incorrect. (Indice : ' + MOCK_CODE + ')'); return }
    setStep('reset')
  }

  const handleReset = () => {
    setError('')
    if (newPwd.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    const users = JSON.parse(localStorage.getItem('dmg_users') || '[]')
    const idx = users.findIndex(u => u.email === email)
    if (idx >= 0) {
      users[idx].password = newPwd
      localStorage.setItem('dmg_users', JSON.stringify(users))
    }
    setSuccess(true)
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

        {!success ? (
          <>
            <div className="auth-title">
              {step === 'request' ? 'Réinitialiser 🔑' : step === 'sent' ? 'Vérifier le code 📧' : 'Nouveau mot de passe'}
            </div>
            <div className="auth-subtitle">
              {step === 'request'
                ? 'Entrez votre email pour recevoir un code'
                : step === 'sent'
                ? `Code envoyé à ${email}`
                : 'Choisissez un nouveau mot de passe sécurisé'}
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {step === 'request' && (
              <>
                <div className="field-group">
                  <label className="field-label">Adresse email</label>
                  <input
                    className="field-input" type="email" placeholder="vous@gmail.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRequest()}
                  />
                </div>
                <button className="btn-primary" onClick={handleRequest}>Envoyer le code</button>
              </>
            )}

            {step === 'sent' && (
              <>
                <div className="field-group">
                  <label className="field-label">Code de vérification</label>
                  <input
                    className="field-input" type="text" placeholder="6 chiffres" maxLength={6}
                    value={code} onChange={e => setCode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  />
                </div>
                <button className="btn-primary" onClick={handleVerify}>Vérifier</button>
              </>
            )}

            {step === 'reset' && (
              <>
                <div className="field-group">
                  <label className="field-label">Nouveau mot de passe</label>
                  <input
                    className="field-input" type="password" placeholder="Min. 6 caractères"
                    value={newPwd} onChange={e => setNewPwd(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                  />
                </div>
                <button className="btn-primary" onClick={handleReset}>Réinitialiser</button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="alert alert-success">✅ Mot de passe réinitialisé avec succès !</div>
            <button className="btn-primary" onClick={onGoLogin}>Se connecter maintenant</button>
          </>
        )}

        <div className="auth-footer">
          <span className="auth-link" onClick={onGoLogin}>← Retour à la connexion</span>
        </div>
      </div>
    </div>
  )
}
