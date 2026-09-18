import Link from "next/link";
import Image from "next/image";
import { SIZES_FULL, SIZES_HALF } from "../../lib/imageSizes";
import { Blocks, Database, Satellite, ShieldCheck } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SectionMedia from "../../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../../lib/content";

const icons = [Database, Satellite, ShieldCheck, Blocks];

export default function Process() {
  const content = getContent();
  const hero = getSection(content, "process-hero");
  const stages = getSection(content, "process-stages");
  const why = getSection(content, "process-why");
  const cta = getSection(content, "process-cta");

  const stageCards = [1, 2, 3, 4].map((i) => ({
    title: t(stages, `s${i}t`),
    body: t(stages, `s${i}b`),
    Icon: icons[i - 1],
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
              <Image src={hero?.image?.src || "/collage/process-flow.webp"} alt="A farmer using a phone in the field, linked to a satellite boundary map, plants, and soil" width={1200} height={1000} priority sizes={SIZES_HALF} />
            </div>
          </div>
        </section>
      )}

      {stages?.style.visible !== false && (
        <section className={`surface-paper ${sectionClassName(stages)}`} style={sectionStyle(stages)}>
          <div className="wrap">
            <div className="cell-grid cols-4">
              {stageCards.map((s, i) => (
                <article className="cell" key={s.title}>
                  <s.Icon size={22} strokeWidth={2} />
                  <span className="cell-num" style={{ marginTop: 20 }}>0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>

            <div className="infographic-figure" style={stages?.image ? { width: `${stages.image.scale}%`, margin: "56px auto 0" } : undefined}>
              <Image
                src={stages?.image?.src || "/collage/verification-stack-bone.webp"}
                alt="Verification stack: field evidence, satellite signals, secure provenance, producing a verified field record"
                width={1680}
                height={946}
                sizes={SIZES_FULL}
              />
            </div>

            {why?.style.visible !== false && (
              <div className="split" style={{ marginTop: 100, ...sectionStyle(why) }}>
                <p className="eyebrow">{t(why, "eyebrow")}</p>
                <div>
                  <h2>{t(why, "h2")}</h2>
                  <SectionMedia section={why} alt="Verifying evidence once and keeping its history" />
                  <div className="outcome-grid">
                    <div><span>01</span><p>{t(why, "o1")}</p></div>
                    <div><span>02</span><p>{t(why, "o2")}</p></div>
                    <div><span>03</span><p>{t(why, "o3")}</p></div>
                    <div><span>04</span><p>{t(why, "o4")}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {cta?.style.visible !== false && (
        <section className={`surface-ink final-cta ${sectionClassName(cta)}`} style={sectionStyle(cta)}>
          <div className="wrap">
            <p className="eyebrow invert">{t(cta, "eyebrow")}</p>
            <h2>{t(cta, "h2")}</h2>
            <SectionMedia section={cta} alt="Discuss your use case" />
            <Link className="btn btn-green" href="/contact">{t(cta, "cta")}</Link>
          </div>
        </section>
      )}
      <SiteFooter settings={content.settings} />
    </main>
  );
}
