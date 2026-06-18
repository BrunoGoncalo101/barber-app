// src/pages/barber/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.user, data.token)
      navigate('/barbeiro')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at center, #051525 0%, #050A0F 70%)'
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Botão voltar */}
  <button
    onClick={() => navigate('/')}
    style={{ color: '#556677', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, padding: 0, transition: 'color .2s' }}
    onMouseOver={e => e.target.style.color = '#fff'}
    onMouseOut={e => e.target.style.color = '#556677'}
  >
    ← Voltar
  </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #00BFFF', overflow: 'hidden', margin: '0 auto 16px', boxShadow: '0 0 24px rgba(0,191,255,.2)' }}>
            <img src="/logo.jpeg" alt="El Chapo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>EL CHAPO</h1>
          <p style={{ color: '#556677', fontSize: 13, letterSpacing: '.1em', margin: 0 }}>Painel do barbeiro</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ marginBottom: 4 }}
          />

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="btn-solid"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p style={{ color: '#1a3040', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          © {new Date().getFullYear()} El Chapo Barbearia
        </p>
      </div>
    </div>
  )
}