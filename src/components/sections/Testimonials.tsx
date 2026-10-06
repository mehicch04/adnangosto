import Image from "next/image";
import { fallbackTestimonials, type Testimonial } from "@/content/site";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col justify-between rounded-lg border border-brand-line bg-brand-surface p-6 transition-colors duration-300 hover:border-brand-yellow/60 sm:w-[380px] sm:p-7">
      <div>
        <span
          aria-hidden="true"
          className="block font-display text-6xl leading-[0.6] text-brand-yellow"
        >
          &ldquo;
        </span>
        <blockquote className="mt-4 text-[15px] leading-relaxed text-white/85 sm:text-base">
          {t.quote}
        </blockquote>
      </div>
      <figcaption className="mt-7 flex items-center gap-3.5 border-t border-brand-line pt-5">
        {t.image ? (
          <Image
            src={t.image}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-full object-cover object-top"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-yellow font-display text-xl text-brand-black"
          >
            {initials(t.name)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-semibold text-white">{t.name}</span>
          <span className="mt-0.5 block text-xs font-semibold tracking-[0.14em] text-brand-yellow uppercase">
            {t.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div className="testimonial-row group flex overflow-hidden">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={`flex shrink-0 animate-marquee gap-4 pr-4 will-change-transform [animation-duration:70s] group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
            reverse ? "[animation-direction:reverse]" : ""
          }`}
        >
          {items.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Testimonials({ items = fallbackTestimonials }: { items?: Testimonial[] }) {
  if (items.length === 0) return null;
  const half = Math.ceil(items.length / 2);
  const rows = items.length > 4 ? [items.slice(0, half), items.slice(half)] : [items];

  return (
    <section
      id="iskustva"
      aria-labelledby="iskustva-naslov"
      className="scroll-mt-24 overflow-hidden border-t border-brand-line py-24 lg:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-brand-yellow uppercase">
            Iskustva klijenata
          </p>
          <h2
            id="iskustva-naslov"
            className="mt-3 font-display text-6xl leading-[0.88] sm:text-7xl lg:text-8xl"
          >
            Njihove riječi,
            <br />
            <span className="text-brand-yellow">ne moje</span>
          </h2>
        </div>
        <p className="max-w-sm text-lg text-white/65">
          Takmičari, rekreativci i treneri o tome kako izgleda saradnja iz prve ruke.
        </p>
      </div>

      <div className="testimonial-mask mt-14 flex flex-col gap-4">
        {rows.map((r, i) => (
          <Row key={i} items={r} reverse={i === 1} />
        ))}
      </div>
    </section>
  );
}
