import type { Metadata } from "next";
import "./globals.css";
import { getContent, typographyCss, siteSettingsCss } from "../lib/content";
import MotionObserver from "../components/MotionObserver";

export const metadata: Metadata = {
  title: "5am.Earth | Grow trust. Create opportunity.",
  description:
    "5am.Earth makes verified farmer and field information reusable across the agricultural value chain.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = getContent();
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: typographyCss(content.typography) }} />
        <style dangerouslySetInnerHTML={{ __html: siteSettingsCss(content.settings) }} />
        {/* Runs before first paint so scroll-reveal CSS never flashes visible content. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <MotionObserver />
      </body>
    </html>
  );
}
