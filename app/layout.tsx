import type { Metadata, Viewport } from "next";
import { Literata, Manrope } from "next/font/google";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProvider } from "@/components/motion-provider";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Literata: editorial serif with optical sizes and full Cyrillic support.
const literata = Literata({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-literata",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const t = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: t.meta.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: t.meta.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.ogLocale,
    url: "/",
    title: t.meta.title,
    description: t.meta.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.locale} className={`${literata.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="meta sr-only z-[60] bg-ink px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t.a11y.skipToContent}
        </a>
        <DemoBanner />
        <MotionProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
