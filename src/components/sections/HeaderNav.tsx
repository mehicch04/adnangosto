"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRightIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import type { ContactLink } from "@/lib/contact";

export type MenuPackage = {
  slug: string;
  name: string;
  tagline: string;
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

function ChatIcon({ chat, className }: { chat: ContactLink; className?: string }) {
  return chat.kind === "whatsapp" ? (
    <WhatsAppIcon className={className} />
  ) : (
    <InstagramIcon className={className} />
  );
}

export function HeaderNav({ packages, chat }: { packages: MenuPackage[]; chat: ContactLink }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(false);
  const [sheet, setSheet] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const item = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  const wa = chat.kind === "whatsapp";

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled((prev) => (prev === y > 24 ? prev : y > 24));
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
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
      setPanel(false);
      setSheet(false);
    };
    const onDown = (e: PointerEvent) => {
      if (item.current && !item.current.contains(e.target as Node)) setPanel(false);
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

  const enter = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanel(true), 80);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanel(false), 180);
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

  const clear = pathname === "/" && !scrolled && !panel;
  const packagesActive = pathname.startsWith("/paketi") || pathname === "/cjenovnik";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          clear
            ? "border-b border-transparent bg-transparent"
            : "border-b border-white/5 bg-brand-black/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[auto_1fr] items-center gap-6 px-5 lg:h-[84px] lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            aria-label="Adnan Gosto, početna"
            className="justify-self-start"
            onClick={goHome}
          >
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={129}
              height={70}
              priority
              className="h-9 w-auto lg:h-10"
            />
          </Link>

          <nav aria-label="Glavni meni" className="hidden justify-self-center lg:block">
            <div
              ref={pill}
              onMouseLeave={() => place(activeItem())}
              className="relative flex items-center gap-0.5 rounded-full border border-white/10 bg-black/45 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <span
                ref={indicator}
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 bottom-1.5 left-0 rounded-full bg-white/10 opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
              />
              <div ref={item} onMouseEnter={enter} onMouseLeave={leave}>
                <button
                  type="button"
                  data-active={packagesActive}
                  aria-expanded={panel}
                  aria-controls="meni-paketi"
                  onMouseEnter={(e) => place(e.currentTarget)}
                  onFocus={(e) => place(e.currentTarget)}
                  onClick={() => {
                    window.clearTimeout(timer.current);
                    setPanel((v) => !v);
                  }}
                  className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                    panel || packagesActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  Paketi i cijene
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className={`size-3 transition-transform duration-300 ${panel ? "rotate-180" : ""}`}
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
                {panel && (
                  <div
                    id="meni-paketi"
                    className="absolute top-full left-1/2 w-[min(80rem,calc(100vw-2.5rem))] -translate-x-1/2 pt-3"
                  >
                    <div className="menu-pop rounded-3xl border border-white/10 bg-brand-surface p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                      <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,0.9fr)] gap-2">
                        {packages.map((p, i) => (
                          <Link
                            key={p.slug}
                            href={`/paketi/${p.slug}`}
                            onClick={close}
                            className="fade-up group flex flex-col rounded-2xl p-5 transition-colors hover:bg-white/[0.06]"
                            style={{ ["--d" as string]: `${0.03 + i * 0.04}s` }}
                          >
                            <span className="font-display text-[28px] leading-none text-white">
                              {p.name}
                            </span>
                            <span className="mt-2 line-clamp-2 text-sm text-white/55">
                              {p.tagline}
                            </span>
                            <span className="mt-auto flex items-end justify-between gap-3 pt-6">
                              <span>
                                <span className="font-display text-4xl leading-none text-brand-yellow">
                                  {p.price}
                                </span>
                                <span className="ml-1.5 text-xs text-white/50">{p.unit}</span>
                              </span>
                              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-all group-hover:translate-x-0.5 group-hover:border-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-black">
                                <ArrowRightIcon />
                              </span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          href="/#saradnja"
                          onClick={close}
                          className="fade-up flex flex-col rounded-2xl bg-brand-yellow p-5 text-brand-black transition-colors hover:bg-white"
                          style={{ ["--d" as string]: "0.2s" }}
                        >
                          <span className="font-display text-[28px] leading-none">
                            Ne znaš koji?
                          </span>
                          <span className="mt-2 text-sm font-semibold text-brand-black/75">
                            Odgovori na dva pitanja i pokazaću ti paket koji ti odgovara.
                          </span>
                          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold">
                            Pomozi mi izabrati
                            <ArrowRightIcon />
                          </span>
                        </Link>
                      </div>
                      <Link
                        href="/cjenovnik"
                        onClick={close}
                        className="mt-2 flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        Cijeli cjenovnik: konsultacije, personalni trening, članstvo i edukacija
                        <ArrowRightIcon />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  data-active={l.href === pathname}
                  onMouseEnter={(e) => place(e.currentTarget)}
                  onFocus={(e) => place(e.currentTarget)}
                  className={`relative block rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                    l.href === pathname ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <a
              href={chat.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={chat.label}
              className={`hidden size-12 place-items-center rounded-full ring-1 transition-colors sm:grid ${
                wa
                  ? "bg-[#25D366]/10 text-[#25D366] ring-[#25D366]/30 hover:bg-[#25D366] hover:text-brand-black"
                  : "bg-white/5 text-white ring-white/15 hover:bg-white hover:text-brand-black"
              }`}
            >
              <ChatIcon chat={chat} className="size-5" />
            </a>
            <Link
              href="/#saradnja"
              onClick={close}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand-yellow pr-1.5 pl-4 text-[15px] font-bold text-brand-black transition-colors hover:bg-white lg:h-12 lg:pl-5"
            >
              Započni<span className="hidden min-[400px]:inline"> saradnju</span>
              <span className="grid size-8 place-items-center rounded-full bg-brand-black text-brand-yellow transition-transform duration-300 group-hover:translate-x-0.5 lg:size-9">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
            <button
              type="button"
              aria-label="Otvori meni"
              aria-expanded={sheet}
              aria-controls="mobilni-meni"
              onClick={() => setSheet(true)}
              className="grid size-11 place-items-center rounded-full bg-white/10 lg:hidden"
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-0.5 w-5 bg-white" />
                <span className="h-0.5 w-3 bg-white" />
              </span>
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-brand-yellow" />
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
              {mobileLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={close}
                    className={`block py-2 font-display text-[30px] leading-tight ${
                      l.href === pathname ? "text-brand-yellow" : "text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-semibold text-white/50">Paketi</p>
            <ul className="mt-2 divide-y divide-white/10 rounded-2xl bg-brand-black/60">
              {packages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/paketi/${p.slug}`}
                    onClick={close}
                    className="flex min-h-14 items-center gap-3 px-4"
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
                className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full border font-semibold ${
                  wa ? "border-[#25D366]/40 text-[#25D366]" : "border-white/20 text-white"
                }`}
              >
                <ChatIcon chat={chat} />
                {chat.label}
              </a>
              <Link
                href="/#saradnja"
                onClick={close}
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-brand-yellow font-bold text-brand-black"
              >
                Započni saradnju
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
