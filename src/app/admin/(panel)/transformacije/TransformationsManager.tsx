"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EditorDialog } from "@/components/admin/EditorDialog";
import { ImagePicker } from "@/components/admin/ImagePicker";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompareIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Badge, Button, EmptyState, Field, inputClass } from "@/components/admin/ui";
import { uploadImage } from "@/lib/admin/upload";
import { imageSrc } from "@/lib/media";
import {
  deleteTransformation,
  saveTransformation,
  saveTransformationOrder,
  setTransformationVisible,
} from "./actions";

type Category = "rekreativci" | "takmicari";

export type AdminTransformation = {
  id: string;
  image: string;
  src: string | null;
  category: Category;
  name: string;
  label: string;
  result: string;
  story: string;
  testimonial: string;
  visible: boolean;
};

type Draft = Omit<AdminTransformation, "id" | "src"> & { id?: string; src: string | null };

const categories: { id: Category; label: string }[] = [
  { id: "rekreativci", label: "Rekreativci" },
  { id: "takmicari", label: "Natjecatelji" },
];

const empty: Draft = {
  image: "",
  src: null,
  category: "rekreativci",
  name: "",
  label: "",
  result: "",
  story: "",
  testimonial: "",
  visible: true,
};

const areaClass = `${inputClass} h-auto min-h-24 resize-y py-2.5 leading-snug`;
const iconBtn =
  "grid size-9 shrink-0 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25";

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span
      className={`text-xs tabular-nums ${value.length > max ? "text-[#ff9b8f]" : "text-white/35"}`}
    >
      {value.length}/{max}
    </span>
  );
}

export function TransformationsManager({ initial }: { initial: AdminTransformation[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Category | "sve">("sve");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [permission, setPermission] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<AdminTransformation | null>(null);
  const [pending, startTransition] = useTransition();

  const shown = filter === "sve" ? items : items.filter((t) => t.category === filter);
  const count = (c: Category) => items.filter((t) => t.category === c).length;

  const openNew = () => {
    setDraft({ ...empty, category: filter === "sve" ? "rekreativci" : filter });
    setFile(null);
    setPermission(false);
    setImageError(null);
  };

  const openEdit = (t: AdminTransformation) => {
    setDraft({ ...t });
    setFile(null);
    setPermission(true);
    setImageError(null);
  };

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const save = async () => {
    if (!draft) return;
    if (!file && !draft.image) {
      setImageError("Dodaj fotografiju prije i poslije.");
      return;
    }
    if (!draft.id && !permission) {
      toast("Potvrdi da imaš dozvolu klijenta za objavu.", "error");
      return;
    }
    setSaving(true);
    try {
      const image = file
        ? await uploadImage(file, "transformacije", { maxSide: 1600 })
        : draft.image;
      const res = await saveTransformation({
        id: draft.id,
        image,
        category: draft.category,
        name: draft.name,
        label: draft.label,
        result: draft.result,
        story: draft.story,
        testimonial: draft.testimonial,
        visible: draft.visible,
      });
      toast(res.message, res.ok ? "success" : "error");
      if (!res.ok || !res.id) return;
      const saved: AdminTransformation = {
        ...draft,
        id: res.id,
        image,
        src: imageSrc(image),
      };
      setItems((all) =>
        draft.id ? all.map((t) => (t.id === draft.id ? saved : t)) : [saved, ...all],
      );
      setDraft(null);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Nešto nije u redu. Pokušaj ponovo.", "error");
    } finally {
      setSaving(false);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + dir, 0, item);
    setItems(next);
    startTransition(async () => {
      const res = await saveTransformationOrder(next.map((t) => t.id));
      if (!res.ok) toast(res.message, "error");
    });
  };

  const toggle = (t: AdminTransformation) => {
    setItems((all) => all.map((x) => (x.id === t.id ? { ...x, visible: !x.visible } : x)));
    startTransition(async () => {
      const res = await setTransformationVisible(t.id, !t.visible);
      toast(res.message, res.ok ? "success" : "error");
      if (!res.ok)
        setItems((all) => all.map((x) => (x.id === t.id ? { ...x, visible: t.visible } : x)));
    });
  };

  const remove = () => {
    if (!removing) return;
    const target = removing;
    startTransition(async () => {
      const res = await deleteTransformation(target.id);
      toast(res.message, res.ok ? "success" : "error");
      if (res.ok) setItems((all) => all.filter((x) => x.id !== target.id));
      setRemoving(null);
    });
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Vrsta"
          className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1"
        >
          {[
            { id: "sve" as const, label: "Sve", n: items.length },
            ...categories.map((c) => ({ ...c, n: count(c.id) })),
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-colors ${
                filter === c.id ? "bg-white text-brand-black" : "text-white/60 hover:text-white"
              }`}
            >
              {c.label}
              <span className="tabular-nums opacity-50">{c.n}</span>
            </button>
          ))}
        </div>
        <Button type="button" onClick={openNew}>
          <PlusIcon className="size-[18px]" />
          Dodaj transformaciju
        </Button>
      </div>

      {shown.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<CompareIcon className="size-6" />}
            title="Još nema transformacija"
            text="Dodaj fotografiju prije i poslije, a uz nju po želji rezultat, kratku priču i izjavu klijenta."
            action={
              <Button type="button" onClick={openNew}>
                <PlusIcon className="size-[18px]" />
                Dodaj prvu
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {shown.map((t) => {
            const index = items.findIndex((x) => x.id === t.id);
            const title = t.result || t.name || "Bez opisa";
            return (
              <li
                key={t.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition-colors hover:border-white/15"
              >
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="relative block aspect-square overflow-hidden bg-black/40 text-left"
                  aria-label={`Uredi: ${title}`}
                >
                  {t.src && (
                    <Image
                      src={t.src}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 260px, (min-width: 640px) 33vw, 50vw"
                      className={`object-cover transition-[transform,opacity] duration-500 group-hover:scale-[1.03] ${t.visible ? "" : "opacity-40"}`}
                    />
                  )}
                  <span className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                    <Badge className="bg-black/70 text-white backdrop-blur">
                      {t.category === "takmicari" ? "Natjecatelj" : "Rekreativac"}
                    </Badge>
                    {!t.visible && <Badge className="bg-white text-brand-black">Skriveno</Badge>}
                  </span>
                </button>
                <div className="flex flex-1 flex-col px-3 pt-3">
                  <p
                    className={`line-clamp-1 text-sm font-semibold ${t.result || t.name ? "text-white" : "text-white/40"}`}
                  >
                    {title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/45">
                    {[
                      t.result ? t.name : "",
                      t.testimonial ? "Ima izjavu" : "",
                      t.story ? "Ima priču" : "",
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Samo fotografija"}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-0.5 border-t border-white/[0.06] px-1.5 py-1.5">
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label="Pomjeri naprijed"
                    title="Pomjeri naprijed"
                    disabled={filter !== "sve" || index === 0 || pending}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUpIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label="Pomjeri nazad"
                    title="Pomjeri nazad"
                    disabled={filter !== "sve" || index === items.length - 1 || pending}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDownIcon className="size-4" />
                  </button>
                  <span className="flex-1" />
                  <button
                    type="button"
                    className={`${iconBtn} max-sm:hidden`}
                    aria-label={t.visible ? "Sakrij sa sajta" : "Prikaži na sajtu"}
                    title={t.visible ? "Sakrij sa sajta" : "Prikaži na sajtu"}
                    onClick={() => toggle(t)}
                  >
                    {t.visible ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  </button>
                  <button
                    type="button"
                    className={`${iconBtn} max-sm:hidden`}
                    aria-label="Uredi"
                    title="Uredi"
                    onClick={() => openEdit(t)}
                  >
                    <PencilIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={`${iconBtn} hover:bg-[#ff6b5a]/15 hover:text-[#ff9b8f]`}
                    aria-label="Obriši"
                    title="Obriši"
                    onClick={() => setRemoving(t)}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {filter !== "sve" && shown.length > 1 && (
        <p className="mt-4 text-[13px] text-white/40">Redoslijed mijenjaš u prikazu Sve.</p>
      )}

      <EditorDialog
        open={draft !== null}
        title={draft?.id ? "Uredi transformaciju" : "Nova transformacija"}
        description="Prazna polja se ne prikazuju na sajtu."
        onClose={() => !saving && setDraft(null)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDraft(null)} disabled={saving}>
              Odustani
            </Button>
            <Button type="button" onClick={save} loading={saving}>
              {draft?.id ? "Sačuvaj" : "Dodaj na sajt"}
            </Button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-5">
            <ImagePicker
              className="max-w-72"
              label="Fotografija prije i poslije"
              hint="Jedna slika s prije i poslije jedno do drugog. Najbolje kvadratna."
              current={draft.src}
              file={file}
              error={imageError}
              onFile={(f) => {
                setFile(f);
                setImageError(null);
              }}
            />
            <div>
              <p className="mb-1.5 text-[13px] font-semibold text-white/80">Vrsta</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={draft.category === c.id}
                    onClick={() => set("category", c.id)}
                    className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${
                      draft.category === c.id
                        ? "border-brand-yellow/60 bg-brand-yellow/10 text-brand-yellow"
                        : "border-white/10 text-white/65 hover:border-white/25"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ime klijenta" htmlFor="t-name" hint="Prazno ako želi ostati anoniman.">
                <input
                  id="t-name"
                  className={inputClass}
                  value={draft.name}
                  maxLength={60}
                  placeholder="npr. Marko K."
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Tko je" htmlFor="t-label" hint="Kratko, ispod imena.">
                <input
                  id="t-label"
                  className={inputClass}
                  value={draft.label}
                  maxLength={80}
                  placeholder="npr. Natjecatelj, Men's Physique"
                  onChange={(e) => set("label", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Rezultat" htmlFor="t-result" hint="Brojka djeluje najjače.">
              <input
                id="t-result"
                className={inputClass}
                value={draft.result}
                maxLength={60}
                placeholder="npr. Minus 14 kg za 16 tjedana"
                onChange={(e) => set("result", e.target.value)}
              />
            </Field>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="t-story" className="text-[13px] font-semibold text-white/80">
                  Kratka priča
                </label>
                <Counter value={draft.story} max={400} />
              </div>
              <textarea
                id="t-story"
                className={areaClass}
                value={draft.story}
                maxLength={400}
                placeholder="S čim je došao, koliko je trajalo i što se promijenilo."
                onChange={(e) => set("story", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="t-quote" className="text-[13px] font-semibold text-white/80">
                  Izjava klijenta
                </label>
                <Counter value={draft.testimonial} max={500} />
              </div>
              <textarea
                id="t-quote"
                className={areaClass}
                value={draft.testimonial}
                maxLength={500}
                placeholder="Njegove riječi, kako ih je napisao."
                onChange={(e) => set("testimonial", e.target.value)}
              />
              <p className="mt-1.5 text-[13px] text-white/45">
                Pojavi se u sekciji Iskustva klijenata. Upiši samo ono što je klijent stvarno rekao
                ili napisao.
              </p>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3">
              <span>
                <span className="block text-sm font-semibold">Vidljivo na sajtu</span>
                <span className="block text-[13px] text-white/45">
                  Skrivenu transformaciju vidiš samo ovdje.
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(e) => set("visible", e.target.checked)}
                className="size-5 accent-[#edb12d]"
              />
            </label>
            {!draft.id && (
              <label className="flex cursor-pointer gap-3 rounded-xl border border-brand-yellow/30 bg-brand-yellow/[0.06] px-4 py-3">
                <input
                  type="checkbox"
                  checked={permission}
                  onChange={(e) => setPermission(e.target.checked)}
                  className="mt-0.5 size-5 shrink-0 accent-[#edb12d]"
                />
                <span className="text-sm text-white/80">
                  Klijent mi je dao dozvolu da objavim ovu fotografiju i tekst.
                </span>
              </label>
            )}
          </div>
        )}
      </EditorDialog>

      <ConfirmDialog
        open={removing !== null}
        title="Obrisati transformaciju?"
        text="Fotografija i tekst nestaju sa sajta i iz panela. Ako je samo želiš skloniti, sakrij je."
        confirmLabel="Obriši"
        loading={pending}
        onConfirm={remove}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
