"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DemoModal from "./DemoModal";
import type { PageMeta } from "../lib/content";

const defaultNav = [
  ["Home", "/"],
  ["The Process", "/process"],
  ["Use Cases", "/use-cases"],
  ["Our Partners", "/partners"],
  ["Company Team", "/team"],
  ["Contact us", "/contact"],
];

export default function SiteHeader({ pages }: { pages?: PageMeta[] }) {
  const pathname = usePathname();
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = pages
    ? pages.filter((p) => p.navVisible).map((p) => [p.label, p.href] as [string, string])
    : defaultNav;

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        {/* prefetch={false}: on a static export with a basePath, Next's RSC
            prefetch for the root route asks for `/5am.earth-staging.txt`,
            which does not exist and logs a 404 on every page. Sub-routes
            prefetch fine (`contact/index.txt`), so only "/" needs opting out. */}
        <Link className="header-logo" href="/" prefetch={false} onClick={() => setMenuOpen(false)}>
          <Image src="/img/symbol-black.png" alt="" width={26} height={26} />
          5am.earth
        </Link>
        <nav className="header-nav">
          {nav.map(([label, href]) => {
            const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link key={href} href={href} prefetch={href === "/" ? false : undefined} className={isActive ? "active" : undefined} aria-current={isActive ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="header-actions">
          <button className="btn btn-ink" type="button" onClick={() => setDemoOpen(true)}>
            See it in action
          </button>
          <button
            className={`header-menu-btn${menuOpen ? " open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${menuOpen ? " open" : ""}`}>
        <div className="wrap">
          {nav.map(([label, href]) => {
            const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                prefetch={href === "/" ? false : undefined}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </header>
  );
}
