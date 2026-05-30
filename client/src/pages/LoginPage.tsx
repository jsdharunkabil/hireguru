import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'
import PageTransition from '../components/PageTransition'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'radial-gradient(ellipse at 60% 0%, #1a1a2e 0%, var(--bg) 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative blobs */}
        <div style={{
          position: 'fixed', top: 0, right: 0,
          width: 400, height: 400, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)',
          opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed', bottom: 0, left: 0,
          width: 300, height: 300, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff6584, #6c63ff)',
          opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>H</span>
              </div>
              <span style={{
                fontSize: 22, fontWeight: 700,
                fontFamily: 'var(--font-display)', color: 'var(--text)',
              }}>HireGuru</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 32,
              fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2,
            }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Sign in to continue your journey
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: '32px 28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
          }}>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 20, padding: '12px 16px', borderRadius: 12, fontSize: 13,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ff8080', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>&#9888;</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'var(--text-muted)', marginBottom: 8,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
                    background: 'var(--bg-input)', border: '1px solid var(--border)',
                    color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.borderColor = '#6c63ff')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 8,
                }}>
                  <label style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    style={{
                      fontSize: 12, color: '#6c63ff', background: 'none',
                      border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
                    background: 'var(--bg-input)', border: '1px solid var(--border)',
                    color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.borderColor = '#6c63ff')}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12, fontSize: 14,
                  fontWeight: 600, border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading
                    ? 'rgba(108,99,255,0.4)'
                    : 'linear-gradient(135deg, #6c63ff, #3ecfcf)',
                  color: 'white', transition: 'opacity 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(108,99,255,0.4)',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!loading) e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              </button>

            </form>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 12, margin: '20px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Google ✅ <a tag was missing before */}
            <a
              href="http://localhost:5000/api/auth/google"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, width: '100%', padding: '12px', borderRadius: 12,
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
                background: 'var(--bg-input)', border: '1px solid var(--border)',
                color: 'var(--text)', transition: 'border-color 0.2s, background 0.2s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.borderColor = '#6c63ff'
                e.currentTarget.style.background = 'rgba(108,99,255,0.06)'
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--bg-input)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </a>

            {/* Register link */}
            <p style={{
              textAlign: 'center', fontSize: 13,
              color: 'var(--text-muted)', marginTop: 24,
            }}>
              <span>Don't have an account? </span>
              <Link to="/register" style={{
                color: '#6c63ff', fontWeight: 600, textDecoration: 'none',
              }}>
                Create one free
              </Link>
            </p>

          </div>
        </div>
      </div>
    </PageTransition>
  )
}