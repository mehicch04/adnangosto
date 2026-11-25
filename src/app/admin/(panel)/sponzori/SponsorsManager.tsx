"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EditorDialog } from "@/components/admin/EditorDialog";
import { ImagePicker } from "@/components/admin/ImagePicker";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeIcon,
  ExternalIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Badge, Button, Card, EmptyState, Field, inputClass } from "@/components/admin/ui";
import { uploadImage } from "@/lib/admin/upload";
import { imageSrc } from "@/lib/media";
import { deleteSponsor, saveSponsor, saveSponsorOrder, setSponsorVisible } from "./actions";

export type AdminSponsor = {
  id: string;
  name: string;
  url: string;
  logo: string;
  src: string | null;
  visible: boolean;
};

type Draft = Omit<AdminSponsor, "id"> & { id?: string };

const iconBtn =
  "grid size-9 shrink-0 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25";

export function SponsorsManager({ initial }: { initial: AdminSponsor[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<AdminSponsor | null>(null);
  const [pending, startTransition] = useTransition();

  const openNew = () => {
    setDraft({ name: "", url: "", logo: "", src: null, visible: true });
    setFile(null);
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const logo = file
        ? await uploadImage(file, "sponzori", { maxSide: 800, keepAlpha: true })
        : draft.logo;
      const res = await saveSponsor({
        id: draft.id,
        name: draft.name,
        url: draft.url,
        logo,
        visible: draft.visible,
      });
      toast(res.message, res.ok ? "success" : "error");
      if (!res.ok || !res.id) return;
      const saved: AdminSponsor = {
        ...draft,
        id: res.id,
        logo,
        src: logo ? imageSrc(logo) : null,
      };
      setItems((all) =>
        draft.id ? all.map((s) => (s.id === draft.id ? saved : s)) : [...all, saved],
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
      const res = await saveSponsorOrder(next.map((s) => s.id));
      if (!res.ok) toast(res.message, "error");
    });
  };

  const toggle = (s: AdminSponsor) => {
    setItems((all) => all.map((x) => (x.id === s.id ? { ...x, visible: !x.visible } : x)));
    startTransition(async () => {
      const res = await setSponsorVisible(s.id, !s.visible);
      toast(res.message, res.ok ? "success" : "error");
      if (!res.ok)
        setItems((all) => all.map((x) => (x.id === s.id ? { ...x, visible: s.visible } : x)));
    });
  };

  const remove = () => {
    if (!removing) return;
    const target = removing;
    startTransition(async () => {
      const res = await deleteSponsor(target.id);
      toast(res.message, res.ok ? "success" : "error");
      if (res.ok) setItems((all) => all.filter((x) => x.id !== target.id));
      setRemoving(null);
    });
  };

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={openNew}>
          <PlusIcon className="size-[18px]" />
          Dodaj sponzora
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<BadgeIcon className="size-6" />}
            title="Trenutno nema sponzora"
            text="Sekcija Sponzori i suradnje je skrivena sa sajta dok ne dodaš prvog."
            action={
              <Button type="button" onClick={openNew}>
                <PlusIcon className="size-[18px]" />
                Dodaj sponzora
              </Button>
            }
          />
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden">
          <ul className="divide-y divide-white/[0.06]">
            {items.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ ...s });
                    setFile(null);
                  }}
                  aria-label={`Uredi: ${s.name}`}
                  className={`grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-white px-2 sm:w-32 ${s.visible ? "" : "opacity-40"}`}
                >
                  {s.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.src} alt="" className="max-h-10 w-auto max-w-full object-contain" />
                  ) : (
                    <span className="truncate font-display text-xl text-brand-black">{s.name}</span>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-semibold">
                    {s.name}
                    {!s.visible && <Badge className="bg-white/10 text-white/70">Skriven</Badge>}
                  </p>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-[13px] text-white/45 hover:text-white"
                    >
                      <span className="truncate">{s.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                      <ExternalIcon className="size-3.5 shrink-0" />
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[13px] text-white/35">Bez linka</p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="hidden sm:contents">
                    <button
                      type="button"
                      className={iconBtn}
                      aria-label="Pomjeri gore"
                      disabled={i === 0 || pending}
                      onClick={() => move(i, -1)}
                    >
                      <ArrowUpIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={iconBtn}
                      aria-label="Pomjeri dolje"
                      disabled={i === items.length - 1 || pending}
                      onClick={() => move(i, 1)}
                    >
                      <ArrowDownIcon className="size-4" />
                    </button>
                  </span>
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={s.visible ? "Sakrij sa sajta" : "Prikaži na sajtu"}
                    onClick={() => toggle(s)}
                  >
                    {s.visible ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  </button>
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label="Uredi"
                    onClick={() => {
                      setDraft({ ...s });
                      setFile(null);
                    }}
                  >
                    <PencilIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={`${iconBtn} hover:bg-[#ff6b5a]/15 hover:text-[#ff9b8f]`}
                    aria-label="Obriši"
                    onClick={() => setRemoving(s)}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <EditorDialog
        open={draft !== null}
        title={draft?.id ? "Uredi sponzora" : "Novi sponzor"}
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
              label="Logo"
              hint="PNG s prozirnom pozadinom izgleda najbolje. Bez loga se prikaže naziv."
              current={draft.src}
              file={file}
              aspect="aspect-[5/2]"
              contain
              onFile={setFile}
            />
            <Field label="Naziv" htmlFor="s-name">
              <input
                id="s-name"
                className={inputClass}
                value={draft.name}
                maxLength={60}
                placeholder="npr. Real Pharm"
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field
              label="Link"
              htmlFor="s-url"
              hint="Stranica sponzora ili njegov Instagram. Može ostati prazno."
            >
              <input
                id="s-url"
                type="url"
                inputMode="url"
                className={inputClass}
                value={draft.url}
                placeholder="https://"
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              />
            </Field>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3">
              <span>
                <span className="block text-sm font-semibold">Vidljiv na sajtu</span>
                <span className="block text-[13px] text-white/45">
                  Kad suradnja završi, sakrij ga ili obriši.
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
                className="size-5 accent-[#edb12d]"
              />
            </label>
          </div>
        )}
      </EditorDialog>

      <ConfirmDialog
        open={removing !== null}
        title={`Obrisati ${removing?.name ?? "sponzora"}?`}
        text="Logo i link nestaju sa sajta."
        confirmLabel="Obriši"
        loading={pending}
        onConfirm={remove}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
