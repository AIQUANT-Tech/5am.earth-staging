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

  const nav = pages
    ? pages.filter((p) => p.navVisible).map((p) => [p.label, p.href] as [string, string])
    : defaultNav;

  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link className="header-logo" href="/">
          <Image src="/img/symbol-black.png" alt="" width={26} height={26} />
          5am.earth
        </Link>
        <nav className="header-nav">
          {nav.map(([label, href]) => {
            const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link key={href} href={href} className={isActive ? "active" : undefined} aria-current={isActive ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <button className="btn btn-ink" type="button" onClick={() => setDemoOpen(true)}>
          See it in action
        </button>
      </div>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </header>
  );
}
