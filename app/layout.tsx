import type { Metadata } from "next";
import "./globals.css";
import { getContent, typographyCss, siteSettingsCss } from "../lib/content";
import { asset } from "../lib/imageLoader";
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
    // suppressHydrationWarning: the inline script below adds a `js` class to
    // <html> before React hydrates, which React otherwise reports as an
    // "Extra attributes from the server" warning in development.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Without this the font sits third in the critical chain
            (html -> css -> font); preloading fetches it alongside the CSS. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={asset("/fonts/Manrope-VariableFont_wght.woff2")}
          crossOrigin="anonymous"
        />
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
