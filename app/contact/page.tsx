import Image from "next/image";
import { SIZES_HALF } from "../../lib/imageSizes";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import SectionMedia from "../../components/SectionMedia";
import { getContent, getSection, sectionStyle, sectionClassName, t } from "../../lib/content";
import ContactForm from "../../components/ContactForm";

export default function Contact() {
  const content = getContent();
  const hero = getSection(content, "contact-hero");
  const form = getSection(content, "contact-form");

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
              <Image src={hero?.image?.src || "/collage/soil-hand.webp"} alt="A hand holding soil and a young sprout" width={1200} height={1000} priority sizes={SIZES_HALF} />
            </div>
          </div>
        </section>
      )}

      <section className={`surface-green ${sectionClassName(form)}`} style={sectionStyle(form)}>
        <div className="wrap lead-grid">
          <div>
            <p className="eyebrow on-green">{t(form, "eyebrow")}</p>
            <div className="contact-options">
              <span>{t(form, "o1")}</span>
              <span>{t(form, "o2")}</span>
              <span>{t(form, "o3")}</span>
              <span>{t(form, "o4")}</span>
            </div>
            <SectionMedia section={form} alt="How to work with 5am.earth" />
          </div>
          <ContactForm />
        </div>
      </section>
      <SiteFooter settings={content.settings} />
    </main>
  );
}
