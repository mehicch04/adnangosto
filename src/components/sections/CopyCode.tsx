"use client";

import { useState } from "react";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
      className="group inline-flex min-h-12 items-center gap-3 rounded-md border-2 border-dashed border-brand-black/40 px-5 font-display text-3xl leading-none tracking-wider transition-colors hover:border-brand-black"
      aria-label={`Kopiraj kod ${code}`}
    >
      {code}
      <span className="font-body text-xs font-bold tracking-[0.12em] uppercase" aria-live="polite">
        {copied ? "Kopirano" : "Kopiraj"}
      </span>
    </button>
  );
}
