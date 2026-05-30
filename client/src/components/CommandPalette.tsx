import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: '🏠', path: '/dashboard' },
  { id: 'score', label: 'Score my resume', icon: '✨', path: '/score' },
  { id: 'history', label: 'View score history', icon: '📊', path: '/score/history' },
  { id: 'interview', label: 'Start mock interview', icon: '🎤', path: '/interview' },
  { id: 'roadmap', label: 'Generate 90-day roadmap', icon: '🗺️', path: '/roadmap' },
  { id: 'tips', label: 'Get resume tips', icon: '💡', path: '/tips' },
  { id: 'jd', label: 'JD Templates', icon: '📋', path: '/jd-templates' },
  { id: 'profile', label: 'Edit profile', icon: '👤', path: '/profile' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const token = useAuthStore(s => s.token)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = useCallback((path: string) => {
    navigate(path)
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }, [navigate])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen(prev => !prev)
      setQuery('')
      setActiveIndex(0)
      return
    }
    if (!open) return
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(prev => (prev + 1) % filtered.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(prev => (prev - 1 + filtered.length) % filtered.length) }
    if (e.key === 'Enter' && filtered[activeIndex]) handleSelect(filtered[activeIndex].path)
  }, [open, filtered, activeIndex, handleSelect])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!token || !open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 80, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      }}
      onClick={() => setOpen(false)}>
      <div
        style={{
          width: '100%', maxWidth: 520,
          borderRadius: 18, overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
        onClick={e => e.stopPropagation()}>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
            placeholder="Type a command or search..."
            style={{ flex: 1, background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--text)', border: 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')}
              style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-input)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>
              clear
            </button>
          )}
          <kbd style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 340, overflowY: 'auto', padding: '6px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No commands found for "{query}"</p>
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd.path)}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 12, padding: '10px 16px', textAlign: 'left',
                  border: 'none', cursor: 'pointer', transition: 'background .1s',
                  background: i === activeIndex ? 'var(--bg-input)' : 'transparent',
                  borderLeft: `3px solid ${i === activeIndex ? '#6c63ff' : 'transparent'}`,
                }}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{cmd.icon}</span>
                <span style={{ fontSize: 13, flex: 1, color: 'var(--text)', fontWeight: i === activeIndex ? 500 : 400 }}>
                  {cmd.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cmd.path}</span>
                {i === activeIndex && (
                  <kbd style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: 'rgba(108,99,255,0.15)', color: '#6c63ff', border: 'none' }}>↵</kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-input)' }}>
          {[['↑↓', 'navigate'], ['↵', 'select'], ['⌘K', 'toggle']].map(([key, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <kbd style={{ padding: '2px 6px', borderRadius: 5, fontSize: 11, background: 'var(--border)', color: 'var(--text-muted)' }}>{key}</kbd>
              {label}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} command{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}