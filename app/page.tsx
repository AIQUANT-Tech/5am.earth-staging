import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import SectionMedia from "../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../lib/content";
import { asset } from "../lib/imageLoader";

function nl(s: string) {
  return s.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export default function Home() {
  const content = getContent();
  const hero = getSection(content, "home-hero");
  const network = getSection(content, "home-network");
  const verify = getSection(content, "home-verify");
  const users = getSection(content, "home-users");
  const outcome = getSection(content, "home-outcome");
  const caseSec = getSection(content, "home-case");
  const partnersSection = getSection(content, "home-partners");
  const lead = getSection(content, "home-lead");

  const audiences = [...content.audiences].filter((a) => a.visible).sort((a, b) => a.order - b.order);

  return (
    <main>
      <SiteHeader pages={content.pages} />

      {hero?.style.visible !== false && (
        <section className={`hero surface-bone ${sectionClassName(hero)}`} style={sectionStyle(hero)}>
          <div className={`wrap hero-grid ${hero?.image?.position === "left" ? "media-left" : ""}`}>
            <div>
              <p className="eyebrow hero-eyebrow">{t(hero, "eyebrow")}</p>
              <h1>{nl(t(hero, "h1"))}</h1>
              <div className="hero-support">
                <p>{t(hero, "sub1")}</p>
                <p className="lede-sub">{t(hero, "sub2")}</p>
              </div>
              <div className="hero-actions">
                <Link className="btn btn-green" href="/contact">{t(hero, "cta1")}</Link>
                <a className="btn btn-ink" href="#network">{t(hero, "cta2")}</a>
              </div>
            </div>
            <div
              className="hero-art"
              style={hero?.image ? { width: `${hero.image.scale}%`, marginLeft: hero.image.position === "left" ? 0 : "auto", marginRight: hero.image.position === "left" ? "auto" : 0 } : undefined}
            >
              <Image src={hero?.image?.src || "/collage/hero-hands.png"} alt="A verified field record: hands holding soil and a sprout, an aerial farm boundary, and a field ledger" width={1600} height={1200} priority />
            </div>
          </div>
        </section>
      )}

      {network?.style.visible !== false && (
        <section id="network" className={`surface-bone ${sectionClassName(network)}`} style={sectionStyle(network)}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t(network, "eyebrow")}</p>
                <h2>{t(network, "h2")}</h2>
              </div>
              <p>{t(network, "intro")}</p>
            </div>
            <SectionMedia section={network} alt="The Agri-Entrepreneur field network" />
            <div className="stat-grid">
              <div className="stat-cell"><strong>{t(network, "stat1n")}</strong><span>{t(network, "stat1l")}</span></div>
              <div className="stat-cell"><strong>{t(network, "stat2n")}</strong><span>{t(network, "stat2l")}</span></div>
              <div className="stat-cell"><strong>{t(network, "stat3n")}</strong><span>{t(network, "stat3l")}</span></div>
              <div className="stat-cell"><strong>{t(network, "stat4n")}</strong><span>{t(network, "stat4l")}</span></div>
            </div>
            <p className="source-note">{t(network, "sourceNote")}</p>
            <div className="pilot-band">
              <div>
                <p className="eyebrow on-green">{t(network, "pilotEyebrow")}</p>
                <h3>{t(network, "pilotH3")}</h3>
              </div>
              <div className="pilot-stats">
                <span><b>{t(network, "pilot1n")}</b>{t(network, "pilot1l")}</span>
                <span><b>{t(network, "pilot2n")}</b>{t(network, "pilot2l")}</span>
                <span><b>{t(network, "pilot3n")}</b>{t(network, "pilot3l")}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {verify?.style.visible !== false && (
        <section id="verify" className={`surface-ink ${sectionClassName(verify)}`} style={sectionStyle(verify)}>
          <div className="wrap">
            <div className="split">
              <p className="eyebrow invert">{t(verify, "eyebrow")}</p>
              <div>
                <h2>{t(verify, "h2")}</h2>
                <p className="lede" style={{ marginTop: 18 }}>{t(verify, "lede")}</p>
              </div>
            </div>

            <div className="infographic-figure" style={verify?.image ? { width: `${verify.image.scale}%`, margin: "56px auto 0" } : undefined}>
              <Image
                src={verify?.image?.src || "/collage/verification-stack-ink.png"}
                alt="Verification stack: field evidence (people and place), satellite signals (boundaries and history), secure provenance (identity and consent), producing a verified field record that is grounded, traceable and reusable"
                width={1680}
                height={946}
              />
            </div>

            <div style={{ marginTop: 40 }}>
              <Link className="btn btn-outline btn-ghost-light" href="/process">{t(verify, "cta")}</Link>
            </div>
          </div>
        </section>
      )}

      {users?.style.visible !== false && (
        <section id="users" className={`surface-bone ${sectionClassName(users)}`} style={sectionStyle(users)}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t(users, "eyebrow")}</p>
                <h2>{t(users, "h2")}</h2>
              </div>
              <p>{t(users, "intro")}</p>
            </div>
            <SectionMedia section={users} alt="Farmers and organizations across the 5am.earth ecosystem" />
            <div className="cell-grid">
              {audiences.map((a, i) => (
                <article className="cell" key={a.id}>
                  <span className="cell-num">0{i + 1}</span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                  <Link href="/contact">{a.cta}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {outcome?.style.visible !== false && (
        <section className={`surface-paper ${sectionClassName(outcome)}`} style={sectionStyle(outcome)}>
          <div className="wrap split">
            <div>
              <p className="eyebrow">{t(outcome, "eyebrow")}</p>
              <h2>{t(outcome, "h2")}</h2>
              <SectionMedia section={outcome} alt="A farmer's portable field record" />
            </div>
            <div>
              <p className="lede">{t(outcome, "lede")}</p>
              <div className="outcome-grid">
                <div><span>01</span><p>{t(outcome, "o1")}</p></div>
                <div><span>02</span><p>{t(outcome, "o2")}</p></div>
                <div><span>03</span><p>{t(outcome, "o3")}</p></div>
                <div><span>04</span><p>{t(outcome, "o4")}</p></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {caseSec?.style.visible !== false && (() => {
        const mediaFirst = caseSec?.image?.position !== "right";
        const media = (
          <div className="case-media" style={caseSec?.image ? { width: `${caseSec.image.scale}%` } : undefined}>
            <Image src={caseSec?.image?.src || "/collage/case-study-pink.png"} alt="A farmer holding harvested grain, connected to her farm ledger, produce basket, seedlings, and market records" width={1240} height={1240} />
          </div>
        );
        const text = (
          <div>
            <h2>{t(caseSec, "h2")}</h2>
            <p>{t(caseSec, "body")}</p>
            <div className="case-metrics">
              <span><b>{t(caseSec, "m1t")}</b>{t(caseSec, "m1b")}</span>
              <span><b>{t(caseSec, "m2t")}</b>{t(caseSec, "m2b")}</span>
              <span><b>{t(caseSec, "m3t")}</b>{t(caseSec, "m3b")}</span>
            </div>
            <Link className="text-link" href="/case-studies">{t(caseSec, "cta")}</Link>
          </div>
        );
        return (
          <section className={`surface-pink ${sectionClassName(caseSec)}`} style={sectionStyle(caseSec)}>
            <div className="wrap">
              <p className="eyebrow">{t(caseSec, "eyebrow")}</p>
              <div className={`case-grid ${mediaFirst ? "case-grid-reverse" : ""}`}>
                {mediaFirst ? <>{media}{text}</> : <>{text}{media}</>}
              </div>
            </div>
          </section>
        );
      })()}

      {partnersSection?.style.visible !== false && (() => {
        const mediaFirst = partnersSection?.image?.position !== "right";
        const media = (
          <div className="case-media" style={partnersSection?.image ? { width: `${partnersSection.image.scale}%` } : undefined}>
            <Image src={partnersSection?.image?.src || "/collage/case-study-map.png"} alt="Farmers and a field agent reviewing a satellite field boundary map together" width={1240} height={920} />
          </div>
        );
        const text = (
          <div>
            <h2>{t(partnersSection, "h2")}</h2>
            <ul className="partner-bullets">
              {t(partnersSection, "bullets")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
            </ul>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn btn-outline" href="/partners">{t(partnersSection, "cta")}</Link>
              <Link className="btn btn-green" href="/contact">{t(partnersSection, "cta2")}</Link>
            </div>
          </div>
        );
        return (
          <section className={`surface-bone ${sectionClassName(partnersSection)}`} style={sectionStyle(partnersSection)}>
            <div className="wrap">
              <p className="eyebrow">{t(partnersSection, "eyebrow")}</p>
              <div className={`case-grid ${mediaFirst ? "case-grid-reverse" : ""}`}>
                {mediaFirst ? <>{media}{text}</> : <>{text}{media}</>}
              </div>
              <div className="partner-logos" style={{ marginTop: 64 }}>
                {[...content.partners].filter((p) => p.visible).sort((a, b) => a.order - b.order).map((p) => (
                  <div key={p.id}>
                    {p.logo ? <img src={asset(p.logo)} alt={p.name} /> : <span className="partner-textmark">{p.name}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {lead?.style.visible !== false && (
        <section className={`surface-green ${sectionClassName(lead)}`} style={sectionStyle(lead)}>
          <div className="wrap lead-grid">
            <div>
              <p className="eyebrow on-green">{t(lead, "eyebrow")}</p>
              <h2>{t(lead, "h2")}</h2>
              <p>{t(lead, "body")}</p>
              <SectionMedia section={lead} alt="Building the next verified use case" />
            </div>
            <form className="card-form">
              <label>Work email<input type="email" placeholder="name@organization.com" /></label>
              <label>Organization<input type="text" placeholder="Organization name" /></label>
              <label>
                I am interested in
                <select defaultValue="">
                  <option value="" disabled>Select a route</option>
                  <option>Accessing verified information</option>
                  <option>Building a solution</option>
                  <option>Contributing data</option>
                  <option>Funding or partnering</option>
                </select>
              </label>
              <button className="btn btn-ink" type="button" style={{ justifyContent: "center" }}>{t(lead, "cta")}</button>
              <small>Wireframe form. Connect to the CRM before launch.</small>
            </form>
          </div>
        </section>
      )}

      <SiteFooter settings={content.settings} />
    </main>
  );
}
