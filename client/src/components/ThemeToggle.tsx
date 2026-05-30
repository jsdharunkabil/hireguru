import { useThemeStore } from '../store/theme.store'
import { useEffect } from 'react'

export default function ThemeToggle() {
  const { isDark, toggle } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.body.style.background = isDark ? '#0d0d1a' : '#f0f0f7'
  }, [isDark])

  return (
    <button onClick={toggle}
      style={{
        padding: '6px 10px', borderRadius: 8, fontSize: 15,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'all .2s', boxShadow: 'var(--shadow-card)',
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}