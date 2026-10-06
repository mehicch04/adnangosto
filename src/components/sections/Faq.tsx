import { faq } from "@/content/site";

export function Faq() {
  return (
    <section
      id="pitanja"
      className="scroll-mt-24 bg-brand-paper px-5 py-24 text-brand-black lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]">
            Česta
            <br />
            pitanja
          </h2>
          <p className="mt-6 max-w-sm text-lg text-brand-ink-muted">
            Odgovori na ono što me ljudi najčešće pitaju prije prve prijave.
          </p>
        </div>
        <div className="border-t-2 border-brand-black">
          {faq.map((item) => (
            <details key={item.q} className="faq-item group border-b border-brand-paper-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-semibold transition-transform duration-300 group-open:translate-x-1 lg:text-xl">
                  {item.q}
                </span>
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-brand-black/15 transition-[background-color,border-color,transform] duration-300 group-open:rotate-180 group-open:border-brand-yellow group-open:bg-brand-yellow">
                  <span className="absolute h-0.5 w-4 bg-brand-black" />
                  <span className="absolute h-4 w-0.5 bg-brand-black transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="faq-body max-w-2xl pb-8 text-brand-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
