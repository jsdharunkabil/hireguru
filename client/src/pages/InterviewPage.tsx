import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'

interface Resume { _id: string; filename: string }
interface Question { id: string; category: string; difficulty: string; question: string; hint: string }
interface AnswerResult { score: number; feedback: string; betterAnswer: string }

const diffColor = (d: string) => d === 'easy' ? '#3ecfcf' : d === 'medium' ? '#f59e0b' : '#ef4444'
const catIcon = (c: string) => c === 'technical' ? '💻' : c === 'behavioral' ? '🧠' : '🎯'

export default function InterviewPage() {
  const [selectedResume, setSelectedResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState<Record<string, AnswerResult>>({})
  const [phase, setPhase] = useState<'setup' | 'interview' | 'done'>('setup')

  const { data: resumeData } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => { const { data } = await api.get('/resumes'); return data.resumes as Resume[] },
  })

  const generateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/ai/interview/questions', { resumeId: selectedResume, jobDescription })
      return data.questions as Question[]
    },
    onSuccess: (qs) => { setQuestions(qs); setPhase('interview'); setCurrentQ(0); toast.success('8 questions generated!') },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to generate questions'),
  })

  const scoreMutation = useMutation({
    mutationFn: async () => {
      const q = questions[currentQ]
      const { data } = await api.post('/ai/interview/score-answer', { question: q.question, answer, hint: q.hint })
      return { id: q.id, result: data as AnswerResult }
    },
    onSuccess: ({ id, result }) => {
      setResults(prev => ({ ...prev, [id]: result }))
      setAnswer('')
      if (currentQ < questions.length - 1) setCurrentQ(prev => prev + 1)
      else { setPhase('done'); toast.success('Interview complete!') }
    },
    onError: () => toast.error('Failed to score answer'),
  })

  const avgScore = Object.values(results).length > 0
    ? Math.round((Object.values(results).reduce((a, r) => a + r.score, 0) / Object.values(results).length) * 10)
    : 0

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none',
  }

  const cardStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24,
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Mock Interview</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>AI-generated questions based on your resume and target role</p>
          </div>

          {/* SETUP */}
          {phase === 'setup' && (
            <div style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Setup Interview</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Select Resume</label>
                <select value={selectedResume} onChange={e => setSelectedResume(e.target.value)} style={inputStyle}>
                  <option value="">Choose a resume...</option>
                  {resumeData?.map(r => <option key={r._id} value={r._id}>{r.filename}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Job Description</label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description..." rows={6} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              <button onClick={() => generateMutation.mutate()}
                disabled={!selectedResume || !jobDescription || generateMutation.isPending}
                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: (!selectedResume || !jobDescription) ? 'rgba(108,99,255,0.3)' : 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
                {generateMutation.isPending ? '🤖 Generating questions...' : '🎤 Start Interview'}
              </button>
            </div>
          )}

          {/* INTERVIEW */}
          {phase === 'interview' && questions.length > 0 && (
            <div>
              {/* Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < currentQ ? '#6c63ff' : i === currentQ ? '#3ecfcf' : 'var(--border)', transition: 'background .3s' }} />
                ))}
                <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>{currentQ + 1}/{questions.length}</span>
              </div>

              <div style={cardStyle}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(108,99,255,0.12)', color: '#6c63ff' }}>
                    {catIcon(questions[currentQ].category)} {questions[currentQ].category}
                  </span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--bg-input)', color: diffColor(questions[currentQ].difficulty) }}>
                    {questions[currentQ].difficulty}
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 20, lineHeight: 1.5 }}>
                  {questions[currentQ].question}
                </h2>

                <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6} style={{ ...inputStyle, resize: 'none', marginBottom: 16 }} />

                <button onClick={() => scoreMutation.mutate()}
                  disabled={!answer.trim() || scoreMutation.isPending}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: !answer.trim() ? 'rgba(108,99,255,0.3)' : 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
                  {scoreMutation.isPending ? '🤖 Scoring...' : currentQ < questions.length - 1 ? 'Submit & Next →' : 'Submit & Finish'}
                </button>
              </div>

              {/* Previous answer feedback */}
              {currentQ > 0 && results[questions[currentQ - 1]?.id] && (
                <div style={{ marginTop: 16, padding: '14px 18px', borderRadius: 14, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#6c63ff', marginBottom: 6 }}>Previous answer: {results[questions[currentQ - 1].id]?.score}/10</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{results[questions[currentQ - 1].id]?.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* DONE */}
          {phase === 'done' && (
            <div>
              <div style={{ ...cardStyle, textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Interview Complete!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Average score across all answers</p>
                <div style={{ width: 90, height: 90, borderRadius: '50%', border: `4px solid ${avgScore >= 70 ? '#3ecfcf' : '#f59e0b'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: avgScore >= 70 ? '#3ecfcf' : '#f59e0b', fontFamily: 'var(--font-display)' }}>{avgScore}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {questions.map((q, i) => {
                  const r = results[q.id]
                  if (!r) return null
                  return (
                    <div key={q.id} style={cardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', flex: 1, marginRight: 16 }}>Q{i + 1}: {q.question}</p>
                        <span style={{ fontSize: 13, fontWeight: 700, color: r.score >= 7 ? '#3ecfcf' : r.score >= 5 ? '#f59e0b' : '#ef4444', whiteSpace: 'nowrap' }}>{r.score}/10</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{r.feedback}</p>
                      <details>
                        <summary style={{ fontSize: 12, color: '#6c63ff', cursor: 'pointer' }}>View stronger answer</summary>
                        <p style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 8, paddingLeft: 12, borderLeft: '2px solid #6c63ff' }}>{r.betterAnswer}</p>
                      </details>
                    </div>
                  )
                })}
              </div>

              <button onClick={() => { setPhase('setup'); setResults({}); setQuestions([]) }}
                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', color: 'white' }}>
                Start New Interview
              </button>
            </div>
          )}
        </div>
        <Footer/>
      </div>
    </PageTransition>
  )
}