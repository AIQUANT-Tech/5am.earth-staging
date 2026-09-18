import Link from "next/link";
import type { SiteSettings } from "../lib/content";

export default function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const tagline = settings?.footerTagline || "Grow trust. Create opportunity.";
  const copyright = (settings?.footerCopyright || "© {year} 5am.earth Foundation").replace(
    "{year}",
    String(new Date().getFullYear())
  );
  const meta = settings?.footerMeta || "A neutral foundation for verified agricultural intelligence";
  // The static site carried a footer mailto; it was dropped in the Next.js
  // rewrite. Empty string in settings hides the link again.
  const email = settings?.contactEmail ?? "yoram@5am.earth";

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>5am.earth</div>
            <p style={{ color: "var(--c-fg-muted)", fontSize: 14, marginTop: 8, maxWidth: 320 }}>
              {tagline}
            </p>
            {email && (
              <a className="footer-email" href={`mailto:${email}`}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="16" height="12" rx="2" />
                  <path d="M2 7l8 5 8-5" />
                </svg>
                {email}
              </a>
            )}
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
          <span>{copyright}</span>
          <span>{meta}</span>
        </div>
      </div>
    </footer>
  );
}
