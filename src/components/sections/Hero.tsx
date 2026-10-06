/*
  HERO: prvih pet sekundi. Mora reći ko je, šta radi i gdje se klikne.

  Raspored (mobitel prvi):
    mobitel:  tekst -> fotografija ispod
    desktop:  tekst lijevo | fotografija desno

  Potpis dizajna je kosa linija iz njegovog loga (rez između G i A).
  Fotografija je odsječena tom istom kosinom, a iza nje viri žuta traka.
  To je jedini "glasni" element na stranici, sve ostalo je mirno.
*/
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-12 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pt-20 lg:pb-24">
        {/* ---------- TEKST ---------- */}
        <div>
          <p className="font-semibold text-brand-yellow">{hero.kicker}</p>

          {/* Bebas je sam po sebi velikim slovima, pa uppercase ne treba.
              leading-[0.9]: veliki naslovi trebaju zbijene redove, inače se raspadnu */}
          <h1 className="mt-3 font-display text-[clamp(3.5rem,13vw,7.5rem)] leading-[0.88]">
            {hero.title}
            <br />
            <span className="text-brand-yellow">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-brand-muted">{hero.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* ---------- FOTOGRAFIJA ---------- */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {/* Žuta kosa traka: ista kosina kao rez između G i A u logu.
              Pomjerena je lijevo od slike (-translate-x-5), pa viri kao ivica. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -translate-x-5 bg-brand-yellow"
            style={{ clipPath: "polygon(24% 0, 28% 0, 4% 100%, 0 100%)" }}
          />
          {/* Slika odsječena istom kosinom: lijeva ivica ide od 24% gore do 0 dolje */}
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ clipPath: "polygon(24% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            {/* priority: najveća slika iznad pregiba, Google je mjeri za LCP ocjenu.
                sizes: govori pregledniku koju veličinu da skine na kojem ekranu */}
            <Image
              src="/images/adnan-hero.jpg"
              alt="Adnan Gosto"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover object-top"
            />
            {/* blagi prelaz u crnu pri dnu, da se slika stopi s pozadinom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-black to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
