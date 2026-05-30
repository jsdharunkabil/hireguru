import { useNavigate, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

const FEATURES = [
  { icon: '✨', title: 'AI Resume Scorer', desc: 'Get instant ATS score, keyword gap analysis and section-by-section feedback powered by AI.' },
  { icon: '🎤', title: 'Mock Interview', desc: 'Practice with 8 AI-generated role-specific questions and get scored feedback on every answer.' },
  { icon: '🗺️', title: '90-Day Roadmap', desc: 'AI builds a personalised week-by-week learning plan based on your exact skill gaps.' },
  { icon: '📊', title: 'Score History', desc: 'Track your resume improvement over time with trend charts and detailed comparison.' },
  { icon: '💡', title: 'Resume Tips', desc: 'Role-specific AI tips, must-have keywords, action verbs and common mistakes to avoid.' },
  { icon: '📋', title: 'JD Templates', desc: 'Save job descriptions and reuse them across sessions with one-click copy.' },
]

const STEPS = [
  { n: '01', title: 'Upload your resume', desc: 'Drag and drop your PDF resume. We extract the text instantly.' },
  { n: '02', title: 'Paste a job description', desc: 'Copy the JD from any job board — LinkedIn, Naukri, Indeed.' },
  { n: '03', title: 'Get AI insights', desc: 'Score, gap analysis, interview questions and roadmap in seconds.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const token = useAuthStore(s => s.token)

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* Navbar */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(108,99,255,0.3)' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>H</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>HireGuru</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/login')}
              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-subtle)', cursor: 'pointer' }}>
              Sign in
            </button>
            <button onClick={() => navigate('/register')}
              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(108,99,255,0.3)' }}>
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, marginBottom: 28, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ fontSize: 13, color: '#6c63ff', fontWeight: 500 }}>AI-powered job application toolkit</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 800, color: 'var(--text)', marginBottom: 20, lineHeight: 1.15 }}>
          Land your dream job
          <span style={{ display: 'block', background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            with AI on your side
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
          Score your resume, practice mock interviews and get a personalised 90-day learning roadmap — all in one place. Free.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <button onClick={() => navigate('/register')}
            style={{ padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(108,99,255,0.35)' }}>
            Start for free →
          </button>
          <button onClick={() => navigate('/login')}
            style={{ padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>
            Sign in
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No credit card · Free forever · 2 min setup</p>
      </div>

      {/* App preview mockup */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', borderRadius: 18, border: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(108,99,255,0.12)' }}>
            {/* Browser bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ flex: 1, margin: '0 16px', padding: '4px 12px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                hireguru.app/score
              </div>
            </div>
            {/* Score UI */}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, fontWeight: 500 }}>AI Resume Score</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', border: '4px solid #3ecfcf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: '#3ecfcf', fontFamily: 'var(--font-display)' }}>87</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[['ATS', 82], ['Skills', 90], ['Experience', 78]].map(([l, v]) => (
                        <div key={l} style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                            <span style={{ color: '#3ecfcf', fontWeight: 600 }}>{v}%</span>
                          </div>
                          <div style={{ height: 4, borderRadius: 4, background: 'var(--border)' }}>
                            <div style={{ height: 4, borderRadius: 4, width: `${v}%`, background: 'linear-gradient(90deg,#6c63ff,#3ecfcf)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 500 }}>Missing Keywords</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {['Docker', 'AWS', 'Redis', 'GraphQL'].map(k => (
                      <span key={k} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{k}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>Matched Keywords</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['React', 'Node.js', 'MongoDB', 'TypeScript'].map(k => (
                      <span key={k} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{k}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6c63ff', marginBottom: 5 }}>💡 Top improvements</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add Docker and AWS experience to your skills section. Include quantified achievements in your experience bullets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { n: '85%', label: 'Average ATS score improvement' },
            { n: '8x', label: 'More interview calls reported' },
            { n: '90', label: 'Day personalised learning plan' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center', padding: '28px 20px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 6, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.n}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
            Everything you need
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Six powerful tools built into one free platform</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title}
              style={{ padding: 24, borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', transition: 'transform .2s, box-shadow .2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(108,99,255,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
            How it works
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Three steps to a better job application</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32 }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(108,99,255,0.25)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'white' }}>{s.n}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{ padding: '56px 48px', borderRadius: 24, background: 'var(--bg-card)', border: '1px solid rgba(108,99,255,0.2)', boxShadow: '0 4px 24px rgba(108,99,255,0.1)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
            Ready to get hired?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of job seekers using AI to land better roles faster.
          </p>
          <button onClick={() => navigate('/register')}
            style={{ padding: '14px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(108,99,255,0.35)' }}>
            Create free account →
          </button>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>Free forever · No credit card required</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, marginBottom: 32 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>H</span>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>HireGuru</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 220 }}>
                AI-powered job application toolkit. Score resumes, practice interviews, build your career.
              </p>
            </div>

            {/* Features */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Features</p>
              {[
                ['Resume Scorer', '/score'],
                ['Mock Interview', '/interview'],
                ['90-Day Roadmap', '/roadmap'],
                ['Resume Tips', '/tips'],
                ['JD Templates', '/jd-templates'],
              ].map(([label, path]) => (
                <a key={path} href={path}
                  style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 8, transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  {label}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Contact & Enquiry</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="mailto:jsdharunkabil@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <span>✉️</span> jsdharunkabil@gmail.com
                </a>
                <a href="tel:+919442876517"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <span>📞</span> +91 9442876517
                </a>
                <a href="https://github.com/jsdharunkabil" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <span>🐙</span> github.com/jsdharunkabil
                </a>
                <a href="https://linkedin.com/in/dharunkabil25" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <span>💼</span> linkedin.com/in/dharunkabil25
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} HireGuru. Built with ❤️ by{' '}
              <span style={{ color: '#6c63ff', fontWeight: 600 }}>Dharun Kabil</span>. All rights reserved.
            </p>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🔒 Secure · Private · Free</span>
          </div>
        </div>
      </footer>

    </div>
  )
}