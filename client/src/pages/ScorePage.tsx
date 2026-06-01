import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { exportScorePDF } from '../utils/exportPDF'

interface Resume { _id: string; filename: string }
interface ScoreResult {
  overallScore: number; atsScore: number
  sections: { experience: number; skills: number; education: number; formatting: number }
  matchedKeywords: string[]; missingKeywords: string[]
  strengths: string[]; improvements: string[]; summary: string
}

function Bar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: 'var(--border)' }}>
        <div style={{ height: 6, borderRadius: 4, width: `${value}%`, background: color, transition: 'width .7s ease' }} />
      </div>
    </div>
  )
}

export default function ScorePage() {
  const navigate = useNavigate()
  const [selectedResume, setSelectedResume] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)

  const { data: resumeData } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => { const { data } = await api.get('/resumes'); return data.resumes as Resume[] },
  })

  const scoreMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/ai/score', { resumeId: selectedResume, jobDescription, jobTitle })
      return data.score as ScoreResult
    },
    onSuccess: (data) => { setScoreResult(data); toast.success('Resume scored!') },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Scoring failed'),
  })

  const scoreColor = scoreResult
    ? scoreResult.overallScore >= 70 ? '#10b981' : scoreResult.overallScore >= 50 ? '#f59e0b' : '#ef4444'
    : '#6c63ff'

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none',
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,24px)' }}>

          <div style={{ marginBottom: 28 }}>
            <button onClick={() => navigate(-1 as any)}
              style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              ← Back
            </button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,5vw,34px)', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              Resume Scorer
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>AI-powered ATS score and keyword gap analysis</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>

            {/* Input */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 'clamp(16px,3vw,24px)', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>Job Details</h2>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Select Resume</label>
                <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} style={inputStyle}>
                  <option value="">Choose a resume...</option>
                  {resumeData?.map(r => <option key={r._id} value={r._id}>{r.filename}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Job Title</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Job Description</label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={8} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              <button onClick={() => scoreMutation.mutate()}
                disabled={!selectedResume || !jobDescription || scoreMutation.isPending}
                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity .2s', background: (!selectedResume || !jobDescription || scoreMutation.isPending) ? 'rgba(108,99,255,0.3)' : 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
                {scoreMutation.isPending ? '⚙️ Analyzing...' : '✨ Score My Resume'}
              </button>
            </div>

            {/* Result */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 'clamp(16px,3vw,24px)', boxShadow: 'var(--shadow-card)', minHeight: 300 }}>
              {!scoreResult && !scoreMutation.isPending && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                  <p style={{ fontWeight: 500, color: 'var(--text-subtle)' }}>Your score will appear here</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Fill in the form and click Score</p>
                </div>
              )}

              {scoreMutation.isPending && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
                  <p style={{ fontWeight: 500, color: 'var(--text)' }}>AI is analyzing your resume...</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>This takes 10–20 seconds</p>
                </div>
              )}

              {scoreResult && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', border: `4px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <span style={{ fontSize: 28, fontWeight: 700, color: scoreColor, fontFamily: 'var(--font-display)' }}>
                        {scoreResult.overallScore}
                      </span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Overall Score</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.6 }}>{scoreResult.summary}</p>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <Bar label="ATS Compatibility" value={scoreResult.atsScore} />
                    <Bar label="Experience" value={scoreResult.sections.experience} />
                    <Bar label="Skills" value={scoreResult.sections.skills} />
                    <Bar label="Education" value={scoreResult.sections.education} />
                    <Bar label="Formatting" value={scoreResult.sections.formatting} />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>✅ Matched Keywords</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {scoreResult.matchedKeywords.slice(0, 8).map(k => (
                        <span key={k} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{k}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>❌ Missing Keywords</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {scoreResult.missingKeywords.slice(0, 8).map(k => (
                        <span key={k} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{k}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>💡 Top Improvements</p>
                    {scoreResult.improvements.map((imp, i) => (
                      <p key={i} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 6 }}>
                        <span style={{ color: '#6c63ff' }}>→</span> {imp}
                      </p>
                    ))}
                  </div>

                  <button onClick={() => exportScorePDF({ ...scoreResult, jobTitle }, 'resume.pdf')}
                    style={{ width: '100%', padding: '10px', borderRadius: 10, fontSize: 13, background: 'var(--bg-input)', color: 'var(--text-subtle)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                    ⬇ Download PDF Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}