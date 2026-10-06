/*
  POČETNA: jedna duga stranica, sekcije redom.
  Raspored prati J3U logiku, prilagođen jednom čovjeku umjesto akademiji:

    Hero          ko je, šta radi, dugme
    Credentials   dokaz odmah ispod (IFBB Pro...)
    Packages      izbor puta + paketi + link na upitnik
    Process       kako izgleda saradnja, korak po korak
    Transform.    rezultati klijenata
    About         lična priča
    Sponsors      (samo ako ih ima)
    FinalCta      zadnji poziv

  revalidate = 60: stranica je statična i služi se trenutno, a Next je
  u pozadini osvježi najviše jednom u minuti ako se nešto promijeni u bazi.
*/
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { Credentials } from "@/components/sections/Credentials";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { Transformations } from "@/components/sections/Transformations";
import { About } from "@/components/sections/About";
import { Sponsors } from "@/components/sections/Sponsors";
import { FinalCta } from "@/components/sections/FinalCta";
import { SiteFooter } from "@/components/sections/SiteFooter";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      {/* Preskoči na sadržaj: korisnici tastature ne moraju prolaziti kroz meni */}
      <a
        href="#sadrzaj"
        className="sr-only z-50 rounded bg-brand-yellow px-4 py-2 font-semibold text-brand-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Preskoči na sadržaj
      </a>

      <SiteHeader />

      <main id="sadrzaj">
        <Hero />
        <Credentials />
        <Packages />
        <Process />
        <Transformations />
        <About />
        <Sponsors />
        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}
