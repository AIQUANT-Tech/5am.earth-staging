import type { Metadata } from "next";
import "./globals.css";
import { getContent, typographyCss } from "../lib/content";


export const metadata: Metadata = {
  title: "5am.Earth | Grow trust. Create opportunity.",
  description:
    "5am.Earth makes verified farmer and field data reusable across the agricultural value chain.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = getContent();
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: typographyCss(content.typography) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
