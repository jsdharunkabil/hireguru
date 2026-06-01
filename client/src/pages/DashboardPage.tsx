import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'
import PageTransition from '../components/PageTransition'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Resume {
  _id: string; filename: string; s3Url: string; uploadedAt: string; extractedText: string
}

const QUICK_ACTIONS = [
  { icon: '✨', label: 'Score Resume', desc: 'ATS analysis', path: '/score', color: '#6c63ff' },
  { icon: '🎤', label: 'Mock Interview', desc: 'Practice now', path: '/interview', color: '#3ecfcf' },
  { icon: '🗺️', label: '90-Day Plan', desc: 'Learning roadmap', path: '/roadmap', color: '#f59e0b' },
  { icon: '💡', label: 'Resume Tips', desc: 'Role-specific', path: '/tips', color: '#ec4899' },
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
        <Navbar />

        <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,24px)' }}>

          {/* Header */}
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                Welcome back, <span style={{ color: '#6c63ff', fontWeight: 600 }}>{user?.name}</span>
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Your Dashboard
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Upload your resume and get AI-powered career insights
              </p>
            </div>
            <button onClick={handleLogout}
              style={{ fontSize: 13, padding: '8px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Logout
            </button>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 28 }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                style={{ padding: '16px 12px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', boxShadow: 'var(--shadow-card)' }}
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
              borderRadius: 18, padding: 'clamp(24px,5vw,40px) 24px',
              textAlign: 'center', cursor: 'pointer', marginBottom: 28,
              background: dragging ? 'rgba(108,99,255,0.05)' : 'var(--bg-card)',
              transition: 'all .2s', boxShadow: 'var(--shadow-card)',
            }}>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
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
                {[1,2].map(i => <div key={i} style={{ height: 72, borderRadius: 14, background: 'var(--bg-card)', opacity: 0.5 }} />)}
              </div>
            ) : data?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', borderRadius: 18, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>📄</p>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>No resumes yet</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Upload your first resume above</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data?.map(resume => (
                  <div key={resume._id}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', transition: 'border-color .15s', flexWrap: 'wrap' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981', whiteSpace: 'nowrap' }}>
                        Uploaded
                      </span>
                      <button onClick={() => navigate('/score')}
                        style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(108,99,255,0.1)', color: '#6c63ff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Score
                      </button>
                      <a href={resume.s3Url} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-subtle)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        View
                      </a>
                      <button onClick={() => { if (confirm('Delete this resume?')) deleteMutation.mutate(resume._id) }}
                        style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tip bar */}
          <div style={{ marginTop: 28, padding: '14px 18px', borderRadius: 14, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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