import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import ScoreTrendChart from '../components/ScoreTrendChart'
import Footer from '../components/Footer';

interface ScoreRecord {
  _id: string; jobTitle: string; overallScore: number; atsScore: number
  matchedKeywords: string[]; missingKeywords: string[]
  improvements: string[]; summary: string; createdAt: string
  resumeId: { filename: string }
}

export default function ScoreHistoryPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['scores'],
    queryFn: async () => { const { data } = await api.get('/ai/scores'); return data.scores as ScoreRecord[] },
  })

  const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Score History</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Track your resume improvement over time</p>
            </div>
            <button onClick={() => navigate('/score')}
              style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white', border: 'none', cursor: 'pointer' }}>
              + New Score
            </button>
          </div>

          {data && data.length >= 2 && <ScoreTrendChart scores={data} />}

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} style={{ height: 130, borderRadius: 16, background: 'var(--bg-card)', opacity: 0.5 }} />)}
            </div>
          ) : data?.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 24px' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No scores yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Score your resume against a job description to see history</p>
              <button onClick={() => navigate('/score')}
                style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white', border: 'none', cursor: 'pointer' }}>
                Score Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {data?.map((record, index) => {
                const color = record.overallScore >= 70 ? '#3ecfcf' : record.overallScore >= 50 ? '#f59e0b' : '#ef4444'
                return (
                  <div key={record._id} style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(108,99,255,0.12)', color: '#6c63ff' }}>
                            #{data.length - index}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                          {record.jobTitle || 'Untitled Role'}
                        </h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {record.resumeId?.filename || 'Unknown resume'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{record.overallScore}</span>
                        </div>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: `${color}18`, color }}>
                          {record.overallScore >= 70 ? 'Strong' : record.overallScore >= 50 ? 'Average' : 'Weak'}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>{record.summary}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>✅ Matched ({record.matchedKeywords.length})</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {record.matchedKeywords.slice(0, 4).map(k => (
                            <span key={k} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(62,207,159,0.1)', color: '#3ecfcf' }}>{k}</span>
                          ))}
                          {record.matchedKeywords.length > 4 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{record.matchedKeywords.length - 4}</span>}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>❌ Missing ({record.missingKeywords.length})</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {record.missingKeywords.slice(0, 4).map(k => (
                            <span key={k} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                      {record.improvements.slice(0, 2).map((imp, i) => (
                        <p key={i} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', gap: 6 }}>
                          <span style={{ color: '#6c63ff' }}>→</span> {imp}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </PageTransition>
  )
}