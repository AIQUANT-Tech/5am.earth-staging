import type { SiteSettings } from "../lib/content";

export default function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const tagline = settings?.footerTagline || "Grow trust. Create opportunity.";
  const copyright = (settings?.footerCopyright || "© {year} 5am.earth Foundation").replace(
    "{year}",
    String(new Date().getFullYear())
  );
  const meta = settings?.footerMeta || "A neutral foundation for verified agricultural intelligence";
  // Label and destination are both info@5am.earth; contactEmailLabel is left
  // empty in settings so it falls back to the address and the two cannot drift
  // apart. Empty contactEmail hides the link entirely.
  const email = settings?.contactEmail ?? "info@5am.earth";
  const emailLabel = settings?.contactEmailLabel || email;

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
                {emailLabel}
              </a>
            )}
          </div>
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
