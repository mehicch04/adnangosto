"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { XIcon } from "@/components/admin/icons";

export function EditorDialog({
  open,
  title,
  description,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="editor-naslov"
      className="drawer-in m-0 ml-auto h-[100dvh] max-h-none w-full max-w-xl border-l border-white/10 bg-[#111] p-0 text-white shadow-[0_0_80px_-10px_rgba(0,0,0,0.9)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
            <div>
              <h2 id="editor-naslov" className="text-lg font-semibold">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-[13px] text-white/50">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Zatvori"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <XIcon className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {children}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-white/[0.07] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </div>
        </div>
      )}
    </dialog>
  );
}
