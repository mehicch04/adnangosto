"use client";

import { useEffect, useState } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import type { ContactLink } from "@/lib/contact";

export function ChatButton({ link }: { link: ContactLink }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const first = document.querySelector("main > section");
    if (!first) {
      const t = window.setTimeout(() => setShow(true), 0);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        const next = e.intersectionRatio < 0.6 || e.boundingClientRect.top < 0;
        setShow((prev) => (prev === next ? prev : next));
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(first);
    return () => io.disconnect();
  }, []);

  const wa = link.kind === "whatsapp";

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={wa ? "Pitaj me na WhatsAppu" : "Piši mi na Instagramu"}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`group fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 flex h-12 items-center gap-2.5 rounded-full pr-0 pl-0 shadow-lg shadow-black/40 transition-[opacity,transform,background-color] duration-300 will-change-transform lg:right-8 lg:bottom-8 lg:h-14 lg:pr-6 lg:pl-4 ${
        wa
          ? "bg-[#25D366] text-brand-black hover:bg-[#3ae07a]"
          : "bg-white text-brand-black hover:bg-brand-yellow"
      } ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <span className="grid size-12 place-items-center lg:size-auto">
        {wa ? <WhatsAppIcon className="size-6" /> : <InstagramIcon className="size-6" />}
      </span>
      <span className="hidden text-[15px] font-bold whitespace-nowrap lg:inline">
        {wa ? "Pitaj me na WhatsAppu" : "Pitaj me na Instagramu"}
      </span>
    </a>
  );
}
