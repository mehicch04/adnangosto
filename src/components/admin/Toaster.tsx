"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertIcon, CheckCircleIcon, XIcon } from "@/components/admin/icons";

type Tone = "success" | "error";
type Toast = { id: number; message: string; tone: Tone };

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback(
    (id: number) => setToasts((all) => all.filter((t) => t.id !== id)),
    [],
  );

  const toast = useCallback(
    (message: string, tone: Tone = "success") => {
      const id = ++seq.current;
      setToasts((all) => [...all.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[80] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#161616]/95 py-3 pr-2 pl-4 text-sm font-medium text-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {t.tone === "success" ? (
              <CheckCircleIcon className="size-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertIcon className="size-5 shrink-0 text-[#ff9b8f]" />
            )}
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              aria-label="Zatvori obavještenje"
              onClick={() => dismiss(t.id)}
              className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
