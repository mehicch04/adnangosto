"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRightIcon, InstagramIcon, TickIcon, WhatsAppIcon } from "@/components/ui/icons";
import type { ContactLink } from "@/lib/contact";

export type MenuPackage = {
  slug: string;
  name: string;
  tag: string;
  audience: string;
  features: string[];
  price: string;
  unit: string;
};

const links = [
  { label: "Transformacije", href: "/#transformacije" },
  { label: "Rezultati", href: "/#rezultati" },
  { label: "O meni", href: "/o-meni" },
  { label: "Pitanja", href: "/#pitanja" },
];

const mobileLinks = [
  { label: "Paketi", href: "/#saradnja" },
  { label: "Transformacije", href: "/#transformacije" },
  { label: "Rezultati", href: "/#rezultati" },
  { label: "O meni", href: "/o-meni" },
  { label: "Cjenovnik", href: "/cjenovnik" },
  { label: "Pitanja", href: "/#pitanja" },
];

const photos: Record<string, { src: string; pos: string }> = {
  "online-coaching": { src: "/images/om-ledja.jpg", pos: "object-[50%_20%]" },
  "paket-12-sedmica": { src: "/images/transformacije/tr-01.jpg", pos: "object-[50%_30%]" },
  "coaching-i-edukacija": { src: "/images/om-konstrukcija.jpg", pos: "object-[50%_40%]" },
  "takmicarske-pripreme": { src: "/images/takmicari/t1.jpg", pos: "object-[50%_20%]" },
};

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function ChatIcon({ chat, className }: { chat: ContactLink; className?: string }) {
  return chat.kind === "whatsapp" ? (
    <WhatsAppIcon className={className} />
  ) : (
    <InstagramIcon className={className} />
  );
}

export function HeaderNav({ packages, chat }: { packages: MenuPackage[]; chat: ContactLink }) {
  const pathname = usePathname();
  const [panel, setPanel] = useState(false);
  const [armed, setArmed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(packages[0]?.slug ?? "");
  const bar = useRef<HTMLDivElement>(null);
  const item = useRef<HTMLDivElement>(null);
  const drop = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const rows = useRef<HTMLUListElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);

  const current = packages.find((p) => p.slug === active) ?? packages[0];

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        setScrolled(y > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPanel((open) => {
        if (open) trigger.current?.focus();
        return false;
      });
      setSheet(false);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (item.current?.contains(t) || drop.current?.contains(t)) return;
      setPanel(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const close = () => {
    window.clearTimeout(timer.current);
    setPanel(false);
    setSheet(false);
  };

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    close();
    if (pathname !== "/") return;
    e.preventDefault();
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const show = () => {
    setArmed(true);
    setPanel(true);
  };

  const enter = () => {
    window.clearTimeout(timer.current);
    setArmed(true);
    timer.current = window.setTimeout(show, 90);
  };

  const leave = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanel(false), 200);
  };

  const place = useCallback((el: HTMLElement | null) => {
    const ind = indicator.current;
    if (!ind) return;
    if (!el) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${el.offsetWidth}px`;
    ind.style.transform = `translateX(${el.offsetLeft}px)`;
  }, []);

  const activeItem = useCallback(
    () => pill.current?.querySelector<HTMLElement>('[data-active="true"]') ?? null,
    [],
  );

  useEffect(() => {
    const sync = () => place(activeItem());
    const frame = requestAnimationFrame(sync);
    document.fonts?.ready.then(sync);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", sync);
    };
  }, [pathname, place, activeItem]);

  useEffect(() => {
    place(panel ? trigger.current : activeItem());
  }, [panel, place, activeItem]);

  useEffect(() => {
    const list = rows.current;
    const m = marker.current;
    const row = list?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!m || !row) return;
    m.style.height = `${row.offsetHeight}px`;
    m.style.transform = `translateY(${row.offsetTop}px)`;
  }, [active, armed]);

  const packagesActive = pathname.startsWith("/paketi") || pathname === "/cjenovnik";
  const linkClass = (on: boolean) =>
    `relative inline-flex items-center text-[13px] font-bold tracking-[0.16em] uppercase transition-colors duration-300 ${
      on ? "text-white" : "text-white/70 hover:text-white"
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-[background-color,box-shadow] duration-500 ${
          scrolled || panel
            ? "bg-brand-black shadow-[0_18px_40px_-24px_rgba(0,0,0,0.95)]"
            : "bg-brand-black/90 backdrop-blur-xl"
        }`}
      >
        <div
          className={`flex items-stretch transition-[height] duration-500 ${ease} ${
            scrolled ? "h-[64px] lg:h-[68px]" : "h-[68px] lg:h-[80px]"
          }`}
        >
          <Link
            href="/"
            aria-label="Adnan Gosto, početna"
            onClick={goHome}
            className="group flex shrink-0 items-center bg-brand-yellow pr-12 pl-5 [clip-path:polygon(0_0,100%_0,calc(100%-28px)_100%,0_100%)] lg:pr-20 lg:pl-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] lg:[clip-path:polygon(0_0,100%_0,calc(100%-40px)_100%,0_100%)]"
          >
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={129}
              height={70}
              priority
              style={{ filter: "brightness(0)" }}
              className={`w-auto transition-[height,transform] duration-500 ${ease} group-hover:scale-[1.04] ${
                scrolled ? "h-8 lg:h-9" : "h-9 lg:h-10"
              }`}
            />
          </Link>

          <div className="flex min-w-0 flex-1 items-center pr-5 lg:mx-auto lg:max-w-[68rem] lg:pl-8">
            <nav aria-label="Glavni meni" className="hidden h-full lg:block">
              <div
                ref={pill}
                onMouseLeave={() => !panel && place(activeItem())}
                className="relative flex h-full items-stretch gap-8"
              >
                <div ref={item} onMouseEnter={enter} onMouseLeave={leave} className="flex">
                  <button
                    ref={trigger}
                    type="button"
                    data-active={packagesActive}
                    aria-expanded={panel}
                    aria-controls="meni-paketi"
                    onMouseEnter={(e) => place(e.currentTarget)}
                    onFocus={(e) => place(e.currentTarget)}
                    onClick={() => {
                      window.clearTimeout(timer.current);
                      if (panel) setPanel(false);
                      else show();
                    }}
                    className={`${linkClass(panel || packagesActive)} gap-2 ${panel ? "text-brand-yellow!" : ""}`}
                  >
                    Paketi i cijene
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className={`size-3 transition-transform duration-500 ${ease} ${panel ? "rotate-180" : ""}`}
                    >
                      <path
                        d="m2.5 4.5 3.5 3.5 3.5-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    data-active={l.href === pathname}
                    onMouseEnter={(e) => place(e.currentTarget)}
                    onFocus={(e) => place(e.currentTarget)}
                    className={linkClass(l.href === pathname)}
                  >
                    {l.label}
                  </Link>
                ))}
                <span
                  ref={indicator}
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-[-1px] left-0 h-[3px] bg-brand-yellow opacity-0 transition-[transform,width,opacity] duration-500 ${ease}`}
                />
              </div>
            </nav>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/cjenovnik"
                onClick={close}
                className={`hidden px-3 text-[13px] font-bold tracking-[0.16em] uppercase transition-colors duration-300 xl:inline-flex ${pathname === "/cjenovnik" ? "text-white" : "text-white/70 hover:text-white"}`}
              >
                Cjenovnik
              </Link>
              <a
                href={chat.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={chat.label}
                className="hidden size-11 place-items-center text-white/70 transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-brand-yellow sm:grid"
              >
                <ChatIcon chat={chat} className="size-5" />
              </a>
              <Link
                href="/#saradnja"
                onClick={close}
                className="group relative inline-flex h-11 items-center gap-2.5 overflow-hidden bg-white px-4 text-[12px] font-bold tracking-[0.16em] whitespace-nowrap text-brand-black uppercase sm:px-5 sm:text-[13px] lg:h-12 lg:px-6"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 origin-left scale-x-0 bg-brand-yellow transition-transform duration-500 ${ease} group-hover:scale-x-100`}
                />
                <span className="relative">Pokreni se</span>
                <ArrowRightIcon
                  className={`relative size-4 transition-transform duration-500 ${ease} group-hover:translate-x-1`}
                />
              </Link>
              <button
                type="button"
                aria-label="Otvori meni"
                aria-expanded={sheet}
                aria-controls="mobilni-meni"
                onClick={() => setSheet(true)}
                className="grid size-11 place-items-center border border-white/15 text-white transition-colors hover:border-white/40 lg:hidden"
              >
                <span className="flex w-5 flex-col gap-1.5">
                  <span className="h-0.5 w-5 bg-white" />
                  <span className="h-0.5 w-3 bg-white" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {armed && current && (
          <div
            ref={drop}
            id="meni-paketi"
            onMouseEnter={enter}
            onMouseLeave={leave}
            aria-hidden={!panel}
            inert={!panel}
            className={`absolute inset-x-0 top-full hidden px-5 pt-3 lg:block ${panel ? "visible" : "invisible"}`}
          >
            <div
              className={`mx-auto w-[min(64rem,100%)] origin-top overflow-hidden rounded-3xl border border-white/10 bg-brand-surface shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] transition-[opacity,transform] duration-500 ${ease} motion-reduce:transition-none ${
                panel
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-2 scale-[0.985] opacity-0"
              }`}
            >
              <div className="grid grid-cols-[22rem_minmax(0,1fr)]">
                <ul ref={rows} className="relative border-r border-white/10 p-2">
                  <span
                    ref={marker}
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-2 top-0 rounded-2xl bg-white/[0.07] transition-[transform,height] duration-500 ${ease}`}
                  >
                    <span className="absolute inset-y-4 left-0 w-1 rounded-full bg-brand-yellow" />
                  </span>
                  {packages.map((p) => {
                    const on = p.slug === current.slug;
                    return (
                      <li key={p.slug} data-slug={p.slug} className="relative">
                        <Link
                          href={`/paketi/${p.slug}`}
                          onClick={close}
                          onMouseEnter={() => setActive(p.slug)}
                          onFocus={() => setActive(p.slug)}
                          className="flex items-center gap-4 rounded-2xl px-4 py-4"
                        >
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-[11px] font-bold tracking-[0.14em] uppercase transition-colors duration-300 ${on ? "text-brand-yellow" : "text-white/40"}`}
                            >
                              {p.tag}
                            </span>
                            <span
                              className={`mt-1 block font-display text-[26px] leading-none transition-[color,transform] duration-500 ${ease} ${on ? "translate-x-1 text-white" : "text-white/80"}`}
                            >
                              {p.name}
                            </span>
                          </span>
                          <span className="font-display text-2xl text-brand-yellow">{p.price}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="relative min-h-[22rem] overflow-hidden">
                  {packages.map((p) => {
                    const ph = photos[p.slug];
                    if (!ph) return null;
                    const on = p.slug === current.slug;
                    return (
                      <Image
                        key={p.slug}
                        src={ph.src}
                        alt=""
                        fill
                        sizes="42rem"
                        className={`object-cover grayscale transition-[opacity,transform] duration-700 ${ease} ${ph.pos} ${
                          on ? "scale-100 opacity-100" : "scale-105 opacity-0"
                        }`}
                      />
                    );
                  })}
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-surface via-brand-surface/80 to-brand-surface/10" />
                  <div
                    key={current.slug}
                    className="fade-up relative flex h-full max-w-lg flex-col p-8"
                    style={{ ["--d" as string]: "0s" }}
                  >
                    <p className="text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase">
                      {current.tag}
                    </p>
                    <p className="mt-3 font-display text-6xl leading-[0.88] text-white">
                      {current.name}
                    </p>
                    <p className="mt-3 text-[15px] text-white/65">{current.audience}</p>
                    <ul className="mt-5 space-y-2">
                      {current.features.map((f) => (
                        <li key={f} className="flex gap-2.5 text-[14px] text-white/80">
                          <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-black">
                            <TickIcon className="size-2.5" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center gap-3 pt-7">
                      <Link
                        href={`/prijava/${current.slug}`}
                        onClick={close}
                        className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand-yellow px-5 text-[14px] font-bold whitespace-nowrap text-brand-black transition-colors duration-300 hover:bg-white"
                      >
                        Prijavi se
                        <ArrowRightIcon
                          className={`size-4 transition-transform duration-500 ${ease} group-hover:translate-x-1`}
                        />
                      </Link>
                      <Link
                        href={`/paketi/${current.slug}`}
                        onClick={close}
                        className="inline-flex h-11 shrink-0 items-center rounded-full border border-white/20 px-5 text-[14px] font-semibold whitespace-nowrap text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-brand-black"
                      >
                        Detalji paketa
                      </Link>
                      <span className="ml-auto font-display text-4xl whitespace-nowrap text-white">
                        {current.price}
                        <span className="ml-1.5 font-body text-xs text-white/50">
                          {current.unit}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-6 py-3.5 text-[14px] font-semibold">
                <Link
                  href="/cjenovnik"
                  onClick={close}
                  className="group inline-flex items-center gap-2 text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Cijeli cjenovnik: konsultacije, lični trening, seminari
                  <ArrowRightIcon
                    className={`size-4 transition-transform duration-500 ${ease} group-hover:translate-x-1`}
                  />
                </Link>
                <Link
                  href="/#saradnja"
                  onClick={close}
                  className="group inline-flex items-center gap-2 text-brand-yellow transition-colors duration-300 hover:text-white"
                >
                  Ne znaš koji? Pomoći ću ti izabrati
                  <ArrowRightIcon
                    className={`size-4 transition-transform duration-500 ${ease} group-hover:translate-x-1`}
                  />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-brand-yellow/70" />
        </div>
      </header>

      {sheet && (
        <div
          id="mobilni-meni"
          role="dialog"
          aria-modal="true"
          aria-label="Meni"
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <button
            type="button"
            aria-label="Zatvori meni"
            onClick={() => setSheet(false)}
            className="fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="sheet-up absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-[28px] bg-brand-surface px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <ul className="grid grid-cols-2 gap-x-4">
              {mobileLinks.map((l, i) => (
                <li
                  key={l.href}
                  className="fade-up"
                  style={{ ["--d" as string]: `${0.04 + i * 0.03}s` }}
                >
                  <Link
                    href={l.href}
                    onClick={close}
                    className={`block py-2 font-display text-[30px] leading-tight transition-colors ${
                      l.href === pathname
                        ? "text-brand-yellow"
                        : "text-white active:text-brand-yellow"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs font-bold tracking-[0.16em] text-white/45 uppercase">
              Paketi
            </p>
            <ul className="mt-2 divide-y divide-white/10 rounded-2xl bg-brand-black/60">
              {packages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/paketi/${p.slug}`}
                    onClick={close}
                    className="flex min-h-14 items-center gap-3 px-4 transition-colors active:bg-white/5"
                  >
                    <span className="font-semibold">{p.name}</span>
                    <span className="ml-auto font-display text-2xl text-brand-yellow">
                      {p.price}
                    </span>
                    <ArrowRightIcon className="size-4 text-white/40" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={chat.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-14 items-center justify-center gap-2 border font-semibold ${
                  chat.kind === "whatsapp"
                    ? "border-[#25D366]/40 text-[#25D366]"
                    : "border-white/20 text-white"
                }`}
              >
                <ChatIcon chat={chat} />
                {chat.label}
              </a>
              <Link
                href="/#saradnja"
                onClick={close}
                className="inline-flex min-h-14 items-center justify-center bg-brand-yellow text-[13px] font-bold tracking-[0.16em] text-brand-black uppercase"
              >
                Pokreni se
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
