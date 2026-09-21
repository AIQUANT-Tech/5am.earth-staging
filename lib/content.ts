import fs from "fs";
import path from "path";
import type { CSSProperties } from "react";

export interface TypeStyle {
  family: string;
  size: number; // px
  letterSpacing: number; // em * 1000, e.g. -30 = -0.03em
  lineHeight: number; // % , e.g. 100 = 1.0
}

export interface Typography {
  headline: TypeStyle;
  number: TypeStyle;
  body: TypeStyle;
  caption: TypeStyle;
}

export interface SectionImage {
  src: string;
  scale: number; // percent width, 100 = full column
  position?: "left" | "right"; // only meaningful for sections with a side-by-side image + text layout
}

export interface SectionStyle {
  bg: string; // "" = default (css class controls it)
  textColor: string; // "" = default
  padding: "full" | "contained";
  rounded: boolean;
  marginY: number; // extra px added top+bottom
  visible: boolean;
}

export interface Section {
  id: string;
  page: string;
  label: string;
  order: number;
  style: SectionStyle;
  image?: SectionImage;
  image2?: SectionImage;
  content: Record<string, string>;
}

export interface UseCase {
  id: string;
  title: string;
  body: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  order: number;
}

export interface PageMeta {
  id: string;
  label: string;
  href: string;
  navVisible: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string; // image path; empty = render name as a text mark
  order: number;
  visible: boolean;
}

export interface Audience {
  id: string;
  title: string;
  body: string;
  cta: string;
  order: number;
  visible: boolean;
}

export interface SiteSettings {
  headerBg: string;
  footerTagline: string;
  footerCopyright: string;
  footerMeta: string;
  contactEmail: string; // where the mailto actually goes; "" hides the link
  // What the link reads as, when it should differ from the address (the 17/09
  // design briefly showed a different public address). Leave empty — the
  // current setting — to display contactEmail itself.
  contactEmailLabel: string;
}

export interface SiteContent {
  typography: Typography;
  pages: PageMeta[];
  sections: Section[];
  useCases: UseCase[];
  team: TeamMember[];
  partners: Partner[];
  audiences: Audience[];
  settings: SiteSettings;
}

const FILE_PATH = path.join(process.cwd(), "content", "site.json");

const defaultStyle = (): SectionStyle => ({
  bg: "",
  textColor: "",
  padding: "full",
  rounded: false,
  marginY: 0,
  visible: true,
});

function sec(id: string, page: string, label: string, order: number, content: Record<string, string>, image?: string, image2?: string): Section {
  return {
    id,
    page,
    label,
    order,
    style: defaultStyle(),
    content,
    ...(image ? { image: { src: image, scale: 100 } } : {}),
    ...(image2 ? { image2: { src: image2, scale: 100 } } : {}),
  };
}

export function defaultContent(): SiteContent {
  const content: SiteContent = {
    typography: {
      headline: { family: "Manrope", size: 92, letterSpacing: -35, lineHeight: 98 },
      number: { family: "Manrope", size: 46, letterSpacing: -30, lineHeight: 100 },
      body: { family: "Manrope", size: 17, letterSpacing: 0, lineHeight: 150 },
      caption: { family: "Manrope", size: 11, letterSpacing: 160, lineHeight: 140 },
    },
    pages: [
      { id: "home", label: "Home", href: "/", navVisible: true },
      { id: "process", label: "The Process", href: "/process", navVisible: true },
      { id: "use-cases", label: "Use Cases", href: "/use-cases", navVisible: true },
      { id: "partners", label: "Our Partners", href: "/partners", navVisible: true },
      { id: "team", label: "Company Team", href: "/team", navVisible: true },
      { id: "contact", label: "Contact us", href: "/contact", navVisible: true },
      { id: "case-studies", label: "Case Studies", href: "/case-studies", navVisible: false },
    ],
    sections: [
      sec("home-hero", "home", "Hero", 0, {
        eyebrow: "Secure, open agricultural data ecosystem",
        h1: "Grow trust.\nCreate opportunity.",
        sub1: "Make every farmer and every verified contribution count.",
        sub2: "5am.earth makes verified farmer and field information reusable across the agricultural value chain.",
        cta1: "Explore a partnership",
        cta2: "See the data",
      }, "/collage/hero-hands.png"),
      sec("home-network", "home", "Network today + pilot", 1, {
        eyebrow: "The network today",
        h2: "Start with people already in the field.",
        intro: "The Syngenta Foundation Agri-Entrepreneur program already connects local entrepreneurs with farmers across India. 5am.earth is building the verification layer on that working network.",
        stat1n: "2.4M+", stat1l: "smallholder farmers connected through the program",
        stat2n: "21K+", stat2l: "trained Agri-Entrepreneurs in the established network",
        stat3n: "45%", stat3l: "of connected farmers are women",
        stat4n: "52%", stat4l: "of Agri-Entrepreneurs were women in 2024",
        sourceNote: "Source: Earth Observation and Blockchain Integration research report. Network figures refer to the Syngenta Foundation Agri-Entrepreneur program in India.",
        pilotEyebrow: "Planned initial deployment",
        pilotH3: "The next step is measured, not assumed.",
        pilot1n: "1,000", pilot1l: "Agri-Entrepreneurs",
        pilot2n: "100,000", pilot2l: "farmers",
        pilot3n: "2", pilot3l: "initial oracle use cases",
      }),
      sec("home-verify", "home", "How a record earns trust", 2, {
        eyebrow: "How a record earns trust",
        h2: "A claim is useful only if others can check it.",
        lede: "Local field knowledge establishes what happened. Satellite evidence checks the place and its history. Consent determines where the record can go next.",
        cta: "See how verification works",
      }, "/collage/verification-stack-ink.png"),
      sec("home-users", "home", "Audiences intro", 3, {
        eyebrow: "One foundation, many users",
        h2: "Start with the value you need.",
        intro: "One verified record can answer different questions. Choose the decision you need to make.",
      }),
      sec("home-outcome", "home", "Farmer outcome", 4, {
        eyebrow: "The farmer-centered outcome",
        h2: "The record stays useful after the first verification.",
        lede: "A farmer can give the next lender, buyer or service provider access to the same verified record instead of starting again.",
        o1: "Portable farmer and field identity",
        o2: "Reduced repeated verification",
        o3: "Stronger visibility for lenders and buyers",
        o4: "Recognition for verified contributions",
      }),
      sec("home-case", "home", "Featured use case", 5, {
        eyebrow: "Featured use case",
        h2: "Satellite Oracle for smallholder agriculture.",
        body: "The first use case combines local field records with satellite evidence. Cardano records the source and history of each verification.",
        m1t: "Use case 01", m1b: "Land border verification",
        m2t: "Use case 02", m2b: "Historical sustainability rating",
        m3t: "Goal", m3b: "Lower risk and expand financial inclusion",
        cta: "Read the case study",
      }, "/collage/case-study-pink.png"),
      sec("home-partners", "home", "Partners", 6, {
        eyebrow: "Our partners",
        h2: "No single partner can verify the whole picture.",
        bullets: "Syngenta Foundation India brings the field network.\nTechnical partners contribute satellite verification, training and the record infrastructure.",
        cta: "Meet our partners",
        cta2: "Become a partner",
      }, "/collage/case-study-map.png"),
      sec("home-lead", "home", "Lead form CTA", 7, {
        eyebrow: "Build the next use case",
        h2: "Which decision needs better field evidence?",
        body: "Tell us what you need to decide and what evidence you have today. We will map the missing verifications and the right partners.",
        cta: "Start the conversation",
      }),

      sec("process-hero", "process", "Hero", 0, {
        eyebrow: "The Process",
        h1: "One field record. Four verifications before it travels.",
        body: "5am.earth connects local evidence with satellite verification, consent and a traceable record of origin.",
      }, "/collage/process-flow.png"),
      sec("process-stages", "process", "Four stage cards + infographic", 1, {
        s1t: "Capture", s1b: "An Agri-Entrepreneur records the farmer, field and activity where the work happens.",
        s2t: "Validate", s2b: "Satellite imagery verifies field boundaries against current signals and land history.",
        s3t: "Authenticate", s3b: "Identity and consent are attached to the evidence. Its source can now be traced.",
        s4t: "Reuse", s4b: "The farmer can permit the same record to support another service or decision.",
      }, "/collage/verification-stack-bone.png"),
      sec("process-why", "process", "Why different", 2, {
        eyebrow: "Why this is different",
        h2: "Verify the evidence once. Keep its history.",
        o1: "Fewer repeated field verifications",
        o2: "Clearer confidence and provenance",
        o3: "Portable records for farmers",
        o4: "Reusable evidence for organizations",
      }),
      sec("process-cta", "process", "Final CTA", 3, {
        eyebrow: "Apply the process",
        h2: "Show us the decision you cannot verify today.",
        cta: "Discuss your use case",
      }),

      sec("usecases-hero", "use-cases", "Hero", 0, {
        eyebrow: "Use Cases",
        h1: "Start with the decision. Trace it back to the field.",
        body: "Each use case begins with evidence that has a source, a history and clear permission to be used.",
      }, "/collage/network-circle.png"),
      sec("usecases-evidence", "use-cases", "Evidence today", 1, {
        eyebrow: "Evidence already in the field",
        h2: "The field network exists today.",
        intro: "The Syngenta Foundation Agri-Entrepreneur program supplies the relationships on the ground. The first 5am.earth deployment is planned on top of that network.",
        stat1n: "2.4M+", stat1l: "smallholder farmers connected across India",
        stat2n: "21K+", stat2l: "trained Agri-Entrepreneurs",
        stat3n: "13", stat3l: "Indian states reached by the program",
        stat4n: "100K", stat4l: "farmers planned for the initial deployment",
        sourceNote: "Evidence: Syngenta Foundation India program information and the Earth Observation and Blockchain Integration research report. Deployment figures describe the initial planned implementation.",
        photo1cap: "Human field evidence",
        photo1body: "Local training and trusted Agri-Entrepreneur relationships ground every record.",
        photo2cap: "Earth observation evidence",
        photo2body: "Satellite imagery helps validate field boundaries and historical land signals.",
      }, "/collage/use-case-farmer.png", "/collage/network-satellite.png"),
      sec("usecases-apps", "use-cases", "Applications grid intro", 2, {
        eyebrow: "Applications",
        h2: "Six decisions. One source of evidence.",
        intro: "The record stays consistent. What changes is the question each organization asks of it.",
      }),
      sec("usecases-implementation", "use-cases", "Initial implementation", 3, {
        eyebrow: "Initial implementation",
        h2: "Satellite Oracle for smallholder agriculture.",
        body: "The first implementation focuses on turning two evidence types into reusable, verifiable records.",
        m1t: "Land", m1b: "Verified field boundaries",
        m2t: "History", m2b: "Sustainability evidence",
        m3t: "Services", m3b: "Finance, insurance, advisory, and markets",
      }),
      sec("usecases-cta", "use-cases", "Final CTA", 4, {
        eyebrow: "Develop the next use case",
        h2: "Which decision needs evidence from the field?",
        cta: "Discuss your use case",
      }),

      sec("partners-hero", "partners", "Hero", 0, {
        eyebrow: "Our Partners",
        h1: "Shared expertise creates shared value.",
        body: "5am.earth brings together field networks, verification technology, infrastructure, and service providers. Every participant contributes something distinct and receives practical value.",
      }, "/collage/network-map.png"),
      sec("partners-infographic", "partners", "Partnership photo", 1, {}, "/collage/partners-pair.png"),
      sec("partners-value", "partners", "Value for every participant", 2, {
        eyebrow: "Value for every participant",
        h2: "Why join the ecosystem?",
        intro: "Partnership is not a logo wall. It is a practical exchange of reach, evidence, infrastructure, capability, and opportunity.",
      }),
      sec("partners-cta", "partners", "Final CTA", 3, {
        eyebrow: "Become a partner",
        h2: "Bring your network, capability, or use case.",
        cta: "Contact us",
      }),

      sec("team-hero", "team", "Hero", 0, {
        eyebrow: "Company Team",
        h1: "Built by people who connect fields, data, and opportunity.",
        body: "5am.earth combines agricultural experience, field delivery, product thinking, Earth observation, and decentralized infrastructure.",
      }, "/collage/team-woman.png"),
      sec("team-structure", "team", "Team structure intro", 1, {
        eyebrow: "Team structure",
        h2: "The capabilities behind the platform.",
        intro: "Replace these role groups with approved team names, titles, portraits, and biographies before launch.",
      }),
      sec("team-cta", "team", "Final CTA", 2, {
        eyebrow: "Connect with the team",
        h2: "Let’s explore what we can build together.",
        cta: "Contact us",
      }),

      sec("contact-hero", "contact", "Hero", 0, {
        eyebrow: "Contact 5am.earth",
        h1: "Let’s grow trust together.",
        body: "Tell us what you are trying to build, verify, fund, source, or understand. We will connect you with the right route.",
      }, "/collage/soil-hand.png"),
      sec("contact-form", "contact", "Form panel", 1, {
        eyebrow: "How can we work together?",
        o1: "Access verified agricultural information",
        o2: "Build a product or service",
        o3: "Contribute field or satellite data",
        o4: "Fund or partner with the ecosystem",
      }),

      sec("casestudies-hero", "case-studies", "Hero", 0, {
        eyebrow: "Case studies",
        h1: "Trust, tested in the field.",
        body: "How field evidence, Earth observation, and secure provenance become practical infrastructure for agricultural services.",
      }, "/collage/finance-grid.png"),
      sec("casestudies-story", "case-studies", "Story + stats + quote", 1, {
        eyebrow: "India / initial deployment",
        h2: "Satellite Oracle for smallholder agriculture.",
        intro: "A collaboration designed around the Syngenta Foundation Agri-Entrepreneur program and its existing farmer relationships.",
        stat1n: "2.4M+", stat1l: "farmers in the established network",
        stat2n: "21K+", stat2l: "trained Agri-Entrepreneurs",
        stat3n: "100K", stat3l: "farmers in the planned initial deployment",
        s1t: "The challenge", s1b: "Farmer and field evidence is repeatedly collected, difficult to reuse, and often disconnected from financial and market services.",
        s2t: "The system", s2b: "Agri-Entrepreneurs capture field data. Satellite data validates boundaries and land signals. Cardano infrastructure records verifiable provenance.",
        s3t: "The first use cases", s3b: "Blockchain-verified land border records and historical sustainability ratings create reusable evidence for services and decisions.",
        s4t: "The intended value", s4b: "Lower risk for financial partners, better service delivery, and new pathways to finance, insurance, markets, and advisory support.",
        quote: "Verified once. Reused across the next service, decision, and opportunity.",
      }),
      sec("casestudies-cta", "case-studies", "Final CTA", 2, {
        eyebrow: "Develop a case study with us",
        h2: "Bring your use case to the shared trust layer.",
        cta: "Start a conversation",
      }),
    ],
    useCases: [
      { id: "uc1", order: 0, title: "Finance and insurance", body: "Verify a field boundary and its history before pricing risk or extending a service." },
      { id: "uc2", order: 1, title: "Markets and procurement", body: "Trace a sourcing claim back to the farmer and field evidence behind it." },
      { id: "uc3", order: 2, title: "Farmer services", body: "Use field history and crop signals to decide what support is needed now." },
      { id: "uc4", order: 3, title: "Sustainability", body: "Compare current claims with historical satellite evidence and recorded fieldwork." },
      { id: "uc5", order: 4, title: "Programs and policy", body: "See who a program reaches and measure change against consistent records." },
      { id: "uc6", order: 5, title: "Products and research", body: "Build a product on permissioned records without collecting the same evidence again." },
    ],
    team: [
      { id: "tm1", order: 0, name: "Foundation leadership", role: "Stewardship & governance", bio: "Stewardship, governance, partnerships, and long-term mission.", photo: "" },
      { id: "tm2", order: 1, name: "Product and data", role: "Product & data", bio: "Farmer-centered products, interoperable data models, and decision-ready intelligence.", photo: "" },
      { id: "tm3", order: 2, name: "Field and program", role: "Field & program", bio: "Agri-Entrepreneur enablement, farmer relationships, training, and local delivery.", photo: "" },
      { id: "tm4", order: 3, name: "Technology and verification", role: "Technology & verification", bio: "Earth observation, secure provenance, identity, and platform infrastructure.", photo: "" },
    ],
    partners: [
      { id: "pt1", order: 0, name: "Syngenta Foundation India", logo: "https://aegf.in/wp-content/uploads/2025/03/SFI_SFI.png", visible: true },
      { id: "pt2", order: 1, name: "Cardano Foundation", logo: "", visible: true },
      { id: "pt3", order: 2, name: "Andamio", logo: "https://www.andamio.io/andamio-logo-w-typography.jpg", visible: true },
    ],
    audiences: [
      { id: "au1", order: 0, visible: true, title: "Financial institutions", body: "Assess a field using evidence that can be verified at its source, then reused at the next decision.", cta: "Explore finance use cases" },
      { id: "au2", order: 1, visible: true, title: "Buyers and supply chains", body: "See where produce came from and which farmer and field records support the claim.", cta: "Explore market use cases" },
      { id: "au3", order: 2, visible: true, title: "Governments and NGOs", body: "Track who a program reaches and what changes in the field without rebuilding the record each time.", cta: "Explore program use cases" },
      { id: "au4", order: 3, visible: true, title: "Builders and researchers", body: "Build products and models on agricultural records shared with permission.", cta: "Build with 5am.earth" },
      { id: "au5", order: 4, visible: true, title: "Agri-Entrepreneurs", body: "Turn fieldwork into a verified contribution that strengthens the next service you provide.", cta: "Join the field network" },
      { id: "au6", order: 5, visible: true, title: "Farmers", body: "Keep one portable farmer and field record for the services you choose to access.", cta: "See the farmer benefit" },
    ],
    settings: {
      headerBg: "#EAE2D7",
      footerTagline: "Grow trust. Create opportunity.",
      footerCopyright: "© {year} 5am.earth Foundation",
      footerMeta: "A neutral foundation for verified agricultural intelligence",
      contactEmail: "info@5am.earth",
      contactEmailLabel: "",
    },
  };

  // Default image position per section: side-by-side hero layouts put the
  // image on the right of the text; the two "case" feature layouts put it
  // on the left — matches how each is actually built today.
  for (const s of content.sections) {
    if (!s.image) continue;
    s.image.position = s.id === "home-case" || s.id === "home-partners" ? "left" : "right";
  }

  return content;
}

export function getContent(): SiteContent {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as SiteContent;
    // Backfill fields added after this file was first saved, so older
    // content.json files on disk pick up new capabilities automatically.
    let needsSave = false;
    if (!parsed.pages) {
      parsed.pages = defaultContent().pages;
      needsSave = true;
    }
    if (!parsed.partners) {
      parsed.partners = defaultContent().partners;
      needsSave = true;
    }
    if (!parsed.audiences) {
      // Migrate legacy a1t/a1b/a1cta..a6* fields out of the home-users
      // section content, if present, so existing edits carry over instead
      // of silently reverting to defaults.
      const usersSection = parsed.sections?.find((s) => s.id === "home-users");
      const legacy = usersSection?.content;
      if (legacy && legacy.a1t) {
        parsed.audiences = [1, 2, 3, 4, 5, 6].map((i) => ({
          id: `au${i}`,
          order: i - 1,
          visible: true,
          title: legacy[`a${i}t`] ?? "",
          body: legacy[`a${i}b`] ?? "",
          cta: legacy[`a${i}cta`] ?? "",
        }));
        for (let i = 1; i <= 6; i++) {
          delete legacy[`a${i}t`];
          delete legacy[`a${i}b`];
          delete legacy[`a${i}cta`];
        }
      } else {
        parsed.audiences = defaultContent().audiences;
      }
      needsSave = true;
    }
    const partnersSection = parsed.sections?.find((s) => s.id === "home-partners");
    if (partnersSection && partnersSection.content.cta2 === undefined) {
      partnersSection.content.cta2 = "Become a partner";
      needsSave = true;
    }
    if (!parsed.settings) {
      parsed.settings = defaultContent().settings;
      needsSave = true;
    }
    if (parsed.settings.footerTagline === undefined) {
      const d = defaultContent().settings;
      parsed.settings.footerTagline = d.footerTagline;
      parsed.settings.footerCopyright = d.footerCopyright;
      parsed.settings.footerMeta = d.footerMeta;
      needsSave = true;
    }
    if (parsed.settings.contactEmail === undefined) {
      parsed.settings.contactEmail = defaultContent().settings.contactEmail;
      needsSave = true;
    }
    if (parsed.settings.contactEmailLabel === undefined) {
      parsed.settings.contactEmailLabel = defaultContent().settings.contactEmailLabel;
      needsSave = true;
    }
    if (partnersSection && partnersSection.content.bullets === undefined) {
      // Carry over the old free-flowing "intro" paragraph as the seed for
      // the new bulleted list — split on existing line breaks/sentences so
      // whatever was already written becomes the first bullets, rather than
      // reverting to the default copy.
      const legacyIntro = partnersSection.content.intro ?? "";
      const lines = legacyIntro
        .split(/\n+/)
        .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z])/))
        .map((s) => s.trim())
        .filter(Boolean);
      partnersSection.content.bullets = lines.length > 0 ? lines.join("\n") : defaultContent().sections.find((s) => s.id === "home-partners")!.content.bullets;
      delete partnersSection.content.intro;
      needsSave = true;
    }
    if (partnersSection && !partnersSection.image) {
      partnersSection.image = { src: "/collage/case-study-map.png", scale: 100 };
      needsSave = true;
    }
    for (const s of parsed.sections ?? []) {
      if (s.image && !s.image.position) {
        s.image.position = s.id === "home-case" || s.id === "home-partners" ? "left" : "right";
        needsSave = true;
      }
    }
    if (needsSave) {
      try {
        saveContent(parsed);
      } catch {
        // read-only fs — serve the backfilled value without persisting
      }
    }
    return parsed;
  } catch {
    const fallback = defaultContent();
    try {
      saveContent(fallback);
    } catch {
      // read-only fs (e.g. some deploy targets) — serve defaults without persisting
    }
    return fallback;
  }
}

export function saveContent(content: SiteContent) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export function getSection(content: SiteContent, id: string): Section | undefined {
  return content.sections.find((s) => s.id === id);
}

export function pageSections(content: SiteContent, page: string): Section[] {
  return content.sections.filter((s) => s.page === page).sort((a, b) => a.order - b.order);
}

export function sectionStyle(s?: Section): CSSProperties {
  if (!s) return {};
  const style: Record<string, string | number> = {};
  if (s.style.bg) style.background = s.style.bg;
  if (s.style.textColor) {
    style.color = s.style.textColor;
    style["--section-text"] = s.style.textColor;
  }
  if (s.style.marginY) {
    style.marginTop = s.style.marginY;
    style.marginBottom = s.style.marginY;
  }
  return style as CSSProperties;
}

export function sectionClassName(s?: Section): string {
  if (!s) return "";
  const cls: string[] = [];
  if (s.style.padding === "contained") cls.push("section-contained");
  if (s.style.rounded) cls.push("section-rounded");
  return cls.join(" ");
}

export function t(s: Section | undefined, key: string, fallback = ""): string {
  return s?.content?.[key] ?? fallback;
}

export function typographyCss(tp: Typography): string {
  const role = (r: TypeStyle) =>
    `--f-family: '${r.family}', Manrope, Arial, sans-serif; --f-size: ${r.size}px; --f-ls: ${r.letterSpacing / 1000}em; --f-lh: ${r.lineHeight / 100};`;
  return `
    :root {
      --tp-headline-family: '${tp.headline.family}', Manrope, Arial, sans-serif;
      --tp-headline-size: ${tp.headline.size}px;
      --tp-headline-ls: ${tp.headline.letterSpacing / 1000}em;
      --tp-headline-lh: ${tp.headline.lineHeight / 100};
      --tp-number-family: '${tp.number.family}', Manrope, Arial, sans-serif;
      --tp-number-size: ${tp.number.size}px;
      --tp-number-ls: ${tp.number.letterSpacing / 1000}em;
      --tp-number-lh: ${tp.number.lineHeight / 100};
      --tp-body-family: '${tp.body.family}', Manrope, Arial, sans-serif;
      --tp-body-size: ${tp.body.size}px;
      --tp-body-ls: ${tp.body.letterSpacing / 1000}em;
      --tp-body-lh: ${tp.body.lineHeight / 100};
      --tp-caption-family: '${tp.caption.family}', Manrope, Arial, sans-serif;
      --tp-caption-size: ${tp.caption.size}px;
      --tp-caption-ls: ${tp.caption.letterSpacing / 1000}em;
      --tp-caption-lh: ${tp.caption.lineHeight / 100};
    }
  `;
}

export function siteSettingsCss(settings: SiteSettings): string {
  return `
    :root {
      --header-bg: ${settings.headerBg || "#EAE2D7"};
    }
  `;
}
