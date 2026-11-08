import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Packages } from "@/components/sections/Packages";
import { ClientResults } from "@/components/sections/ClientResults";
import { Transformations } from "@/components/sections/Transformations";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { FinalCta } from "@/components/sections/FinalCta";
import { Faq } from "@/components/sections/Faq";
import { BackToTop } from "@/components/sections/BackToTop";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { MobileCta } from "@/components/sections/MobileCta";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { ShopPromo } from "@/components/sections/ShopPromo";
import { packages } from "@/content/packages";
import { site } from "@/content/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Početna | Adnan Gosto" },
};

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Adnan Gosto",
    url: siteUrl,
    image: `${siteUrl}/images/hero-gym.jpg`,
    jobTitle: "IFBB Pro i trener",
    sameAs: [site.instagram],
    makesOffer: packages.map((p) => ({
      "@type": "Offer",
      price: p.price,
      priceCurrency: "EUR",
      url: `${siteUrl}/paketi/${p.slug}`,
      itemOffered: { "@type": "Service", name: p.name, description: p.tagline },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#sadrzaj"
        className="sr-only z-50 rounded bg-brand-yellow px-4 py-2 font-semibold text-brand-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Preskoči na sadržaj
      </a>
      <SiteHeader />
      <main id="sadrzaj">
        <Hero />
        <Marquee />
        <Packages />
        <ClientResults />
        <Transformations />
        <Testimonials />
        <Process />
        <About />
        <ShopPromo />
        <Faq />
        <FinalCta />
        <InstagramFeed />
      </main>
      <SiteFooter />
      <BackToTop />
      <MobileCta />
    </>
  );
}
