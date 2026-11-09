"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/admin/icons";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? "Kopirano" : label}
      title={done ? "Kopirano" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        } catch {
          setDone(false);
        }
      }}
      className="grid size-8 shrink-0 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/10 hover:text-white"
    >
      {done ? <CheckIcon className="size-4 text-emerald-400" /> : <CopyIcon className="size-4" />}
    </button>
  );
}
