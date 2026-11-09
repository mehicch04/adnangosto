"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
  ExternalIcon,
  EyeIcon,
  EyeOffIcon,
  GripIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Button, Card, CardHeader, Field, Spinner, inputClass } from "@/components/admin/ui";
import { TickIcon } from "@/components/ui/icons";
import { formatPrice, packageCompare, type PackageSlug } from "@/content/packages";
import { savePackage, savePackageOrder, setPackageFeatured, setPackageVisible } from "./actions";

export type PackageFields = {
  name: string;
  shortName: string;
  badge: string;
  tagline: string;
  audience: string;
  price: number;
  priceUnit: string;
  priceNote: string;
  checkIn: string;
  features: string[];
  includes: { title: string; text: string }[];
};

export type EditorPackage = PackageFields & { slug: string; featured: boolean; visible: boolean };

function fieldsOf(p: EditorPackage): PackageFields {
  return {
    name: p.name,
    shortName: p.shortName,
    badge: p.badge,
    tagline: p.tagline,
    audience: p.audience,
    price: p.price,
    priceUnit: p.priceUnit,
    priceNote: p.priceNote,
    checkIn: p.checkIn,
    features: p.features,
    includes: p.includes,
  };
}

const same = (a: PackageFields, b: PackageFields) => JSON.stringify(a) === JSON.stringify(b);
const areaClass = `${inputClass} h-auto min-h-20 resize-y py-2.5 leading-snug`;
const iconBtn =
  "grid size-8 shrink-0 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30";

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-white/[0.06] px-5 py-5 first:border-t-0 sm:px-6">
      <legend className="sr-only">{title}</legend>
      <p className="text-[13px] font-bold tracking-[0.14em] text-brand-yellow uppercase">{title}</p>
      <p className="mt-1 text-[13px] text-white/45">{hint}</p>
      <div className="mt-5 grid gap-4">{children}</div>
    </fieldset>
  );
}

function Preview({ p }: { p: EditorPackage }) {
  const ribbon = p.badge || (p.featured ? "Najpopularnije" : "");
  const price = formatPrice(Number.isFinite(p.price) ? p.price : 0);
  return (
    <div className="rounded-2xl bg-brand-paper p-4 pt-7 text-brand-black sm:p-5 sm:pt-8">
      <div className="relative rounded-2xl border border-brand-paper-line bg-white p-6">
        {ribbon && (
          <span className="absolute -top-3 right-6 rounded-full bg-brand-black px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white uppercase">
            {ribbon}
          </span>
        )}
        <p className="text-xs font-bold tracking-[0.14em] text-brand-ink-muted uppercase">
          {packageCompare[p.slug as PackageSlug]?.tag}
        </p>
        <h3 className="mt-4 font-display text-[2.4rem] leading-[0.9]">
          {p.name || "Naziv paketa"}
        </h3>
        <p className="mt-3 text-[15px] leading-snug text-brand-ink-muted">{p.audience}</p>
        <p className="mt-5 flex items-baseline gap-2">
          <span className="font-display text-6xl leading-none">{price}</span>
          <span className="text-sm font-semibold text-brand-ink-muted">{p.priceUnit}</span>
        </p>
        <p className="mt-1 text-[13px] text-brand-ink-muted/80">{p.priceNote}</p>
        <span className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-brand-black font-semibold text-white">
          Prijavi se
        </span>
        <ul className="mt-6 space-y-3 border-t border-brand-paper-line pt-6">
          {p.features.filter(Boolean).map((f, i) => (
            <li key={`${f}-${i}`} className="flex gap-3 text-[14px] leading-snug">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-yellow">
                <TickIcon className="size-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-brand-black px-4 py-3 text-white">
        <p className="text-[11px] font-bold tracking-[0.14em] text-white/40 uppercase">U meniju</p>
        <p className="mt-1.5 flex items-baseline justify-between gap-3">
          <span className="font-semibold">{p.shortName || p.name}</span>
          <span className="font-display text-xl text-brand-yellow">{price}</span>
        </p>
        <p className="mt-1 line-clamp-2 text-[13px] text-white/55">{p.tagline}</p>
      </div>
    </div>
  );
}

export function PackagesEditor({ initial }: { initial: EditorPackage[] }) {
  const toast = useToast();
  const [list, setList] = useState(initial);
  const [drafts, setDrafts] = useState<Record<string, PackageFields>>(() =>
    Object.fromEntries(initial.map((p) => [p.slug, fieldsOf(p)])),
  );
  const [selected, setSelected] = useState(initial[0]?.slug ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [saving, startSave] = useTransition();
  const [dragging, setDragging] = useState<string | null>(null);
  const dragStart = useRef<string[]>([]);
  const editor = useRef<HTMLDivElement>(null);

  const current = list.find((p) => p.slug === selected) ?? list[0];
  const draft = drafts[current.slug];
  const dirty = !same(draft, fieldsOf(current));
  const live: EditorPackage = { ...current, ...draft };
  const dirtyCount = list.filter((p) => !same(drafts[p.slug], fieldsOf(p))).length;

  const update = (patch: Partial<PackageFields>) =>
    setDrafts((d) => ({ ...d, [current.slug]: { ...d[current.slug], ...patch } }));

  useEffect(() => {
    if (!dirtyCount) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyCount]);

  const persistOrder = async (next: EditorPackage[], prev: EditorPackage[]) => {
    setBusy("order");
    const res = await savePackageOrder(next.map((p) => p.slug));
    setBusy(null);
    if (!res.ok) setList(prev);
    toast(res.message, res.ok ? "success" : "error");
  };

  const shift = (slug: string, dir: -1 | 1) => {
    const from = list.findIndex((p) => p.slug === slug);
    const to = from + dir;
    if (to < 0 || to >= list.length) return;
    const prev = list;
    const next = move(list, from, to);
    setList(next);
    void persistOrder(next, prev);
  };

  const toggle = async (slug: string, kind: "visible" | "featured") => {
    const pkg = list.find((p) => p.slug === slug);
    if (!pkg) return;
    const prev = list;
    const value = !pkg[kind];
    setList((l) =>
      l.map((p) => {
        if (kind === "featured")
          return p.slug === slug
            ? { ...p, featured: value, visible: value ? true : p.visible }
            : { ...p, featured: value ? false : p.featured };
        return p.slug === slug ? { ...p, visible: value, featured: value ? p.featured : false } : p;
      }),
    );
    setBusy(`${kind}:${slug}`);
    const res =
      kind === "visible"
        ? await setPackageVisible(slug, value)
        : await setPackageFeatured(slug, value);
    setBusy(null);
    if (!res.ok) setList(prev);
    toast(res.message, res.ok ? "success" : "error");
  };

  const save = () =>
    startSave(async () => {
      const res = await savePackage({ slug: current.slug, ...draft });
      if (res.ok) setList((l) => l.map((p) => (p.slug === current.slug ? { ...p, ...draft } : p)));
      toast(res.message, res.ok ? "success" : "error");
    });

  const reset = () => update(fieldsOf(current));

  return (
    <>
      <Card className="mt-8">
        <CardHeader
          title="Redoslijed i vidljivost"
          description="Ovim redom se paketi prikazuju na početnoj, u meniju i u cjenovniku. Prevuci karticu ili koristi strelice."
          action={busy === "order" ? <Spinner className="size-4 text-white/50" /> : undefined}
        />
        <ol className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          {list.map((p, i) => {
            const on = p.slug === current.slug;
            const changed = !same(drafts[p.slug], fieldsOf(p));
            return (
              <li
                key={p.slug}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  dragStart.current = list.map((x) => x.slug);
                  setDragging(p.slug);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!dragging || dragging === p.slug) return;
                  setList((l) =>
                    move(
                      l,
                      l.findIndex((x) => x.slug === dragging),
                      l.findIndex((x) => x.slug === p.slug),
                    ),
                  );
                }}
                onDragEnd={() => {
                  setDragging(null);
                  const before = dragStart.current;
                  if (before.join() === list.map((x) => x.slug).join()) return;
                  const prev = before.map((s) => list.find((x) => x.slug === s)!);
                  void persistOrder(list, prev);
                }}
                className={`group relative rounded-2xl border p-3.5 transition-[border-color,background-color,opacity,transform] ${
                  on
                    ? "border-brand-yellow/70 bg-brand-yellow/[0.06]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                } ${dragging === p.slug ? "scale-[0.98] opacity-50" : ""} ${p.visible ? "" : "opacity-60"}`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="grid size-8 cursor-grab place-items-center rounded-lg text-white/35 active:cursor-grabbing"
                    aria-hidden="true"
                  >
                    <GripIcon className="size-4" />
                  </span>
                  <span className="font-display text-xl leading-none text-white/35 tabular-nums">
                    {i + 1}
                  </span>
                  <span className="ml-auto flex">
                    <button
                      type="button"
                      aria-label={`Pomjeri ${p.name} ranije`}
                      disabled={i === 0 || busy === "order"}
                      onClick={() => shift(p.slug, -1)}
                      className={iconBtn}
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Pomjeri ${p.name} kasnije`}
                      disabled={i === list.length - 1 || busy === "order"}
                      onClick={() => shift(p.slug, 1)}
                      className={iconBtn}
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(p.slug);
                    if (window.innerWidth < 1024)
                      editor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  aria-pressed={on}
                  className="mt-2 block w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60 focus-visible:outline-none!"
                >
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-semibold">{p.name}</span>
                    {changed && (
                      <span
                        title="Nesačuvane izmjene"
                        className="size-2 shrink-0 rounded-full bg-brand-yellow"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-white/50">
                    {formatPrice(p.price)} {p.priceUnit}
                  </span>
                </button>
                <div className="mt-3 flex gap-1.5">
                  <button
                    type="button"
                    aria-pressed={p.visible}
                    disabled={busy !== null}
                    onClick={() => toggle(p.slug, "visible")}
                    className={`inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border text-[12px] font-semibold transition-colors disabled:cursor-wait ${
                      p.visible
                        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15"
                        : "border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    {busy === `visible:${p.slug}` ? (
                      <Spinner className="size-3.5" />
                    ) : p.visible ? (
                      <EyeIcon className="size-3.5" />
                    ) : (
                      <EyeOffIcon className="size-3.5" />
                    )}
                    {p.visible ? "Vidljiv" : "Sakriven"}
                  </button>
                  <button
                    type="button"
                    aria-pressed={p.featured}
                    aria-label={
                      p.featured ? "Skini oznaku najpopularnije" : "Označi kao najpopularnije"
                    }
                    title={p.featured ? "Najpopularnije" : "Označi kao najpopularnije"}
                    disabled={busy !== null}
                    onClick={() => toggle(p.slug, "featured")}
                    className={`grid h-8 w-9 place-items-center rounded-lg border transition-colors disabled:cursor-wait ${
                      p.featured
                        ? "border-brand-yellow/40 bg-brand-yellow/15 text-brand-yellow"
                        : "border-white/10 text-white/45 hover:text-white"
                    }`}
                  >
                    {busy === `featured:${p.slug}` ? (
                      <Spinner className="size-3.5" />
                    ) : (
                      <StarIcon filled={p.featured} className="size-4" />
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <div
        ref={editor}
        className="mt-4 grid scroll-mt-20 gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6"
      >
        <Card className="min-w-0">
          <CardHeader
            title={live.name || "Paket"}
            description={live.visible ? "Vidljiv na sajtu" : "Sakriven, posjetioci ga ne vide"}
            action={
              <a
                href={`/paketi/${current.slug}`}
                target="_blank"
                rel="noopener"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-white/60 hover:bg-white/[0.06] hover:text-white"
              >
                <ExternalIcon className="size-4" />
                Na sajtu
              </a>
            }
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Section title="Kartica" hint="Ovo se vidi na početnoj u sekciji paketa.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Naziv" htmlFor="name">
                  <input
                    id="name"
                    value={draft.name}
                    maxLength={60}
                    required
                    onChange={(e) => update({ name: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Oznaka"
                  htmlFor="badge"
                  hint="Mala oznaka na vrhu kartice. Može ostati prazno."
                >
                  <input
                    id="badge"
                    value={draft.badge}
                    maxLength={30}
                    onChange={(e) => update({ badge: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field
                label="Check-in"
                htmlFor="checkIn"
                hint="Ide u cjenovnik i na stranicu paketa."
              >
                <input
                  id="checkIn"
                  value={draft.checkIn}
                  maxLength={60}
                  onChange={(e) => update({ checkIn: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Kome je namijenjen" htmlFor="audience">
                <textarea
                  id="audience"
                  value={draft.audience}
                  maxLength={220}
                  rows={2}
                  onChange={(e) => update({ audience: e.target.value })}
                  className={areaClass}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <Field label="Cijena u €" htmlFor="price">
                  <input
                    id="price"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={Number.isFinite(draft.price) ? draft.price : ""}
                    onChange={(e) => update({ price: e.target.valueAsNumber })}
                    className={`${inputClass} tabular-nums`}
                  />
                </Field>
                <Field
                  label="Uz cijenu"
                  htmlFor="priceUnit"
                  hint="Npr. mjesečno ili za 12 sedmica."
                >
                  <input
                    id="priceUnit"
                    value={draft.priceUnit}
                    maxLength={40}
                    onChange={(e) => update({ priceUnit: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Napomena o plaćanju" htmlFor="priceNote">
                <input
                  id="priceNote"
                  value={draft.priceNote}
                  maxLength={120}
                  onChange={(e) => update({ priceNote: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <ListField
                label="Stavke s kvačicom"
                items={draft.features}
                max={6}
                addLabel="Dodaj stavku"
                onChange={(features) => update({ features })}
                render={(value, set, i) => (
                  <input
                    aria-label={`Stavka ${i + 1}`}
                    value={value}
                    maxLength={120}
                    onChange={(e) => set(e.target.value)}
                    className={inputClass}
                  />
                )}
                empty=""
              />
            </Section>

            <Section title="Meni i opis" hint="Kratki naziv i opis idu u padajući meni.">
              <Field
                label="Kratki naziv"
                htmlFor="shortName"
                hint="Ako je prazno, koristi se naziv."
              >
                <input
                  id="shortName"
                  value={draft.shortName}
                  maxLength={40}
                  onChange={(e) => update({ shortName: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Kratki opis" htmlFor="tagline">
                <textarea
                  id="tagline"
                  value={draft.tagline}
                  maxLength={220}
                  rows={2}
                  onChange={(e) => update({ tagline: e.target.value })}
                  className={areaClass}
                />
              </Field>
            </Section>

            <Section title="Šta dobijaš" hint="Blokovi na stranici paketa, ispod naslova.">
              <ListField
                label="Stavke"
                items={draft.includes}
                max={8}
                addLabel="Dodaj blok"
                onChange={(includes) => update({ includes })}
                empty={{ title: "", text: "" }}
                render={(value, set, i) => (
                  <div className="grid gap-2">
                    <input
                      aria-label={`Naslov bloka ${i + 1}`}
                      placeholder="Naslov"
                      value={value.title}
                      maxLength={80}
                      onChange={(e) => set({ ...value, title: e.target.value })}
                      className={`${inputClass} font-semibold`}
                    />
                    <textarea
                      aria-label={`Tekst bloka ${i + 1}`}
                      placeholder="Tekst"
                      value={value.text}
                      maxLength={400}
                      rows={2}
                      onChange={(e) => set({ ...value, text: e.target.value })}
                      className={areaClass}
                    />
                  </div>
                )}
              />
            </Section>
            <button type="submit" hidden />
          </form>
        </Card>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-2 px-1 text-[12px] font-semibold tracking-[0.14em] text-white/40 uppercase">
            Pregled uživo
          </p>
          <Preview p={live} />
        </div>
      </div>

      {dirty && (
        <div className="toast-in fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6 lg:pl-[16.5rem]">
          <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-[#161616]/95 py-2 pr-2 pl-4 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <span className="size-2 rounded-full bg-brand-yellow" />
            <span className="flex-1 text-sm font-medium">Nesačuvane izmjene</span>
            <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={saving}>
              Poništi
            </Button>
            <Button type="button" size="sm" onClick={save} loading={saving}>
              Sačuvaj
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function ListField<T>({
  label,
  items,
  max,
  addLabel,
  onChange,
  render,
  empty,
}: {
  label: string;
  items: T[];
  max: number;
  addLabel: string;
  onChange: (items: T[]) => void;
  render: (value: T, set: (v: T) => void, index: number) => ReactNode;
  empty: T;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-white/80">{label}</p>
      <ul className="grid gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <div className="min-w-0 flex-1">
              {render(item, (v) => onChange(items.map((x, j) => (j === i ? v : x))), i)}
            </div>
            <div className="flex flex-col pt-0.5 sm:flex-row">
              <button
                type="button"
                aria-label="Gore"
                disabled={i === 0}
                onClick={() => onChange(move(items, i, i - 1))}
                className={iconBtn}
              >
                <ArrowUpIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Dolje"
                disabled={i === items.length - 1}
                onClick={() => onChange(move(items, i, i + 1))}
                className={iconBtn}
              >
                <ArrowDownIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Ukloni"
                disabled={items.length <= 1}
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className={`${iconBtn} hover:text-[#ff9b8f]`}
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, empty])}
          className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <PlusIcon className="size-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
