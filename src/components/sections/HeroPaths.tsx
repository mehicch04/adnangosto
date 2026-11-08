"use client";

import { heroPaths } from "@/content/site";

export const GOAL_EVENT = "adnangosto:cilj";

export function HeroPaths() {
  return (
    <div className="mt-8">
      <p className="text-xs font-bold tracking-[0.18em] text-white/55 uppercase">Šta tražiš?</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {heroPaths.map((p) => (
          <li key={p.id}>
            <a
              href="#saradnja"
              onClick={() => window.dispatchEvent(new CustomEvent(GOAL_EVENT, { detail: p.id }))}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-brand-black/40 px-4 text-[15px] font-semibold text-white transition-[background-color,border-color,color] duration-200 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-black"
            >
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
