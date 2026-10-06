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
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { MobileCta } from "@/components/sections/MobileCta";
import { SiteFooter } from "@/components/sections/SiteFooter";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
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
        <Process />
        <About />
        <Faq />
        <FinalCta />
        <InstagramFeed />
      </main>
      <SiteFooter />
      <MobileCta />
    </>
  );
}
