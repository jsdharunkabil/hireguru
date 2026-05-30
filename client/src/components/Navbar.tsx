import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Score', path: '/score' },
  { label: 'History', path: '/score/history' },
  { label: 'Interview', path: '/interview' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Tips', path: '/tips' },
  { label: 'JD Templates', path: '/jd-templates' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 1px 0 var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(108,99,255,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>H</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
            HireGuru
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(l => {
            const active = location.pathname === l.path
            return (
              <button key={l.path} onClick={() => navigate(l.path)}
                style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 13, border: 'none', cursor: 'pointer',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#6c63ff' : 'var(--text-muted)',
                  background: active ? 'rgba(108,99,255,0.08)' : 'transparent',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text)' }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}}>
                {l.label}
              </button>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <button onClick={() => navigate('/profile')}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14, boxShadow: '0 2px 8px rgba(108,99,255,0.3)' }}
            title={user?.name}>
            {user?.name?.charAt(0).toUpperCase()}
          </button>
          <button onClick={() => { logout(); navigate('/login') }}
            style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', fontWeight: 500 }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}