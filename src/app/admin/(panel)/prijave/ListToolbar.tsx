"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArchiveIcon, ChevronDown, SearchIcon, XIcon } from "@/components/admin/icons";
import { Spinner } from "@/components/admin/ui";
import { statuses } from "@/lib/admin/applications";
import { listHref, type ListParams } from "@/lib/admin/list";

const selectClass =
  "h-10 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/[0.03] pr-9 pl-3.5 text-[13px] font-semibold text-white/80 outline-none transition-colors hover:border-white/20 focus-visible:outline-none! focus-visible:border-brand-yellow/70 focus-visible:ring-4 focus-visible:ring-brand-yellow/15";

export function ListToolbar({
  params,
  counts,
  archived,
  packages,
}: {
  params: ListParams;
  counts: Record<string, number>;
  archived: number;
  packages: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.q);
  const [seen, setSeen] = useState(params.q);
  if (params.q !== seen) {
    setSeen(params.q);
    if (params.q !== q.trim()) setQ(params.q);
  }
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef(0);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  const go = (next: Partial<ListParams>) =>
    start(() => router.replace(listHref({ ...params, ...next }), { scroll: false }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== "/" || el.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const chips = [
    { id: null, label: "Sve", count: total },
    ...statuses.map((s) => ({ id: s.id, label: s.label, count: counts[s.id] ?? 0 })),
  ];

  return (
    <div className="mt-8 space-y-3">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_10rem]">
        <label className="relative block">
          <span className="sr-only">Traži prijave</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-white/40" />
          <input
            ref={input}
            type="search"
            value={q}
            onChange={(e) => {
              const value = e.target.value;
              setQ(value);
              window.clearTimeout(timer.current);
              timer.current = window.setTimeout(() => go({ q: value.trim() }), 320);
            }}
            placeholder="Ime, e-mail ili telefon"
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pr-16 pl-10 text-[14px] text-white transition-[border-color,box-shadow] outline-none placeholder:text-white/35 hover:border-white/20 focus:border-brand-yellow/70 focus:ring-4 focus:ring-brand-yellow/15 focus-visible:outline-none! [&::-webkit-search-cancel-button]:hidden"
          />
          <span className="absolute inset-y-0 right-2 flex items-center gap-1">
            {pending && <Spinner className="size-4 text-white/50" />}
            {q ? (
              <button
                type="button"
                aria-label="Obriši pretragu"
                onClick={() => {
                  window.clearTimeout(timer.current);
                  setQ("");
                  go({ q: "" });
                }}
                className="grid size-7 place-items-center rounded-lg text-white/45 hover:bg-white/10 hover:text-white"
              >
                <XIcon className="size-4" />
              </button>
            ) : (
              <kbd className="hidden rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-semibold text-white/40 sm:block">
                /
              </kbd>
            )}
          </span>
        </label>
        <label className="relative block">
          <span className="sr-only">Paket</span>
          <select
            value={params.paket ?? ""}
            onChange={(e) => go({ paket: e.target.value || null })}
            className={selectClass}
          >
            <option value="" className="bg-[#161616]">
              Svi paketi
            </option>
            {packages.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-[#161616]">
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/45" />
        </label>
        <label className="relative block">
          <span className="sr-only">Redoslijed</span>
          <select
            value={params.sort}
            onChange={(e) => go({ sort: e.target.value === "starije" ? "starije" : "novije" })}
            className={selectClass}
          >
            <option value="novije" className="bg-[#161616]">
              Prvo novije
            </option>
            <option value="starije" className="bg-[#161616]">
              Prvo starije
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/45" />
        </label>
      </div>

      <nav
        aria-label="Filter po statusu"
        className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {chips.map((f) => {
          const on = !params.arhiva && params.status === f.id;
          return (
            <Link
              key={f.label}
              href={listHref({ ...params, status: f.id, arhiva: false })}
              replace
              scroll={false}
              aria-current={on ? "page" : undefined}
              className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                on
                  ? "border-white bg-white text-brand-black"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-black/10" : "bg-white/[0.08]"}`}
              >
                {f.count}
              </span>
            </Link>
          );
        })}
        <Link
          href={listHref({ ...params, status: null, arhiva: !params.arhiva })}
          replace
          scroll={false}
          aria-current={params.arhiva ? "page" : undefined}
          className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition-colors sm:ml-auto ${
            params.arhiva
              ? "border-white bg-white text-brand-black"
              : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
          }`}
        >
          <ArchiveIcon className="size-4" />
          Arhiva
          <span
            className={`rounded-full px-1.5 text-[11px] tabular-nums ${params.arhiva ? "bg-black/10" : "bg-white/[0.08]"}`}
          >
            {archived}
          </span>
        </Link>
      </nav>
    </div>
  );
}
