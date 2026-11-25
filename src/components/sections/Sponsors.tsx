import Image from "next/image";
import { getSponsors, type Sponsor } from "@/lib/content/sponsors";

function Logo({ s }: { s: Sponsor }) {
  return s.logo ? (
    <Image
      src={s.logo}
      alt={s.name}
      width={240}
      height={96}
      sizes="200px"
      className="h-12 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14"
    />
  ) : (
    <span className="font-display text-3xl leading-none text-brand-black">{s.name}</span>
  );
}

export async function Sponsors() {
  const sponsors = await getSponsors();
  if (sponsors.length === 0) return null;
  const tile =
    "group grid h-28 place-items-center rounded-lg bg-white px-6 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.9)] transition-[transform,box-shadow] duration-300 sm:h-32";

  return (
    <section
      aria-labelledby="sponzori-naslov"
      className="border-t border-brand-line px-5 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-brand-yellow uppercase">
          <span className="h-0.5 w-8 bg-brand-yellow" />
          Sponzori i suradnje
        </p>
        <h2
          id="sponzori-naslov"
          className="mt-4 font-display text-5xl leading-[0.9] sm:text-6xl lg:text-7xl"
        >
          Uz mene <span className="text-brand-yellow">stoje</span>
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {sponsors.map((s) => (
            <li key={s.id}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  aria-label={`${s.name}, otvara se u novoj kartici`}
                  className={`${tile} hover:-translate-y-1 hover:shadow-[0_28px_48px_-26px_rgba(237,177,45,0.55)]`}
                >
                  <Logo s={s} />
                </a>
              ) : (
                <div className={tile}>
                  <Logo s={s} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
