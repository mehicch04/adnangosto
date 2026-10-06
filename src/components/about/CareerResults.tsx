import { resultsByYear, type Result } from "@/content/about";

function Place({ place }: { place: Result["place"] }) {
  const gold = place === 1;
  const pro = place === "Pro";
  return (
    <span
      className={`grid size-14 shrink-0 place-items-center rounded-xl font-display text-2xl leading-none ${
        pro
          ? "bg-brand-black text-brand-yellow"
          : gold
            ? "bg-brand-yellow text-brand-black"
            : "border-2 border-brand-black/15 text-brand-black"
      }`}
    >
      {pro ? "Pro" : `${place}.`}
    </span>
  );
}

export function CareerResults() {
  return (
    <section
      id="titule"
      className="scroll-mt-24 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="font-display text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
            Takmičarska
            <br />
            karijera
          </h2>
          <p className="max-w-lg text-lg text-brand-ink-muted lg:justify-self-end">
            Svaki nastup od prvog državnog prvenstva do IFBB Pro lige. Apsolutni prvak znači pobjedu
            nad pobjednicima svih kategorija.
          </p>
        </div>

        <ol className="mt-16 space-y-4">
          {resultsByYear.map((y) => (
            <li
              key={y.year}
              className="grid gap-6 rounded-2xl border border-brand-paper-line bg-white p-6 lg:grid-cols-[220px_1fr] lg:gap-10 lg:p-10"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="font-display text-7xl leading-none lg:text-8xl">{y.year}</p>
                {y.highlight && (
                  <p className="mt-3 inline-block rounded-full bg-brand-black px-3 py-1 text-sm font-semibold text-brand-yellow">
                    {y.highlight}
                  </p>
                )}
              </div>
              <ul className="divide-y divide-brand-paper-line">
                {y.results.map((r) => (
                  <li
                    key={r.event + r.place}
                    className="flex items-center gap-5 py-4 first:pt-0 last:pb-0"
                  >
                    <Place place={r.place} />
                    <div className="min-w-0">
                      <p className="text-lg leading-snug font-semibold">
                        {r.event}
                        {r.overall && (
                          <span className="ml-2 inline-block rounded bg-brand-yellow px-2 py-0.5 align-middle text-xs font-semibold text-brand-black">
                            Apsolutni pobjednik
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-brand-ink-muted">
                        {[r.category, r.location, r.note].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
