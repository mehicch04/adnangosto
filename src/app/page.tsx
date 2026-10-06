/*
  Pocetna = jedna duga stranica koja se skrola, sekcije redom kao u ponudi.
  Ovo je Server Component (nema "use client"), pa ce kasnije citati iz baze
  direktno na serveru, bez ikakvog JavaScripta u pregledniku. Zato je brza.
*/
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Packages } from "@/components/sections/Packages";
import { Transformations } from "@/components/sections/Transformations";
import { Sponsors } from "@/components/sections/Sponsors";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Packages />
      <Transformations />
      <Sponsors />
      <Contact />
    </main>
  );
}
