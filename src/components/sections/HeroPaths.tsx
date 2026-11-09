"use client";

import { ArrowRightIcon } from "@/components/ui/icons";
import { heroPaths } from "@/content/site";

export const GOAL_EVENT = "adnangosto:cilj";

export function HeroPaths() {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] text-white/45 uppercase">Kreni od cilja</p>
      <ul
        aria-label="Kreni od cilja"
        className="mt-2 divide-y divide-white/10 sm:mt-3 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 sm:divide-y-0"
      >
        {heroPaths.map((p) => (
          <li key={p.id}>
            <a
              href="#saradnja"
              onClick={() => window.dispatchEvent(new CustomEvent(GOAL_EVENT, { detail: p.id }))}
              className="group flex min-h-12 items-center gap-2 text-[15px] font-semibold text-white/85 transition-colors hover:text-brand-yellow sm:inline-flex sm:min-h-9 sm:gap-1.5"
            >
              <span className="h-px w-3 bg-brand-yellow transition-[width] duration-300 group-hover:w-5" />
              {p.label}
              <ArrowRightIcon className="ml-auto size-4 text-white/40 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-brand-yellow sm:hidden" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
