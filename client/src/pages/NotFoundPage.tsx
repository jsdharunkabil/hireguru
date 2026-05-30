import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <p className="text-8xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </p>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Page not found
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          This page doesn't exist or was moved.
        </p>
        <button onClick={() => navigate('/dashboard')}
          className="px-8 py-3 rounded-xl font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)', color: 'white' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
  <PageTransition>
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      ...
    </div>
  </PageTransition>
)
}