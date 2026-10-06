import Image from "next/image";
import Link from "next/link";
import { clientResults, coachingTotals } from "@/content/site";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

export function ClientResults() {
  return (
    <section id="rezultati" className="scroll-mt-24 px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]">
              Moji takmičari
              <br />
              <span className="text-brand-yellow">na bini</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-brand-muted">
              Od državnih prvenstava do Arnold Classica i svjetskog prvenstva. Ljudi koje sam
              pripremao za takmičenja.
            </p>
          </div>
          <dl className="grid grid-cols-4 border-t border-brand-line pt-6 lg:border-t-0 lg:pt-0">
            {coachingTotals.map((t, i) => (
              <div key={t.label} className={i > 0 ? "border-l border-brand-line pl-4 lg:pl-6" : ""}>
                <dt className="font-display text-4xl leading-none text-brand-yellow sm:text-5xl lg:text-6xl">
                  {t.value}
                </dt>
                <dd className="mt-2 text-xs text-brand-muted sm:text-sm">{t.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {clientResults.map((c) => (
            <li
              key={c.name}
              tabIndex={0}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-surface outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
            >
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-brand-raised">
                  <span className="text-outline font-display text-[9rem] leading-none">
                    {initials(c.name)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
              <div className="absolute inset-0 bg-brand-black/0 transition-colors duration-500 lg:group-hover:bg-brand-black/60 lg:group-focus-visible:bg-brand-black/60" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="inline-block rounded-sm bg-brand-yellow px-2 py-0.5 text-xs font-bold tracking-[0.12em] text-brand-black uppercase">
                  {c.title}
                </p>
                <h3 className="mt-3 font-display text-4xl leading-none lg:text-5xl">{c.name}</h3>
                <div className="grid transition-[grid-template-rows] duration-500 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]">
                  <ul className="overflow-hidden">
                    {c.results.map((r) => (
                      <li key={r} className="mt-3 flex gap-3 text-sm text-white/85 first:mt-4">
                        <span className="mt-2 h-0.5 w-4 shrink-0 bg-brand-yellow" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}

          <li className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-yellow text-brand-black">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-6 font-display text-[12rem] leading-none text-brand-black/10"
            >
              Ti?
            </span>
            <Link
              href="/#saradnja"
              className="group relative flex h-full flex-col justify-between p-8"
            >
              <span className="text-sm font-bold tracking-[0.14em] uppercase">
                Sljedeće ime na listi
              </span>
              <span>
                <span className="block font-display text-6xl leading-[0.9] lg:text-7xl">
                  Želiš
                  <br />
                  na binu?
                </span>
                <span className="mt-4 block max-w-xs font-semibold">
                  Prijavi se za pripremu i budi sljedeći takmičar na ovoj listi.
                </span>
                <span className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-sm bg-brand-black px-6 text-[13px] font-bold tracking-[0.14em] text-white uppercase transition-colors group-hover:text-brand-yellow">
                  Prijavi se
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                  >
                    <path
                      d="M5 12h14m0 0-6-6m6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
