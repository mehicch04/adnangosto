"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function ProcessCard({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      data-in={inView}
      className={`group flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-brand-surface ${className}`}
    >
      {children}
    </li>
  );
}
