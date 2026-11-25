"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { UploadIcon } from "@/components/admin/icons";

export function ImagePicker({
  current,
  file,
  onFile,
  label,
  hint,
  aspect = "aspect-square",
  contain = false,
  error,
  className = "",
}: {
  current: string | null;
  file: File | null;
  onFile: (file: File | null) => void;
  label: string;
  hint: string;
  aspect?: string;
  contain?: boolean;
  error?: string | null;
  className?: string;
}) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const shown = preview ?? current;

  return (
    <div className={className}>
      <p className="mb-1.5 text-[13px] font-semibold text-white/80">{label}</p>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={`group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed transition-colors ${aspect} ${
          error
            ? "border-[#ff6b5a]/70"
            : drag
              ? "border-brand-yellow bg-brand-yellow/5"
              : "border-white/15 hover:border-white/30"
        } ${contain ? "bg-white" : "bg-black/40"}`}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shown}
            alt=""
            className={`absolute inset-0 size-full ${contain ? "object-contain p-6" : "object-cover"}`}
          />
        ) : null}
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm font-semibold transition-opacity ${
            shown
              ? "bg-black/60 text-white opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
              : "text-white/60"
          }`}
        >
          <UploadIcon className="size-6" />
          {shown ? "Zamijeni sliku" : "Odaberi ili prevuci sliku"}
        </span>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </label>
      {error ? (
        <p className="mt-1.5 text-[13px] font-medium text-[#ff9b8f]">{error}</p>
      ) : (
        <p className="mt-1.5 text-[13px] text-white/45">{hint}</p>
      )}
    </div>
  );
}
