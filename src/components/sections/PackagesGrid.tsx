"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GOAL_EVENT } from "@/components/sections/HeroPaths";
import { ArrowRightIcon, TickIcon } from "@/components/ui/icons";
import type { PackageCompare, PackageSlug } from "@/content/packages";

export type PackageCard = {
  slug: PackageSlug;
  name: string;
  badge?: string;
  featured?: boolean;
  audience: string;
  price: string;
  priceUnit: string;
  priceNote: string;
  features: string[];
  compare: PackageCompare;
};

type Goal = "forma" | "bina" | "znanje";

const goals: { id: Goal; label: string; prefer: PackageSlug }[] = [
  { id: "forma", label: "Forma i zdravlje", prefer: "online-coaching" },
  { id: "bina", label: "Takmičenje", prefer: "takmicarske-pripreme" },
  { id: "znanje", label: "Edukacija", prefer: "coaching-i-edukacija" },
];

const goalOf: Record<PackageSlug, Goal> = {
  "online-coaching": "forma",
  "paket-12-sedmica": "forma",
  "coaching-i-edukacija": "znanje",
  "takmicarske-pripreme": "bina",
};

const rows: { label: string; get: (p: PackageCard) => string }[] = [
  { label: "Najbolje za", get: (p) => p.compare.bestFor },
  { label: "Cijena", get: (p) => `${p.price} ${p.priceUnit}` },
  { label: "Plaćanje", get: (p) => p.compare.payment },
  { label: "Praćenje", get: (p) => p.compare.tracking },
  { label: "Trajanje", get: (p) => p.compare.duration },
  { label: "Najveća prednost", get: (p) => p.compare.edge },
];

const ease = "ease-[cubic-bezier(0.2,0.7,0.2,1)]";

export function PackagesGrid({ packages }: { packages: PackageCard[] }) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [picked, setPicked] = useState<PackageSlug | null>(null);
  const [tap, setTap] = useState<Goal | null>(null);
  const [inView, setInView] = useState<boolean | null>(null);
  const [slide, setSlide] = useState(0);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const wrap = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const buttons = useRef<Partial<Record<Goal, HTMLButtonElement | null>>>({});
  const demo = useRef({ done: false, timers: [] as number[] });

  const available = goals.filter((g) => packages.some((p) => goalOf[p.slug] === g.id));
  const firstGoal = available[0]?.id;
  const has = (slug: PackageSlug) => packages.some((p) => p.slug === slug);
  const pickFor = useCallback(
    (g: Goal) => {
      const pref = goals.find((x) => x.id === g)!.prefer;
      return packages.some((p) => p.slug === pref)
        ? pref
        : (packages.find((p) => goalOf[p.slug] === g)?.slug ?? null);
    },
    [packages],
  );

  const select = useCallback(
    (g: Goal | null, slug?: PackageSlug) => {
      setGoal(g);
      setPicked(g ? (slug ?? pickFor(g)) : null);
    },
    [pickFor],
  );

  const stopDemo = useCallback(() => {
    demo.current.done = true;
    demo.current.timers.forEach((t) => window.clearTimeout(t));
    demo.current.timers = [];
    if (cursor.current) cursor.current.style.opacity = "0";
  }, []);

  const choose = (g: Goal | null, slug?: PackageSlug) => {
    stopDemo();
    select(g, slug);
  };

  useLayoutEffect(() => {
    const btn = goal ? buttons.current[goal] : null;
    setPill(btn ? { x: btn.offsetLeft, w: btn.offsetWidth } : null);
  }, [goal]);

  useEffect(() => {
    const onResize = () => {
      const btn = goal ? buttons.current[goal] : null;
      if (btn) setPill({ x: btn.offsetLeft, w: btn.offsetWidth });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [goal]);

  useEffect(() => {
    const onGoal = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as Goal;
      if (!goals.some((g) => g.id === id)) return;
      stopDemo();
      select(id);
    };
    window.addEventListener(GOAL_EVENT, onGoal);
    return () => window.removeEventListener(GOAL_EVENT, onGoal);
  }, [select, stopDemo]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        } else setInView(false);
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = wrap.current;
    const ctl = control.current;
    const cards = list.current;
    const target = firstGoal;
    if (reduce || !box || !ctl || !cards || !target) {
      demo.current.done = true;
      return;
    }
    const seen = { control: false, cards: false };
    const timers = demo.current.timers;
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const run = () => {
      const btn = buttons.current[target];
      const c = cursor.current;
      if (!btn || !c || demo.current.done) return;
      demo.current.done = true;
      const w = box.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const x = b.left - w.left + b.width * 0.55;
      const y = b.top - w.top + b.height * 0.6;
      c.style.transition = "none";
      c.style.opacity = "0";
      c.style.transform = `translate3d(${x + 150}px, ${y + 110}px, 0)`;
      c.getBoundingClientRect();
      c.style.transition = "opacity 0.35s ease, transform 1.05s cubic-bezier(0.65, 0, 0.35, 1)";
      later(() => (c.style.opacity = "1"), 80);
      later(() => (c.style.transform = `translate3d(${x}px, ${y}px, 0)`), 320);
      later(() => (c.dataset.press = "true"), 1420);
      later(() => {
        setTap(target);
        select(target);
      }, 1520);
      later(() => (c.dataset.press = "false"), 1640);
      later(() => setTap(null), 2300);
      later(() => {
        c.style.transform = `translate3d(${x + 36}px, ${y + 52}px, 0)`;
        c.style.opacity = "0";
      }, 2500);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === ctl) seen.control = e.intersectionRatio > 0.98;
          if (e.target === cards) seen.cards = e.intersectionRatio > 0.22;
        }
        if (seen.control && seen.cards && !demo.current.done) {
          io.disconnect();
          later(run, 450);
        }
      },
      { threshold: [0, 0.22, 0.4, 0.98, 1], rootMargin: "-14% 0px -10% 0px" },
    );
    io.observe(ctl);
    io.observe(cards);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [firstGoal, select]);

  useEffect(() => {
    const ul = list.current;
    if (!ul || !picked || ul.scrollWidth <= ul.clientWidth + 4) return;
    const card = ul.querySelector<HTMLElement>(`[data-slug="${picked}"]`);
    if (!card) return;
    ul.scrollTo({
      left: card.offsetLeft - (ul.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [picked]);

  const onScroll = () => {
    const ul = list.current;
    const first = ul?.firstElementChild as HTMLElement | null;
    if (!ul || !first) return;
    setSlide(Math.round(ul.scrollLeft / (first.offsetWidth + 12)));
  };

  const helper =
    goal === "forma" && has("online-coaching") && has("paket-12-sedmica")
      ? picked === "paket-12-sedmica"
        ? {
            text: "Želiš da te pratim svake sedmice?",
            label: "Online coaching",
            slug: "online-coaching" as const,
          }
        : {
            text: "Tek počinješ i želiš manje pritiska?",
            label: "Paket 12 sedmica",
            slug: "paket-12-sedmica" as const,
          }
      : null;

  return (
    <div ref={wrap} data-in={inView ?? undefined} className="group/pk relative">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase">
            <span className="h-0.5 w-8 bg-brand-yellow" />
            Paketi i cijene
          </p>
          <h2
            id="saradnja-naslov"
            className="mt-4 font-display text-6xl leading-[0.88] sm:text-7xl lg:text-[7.5rem]"
          >
            Izaberi kako radimo
          </h2>
        </div>
        <div>
          <p id="pk-cilj" className="mb-3 text-sm font-semibold text-brand-ink-muted">
            Šta ti treba?
          </p>
          <div
            ref={control}
            role="radiogroup"
            aria-labelledby="pk-cilj"
            className="relative flex w-full rounded-full border border-brand-black/10 bg-white p-1 shadow-[0_14px_34px_-20px_rgba(0,0,0,0.4)] sm:inline-flex sm:w-auto"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 bottom-1 left-0 rounded-full bg-brand-black transition-[transform,width,opacity] duration-500 ${ease} ${pill ? "opacity-100" : "opacity-0"}`}
              style={pill ? { width: pill.w, transform: `translateX(${pill.x}px)` } : { width: 0 }}
            />
            {available.map((g) => {
              const on = goal === g.id;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    buttons.current[g.id] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(on ? null : g.id)}
                  className={`relative h-11 flex-1 rounded-full px-3 text-[14px] font-semibold whitespace-nowrap transition-colors duration-300 sm:flex-none sm:px-5 ${
                    on ? "text-white" : "text-brand-black/65 hover:text-brand-black"
                  }`}
                >
                  {tap === g.id && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 animate-tap rounded-full bg-brand-yellow"
                    />
                  )}
                  <span className="relative">{g.label}</span>
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-3 min-h-6 text-[14px] lg:text-right">
            {helper && (
              <span
                key={helper.slug}
                className="inline-flex animate-step flex-wrap items-center gap-x-2"
              >
                <span className="text-brand-ink-muted">{helper.text}</span>
                <button
                  type="button"
                  onClick={() => choose("forma", helper.slug)}
                  className="inline-flex items-center gap-1 font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 transition-colors hover:decoration-brand-black"
                >
                  {helper.label}
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </span>
            )}
          </p>
        </div>
      </div>

      <ul
        ref={list}
        onScroll={onScroll}
        className="relative -mx-5 mt-8 flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto scroll-smooth px-5 pt-5 pb-6 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {packages.map((p, i) => {
          const on = picked === p.slug;
          const ribbon = on
            ? "Preporuka za tebe"
            : (p.badge ?? (p.featured ? "Najpopularnije" : undefined));
          return (
            <li
              key={p.slug}
              data-slug={p.slug}
              style={{ transitionDelay: inView ? `${i * 90}ms` : undefined }}
              className={`flex w-[84%] shrink-0 snap-center transition-[opacity,transform] duration-700 sm:w-[46%] lg:w-auto ${ease} group-data-[in=false]/pk:translate-y-10 group-data-[in=false]/pk:opacity-0`}
            >
              <article
                className={`group relative flex w-full flex-col rounded-2xl border p-6 transition-[background-color,color,border-color,box-shadow,transform] duration-500 ${ease} ${
                  on
                    ? "border-brand-black bg-brand-black text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] lg:-translate-y-4"
                    : "border-brand-paper-line bg-white hover:-translate-y-1.5 hover:border-brand-black/25 hover:shadow-[0_28px_50px_-30px_rgba(10,10,10,0.45)]"
                }`}
              >
                {ribbon && (
                  <span
                    key={ribbon}
                    className={`absolute -top-3 right-6 animate-step rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase ${
                      on ? "bg-brand-yellow text-brand-black" : "bg-brand-black text-white"
                    }`}
                  >
                    {ribbon}
                  </span>
                )}
                <p
                  className={`text-xs font-bold tracking-[0.14em] uppercase transition-colors duration-500 ${on ? "text-brand-yellow" : "text-brand-ink-muted"}`}
                >
                  {p.compare.tag}
                </p>
                <h3 className="mt-4 font-display text-[2.6rem] leading-[0.9] lg:min-h-[4.7rem]">
                  <Link href={`/paketi/${p.slug}`} className="outline-none focus-visible:underline">
                    {p.name}
                  </Link>
                </h3>
                <p
                  className={`mt-3 text-[15px] leading-snug transition-colors duration-500 lg:min-h-[4.5rem] ${on ? "text-white/65" : "text-brand-ink-muted"}`}
                >
                  {p.audience}
                </p>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-6xl leading-none">{p.price}</span>
                  <span
                    className={`text-sm font-semibold transition-colors duration-500 ${on ? "text-white/60" : "text-brand-ink-muted"}`}
                  >
                    {p.priceUnit}
                  </span>
                </p>
                <p
                  className={`mt-1 text-[13px] transition-colors duration-500 ${on ? "text-white/45" : "text-brand-ink-muted/80"}`}
                >
                  {p.priceNote}
                </p>
                <Link
                  href={`/prijava/${p.slug}`}
                  className={`group/cta mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 ${
                    on
                      ? "bg-brand-yellow text-brand-black hover:bg-white"
                      : "bg-brand-black text-white hover:bg-brand-yellow hover:text-brand-black"
                  }`}
                >
                  Prijavi se
                  <span className="sr-only"> za {p.name}</span>
                  <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
                <ul
                  className={`mt-6 space-y-3 border-t pt-6 transition-colors duration-500 ${on ? "border-white/10" : "border-brand-paper-line"}`}
                >
                  {p.features.map((f, j) => (
                    <li key={f} className="flex gap-3 text-[14px] leading-snug">
                      <span
                        style={{ transitionDelay: `${j * 60}ms` }}
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:scale-110 ${ease}`}
                      >
                        <TickIcon className="size-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/paketi/${p.slug}`}
                  className={`mt-auto inline-flex items-center justify-center gap-1.5 pt-6 text-[14px] font-semibold underline-offset-4 hover:underline ${on ? "text-white/80" : ""}`}
                >
                  Detalji paketa
                  <span className="sr-only">: {p.name}</span>
                </Link>
              </article>
            </li>
          );
        })}
      </ul>

      <div className="mt-1 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
        {packages.map((p, i) => (
          <span
            key={p.slug}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
              slide === i ? "w-6 bg-brand-black" : "w-1.5 bg-brand-black/20"
            }`}
          />
        ))}
      </div>

      <div
        className={`mt-10 overflow-hidden rounded-2xl border border-brand-paper-line bg-white transition-[opacity,transform] delay-300 duration-700 ${ease} group-data-[in=false]/pk:translate-y-10 group-data-[in=false]/pk:opacity-0 lg:mt-14`}
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b border-brand-paper-line px-5 py-5 sm:px-6">
          <h3 className="font-display text-3xl leading-none">Uporedi pakete</h3>
          <p className="text-[13px] text-brand-ink-muted">
            <span className="sm:hidden">Povuci tabelu za sve pakete</span>
            <span className="hidden sm:inline">Klikni na naziv paketa da ga istakneš</span>
          </p>
        </div>
        <div className="relative [scrollbar-width:thin] overflow-x-auto">
          <table className="w-full min-w-[54rem] table-fixed border-collapse text-left text-[14px]">
            <caption className="sr-only">Poređenje paketa</caption>
            <colgroup>
              <col className="w-36 sm:w-44" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-white px-5 py-4 sm:px-6">
                  <span className="sr-only">Stavka</span>
                </th>
                {packages.map((p) => {
                  const on = picked === p.slug;
                  return (
                    <th
                      key={p.slug}
                      scope="col"
                      className={`px-4 py-4 align-bottom transition-colors duration-500 ${on ? "bg-brand-yellow/15" : ""}`}
                    >
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => choose(goalOf[p.slug], p.slug)}
                        className="group/th flex w-full flex-col items-start text-left"
                      >
                        <span
                          className={`mb-2 h-1 rounded-full bg-brand-yellow transition-[width] duration-500 ${ease} ${on ? "w-10" : "w-0 group-hover/th:w-5"}`}
                        />
                        <span className="font-display text-2xl leading-[0.95]">{p.name}</span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.label}
                  className="group/row border-t border-brand-paper-line transition-colors hover:bg-brand-paper/60"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white px-5 py-4 align-top text-[13px] font-semibold text-brand-ink-muted shadow-[10px_0_14px_-14px_rgba(0,0,0,0.35)] transition-colors group-hover/row:bg-[#fafaf9] sm:px-6 sm:shadow-none"
                  >
                    {r.label}
                  </th>
                  {packages.map((p) => {
                    const on = picked === p.slug;
                    return (
                      <td
                        key={p.slug}
                        className={`px-4 py-4 align-top leading-snug transition-colors duration-500 ${
                          on
                            ? "bg-brand-yellow/15 font-semibold text-brand-black"
                            : "text-brand-black/80"
                        } ${r.label === "Cijena" ? "font-semibold text-brand-black" : ""}`}
                      >
                        {r.get(p)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-brand-paper-line">
                <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-4 sm:px-6">
                  <span className="sr-only">Prijava</span>
                </th>
                {packages.map((p) => (
                  <td
                    key={p.slug}
                    className={`px-4 py-4 transition-colors duration-500 ${picked === p.slug ? "bg-brand-yellow/15" : ""}`}
                  >
                    <Link
                      href={`/prijava/${p.slug}`}
                      className="group/link inline-flex items-center gap-1.5 text-[14px] font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:decoration-brand-black"
                    >
                      Prijavi se
                      <span className="sr-only"> za {p.name}</span>
                      <ArrowRightIcon className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <span
        ref={cursor}
        aria-hidden="true"
        data-press="false"
        className="group/cur pointer-events-none absolute top-0 left-0 z-30 opacity-0 will-change-transform"
      >
        <span className="hidden size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-black/30 shadow-[0_6px_18px_rgba(0,0,0,0.3)] backdrop-blur-[2px] transition-transform duration-150 group-data-[press=true]/cur:scale-75 pointer-coarse:block" />
        <svg
          viewBox="0 0 24 24"
          className="block size-7 origin-top-left drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] transition-transform duration-150 group-data-[press=true]/cur:scale-[0.82] pointer-coarse:hidden"
        >
          <path
            d="M3.5 2.2 19.6 13l-7.1 1.2 4 7.4-3 1.6-4-7.5L4.4 21Z"
            fill="#0a0a0a"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
