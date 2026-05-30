import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'
interface JDTemplate { _id: string; title: string; company: string; description: string; tags: string[]; createdAt: string }

export default function JDTemplatePage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', company: '', description: '', tags: '' })
  const [copied, setCopied] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['jd-templates'],
    queryFn: async () => { const { data } = await api.get('/jd'); return data.templates as JDTemplate[] },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/jd', { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jd-templates'] })
      setForm({ title: '', company: '', description: '', tags: '' })
      setShowForm(false)
      toast.success('Template saved!')
    },
    onError: () => toast.error('Save failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/jd/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jd-templates'] }); toast.success('Deleted') },
  })

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(null), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none',
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>JD Templates</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Save and reuse job descriptions across sessions</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white', border: 'none', cursor: 'pointer' }}>
              {showForm ? '✕ Cancel' : '+ Save JD'}
            </button>
          </div>

          {/* Save form */}
          {showForm && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 18, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>Save New Template</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Job Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Full Stack Developer" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Company</label>
                  <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Google, Amazon..." style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="react, node, typescript" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Job Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Paste full job description..." rows={6} style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <button onClick={() => saveMutation.mutate()}
                disabled={!form.title || !form.description || saveMutation.isPending}
                style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white', border: 'none', cursor: 'pointer' }}>
                {saveMutation.isPending ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          )}

          {/* Template list */}
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} style={{ height: 110, borderRadius: 16, background: 'var(--bg-card)', opacity: 0.5 }} />)}
            </div>
          ) : data?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', borderRadius: 18, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>📋</p>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No templates saved</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click "+ Save JD" to save your first job description</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data?.map(template => (
                <div key={template._id}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', transition: 'border-color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{template.title}</h3>
                      {template.company && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{template.company}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => copyToClipboard(template.description, template._id)}
                        style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, background: copied === template._id ? 'rgba(62,207,159,0.12)' : 'var(--bg-input)', color: copied === template._id ? '#3ecfcf' : 'var(--text-subtle)', border: 'none', cursor: 'pointer' }}>
                        {copied === template._id ? '✓ Copied' : 'Copy'}
                      </button>
                      <button onClick={() => deleteMutation.mutate(template._id)}
                        style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {template.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {template.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(108,99,255,0.1)', color: '#6c63ff' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </PageTransition>
  )
}