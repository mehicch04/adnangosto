"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/admin/icons";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toaster";
import { Button, Card, CardHeader, inputClass } from "@/components/admin/ui";
import type { PriceGroup, PriceItem } from "@/content/packages";
import { savePriceList } from "./actions";

type Item = Required<Pick<PriceItem, "name" | "price">> & { detail: string; unit: string };
type Group = { id: string; title: string; text: string; items: Item[] };

const iconBtn =
  "grid size-8 shrink-0 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30";

function toGroups(groups: PriceGroup[]): Group[] {
  return groups.map((g) => ({
    id: g.id,
    title: g.title,
    text: g.text,
    items: g.items.map((i) => ({
      name: i.name,
      price: i.price,
      detail: i.detail ?? "",
      unit: i.unit ?? "",
    })),
  }));
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "dj")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "grupa"
  );
}

function withIds(groups: Group[]) {
  const used = new Set(["online"]);
  return groups.map((g) => {
    let id = g.id && !used.has(g.id) ? g.id : slugify(g.title);
    let n = 2;
    while (used.has(id)) id = `${slugify(g.title)}-${n++}`;
    used.add(id);
    return { ...g, id };
  });
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function PriceListEditor({
  initial,
  defaults,
  online,
}: {
  initial: PriceGroup[];
  defaults: PriceGroup[];
  online: { name: string; price: string }[];
}) {
  const toast = useToast();
  const [saved, setSaved] = useState(() => toGroups(initial));
  const [groups, setGroups] = useState(saved);
  const [saving, start] = useTransition();
  const [restore, setRestore] = useState(false);
  const dirty = JSON.stringify(groups) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setGroup = (gi: number, patch: Partial<Group>) =>
    setGroups((all) => all.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const setItem = (gi: number, ii: number, patch: Partial<Item>) =>
    setGroups((all) =>
      all.map((g, i) =>
        i === gi
          ? { ...g, items: g.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) }
          : g,
      ),
    );

  const save = (next = groups) =>
    start(async () => {
      const clean = withIds(next);
      const res = await savePriceList(clean);
      if (res.ok) {
        setSaved(clean);
        setGroups(clean);
      }
      toast(res.message, res.ok ? "success" : "error");
    });

  return (
    <div className="mt-8 space-y-4 lg:space-y-6">
      <Card>
        <CardHeader
          title="Online coaching"
          description="Ova grupa se puni sama iz paketa. Cijene mijenjaš u kartici Paketi."
          action={
            <a
              href="/cjenovnik"
              target="_blank"
              rel="noopener"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-white/60 hover:bg-white/[0.06] hover:text-white"
            >
              <ExternalIcon className="size-4" />
              Cjenovnik
            </a>
          }
        />
        <ul className="divide-y divide-white/[0.06]">
          {online.map((o) => (
            <li
              key={o.name}
              className="flex items-baseline justify-between gap-4 px-5 py-3 text-sm sm:px-6"
            >
              <span className="text-white/80">{o.name}</span>
              <span className="font-semibold text-white tabular-nums">{o.price}</span>
            </li>
          ))}
        </ul>
      </Card>

      {groups.map((g, gi) => (
        <Card key={gi}>
          <div className="flex items-start gap-2 border-b border-white/[0.06] px-4 py-4 sm:px-6">
            <div className="grid min-w-0 flex-1 gap-2">
              <input
                aria-label="Naziv grupe"
                value={g.title}
                maxLength={80}
                placeholder="Naziv grupe"
                onChange={(e) => setGroup(gi, { title: e.target.value })}
                className={`${inputClass} font-semibold`}
              />
              <input
                aria-label="Opis grupe"
                value={g.text}
                maxLength={240}
                placeholder="Jedna rečenica ispod naziva"
                onChange={(e) => setGroup(gi, { text: e.target.value })}
                className={`${inputClass} text-[14px] text-white/75`}
              />
            </div>
            <div className="flex flex-col sm:flex-row">
              <button
                type="button"
                aria-label="Grupa gore"
                disabled={gi === 0}
                onClick={() => setGroups((all) => move(all, gi, gi - 1))}
                className={iconBtn}
              >
                <ArrowUpIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Grupa dolje"
                disabled={gi === groups.length - 1}
                onClick={() => setGroups((all) => move(all, gi, gi + 1))}
                className={iconBtn}
              >
                <ArrowDownIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Ukloni grupu"
                onClick={() => setGroups((all) => all.filter((_, i) => i !== gi))}
                className={`${iconBtn} hover:text-[#ff9b8f]`}
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {g.items.map((it, ii) => (
              <li key={ii} className="flex items-start gap-2 px-4 py-3 sm:px-6">
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_8rem_7rem]">
                  <input
                    aria-label="Usluga"
                    placeholder="Usluga"
                    value={it.name}
                    maxLength={120}
                    onChange={(e) => setItem(gi, ii, { name: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    aria-label="Detalj"
                    placeholder="Detalj, nije obavezno"
                    value={it.detail}
                    maxLength={200}
                    onChange={(e) => setItem(gi, ii, { detail: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    aria-label="Cijena"
                    placeholder="50 €"
                    value={it.price}
                    maxLength={60}
                    onChange={(e) => setItem(gi, ii, { price: e.target.value })}
                    className={`${inputClass} font-semibold tabular-nums`}
                  />
                  <input
                    aria-label="Jedinica"
                    placeholder="mjesečno"
                    value={it.unit}
                    maxLength={60}
                    onChange={(e) => setItem(gi, ii, { unit: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col pt-0.5 sm:flex-row">
                  <button
                    type="button"
                    aria-label="Stavka gore"
                    disabled={ii === 0}
                    onClick={() => setGroup(gi, { items: move(g.items, ii, ii - 1) })}
                    className={iconBtn}
                  >
                    <ArrowUpIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Stavka dolje"
                    disabled={ii === g.items.length - 1}
                    onClick={() => setGroup(gi, { items: move(g.items, ii, ii + 1) })}
                    className={iconBtn}
                  >
                    <ArrowDownIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Ukloni stavku"
                    onClick={() => setGroup(gi, { items: g.items.filter((_, j) => j !== ii) })}
                    className={`${iconBtn} hover:text-[#ff9b8f]`}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 sm:px-6">
            <button
              type="button"
              disabled={g.items.length >= 30}
              onClick={() =>
                setGroup(gi, { items: [...g.items, { name: "", detail: "", price: "", unit: "" }] })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <PlusIcon className="size-4" />
              Dodaj uslugu
            </button>
          </div>
        </Card>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={groups.length >= 19}
          onClick={() =>
            setGroups((all) => [
              ...all,
              {
                id: "",
                title: "",
                text: "",
                items: [{ name: "", detail: "", price: "", unit: "" }],
              },
            ])
          }
        >
          <PlusIcon className="size-4" />
          Nova grupa
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setRestore(true)}>
          Vrati početni cjenovnik
        </Button>
      </div>

      <ConfirmDialog
        open={restore}
        title="Vratiti početni cjenovnik?"
        text="Sve grupe i stavke ispod online paketa vraćaju se na verziju s kojom je sajt napravljen."
        confirmLabel="Vrati"
        tone="primary"
        loading={saving}
        onClose={() => setRestore(false)}
        onConfirm={() => {
          const next = toGroups(defaults);
          setGroups(next);
          setRestore(false);
          save(next);
        }}
      />

      {dirty && (
        <div className="toast-in fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6 lg:pl-[16.5rem]">
          <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-[#161616]/95 py-2 pr-2 pl-4 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <span className="size-2 rounded-full bg-brand-yellow" />
            <span className="flex-1 text-sm font-medium">Nesačuvane izmjene</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={saving}
              onClick={() => setGroups(saved)}
            >
              Poništi
            </Button>
            <Button type="button" size="sm" loading={saving} onClick={() => save()}>
              Sačuvaj
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
