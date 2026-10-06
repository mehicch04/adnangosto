"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function MobileCta() {
  const [show, setShow] = useState(false);
  const state = useRef({ pastHero: false, inPackages: false, atEnd: false });

  useEffect(() => {
    const update = () => {
      const s = state.current;
      const next = s.pastHero && !s.inPackages && !s.atEnd;
      setShow((prev) => (prev === next ? prev : next));
    };
    const observe = (id: string, key: "inPackages" | "atEnd") => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => {
        state.current[key] =
          key === "atEnd" ? e.isIntersecting || e.boundingClientRect.top < 0 : e.isIntersecting;
        update();
      });
      io.observe(el);
      return io;
    };
    const hero = document.querySelector("main > section");
    const heroIo = hero
      ? new IntersectionObserver(
          ([e]) => {
            state.current.pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
            update();
          },
          { rootMargin: "0px 0px -30% 0px" },
        )
      : null;
    if (hero && heroIo) heroIo.observe(hero);
    const a = observe("saradnja", "inPackages");
    const b = observe("kontakt", "atEnd");
    return () => {
      heroIo?.disconnect();
      a?.disconnect();
      b?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-black p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 will-change-transform lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/#saradnja"
        tabIndex={show ? 0 : -1}
        className="flex min-h-12 items-center justify-center rounded-sm bg-brand-yellow text-[13px] font-bold tracking-[0.14em] text-brand-black uppercase"
      >
        Izaberi saradnju i prijavi se
      </Link>
    </div>
  );
}
