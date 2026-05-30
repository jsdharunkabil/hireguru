import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'
interface Tip { category: string; tip: string; example: string; priority: string }
interface TipsResult { tips: Tip[]; keywords: string[]; commonMistakes: string[]; actionVerbs: string[] }

const priorityColor = (p: string) => p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#3ecfcf'
const categoryIcon: Record<string, string> = {
  Summary: '📝', Experience: '💼', Skills: '⚡', Education: '🎓',
  Formatting: '✨', ATS: '🤖', Achievements: '🏆', 'Soft Skills': '🤝'
}

export default function ResumeTipsPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('junior')
  const [result, setResult] = useState<TipsResult | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const tipsMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/ai/resume-tips', { jobTitle, experienceLevel })
      return data as TipsResult
    },
    onSuccess: (data) => {
      setResult(data)
      setActiveCategory(data.tips[0]?.category || null)
      toast.success('Tips generated!')
    },
    onError: () => toast.error('Failed to generate tips'),
  })

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none',
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Resume Tips</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Role-specific AI advice to make your resume stand out</p>
          </div>

          {/* Input */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Target Role</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Scientist" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Experience Level</label>
                <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} style={inputStyle}>
                  <option value="fresher">Fresher / Intern</option>
                  <option value="junior">Junior (0-2 yrs)</option>
                  <option value="mid">Mid-level (2-5 yrs)</option>
                  <option value="senior">Senior (5+ yrs)</option>
                </select>
              </div>
            </div>
            <button onClick={() => tipsMutation.mutate()}
              disabled={!jobTitle || tipsMutation.isPending}
              style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: !jobTitle ? 'rgba(108,99,255,0.3)' : 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
              {tipsMutation.isPending ? '🤖 Generating tips...' : '💡 Get Resume Tips'}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.tips.map(tip => (
                  <button key={tip.category} onClick={() => setActiveCategory(tip.category)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: `1px solid ${activeCategory === tip.category ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`, background: activeCategory === tip.category ? 'rgba(108,99,255,0.1)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{categoryIcon[tip.category] || '📌'}</span>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{tip.category}</span>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 20, background: `${priorityColor(tip.priority)}18`, color: priorityColor(tip.priority) }}>
                      {tip.priority}
                    </span>
                  </button>
                ))}
              </div>

              {/* Detail */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result.tips.filter(t => t.category === activeCategory).map(tip => (
                  <div key={tip.category} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 24 }}>{categoryIcon[tip.category] || '📌'}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{tip.category}</h3>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>{tip.tip}</p>
                    <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#6c63ff', marginBottom: 6 }}>✦ Example</p>
                      <p style={{ fontSize: 13, color: 'var(--text-subtle)' }}>{tip.example}</p>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-subtle)', marginBottom: 12 }}>🔑 Must-Have Keywords</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.keywords.map(k => (
                        <span key={k} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(62,207,159,0.1)', color: '#3ecfcf' }}>{k}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-subtle)', marginBottom: 12 }}>⚡ Action Verbs</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.actionVerbs.map(v => (
                        <span key={v} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(108,99,255,0.1)', color: '#6c63ff' }}>{v}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-subtle)', marginBottom: 12 }}>⚠️ Common Mistakes to Avoid</p>
                  {result.commonMistakes.map((m, i) => (
                    <p key={i} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 8 }}>
                      <span style={{ color: '#ef4444' }}>✗</span> {m}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </PageTransition>
  )
}