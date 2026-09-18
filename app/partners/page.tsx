import Link from "next/link";
import Image from "next/image";
import { SIZES_HALF } from "../../lib/imageSizes";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SectionMedia from "../../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../../lib/content";
import { asset } from "../../lib/imageLoader";

const benefitDefaults = [
  ["Farmers", "Gain portable recognition and stronger pathways to finance, markets, insurance, and essential services."],
  ["Agri-Entrepreneurs", "Turn trusted local knowledge into recognized contributions, better tools, and stronger farmer relationships."],
  ["Data and technology partners", "Connect specialist verification, satellite, identity, learning, or infrastructure capabilities to real field networks."],
  ["Financial institutions and buyers", "Reduce verification friction and make decisions using clearer, traceable agricultural evidence."],
  ["Governments, NGOs, and funders", "Extend program reach, monitor outcomes, and invest in shared infrastructure that compounds in value."],
  ["Builders and researchers", "Create products and insight tools on a documented, permissioned agricultural data foundation."],
];

export default function Partners() {
  const content = getContent();
  const hero = getSection(content, "partners-hero");
  const infographic = getSection(content, "partners-infographic");
  const value = getSection(content, "partners-value");
  const cta = getSection(content, "partners-cta");

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
              <Image src={hero?.image?.src || "/collage/network-map.webp"} alt="Two partners' hands marking up a shared satellite field map, with a water tower and market linked in" width={1200} height={800} priority sizes={SIZES_HALF} />
            </div>
          </div>
        </section>
      )}

      <section className="surface-paper">
        <div className="wrap">
          <div className="partner-logos">
            {[...content.partners].filter((p) => p.visible).sort((a, b) => a.order - b.order).map((p) => (
              <div key={p.id}>
                {p.logo ? <img src={asset(p.logo)} alt={p.name} /> : <span className="partner-textmark">{p.name}</span>}
              </div>
            ))}
          </div>

          {infographic?.style.visible !== false && (
            <div
              className="infographic-figure infographic-half"
              style={{ ...sectionStyle(infographic), ...(infographic?.image ? { width: `${infographic.image.scale}%` } : {}) }}
            >
              <Image src={infographic?.image?.src || "/collage/partners-pair.webp"} alt="Two field partners reviewing a satellite field map together" width={1240} height={920} sizes={SIZES_HALF} />
            </div>
          )}

          {value?.style.visible !== false && (
            <>
              <div className="section-head" style={{ marginTop: 90 }}>
                <div>
                  <p className="eyebrow">{t(value, "eyebrow")}</p>
                  <h2>{t(value, "h2")}</h2>
                </div>
                <p>{t(value, "intro")}</p>
              </div>
              <SectionMedia section={value} alt="Why partners join the ecosystem" />
              <div className="cell-grid">
                {benefitDefaults.map((b, i) => (
                  <article className="cell" key={b[0]}>
                    <span className="cell-num">0{i + 1}</span>
                    <h3>{b[0]}</h3>
                    <p>{b[1]}</p>
                    <Link href="/contact">Explore a partnership</Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {cta?.style.visible !== false && (
        <section className={`surface-ink final-cta ${sectionClassName(cta)}`} style={sectionStyle(cta)}>
          <div className="wrap">
            <p className="eyebrow invert">{t(cta, "eyebrow")}</p>
            <h2>{t(cta, "h2")}</h2>
            <SectionMedia section={cta} alt="Become a 5am.earth partner" />
            <Link className="btn btn-green" href="/contact">{t(cta, "cta")}</Link>
          </div>
        </section>
      )}
      <SiteFooter settings={content.settings} />
    </main>
  );
}
