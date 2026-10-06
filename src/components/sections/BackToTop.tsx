"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/ui/icons";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.querySelector("main > section");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => {
      const next = !e.isIntersecting && e.boundingClientRect.top < 0;
      setShow((prev) => (prev === next ? prev : next));
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <button
      type="button"
      aria-label="Nazad na vrh stranice"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      onClick={() => window.scrollTo({ top: 0 })}
      className={`fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 grid size-12 place-items-center rounded-full border border-white/15 bg-brand-black/90 text-white shadow-lg shadow-black/40 transition-[opacity,transform,color,border-color] duration-300 will-change-transform hover:border-brand-yellow hover:text-brand-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow lg:right-8 lg:bottom-8 lg:size-14 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUpIcon className="size-5" />
    </button>
  );
}
