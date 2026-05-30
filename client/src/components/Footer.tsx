export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: 64,
      background: 'var(--bg-card)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 32, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>H</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>HireGuru</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 210 }}>
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
              ['Score History', '/score/history'],
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
                <span style={{ fontSize: 15 }}>✉️</span>
                jsdharunkabil@gmail.com
              </a>
              <a href="tel:+919442876517"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <span style={{ fontSize: 15 }}>📞</span>
                +91 94428 76517
              </a>
              <a href="https://github.com/jsdharunkabil" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <span style={{ fontSize: 15 }}>🐙</span>
                github.com/jsdharunkabil
              </a>
              <a href="https://linkedin.com/in/dharunkabil25" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <span style={{ fontSize: 15 }}>💼</span>
                linkedin.com/in/dharunkabil25
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} HireGuru. Built with ❤️ by{' '}
            <span style={{ color: '#6c63ff', fontWeight: 600 }}>Dharun Kabil</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🔒 Secure · Private · Free</span>
          </div>
        </div>
      </div>
    </footer>
  )
}