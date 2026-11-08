"use client";

import { useState } from "react";
import { TransformationsGrid } from "@/components/sections/TransformationsGrid";
import type { TransformationPhoto } from "@/content/site";

export function TransformationsTabs({
  tabs,
}: {
  tabs: { id: string; label: string; photos: TransformationPhoto[] }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <>
      <div className="mx-auto mt-10 max-w-7xl px-5">
        <div
          role="tablist"
          aria-label="Vrsta transformacija"
          className="inline-flex rounded-full border border-brand-black/15 bg-white p-1"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={t.id === current.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`min-h-11 rounded-full px-5 text-[15px] font-semibold transition-colors ${
                t.id === current.id
                  ? "bg-brand-black text-white"
                  : "text-brand-black hover:bg-brand-black/5"
              }`}
            >
              {t.label} <span className="opacity-60">{t.photos.length}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        key={current.id}
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="animate-step"
      >
        <TransformationsGrid photos={current.photos} />
      </div>
    </>
  );
}
