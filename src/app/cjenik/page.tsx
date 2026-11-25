import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ADNAN_EMAIL, PRICE_ANCHOR_LABEL, PRICE_RANGE_NOTE } from "@/content/packages";
import { archiveDays } from "@/lib/pricing/cjenik";
import { getPriceList } from "@/lib/content/packages";

export const metadata: Metadata = {
  title: "Cjenik",
  description:
    "Cijene online coachinga, paketa od 12 tjedana, natjecateljskih priprema, edukacije, konzultacija i osobnih treninga.",
  alternates: { canonical: "/cjenik" },
};

function mailto(subject: string) {
  return `mailto:${ADNAN_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const revalidate = 3600;

export default async function PricingPage() {
  const [priceList, days] = await Promise.all([getPriceList(), archiveDays()]);
  return (
    <PageShell>
      <section className="px-5 pt-32 pb-12 lg:pt-44 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-brand-yellow uppercase">
            <span className="h-0.5 w-8 bg-brand-yellow" />
            Sve usluge na jednom mjestu
          </p>
          <h1 className="mt-5 animate-rise font-display text-[clamp(4.5rem,14vw,10rem)] leading-[0.82]">
            Cjenik
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Online paketi biraju se putem prijave na stranici. Za konzultacije, treninge uživo i
            seminare javi mi se izravno pa dogovaramo termin.
          </p>
        </div>
      </section>

      <nav
        aria-label="Kategorije cjenika"
        className="sticky top-[72px] z-20 border-y border-brand-line bg-brand-black/95 lg:top-20"
      >
        <ul className="mx-auto flex max-w-7xl [scrollbar-width:none] gap-2 overflow-x-auto px-5 py-3">
          {priceList.map((g) => (
            <li key={g.id} className="shrink-0">
              <a
                href={`#${g.id}`}
                className="inline-flex min-h-10 items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white/80 transition-colors hover:border-brand-yellow hover:text-white"
              >
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-16 lg:space-y-24">
          {priceList.map((group) => {
            const online = group.id === "online";
            return (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={`${group.id}-naslov`}
                className="grid scroll-mt-40 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16"
              >
                <div>
                  <h2
                    id={`${group.id}-naslov`}
                    className="font-display text-5xl leading-none sm:text-6xl"
                  >
                    {group.title}
                  </h2>
                  <p className="mt-4 max-w-sm text-white/60">{group.text}</p>
                  {!online && (
                    <a
                      href={mailto(`Upit: ${group.title}`)}
                      className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md border border-white/15 px-5 font-semibold transition-colors hover:border-brand-yellow hover:text-brand-yellow"
                    >
                      Dogovori termin
                      <ArrowRightIcon />
                    </a>
                  )}
                </div>
                <ul className="divide-y divide-brand-line border-y border-brand-line">
                  {group.items.map((item) => {
                    const body = (
                      <>
                        <span className="min-w-0">
                          <span className="block text-lg font-semibold">{item.name}</span>
                          {item.detail && (
                            <span className="mt-1 block text-sm text-white/55">{item.detail}</span>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center gap-4">
                          <span className="text-right">
                            <span className="block font-display text-3xl leading-none whitespace-nowrap sm:text-4xl">
                              {item.price}
                            </span>
                            {item.unit && (
                              <span className="mt-1 block text-xs font-semibold text-white/55">
                                {item.unit}
                              </span>
                            )}
                            <span className="mt-1 block text-[11px] whitespace-nowrap text-white/60">
                              {PRICE_ANCHOR_LABEL}: {item.anchor ?? item.price}
                            </span>
                          </span>
                          {item.href && (
                            <ArrowRightIcon className="size-5 text-brand-yellow transition-transform group-hover:translate-x-1" />
                          )}
                        </span>
                      </>
                    );
                    return (
                      <li key={item.name}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="group flex items-center justify-between gap-6 py-5 transition-colors hover:bg-brand-surface/60 sm:px-4"
                          >
                            {body}
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between gap-6 py-5 sm:px-4">
                            {body}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <div className="grid gap-4 rounded-lg border border-brand-line bg-brand-surface p-6 sm:p-8 lg:grid-cols-3 lg:gap-10">
            <div>
              <h2 className="font-display text-3xl leading-none text-brand-yellow">Valuta</h2>
              <p className="mt-3 text-white/70">Sve cijene su izražene u eurima i uključuju PDV.</p>
            </div>
            <div>
              <h2 className="font-display text-3xl leading-none text-brand-yellow">Plaćanje</h2>
              <p className="mt-3 text-white/70">
                Način uplate dogovaramo nakon prijave, prije početka suradnje.
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl leading-none text-brand-yellow">
                Rasponi cijena
              </h2>
              <p className="mt-3 text-white/70">{PRICE_RANGE_NOTE}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-brand-line p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl leading-none">Strojno čitljiv cjenik</h2>
                <p className="mt-2 max-w-xl text-sm text-white/60">
                  Cjenik u XML formatu ažurira se svaki dan do 8 sati. Cjenici prethodnih 30 dana
                  ostaju dostupni.
                </p>
              </div>
              <a
                href="/cjenik.xml"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-bold text-brand-black transition-colors hover:bg-white"
              >
                Današnji cjenik (XML)
                <ArrowRightIcon className="size-4" />
              </a>
            </div>
            {days.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2 text-[13px]">
                {days.map((d) => (
                  <li key={d}>
                    <a
                      href={`/cjenik/${d}.xml`}
                      className="inline-flex h-8 items-center rounded-full border border-white/15 px-3 text-white/70 tabular-nums transition-colors hover:border-white/40 hover:text-white"
                    >
                      {d.split("-").reverse().join(". ")}.
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
