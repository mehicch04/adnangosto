"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function inView(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

function reached(id: string) {
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().top < window.innerHeight : false;
}

export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setShow(
        window.scrollY > window.innerHeight * 0.7 && !inView("saradnja") && !reached("kontakt"),
      );
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-black/95 p-3 backdrop-blur transition-transform duration-300 lg:hidden ${
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
