import type { Metadata } from "next";
import "./globals.css";
import { getContent, typographyCss, siteSettingsCss } from "../lib/content";
import { asset } from "../lib/imageLoader";
import MotionObserver from "../components/MotionObserver";

// Selector list must stay in step with the `html.js ...:not(.in-view)` block
// in globals.css that sets these to opacity: 0.
const REVEAL_SELECTOR =
  ".cell,.stat-cell,.team-card,.quote-block,.pilot-band,.partner-logos > div," +
  ".field-photos figure,.section-head,.case-media,.infographic-figure,.outcome-grid > div";

/**
 * Scroll-reveal, wired up inline at the end of <body> rather than from a React
 * effect.
 *
 * The inline script in <head> adds `js`, which immediately sets every element
 * above to opacity: 0. If the thing that adds `in-view` back only runs after
 * hydration, all that content stays invisible until ~106 kB of JS has
 * downloaded and parsed — about 2s on a simulated slow 4G connection. On
 * /process/ that is nearly the whole page below the hero, so anyone scrolling
 * early sees blank gaps and reasonably concludes the page is still loading.
 *
 * Running it here means the observer is live as soon as the HTML is parsed,
 * with no dependency on the bundle. Same animation, just not gated on React.
 * Anything unexpected (no IntersectionObserver, a thrown error, reduced-motion)
 * falls back to showing the content immediately.
 */
const REVEAL_SCRIPT = `(function(){
  var S=${JSON.stringify(REVEAL_SELECTOR)};
  function showAll(){
    var n=document.querySelectorAll(S);
    for(var i=0;i<n.length;i++){n[i].classList.add('in-view');}
  }
  try{
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce||!('IntersectionObserver' in window)){showAll();return;}
    var els=document.querySelectorAll(S);
    var io=new IntersectionObserver(function(entries,obs){
      for(var i=0;i<entries.length;i++){
        if(entries[i].isIntersecting){entries[i].target.classList.add('in-view');obs.unobserve(entries[i].target);}
      }
    },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
    for(var j=0;j<els.length;j++){io.observe(els[j]);}
    window.__revealWired=true;
  }catch(e){showAll();}
})();`;

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
        {/* Placed after the content so the nodes exist, and before the async
            bundle runs — reveal no longer waits on hydration. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
        <MotionObserver />
      </body>
    </html>
  );
}
