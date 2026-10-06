/*
  Završni poziv na akciju. Ko je doskrolao do dna, razmišlja, i treba mu
  jedno jasno dugme, bez ponovnog traženja po stranici.
*/
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section id="kontakt" className="scroll-mt-20 px-5 pb-20 lg:pb-28">
      <div className="mx-auto max-w-6xl rounded-2xl border border-brand-yellow/40 bg-brand-surface px-6 py-14 text-center sm:px-12">
        <h2 className="font-display text-5xl leading-none sm:text-6xl">
          Spreman za <span className="text-brand-yellow">prvi korak?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-muted">
          Izaberi paket, popuni prijavu za par minuta i javljam ti se s konkretnim prijedlogom.
        </p>
        <div className="mt-8">
          <Button href="#saradnja">Izaberi saradnju</Button>
        </div>
      </div>
    </section>
  );
}
