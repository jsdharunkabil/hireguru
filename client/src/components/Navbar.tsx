import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        {/* Main bar */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => { navigate('/dashboard'); setMenuOpen(false) }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(108,99,255,0.3)' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>H</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>
              HireGuru
            </span>
          </div>

          {/* Desktop nav */}
          <div className="desktop-only" style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => {
              const active = location.pathname === l.path
              return (
                <button key={l.path} onClick={() => navigate(l.path)}
                  style={{
                    padding: '6px 10px', borderRadius: 8, fontSize: 13,
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <ThemeToggle />
            <button onClick={() => { navigate('/profile'); setMenuOpen(false) }}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 13, boxShadow: '0 2px 8px rgba(108,99,255,0.3)', flexShrink: 0 }}
              title={user?.name}>
              {user?.name?.charAt(0).toUpperCase()}
            </button>
            {/* Desktop logout */}
            <button onClick={() => { logout(); navigate('/login') }}
              className="desktop-only"
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Logout
            </button>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-only"
              style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              <div style={{ width: 16, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <div style={{ width: 16, height: 2, background: 'var(--text)', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity .2s' }} />
              <div style={{ width: 16, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="mobile-only" style={{ flexDirection: 'column', borderTop: '1px solid var(--border)', paddingBottom: 12, gap: 2 }}>
            {NAV_LINKS.map(l => {
              const active = location.pathname === l.path
              return (
                <button key={l.path}
                  onClick={() => { navigate(l.path); setMenuOpen(false) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '12px 8px', borderRadius: 8,
                    fontSize: 14, border: 'none', cursor: 'pointer',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#6c63ff' : 'var(--text)',
                    background: active ? 'rgba(108,99,255,0.08)' : 'transparent',
                  }}>
                  {l.label}
                </button>
              )
            })}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <button onClick={() => { logout(); navigate('/login'); setMenuOpen(false) }}
              style={{ width: '100%', textAlign: 'left', padding: '12px 8px', borderRadius: 8, fontSize: 14, border: 'none', cursor: 'pointer', color: '#ef4444', background: 'transparent', fontWeight: 500 }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}