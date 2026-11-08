"use client";

import { heroPaths } from "@/content/site";

export const GOAL_EVENT = "adnangosto:cilj";

export function HeroPaths() {
  return (
    <ul aria-label="Šta tražiš?" className="flex flex-wrap gap-2">
      {heroPaths.map((p) => (
        <li key={p.id}>
          <a
            href="#saradnja"
            onClick={() => window.dispatchEvent(new CustomEvent(GOAL_EVENT, { detail: p.id }))}
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-black/50 px-4 text-sm font-semibold text-white/85 transition-colors hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-black"
          >
            {p.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
