import Link from "next/link";
import { coachingHighlights, coachingTitles, mentors } from "@/content/about";

export function CoachLegacy() {
  return (
    <section className="px-5 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl">
            Učio od <span className="text-brand-yellow">najboljih</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-brand-muted">
            Saradnja s vrhunskim trenerima donijela je iskustvo koje danas prenosim na svoje
            takmičare.
          </p>
          <ul className="mt-10 divide-y divide-brand-line border-y border-brand-line">
            {mentors.map((m) => (
              <li key={m.name} className="group flex items-baseline justify-between gap-6 py-6">
                <span className="font-display text-4xl leading-none transition-colors group-hover:text-brand-yellow lg:text-5xl">
                  {m.name}
                </span>
                <span className="text-right text-sm text-brand-muted">{m.origin}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-brand-yellow p-8 text-brand-black lg:p-12">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -bottom-10 font-display text-[11rem] leading-none text-brand-black/10"
          >
            Coach
          </span>
          <h2 className="relative font-display text-5xl leading-[0.9] lg:text-6xl">
            Moji takmičari
          </h2>
          <dl className="relative mt-8 grid grid-cols-4 gap-4 border-y border-brand-black/20 py-6">
            {coachingHighlights.map((h) => (
              <div key={h.label}>
                <dt className="font-display text-4xl leading-none lg:text-5xl">{h.value}</dt>
                <dd className="mt-1 text-xs font-semibold lg:text-sm">{h.label}</dd>
              </div>
            ))}
          </dl>
          <ul className="relative mt-8 space-y-3">
            {coachingTitles.map((t) => (
              <li key={t} className="flex items-center gap-3 font-semibold">
                <span className="h-0.5 w-6 bg-brand-black" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/#rezultati"
            className="relative mt-10 inline-flex min-h-14 items-center rounded-md bg-brand-black px-7 text-lg font-semibold text-white transition-colors hover:text-brand-yellow"
          >
            Rezultati takmičara
          </Link>
        </div>
      </div>
    </section>
  );
}
