"use client";

import { useId, useState, useTransition } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalIcon,
  TrashIcon,
  UploadIcon,
} from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Badge, Button, Spinner, inputClass } from "@/components/admin/ui";
import { GALLERY_MAX } from "@/content/gallery";
import { uploadImage } from "@/lib/admin/upload";
import { imageSrc } from "@/lib/media";
import { saveGallery } from "./actions";

type Item = { path: string; alt: string; src: string };

const iconBtn =
  "grid size-9 shrink-0 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25";

export function GalleryManager({ initial }: { initial: Item[] }) {
  const toast = useToast();
  const inputId = useId();
  const [saved, setSaved] = useState(initial);
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [saving, startSaving] = useTransition();
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);
  const missingAlt = items.some((g) => g.alt.trim().length < 3);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = GALLERY_MAX - items.length;
    const list = Array.from(files).slice(0, room);
    if (files.length > room) toast(`Galerija prima najviše ${GALLERY_MAX} fotografija.`, "error");
    setUploading(list.length);
    for (const f of list) {
      try {
        const path = await uploadImage(f, "galerija", { maxSide: 2000 });
        setItems((all) => [...all, { path, alt: "", src: imageSrc(path) }]);
      } catch (e) {
        toast(e instanceof Error ? e.message : "Fotografija nije poslana.", "error");
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setItems(next);
  };

  const save = () =>
    startSaving(async () => {
      const res = await saveGallery(items.map(({ path, alt }) => ({ path, alt: alt.trim() })));
      toast(res.message, res.ok ? "success" : "error");
      if (res.ok) setSaved(items);
    });

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-white/45">
          {items.length} od najviše {GALLERY_MAX}. Uz svaku upiši kratak opis, on pomaže Googleu i
          slabovidnima.
        </p>
        <div className="flex items-center gap-2">
          <a
            href="/o-meni"
            target="_blank"
            rel="noopener"
            className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-white/60 hover:text-white"
          >
            Pogledaj <ExternalIcon className="size-4" />
          </a>
          <label
            htmlFor={inputId}
            className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] ${items.length >= GALLERY_MAX ? "pointer-events-none opacity-50" : ""}`}
          >
            {uploading ? <Spinner /> : <UploadIcon className="size-[18px]" />}
            {uploading ? `Šaljem ${uploading}` : "Dodaj fotografije"}
          </label>
          <input
            id={inputId}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            className="sr-only"
            onChange={(e) => {
              add(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
        {items.map((g, i) => (
          <li
            key={g.path}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
          >
            <div className="relative aspect-[4/5] bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt=""
                className="absolute inset-0 size-full object-cover object-top"
              />
              {i === 0 && (
                <Badge className="absolute top-2 left-2 bg-brand-yellow text-brand-black">
                  Velika
                </Badge>
              )}
            </div>
            <div className="p-2.5">
              <input
                aria-label={`Opis fotografije ${i + 1}`}
                className={`${inputClass} h-10 text-sm`}
                value={g.alt}
                maxLength={160}
                placeholder="Opis, npr. Poza na pozornici"
                aria-invalid={g.alt.trim().length < 3 || undefined}
                onChange={(e) =>
                  setItems((all) =>
                    all.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)),
                  )
                }
              />
            </div>
            <div className="flex items-center gap-0.5 border-t border-white/[0.06] px-1.5 py-1.5">
              <button
                type="button"
                className={iconBtn}
                aria-label="Pomjeri naprijed"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ArrowUpIcon className="size-4" />
              </button>
              <button
                type="button"
                className={iconBtn}
                aria-label="Pomjeri nazad"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDownIcon className="size-4" />
              </button>
              <span className="flex-1" />
              <button
                type="button"
                className={`${iconBtn} hover:bg-[#ff6b5a]/15 hover:text-[#ff9b8f]`}
                aria-label="Ukloni iz galerije"
                onClick={() => setItems((all) => all.filter((_, j) => j !== i))}
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div
        className={`sticky bottom-24 z-20 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#161616]/95 px-4 py-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-[opacity,transform] duration-300 lg:bottom-6 ${
          dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <span className="text-[13px] text-white/70">
          {missingAlt ? "Upiši opis uz svaku fotografiju." : "Imaš nesačuvane izmjene."}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setItems(saved)}>
            Poništi
          </Button>
          <Button
            type="button"
            size="sm"
            loading={saving}
            disabled={missingAlt || uploading > 0}
            onClick={save}
          >
            Sačuvaj galeriju
          </Button>
        </div>
      </div>
    </>
  );
}
