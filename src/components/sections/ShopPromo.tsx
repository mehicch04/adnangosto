import { ArrowRightIcon } from "@/components/ui/icons";
import { CopyCode } from "@/components/sections/CopyCode";
import { site } from "@/content/site";

export function ShopPromo() {
  const { url, code, discount } = site.shop;
  if (!url) return null;
  return (
    <section aria-labelledby="shop-naslov" className="px-5 pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate grid gap-8 overflow-hidden rounded-lg bg-brand-yellow p-8 text-brand-black sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-16">
          <svg
            aria-hidden="true"
            viewBox="0 0 300 150"
            className="pointer-events-none absolute -right-8 -bottom-12 -z-10 h-72 w-auto select-none"
          >
            <text
              x="300"
              y="150"
              textAnchor="end"
              fill="#0a0a0a"
              fillOpacity="0.07"
              style={{ fontFamily: "var(--font-display)", fontSize: 180 }}
            >
              {discount}
            </text>
          </svg>
          <div>
            <p className="text-sm font-bold tracking-[0.2em] uppercase">Web shop</p>
            <h2 id="shop-naslov" className="mt-3 font-display text-6xl leading-[0.88] sm:text-7xl">
              {discount} popusta preko ove stranice
            </h2>
            <p className="mt-5 max-w-md text-lg font-semibold">
              Suplementi i oprema iz mog web shopa. Popust važi kad kupuješ preko ovog linka.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            {code && <CopyCode code={code} />}
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="group inline-flex min-h-14 items-center gap-3 rounded-md bg-brand-black px-8 text-lg font-bold text-white transition-colors hover:text-brand-yellow"
            >
              Otvori web shop
              <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
