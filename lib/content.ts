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

export interface SiteContent {
  typography: Typography;
  pages: PageMeta[];
  sections: Section[];
  useCases: UseCase[];
  team: TeamMember[];
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
  return {
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
        sub2: "5am.earth makes verified farmer and field data reusable across the agricultural value chain.",
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
      sec("home-users", "home", "Audiences intro + cards", 3, {
        eyebrow: "One foundation, many users",
        h2: "Start with the value you need.",
        intro: "One verified record can answer different questions. Choose the decision you need to make.",
        a1t: "Financial institutions", a1b: "Assess a field using evidence that can be checked at its source, then reused at the next decision.", a1cta: "Explore finance use cases",
        a2t: "Buyers and supply chains", a2b: "See where produce came from and which farmer and field records support the claim.", a2cta: "Explore market use cases",
        a3t: "Governments and NGOs", a3b: "Track who a program reaches and what changes in the field without rebuilding the record each time.", a3cta: "Explore program use cases",
        a4t: "Builders and researchers", a4b: "Build products and models on agricultural records shared with permission.", a4cta: "Build with 5am.earth",
        a5t: "Agri-Entrepreneurs", a5b: "Turn fieldwork into a verified contribution that strengthens the next service you provide.", a5cta: "Join the field network",
        a6t: "Farmers", a6b: "Keep one portable farmer and field record for the services you choose to access.", a6cta: "See the farmer benefit",
      }),
      sec("home-outcome", "home", "Farmer outcome", 4, {
        eyebrow: "The farmer-centered outcome",
        h2: "The record stays useful after the first check.",
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
        intro: "Syngenta Foundation India brings the field network. Technical partners contribute satellite checks, training and the record infrastructure.",
        cta: "Meet our partners",
      }),
      sec("home-lead", "home", "Lead form CTA", 7, {
        eyebrow: "Build the next use case",
        h2: "Which decision needs better field evidence?",
        body: "Tell us what you need to decide and what evidence you have today. We will map the missing checks and the right partners.",
        cta: "Start the conversation",
      }),

      sec("process-hero", "process", "Hero", 0, {
        eyebrow: "The Process",
        h1: "One field record. Four checks before it travels.",
        body: "5am.earth connects local evidence with satellite checks, consent and a traceable record of origin.",
      }, "/collage/process-flow.png"),
      sec("process-stages", "process", "Four stage cards + infographic", 1, {
        s1t: "Capture", s1b: "An Agri-Entrepreneur records the farmer, field and activity where the work happens.",
        s2t: "Validate", s2b: "Satellite imagery checks field boundaries against current signals and land history.",
        s3t: "Authenticate", s3b: "Identity and consent are attached to the evidence. Its source can now be traced.",
        s4t: "Reuse", s4b: "The farmer can permit the same record to support another service or decision.",
      }, "/collage/verification-stack-bone.png"),
      sec("process-why", "process", "Why different", 2, {
        eyebrow: "Why this is different",
        h2: "Verify the evidence once. Keep its history.",
        o1: "Fewer repeated field checks",
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
        o1: "Access verified agricultural data",
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
        s2t: "The system", s2b: "Agri-Entrepreneurs capture field information. Satellite data validates boundaries and land signals. Cardano infrastructure records verifiable provenance.",
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
      { id: "uc1", order: 0, title: "Finance and insurance", body: "Check a field boundary and its history before pricing risk or extending a service." },
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
  };
}

export function getContent(): SiteContent {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as SiteContent;
    // Backfill fields added after this file was first saved, so older
    // content.json files on disk pick up new capabilities automatically.
    if (!parsed.pages) {
      parsed.pages = defaultContent().pages;
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
