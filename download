import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError('E-mail ou senha incorretos.')
    setLoading(false)
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="noise" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, background: '#25D366', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(37,211,102,0.3)'
          }}>💬</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
            LinkZap
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 6 }}>
            Painel administrativo
          </p>
        </div>

        {/* Card */}
        <div className="card card-shine" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label className="label">E-mail</label>
              <input
                className={`input ${error ? 'error' : ''}`}
                type="email"
                placeholder="admin@seusite.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label">Senha</label>
              <input
                className={`input ${error ? 'error' : ''}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {error && <p className="field-error">{error}</p>}
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? <span className="spinner" /> : 'Entrar no painel →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          Crie seu usuário em Supabase → Authentication → Users
        </p>
      </div>
    </div>
  )
}
