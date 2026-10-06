import { clientResults, coachingTotals } from "@/content/site";

export function ClientResults() {
  return (
    <section id="rezultati" className="scroll-mt-16 px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
              Moji takmičari
              <br />
              <span className="text-brand-yellow">na bini</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-brand-muted">
              Od državnih prvenstava do Arnold Classica i svjetskog prvenstva. Rezultati ljudi koje
              sam pripremao za takmičenja.
            </p>
            <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-brand-line pt-8">
              {coachingTotals.map((t) => (
                <div key={t.label}>
                  <dt className="font-display text-4xl leading-none text-white lg:text-5xl">
                    {t.value}
                  </dt>
                  <dd className="mt-1 text-xs text-brand-muted lg:text-sm">{t.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ol className="divide-y divide-brand-line border-y border-brand-line">
            {clientResults.map((c) => (
              <li key={c.name} className="group grid gap-3 py-7 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
                <div>
                  <h3 className="font-display text-4xl leading-none transition-colors group-hover:text-brand-yellow">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-brand-yellow">{c.title}</p>
                </div>
                <ul className="space-y-1.5 text-brand-muted">
                  {c.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
