export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 64, background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(28px,4vw,40px) clamp(16px,4vw,24px) clamp(20px,3vw,28px)' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 'clamp(20px,4vw,32px)', marginBottom: 28 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6c63ff,#3ecfcf)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>H</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>HireGuru</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              AI-powered job application toolkit. Free forever.
            </p>
          </div>

          {/* Features */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Features</p>
            {[
              ['Resume Scorer', '/score'],
              ['Mock Interview', '/interview'],
              ['90-Day Roadmap', '/roadmap'],
              ['Resume Tips', '/tips'],
              ['JD Templates', '/jd-templates'],
            ].map(([label, path]) => (
              <a key={path} href={path}
                style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 7, transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                {label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Contact & Enquiry</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { href: 'mailto:jsdharunkabil@gmail.com', icon: '✉️', label: 'jsdharunkabil@gmail.com' },
                { href: 'tel:+919442876517', icon: '📞', label: '+91 94428 76517' },
                { href: 'https://github.com/jsdharunkabil', icon: '🐙', label: 'github.com/jsdharunkabil' },
                { href: 'https://linkedin.com/in/dharunkabil25', icon: '💼', label: 'linkedin.com/in/dharunkabil25' },
              ].map(({ href, icon, label }) => (
                <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} HireGuru · Built with ❤️ by{' '}
            <span style={{ color: '#6c63ff', fontWeight: 600 }}>Dharun Kabil</span>
          </p>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🔒 Secure · Private · Free</span>
        </div>
      </div>
    </footer>
  )
}