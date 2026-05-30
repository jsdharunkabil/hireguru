import React from 'react'

interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>⚠️</p>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>An unexpected error occurred.</p>
        <button onClick={() => window.location.href = '/dashboard'}
          style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white', border: 'none', cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    )
    return this.props.children
  }
}