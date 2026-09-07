import Image from "next/image";
import type { Section } from "../lib/content";

export default function SectionMedia({ section, alt }: { section?: Section; alt: string }) {
  if (!section?.image?.src) return null;
  return (
    <div className="infographic-figure" style={{ width: `${section.image.scale}%`, margin: "48px auto 0" }}>
      <Image src={section.image.src} alt={alt} width={1400} height={900} />
    </div>
  );
}
