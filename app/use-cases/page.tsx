import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SectionMedia from "../../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../../lib/content";

export default function UseCases() {
  const content = getContent();
  const hero = getSection(content, "usecases-hero");
  const evidence = getSection(content, "usecases-evidence");
  const apps = getSection(content, "usecases-apps");
  const impl = getSection(content, "usecases-implementation");
  const cta = getSection(content, "usecases-cta");
  const uses = [...content.useCases].sort((a, b) => a.order - b.order);

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
              <Image src={hero?.image?.src || "/collage/network-circle.png"} alt="Four farmers using phones, connected by dotted lines to a shared satellite field map at the center" width={1200} height={1200} priority />
            </div>
          </div>
        </section>
      )}

      {evidence?.style.visible !== false && (
        <section className={`surface-paper ${sectionClassName(evidence)}`} style={sectionStyle(evidence)}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t(evidence, "eyebrow")}</p>
                <h2>{t(evidence, "h2")}</h2>
              </div>
              <p>{t(evidence, "intro")}</p>
            </div>
            <div className="stat-grid">
              <div className="stat-cell"><strong>{t(evidence, "stat1n")}</strong><span>{t(evidence, "stat1l")}</span></div>
              <div className="stat-cell"><strong>{t(evidence, "stat2n")}</strong><span>{t(evidence, "stat2l")}</span></div>
              <div className="stat-cell"><strong>{t(evidence, "stat3n")}</strong><span>{t(evidence, "stat3l")}</span></div>
              <div className="stat-cell"><strong>{t(evidence, "stat4n")}</strong><span>{t(evidence, "stat4l")}</span></div>
            </div>
            <p className="source-note">{t(evidence, "sourceNote")}</p>
            <div className="field-photos">
              <figure>
                <Image
                  src={evidence?.image?.src || "/collage/use-case-farmer.png"}
                  alt="A field agent capturing field evidence with a phone, connected to a satellite field boundary map"
                  width={900} height={600}
                  style={evidence?.image ? { width: `${evidence.image.scale}%` } : undefined}
                />
                <figcaption>
                  <b>{t(evidence, "photo1cap")}</b>
                  <span>{t(evidence, "photo1body")}</span>
                </figcaption>
              </figure>
              <figure>
                <Image
                  src={evidence?.image2?.src || "/collage/network-satellite.png"}
                  alt="A farmer reviewing satellite field boundary data on a phone, linked to a fingerprint and identity record"
                  width={900} height={600}
                  style={evidence?.image2 ? { width: `${evidence.image2.scale}%` } : undefined}
                />
                <figcaption>
                  <b>{t(evidence, "photo2cap")}</b>
                  <span>{t(evidence, "photo2body")}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      )}

      {apps?.style.visible !== false && (
        <section className={`surface-bone ${sectionClassName(apps)}`} style={sectionStyle(apps)}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t(apps, "eyebrow")}</p>
                <h2>{t(apps, "h2")}</h2>
              </div>
              <p>{t(apps, "intro")}</p>
            </div>
            <SectionMedia section={apps} alt="Applications built on one source of evidence" />
            <div className="cell-grid">
              {uses.map((u, i) => (
                <article className="cell" key={u.id}>
                  <span className="cell-num">0{i + 1}</span>
                  <h3>{u.title}</h3>
                  <p>{u.body}</p>
                  <Link href="/contact">Discuss this use case</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {impl?.style.visible !== false && (
        <section className={`surface-pink ${sectionClassName(impl)}`} style={sectionStyle(impl)}>
          <div className="wrap">
            <p className="eyebrow">{t(impl, "eyebrow")}</p>
            <div className="case-grid">
              <div>
                <h2>{t(impl, "h2")}</h2>
                <p>{t(impl, "body")}</p>
                <SectionMedia section={impl} alt="The initial Satellite Oracle implementation" />
              </div>
              <div className="case-metrics">
                <span><b>{t(impl, "m1t")}</b>{t(impl, "m1b")}</span>
                <span><b>{t(impl, "m2t")}</b>{t(impl, "m2b")}</span>
                <span><b>{t(impl, "m3t")}</b>{t(impl, "m3b")}</span>
              </div>
            </div>
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
