import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'
import PageTransition from '../components/PageTransition'
import ThemeToggle from '../components/ThemeToggle'
import Footer from '../components/Footer'

interface Resume {
  _id: string; filename: string; s3Url: string; uploadedAt: string; extractedText: string
}

const NAV_LINKS = [
  { label: 'Score', path: '/score' },
  { label: 'History', path: '/score/history' },
  { label: 'Interview', path: '/interview' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Tips', path: '/tips' },
  { label: 'JD Templates', path: '/jd-templates' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  

  const { data, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const { data } = await api.get('/resumes')
      return data.resumes as Resume[]
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume uploaded!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Upload failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume deleted')
    },
    onError: () => toast.error('Delete failed'),
  })

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large — max 5MB'); return }
    uploadMutation.mutate(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        {/* Navbar */}
        <nav style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>H</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>HireGuru</span>
            </div>

            {/* Desktop nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
              {NAV_LINKS.map(l => (
                <button key={l.path} onClick={() => navigate(l.path)}
                  style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-input)', e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'var(--text-muted)')}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ThemeToggle />
              <button onClick={() => navigate('/profile')}
                style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 13, fontFamily: 'var(--font-display)' }}
                title={user?.name}>
                {user?.name?.charAt(0).toUpperCase()}
              </button>
              <button onClick={handleLogout}
                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              Welcome back, <span style={{ color: '#6c63ff', fontWeight: 600 }}>{user?.name}</span>
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              Your Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Upload your resume and get AI-powered career insights
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { icon: '✨', label: 'Score Resume', desc: 'ATS analysis', path: '/score', color: '#6c63ff' },
              { icon: '🎤', label: 'Mock Interview', desc: 'Practice now', path: '/interview', color: '#3ecfcf' },
              { icon: '🗺️', label: '90-Day Plan', desc: 'Learning roadmap', path: '/roadmap', color: '#f59e0b' },
              { icon: '💡', label: 'Resume Tips', desc: 'Role-specific', path: '/tips', color: '#ec4899' },
            ].map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                style={{ padding: '16px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2, fontFamily: 'var(--font-display)' }}>{a.label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.desc}</p>
              </button>
            ))}
          </div>

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            style={{
              border: `2px dashed ${dragging ? '#6c63ff' : 'var(--border)'}`,
              borderRadius: 18,
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: 32,
              background: dragging ? 'rgba(108,99,255,0.05)' : 'var(--bg-card)',
              transition: 'all .2s',
            }}>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15v2a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-2" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {uploadMutation.isPending ? (
              <>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>Uploading...</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Processing your PDF</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>Drop your resume here</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>PDF only · max 5MB · click or drag & drop</p>
              </>
            )}
          </div>

          {/* Resume list */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                Your Resumes
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: 'rgba(108,99,255,0.12)', color: '#6c63ff' }}>
                  {data?.length || 0}
                </span>
              </h2>
              <button onClick={() => navigate('/score/history')}
                style={{ fontSize: 12, color: '#6c63ff', background: 'none', border: 'none', cursor: 'pointer' }}>
                View score history →
              </button>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1,2].map(i => (
                  <div key={i} style={{ height: 72, borderRadius: 14, background: 'var(--bg-card)', animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : data?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', borderRadius: 18, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>📄</p>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>No resumes yet</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Upload your first resume above to get started</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data?.map(resume => (
                  <div key={resume._id}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', transition: 'border-color .15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resume.filename}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(62,207,159,0.1)', color: '#3ecfcf' }}>
                        Uploaded
                      </span>
                      <button onClick={() => navigate(`/score`)}
                        style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, background: 'rgba(108,99,255,0.1)', color: '#6c63ff', border: 'none', cursor: 'pointer' }}>
                        Score
                      </button>
                      <a href={resume.s3Url} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-subtle)', textDecoration: 'none' }}>
                        View
                      </a>
                      <button
                        onClick={() => { if (confirm('Delete this resume?')) deleteMutation.mutate(resume._id) }}
                        style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tip bar */}
          <div style={{ marginTop: 32, padding: '14px 18px', borderRadius: 14, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>⌨️</span>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Press <kbd style={{ padding: '2px 6px', borderRadius: 5, background: 'rgba(108,99,255,0.15)', color: '#6c63ff', fontSize: 11 }}>⌘K</kbd> or <kbd style={{ padding: '2px 6px', borderRadius: 5, background: 'rgba(108,99,255,0.15)', color: '#6c63ff', fontSize: 11 }}>Ctrl+K</kbd> to open the command palette
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}