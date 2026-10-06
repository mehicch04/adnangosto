/*
  SPONZORI: traka logotipa. Ako nema nijednog, sekcija se uopšte ne crta,
  da na sajtu nikad ne stoji prazna ili zastarjela lista.
*/
import Image from "next/image";
import { sponsors } from "@/content/site";

export function Sponsors() {
  if (sponsors.length === 0) return null;

  return (
    <section aria-label="Sponzori" className="border-t border-brand-line px-5 py-12">
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {sponsors.map((s) => (
          <li key={s.name}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
              <Image
                src={s.logo}
                alt={s.name}
                width={140}
                height={48}
                className="h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
