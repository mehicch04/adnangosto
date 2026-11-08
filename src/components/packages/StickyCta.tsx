"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCta({
  href,
  price,
  unit,
  watchId,
}: {
  href: string;
  price: string;
  unit: string;
  watchId: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    const end = document.getElementById("paket-kraj");
    if (!target) return;
    const state = { past: false, atEnd: false };
    const update = () => {
      const next = state.past && !state.atEnd;
      setShow((prev) => (prev === next ? prev : next));
    };
    const io = new IntersectionObserver(([e]) => {
      state.past = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    io.observe(target);
    const endIo = end
      ? new IntersectionObserver(([e]) => {
          state.atEnd = e.isIntersecting || e.boundingClientRect.top < 0;
          update();
        })
      : null;
    if (end && endIo) endIo.observe(end);
    return () => {
      io.disconnect();
      endIo?.disconnect();
    };
  }, [watchId]);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-black/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 will-change-transform lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-4">
        <p className="leading-tight">
          <span className="block font-display text-3xl leading-none text-white">{price}</span>
          <span className="text-xs text-white/60">{unit}</span>
        </p>
        <Link
          href={href}
          tabIndex={show ? 0 : -1}
          className="ml-auto inline-flex min-h-12 flex-1 items-center justify-center rounded-md bg-brand-yellow px-5 text-[15px] font-bold text-brand-black"
        >
          Prijavi se
        </Link>
      </div>
    </div>
  );
}
