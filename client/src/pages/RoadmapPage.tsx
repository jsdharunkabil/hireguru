import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer';

interface Week { week: number; phase: string; focus: string; tasks: string[]; resources: string[] }

const phaseColor = (p: string) => p === 'Foundation' ? '#6c63ff' : p === 'Building' ? '#f59e0b' : '#3ecfcf'

export default function RoadmapPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [skills, setSkills] = useState('')
  const [roadmap, setRoadmap] = useState<Week[]>([])
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1)

  const { data: scores } = useQuery({
    queryKey: ['scores'],
    queryFn: async () => { const { data } = await api.get('/ai/scores'); return data.scores },
  })

  const roadmapMutation = useMutation({
    mutationFn: async () => {
      const missingKeywords = skills.split(',').map(s => s.trim()).filter(Boolean)
      const { data } = await api.post('/ai/roadmap', { missingKeywords, jobTitle })
      return data.weeks as Week[]
    },
    onSuccess: (data) => { setRoadmap(data); toast.success('Roadmap generated!') },
    onError: () => toast.error('Generation failed'),
  })

  const loadFromLatestScore = () => {
    if (scores?.[0]) {
      setJobTitle(scores[0].jobTitle || '')
      setSkills(scores[0].missingKeywords.join(', '))
      toast.success('Loaded from latest score!')
    }
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

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>90-Day Roadmap</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>AI-generated week-by-week learning plan based on your skill gaps</p>
          </div>

          {/* Input */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Generate Roadmap</h2>
              {scores?.[0] && (
                <button onClick={loadFromLatestScore}
                  style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, background: 'rgba(108,99,255,0.12)', color: '#6c63ff', border: 'none', cursor: 'pointer' }}>
                  Load from latest score
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Target Role</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Skills to Learn (comma separated)</label>
                <input value={skills} onChange={e => setSkills(e.target.value)}
                  placeholder="Docker, AWS, TypeScript" style={inputStyle} />
              </div>
            </div>

            <button onClick={() => roadmapMutation.mutate()}
              disabled={!jobTitle || !skills || roadmapMutation.isPending}
              style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: (!jobTitle || !skills) ? 'rgba(108,99,255,0.3)' : 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
              {roadmapMutation.isPending ? '🤖 Generating roadmap...' : '🗺️ Generate 90-Day Plan'}
            </button>
          </div>

          {/* Roadmap weeks */}
          {roadmap.length > 0 && (
            <div>
              {/* Phase legend */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                {['Foundation', 'Building', 'Advanced'].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: phaseColor(p) }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {roadmap.map(week => (
                  <div key={week.week}
                    style={{ borderRadius: 14, border: `1px solid ${expandedWeek === week.week ? phaseColor(week.phase) + '40' : 'var(--border)'}`, overflow: 'hidden', transition: 'border-color .2s' }}>
                    <button
                      onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--bg-card)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${phaseColor(week.phase)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: phaseColor(week.phase), flexShrink: 0 }}>
                        W{week.week}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{week.focus}</p>
                        <p style={{ fontSize: 11, color: phaseColor(week.phase) }}>{week.phase}</p>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{expandedWeek === week.week ? '▲' : '▼'}</span>
                    </button>

                    {expandedWeek === week.week && (
                      <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-subtle)', marginBottom: 10 }}>📋 Tasks</p>
                            {week.tasks.map((task, i) => (
                              <p key={i} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 6 }}>
                                <span style={{ color: phaseColor(week.phase) }}>→</span> {task}
                              </p>
                            ))}
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-subtle)', marginBottom: 10 }}>📚 Resources</p>
                            {week.resources.map((res, i) => (
                              <p key={i} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 6 }}>
                                <span style={{ color: '#3ecfcf' }}>✦</span> {res}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </PageTransition>
  )
}