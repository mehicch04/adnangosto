"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, SearchIcon } from "@/components/admin/icons";

export type Command = {
  id: string;
  label: string;
  group: string;
  keywords?: string;
  icon: ReactNode;
  href?: string;
  external?: boolean;
  run?: () => void;
};

const fold = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return commands;
    return commands.filter((c) => fold(`${c.label} ${c.keywords ?? ""} ${c.group}`).includes(q));
  }, [query, commands]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      input.current?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  const choose = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    setQuery("");
    setIndex(0);
    if (c.run) c.run();
    else if (c.href && c.external) window.open(c.href, "_blank", "noopener");
    else if (c.href) router.push(c.href);
  };

  const groups = results.reduce<Record<string, Command[]>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});

  return (
    <dialog
      ref={dialog}
      onClose={() => {
        onClose();
        setQuery("");
        setIndex(0);
      }}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Brza pretraga"
      className="dialog-pop mx-auto mt-[12vh] w-[min(36rem,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-0 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.95)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5">
        <SearchIcon className="size-5 shrink-0 text-white/40" />
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(results.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(results[index]);
            }
          }}
          placeholder="Traži stranicu ili akciju..."
          aria-label="Traži"
          className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-white/35 focus-visible:outline-none!"
        />
        <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-white/40">
          Esc
        </kbd>
      </div>
      <div className="max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && (
          <p className="px-3 py-10 text-center text-sm text-white/45">
            Nema rezultata za &ldquo;{query}&rdquo;.
          </p>
        )}
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="py-1">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold text-white/35">{group}</p>
            {items.map((c) => {
              const i = results.indexOf(c);
              const on = i === index;
              return (
                <button
                  key={c.id}
                  type="button"
                  onMouseMove={() => setIndex(i)}
                  onClick={() => choose(c)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    on ? "bg-white/[0.07] text-white" : "text-white/70"
                  }`}
                >
                  <span className={on ? "text-brand-yellow" : "text-white/45"}>{c.icon}</span>
                  <span className="flex-1">{c.label}</span>
                  {on && <ArrowRight className="size-4 text-white/40" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 border-t border-white/[0.07] px-5 py-2.5 text-[11px] font-medium text-white/35">
        <span>↑↓ biraj</span>
        <span>Enter otvori</span>
      </div>
    </dialog>
  );
}
