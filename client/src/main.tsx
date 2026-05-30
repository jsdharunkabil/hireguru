import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

// Apply saved theme on startup
const saved = localStorage.getItem('hireguru-theme')
const isDark = saved ? JSON.parse(saved)?.state?.isDark : false
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
document.body.style.background = isDark ? '#0d0d1a' : '#f0f0f7'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: isDark ? '#1a1a2e' : '#ffffff',
              color: isDark ? 'var(--text)' : '#1a1a2e',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#3ecfcf', secondary: isDark ? '#1a1a2e' : '#ffffff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: isDark ? '#1a1a2e' : '#ffffff' } },
            duration: 3000,
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)