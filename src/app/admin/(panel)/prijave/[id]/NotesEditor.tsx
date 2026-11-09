"use client";

import { useEffect, useRef, useState } from "react";
import { saveNotes } from "@/app/admin/actions";
import { CheckIcon } from "@/components/admin/icons";
import { Spinner } from "@/components/admin/ui";

type State = "idle" | "dirty" | "saving" | "saved" | "error";

const clock = new Intl.DateTimeFormat("bs-BA", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Sarajevo",
});

export function NotesEditor({ id, initial }: { id: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [state, setState] = useState<State>("idle");
  const [savedAt, setSavedAt] = useState("");
  const last = useRef(initial);
  const timer = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());

  const save = (next: string) => {
    window.clearTimeout(timer.current);
    queue.current = queue.current.then(async () => {
      if (next === last.current) {
        setState((s) => (s === "dirty" ? "saved" : s));
        return;
      }
      setState("saving");
      const res = await saveNotes(id, next);
      if (res.ok) {
        last.current = next;
        setSavedAt(clock.format(new Date()));
        setState("saved");
      } else {
        setState("error");
      }
    });
  };

  useEffect(() => {
    if (state !== "dirty" && state !== "saving") return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [state]);

  return (
    <div>
      <textarea
        id="biljeske"
        value={value}
        maxLength={5000}
        rows={6}
        placeholder="Dogovor, cijena, kad se javiti. Vidiš samo ti."
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          setState("dirty");
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => save(next), 900);
        }}
        onBlur={() => save(value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            save(value);
          }
        }}
        className="block min-h-32 w-full resize-y rounded-xl border border-white/10 bg-black/40 p-3.5 text-[14px] leading-relaxed text-white transition-[border-color,box-shadow] outline-none placeholder:text-white/30 hover:border-white/20 focus:border-brand-yellow/70 focus:ring-4 focus:ring-brand-yellow/15 focus-visible:outline-none!"
      />
      <p
        aria-live="polite"
        className={`mt-2 flex h-5 items-center gap-1.5 text-xs font-medium ${state === "error" ? "text-[#ff9b8f]" : "text-white/45"}`}
      >
        {state === "saving" && (
          <>
            <Spinner className="size-3" />
            Čuvam
          </>
        )}
        {state === "saved" && (
          <>
            <CheckIcon className="size-3.5 text-emerald-400" />
            Sačuvano u {savedAt}
          </>
        )}
        {state === "dirty" && "Čuva se samo dok pišeš"}
        {state === "error" && "Nije sačuvano. Klikni van polja da pokušaš ponovo."}
        {state === "idle" && "Čuva se automatski"}
      </p>
    </div>
  );
}
