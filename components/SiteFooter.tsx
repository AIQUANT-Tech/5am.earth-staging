import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>5am.earth</div>
            <p style={{ color: "var(--c-fg-muted)", fontSize: 14, marginTop: 8, maxWidth: 320 }}>
              Grow trust. Create opportunity.
            </p>
          </div>
          <nav className="footer-links">
            <Link href="/process">The Process</Link>
            <Link href="/use-cases">Use Cases</Link>
            <Link href="/partners">Our Partners</Link>
            <Link href="/team">Company Team</Link>
            <Link href="/case-studies">Case Studies</Link>
            <Link href="/contact">Contact us</Link>
          </nav>
        </div>
        <div className="footer-wordmark">5am.earth</div>
        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} 5am.earth Foundation</span>
          <span>A neutral foundation for verified agricultural intelligence</span>
        </div>
      </div>
    </footer>
  );
}
