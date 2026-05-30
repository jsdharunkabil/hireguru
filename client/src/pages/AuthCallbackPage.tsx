import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import api from '../api/axios'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('name')
    const email = params.get('email')
    const id = params.get('id')

    if (name && email && id) {
      // Exchange httpOnly cookie for token
      api.get('/auth/google/token', { withCredentials: true })
        .then(({ data }) => {
          setAuth(data.token, {
            id,
            name: decodeURIComponent(name),
            email: decodeURIComponent(email),
          })
          navigate('/dashboard')
        })
        .catch(() => navigate('/login'))
    } else {
      navigate('/login')
    }
  }, [navigate, setAuth])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#6c63ff', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Signing you in with Google...</p>
    </div>
  )
}