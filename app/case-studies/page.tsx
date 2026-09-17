import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SectionMedia from "../../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../../lib/content";

export default function CaseStudies() {
  const content = getContent();
  const hero = getSection(content, "casestudies-hero");
  const story = getSection(content, "casestudies-story");
  const cta = getSection(content, "casestudies-cta");

  const beats = [1, 2, 3, 4].map((i) => ({
    num: `0${i}`,
    title: t(story, `s${i}t`),
    body: t(story, `s${i}b`),
  }));

  return (
    <main>
      <SiteHeader pages={content.pages} />
      {hero?.style.visible !== false && (
        <section className={`inner-hero surface-bone ${sectionClassName(hero)}`} style={sectionStyle(hero)}>
          <div className={`wrap inner-hero-grid ${hero?.image?.position === "left" ? "media-left" : ""}`}>
            <div>
              <p className="eyebrow">{t(hero, "eyebrow")}</p>
              <h1>{t(hero, "h1")}</h1>
              <p>{t(hero, "body")}</p>
            </div>
            <div className="inner-hero-art" style={hero?.image ? { width: `${hero.image.scale}%` } : undefined}>
              <Image src={hero?.image?.src || "/collage/finance-grid.png"} alt="Verified field evidence: a fingerprint, a wax seal, a satellite field boundary, and a farmer with a tablet" width={1200} height={1200} priority />
            </div>
          </div>
        </section>
      )}

      {story?.style.visible !== false && (
        <section className={`surface-paper ${sectionClassName(story)}`} style={sectionStyle(story)}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t(story, "eyebrow")}</p>
                <h2>{t(story, "h2")}</h2>
              </div>
              <p>{t(story, "intro")}</p>
            </div>
            <SectionMedia section={story} alt="Satellite Oracle case study evidence" />
            <div className="stat-grid three">
              <div className="stat-cell"><strong>{t(story, "stat1n")}</strong><span>{t(story, "stat1l")}</span></div>
              <div className="stat-cell"><strong>{t(story, "stat2n")}</strong><span>{t(story, "stat2l")}</span></div>
              <div className="stat-cell"><strong>{t(story, "stat3n")}</strong><span>{t(story, "stat3l")}</span></div>
            </div>

            <div className="cell-grid cols-4" style={{ marginTop: 64 }}>
              {beats.map((b) => (
                <article className="cell" key={b.num}>
                  <span className="cell-num">{b.num}</span>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </article>
              ))}
            </div>

            <div className="quote-block">
              <p>{t(story, "quote")}</p>
            </div>
          </div>
        </section>
      )}

      {cta?.style.visible !== false && (
        <section className={`surface-ink final-cta ${sectionClassName(cta)}`} style={sectionStyle(cta)}>
          <div className="wrap">
            <p className="eyebrow invert">{t(cta, "eyebrow")}</p>
            <h2>{t(cta, "h2")}</h2>
            <SectionMedia section={cta} alt="Bring your use case to the shared trust layer" />
            <Link className="btn btn-green" href="/contact">{t(cta, "cta")}</Link>
          </div>
        </section>
      )}
      <SiteFooter settings={content.settings} />
    </main>
  );
}
