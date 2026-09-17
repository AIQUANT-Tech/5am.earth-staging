import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SectionMedia from "../../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../../lib/content";
import { asset } from "../../lib/imageLoader";

export default function Team() {
  const content = getContent();
  const hero = getSection(content, "team-hero");
  const structure = getSection(content, "team-structure");
  const cta = getSection(content, "team-cta");
  const members = [...content.team].sort((a, b) => a.order - b.order);

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
              <Image src={hero?.image?.src || "/collage/team-woman.png"} alt="A field practitioner holding freshly harvested crop, part of the 5am.earth network" width={1200} height={1000} priority />
            </div>
          </div>
        </section>
      )}

      {structure?.style.visible !== false && (
        <section className={`surface-paper ${sectionClassName(structure)}`} style={sectionStyle(structure)}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t(structure, "eyebrow")}</p>
                <h2>{t(structure, "h2")}</h2>
              </div>
              <p>{t(structure, "intro")}</p>
            </div>
            <SectionMedia section={structure} alt="The team behind the platform" />
            <div className="cell-grid cols-4">
              {members.map((m) => (
                <article className="team-card" key={m.id}>
                  {m.photo ? (
                    <img src={asset(m.photo)} alt={m.name} className="team-portrait" style={{ objectFit: "cover" }} />
                  ) : (
                    <div className="team-portrait">Team portrait</div>
                  )}
                  <div className="team-body">
                    <span className="cell-num">{m.role}</span>
                    <h3>{m.name}</h3>
                    <p>{m.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {cta?.style.visible !== false && (
        <section className={`surface-ink final-cta ${sectionClassName(cta)}`} style={sectionStyle(cta)}>
          <div className="wrap">
            <p className="eyebrow invert">{t(cta, "eyebrow")}</p>
            <h2>{t(cta, "h2")}</h2>
            <SectionMedia section={cta} alt="Connect with the 5am.earth team" />
            <Link className="btn btn-green" href="/contact">{t(cta, "cta")}</Link>
          </div>
        </section>
      )}
      <SiteFooter settings={content.settings} />
    </main>
  );
}
