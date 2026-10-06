import Image from "next/image";
import Link from "next/link";
import type { Sponsor, SponsorStyle } from "@/content/site";
import { getSponsors } from "@/lib/content";

const wordmark: Record<SponsorStyle, string> = {
  display: "font-display text-3xl tracking-wide lg:text-4xl",
  heavy: "font-body text-lg font-black tracking-tight uppercase lg:text-xl",
  italic: "font-body text-xl font-extrabold italic tracking-tight uppercase lg:text-2xl",
  wide: "font-body text-sm font-bold tracking-[0.32em] uppercase lg:text-base",
};

function Mark({
  sponsor,
  className,
  large,
}: {
  sponsor: Sponsor;
  className: string;
  large?: boolean;
}) {
  if (sponsor.logo) {
    return (
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={180}
        height={60}
        className={`${large ? "h-16 lg:h-20" : "h-10 lg:h-12"} w-auto object-contain ${className}`}
      />
    );
  }
  return (
    <span
      className={`leading-none ${large ? "font-display text-6xl lg:text-7xl" : `text-center ${wordmark[sponsor.style ?? "heavy"]}`} ${className}`}
    >
      {sponsor.name}
    </span>
  );
}

function Cell({ sponsor }: { sponsor: Sponsor }) {
  const inner = (
    <Mark
      sponsor={sponsor}
      className="text-white/60 transition-colors duration-300 group-hover:text-white"
    />
  );
  const base =
    "group grid min-h-28 place-items-center bg-brand-black px-4 py-8 transition-colors duration-300 hover:bg-brand-surface lg:min-h-36";
  return sponsor.url ? (
    <li className="contents">
      <a href={sponsor.url} target="_blank" rel="noopener noreferrer sponsored" className={base}>
        {inner}
      </a>
    </li>
  ) : (
    <li className={base}>{inner}</li>
  );
}

export async function Sponsors() {
  const [main, ...rest] = await getSponsors();
  if (!main) return null;
  const partners = rest.slice(0, 7);
  const mobileSpan = partners.length % 2 === 0 ? "col-span-2" : "";
  const desktopSpan = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-2", "lg:col-span-1"][
    partners.length % 4
  ];

  return (
    <section aria-labelledby="sponzori-naslov" className="px-5 pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-yellow uppercase">
              Sponzori i partneri
            </p>
            <h2
              id="sponzori-naslov"
              className="mt-3 font-display text-6xl leading-[0.88] sm:text-7xl"
            >
              Iza mene <span className="text-brand-yellow">stoje</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-white/65 lg:justify-self-end">
            Brendovi čije proizvode koristim u pripremi i koji podržavaju moj rad na bini i van nje.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-brand-line bg-brand-line lg:grid-cols-12">
          <div className="flex min-h-56 flex-col justify-between bg-brand-yellow p-7 text-brand-black lg:col-span-4 lg:min-h-0 lg:p-9">
            <p className="text-xs font-bold tracking-[0.2em] uppercase">Glavni sponzor</p>
            <div>
              <Mark sponsor={main} large className="block text-brand-black" />
              {main.url && (
                <a
                  href={main.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.14em] uppercase underline-offset-4 hover:underline"
                >
                  Posjeti stranicu
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-px lg:col-span-8 lg:grid-cols-4">
            {partners.map((s) => (
              <Cell key={s.name} sponsor={s} />
            ))}
            <li className={`bg-brand-black ${mobileSpan} ${desktopSpan}`}>
              <Link
                href="#kontakt"
                className="group flex h-full min-h-28 flex-col items-center justify-center gap-2 border border-dashed border-white/15 px-4 py-8 text-center transition-colors duration-300 hover:border-brand-yellow lg:min-h-36"
              >
                <span className="grid size-9 place-items-center rounded-full border border-white/25 text-xl leading-none transition-colors group-hover:border-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-black">
                  +
                </span>
                <span className="text-[12px] font-bold tracking-[0.16em] text-white/70 uppercase group-hover:text-white">
                  Postani partner
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
