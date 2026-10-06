"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

const nav = [
  { label: "Saradnja", href: "/#saradnja" },
  { label: "Rezultati", href: "/#rezultati" },
  { label: "Kako radimo", href: "/#kako-radimo" },
  { label: "O meni", href: "/o-meni" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-b border-white/10 bg-brand-black/85 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-brand-black/80 to-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-[height] duration-300 ${
            scrolled ? "h-16" : "h-20 lg:h-24"
          }`}
        >
          <Link
            href="/"
            aria-label="Adnan Gosto, početna"
            className="relative z-10 shrink-0"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={560}
              height={304}
              priority
              className={`w-auto transition-[height] duration-300 ${scrolled ? "h-9" : "h-10 lg:h-12"}`}
            />
          </Link>

          <nav aria-label="Glavni meni" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur">
              {nav.map((item) => {
                const active = item.href === pathname;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-white text-brand-black"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hidden size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand-yellow hover:text-brand-yellow sm:grid"
            >
              <InstagramIcon />
            </a>
            <Link
              href="/#saradnja"
              onClick={() => setOpen(false)}
              className="hidden min-h-11 items-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-white sm:inline-flex"
            >
              Prijavi se
            </Link>
            <button
              type="button"
              aria-label={open ? "Zatvori meni" : "Otvori meni"}
              aria-expanded={open}
              aria-controls="mobilni-meni"
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-white/15 lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 bg-white transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 bg-white transition-all duration-300 ${
                    open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <div
        id="mobilni-meni"
        className={`fixed inset-0 z-40 flex flex-col bg-brand-black px-5 pt-28 pb-10 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/3 bg-brand-yellow"
          style={{ clipPath: "polygon(80% 0, 100% 0, 100% 100%, 20% 100%)" }}
        />
        <nav aria-label="Mobilni meni" className="relative flex-1">
          <ul className="space-y-2">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline gap-4 font-display text-6xl leading-tight ${
                    item.href === pathname ? "text-brand-yellow" : "text-white"
                  }`}
                >
                  <span className="text-base text-white/30">0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative space-y-4">
          <Link
            href="/#saradnja"
            onClick={() => setOpen(false)}
            className="flex min-h-14 items-center justify-center rounded-full bg-brand-yellow text-lg font-semibold text-brand-black"
          >
            Prijavi se
          </Link>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-brand-black font-semibold"
          >
            <InstagramIcon />
            {site.instagramHandle}
          </a>
        </div>
      </div>
    </>
  );
}
