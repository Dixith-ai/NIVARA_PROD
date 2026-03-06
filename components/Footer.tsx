import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo mb-4" style={{ color: 'var(--color-text-inverse)' }}>NIVARA</div>
            <p style={{ color: 'rgba(250,248,244,0.4)', fontSize: 'var(--font-size-sm)', lineHeight: 1.8 }}>
              <span className="font-accent" style={{ fontSize: '1.1rem', color: 'rgba(250,248,244,0.5)', fontStyle: 'italic' }}>निवार — protection, shelter.</span><br />
              Indigenously crafted in India.
            </p>
          </div>

          <div className="footer-links">
            <h6>Product</h6>
            <ul>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/buy">Buy Device</Link></li>
              <li><Link href="/kiosks">Find Kiosks</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h6>Resources</h6>
            <ul>
              <li><Link href="/doctors">Find Doctors</Link></li>
              <li><Link href="/feedback">Feedback</Link></li>
              <li><Link href="/demo">Try Demo</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h6>Company</h6>
            <ul>
              <li><Link href="/features">About</Link></li>
              <li><span style={{ color: 'rgba(250,248,244,0.4)', fontSize: 'var(--font-size-sm)', cursor: 'default' }}>Privacy</span></li>
              <li><span style={{ color: 'rgba(250,248,244,0.4)', fontSize: 'var(--font-size-sm)', cursor: 'default' }}>Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-ornament"><span className="footer-ornament-gem"></span></div>
          <p className="text-small">© 2026 NIVARA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
