"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteApplication, setArchived, setStatus } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ArchiveIcon, TrashIcon } from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Button, Spinner } from "@/components/admin/ui";
import { statuses, type StatusId } from "@/lib/admin/applications";

export function StatusControl({ id, value }: { id: string; value: StatusId }) {
  const toast = useToast();
  const [current, setCurrent] = useState(value);
  const [target, setTarget] = useState<StatusId | null>(null);
  const [, start] = useTransition();

  return (
    <div role="radiogroup" aria-label="Status prijave" className="grid grid-cols-2 gap-2">
      {statuses.map((s) => {
        const on = current === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={target !== null}
            onClick={() => {
              if (on) return;
              const prev = current;
              setCurrent(s.id);
              setTarget(s.id);
              start(async () => {
                const res = await setStatus(id, s.id);
                if (!res.ok) setCurrent(prev);
                setTarget(null);
                toast(res.message, res.ok ? "success" : "error");
              });
            }}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-[13px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60 focus-visible:outline-none! disabled:cursor-wait ${
              on
                ? "border-white/80 bg-white text-brand-black"
                : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
            }`}
          >
            {target === s.id ? (
              <Spinner className="size-3.5" />
            ) : (
              <span className={`size-2 rounded-full ${s.dot}`} />
            )}
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function RecordActions({
  id,
  name,
  archived,
  photos,
}: {
  id: string;
  name: string;
  archived: boolean;
  photos: number;
}) {
  const toast = useToast();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [archiving, startArchive] = useTransition();
  const [deleting, startDelete] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={archiving}
        onClick={() =>
          startArchive(async () => {
            const res = await setArchived(id, !archived);
            toast(res.message, res.ok ? "success" : "error");
          })
        }
      >
        {!archiving && <ArchiveIcon className="size-4" />}
        {archived ? "Vrati iz arhive" : "Arhiviraj"}
      </Button>
      <Button type="button" variant="danger" size="sm" onClick={() => setConfirm(true)}>
        <TrashIcon className="size-4" />
        Obriši
      </Button>
      <ConfirmDialog
        open={confirm}
        title="Trajno obrisati prijavu?"
        text={
          <>
            Brišu se svi podaci koje je poslao {name}
            {photos ? `, zajedno sa ${photos} ${photos === 1 ? "slikom" : "slika"}` : ""}. Ovo se ne
            može vratiti. Ako želiš samo skloniti prijavu iz liste, arhiviraj je.
          </>
        }
        confirmLabel="Obriši trajno"
        loading={deleting}
        onClose={() => setConfirm(false)}
        onConfirm={() =>
          startDelete(async () => {
            const res = await deleteApplication(id);
            toast(res.message, res.ok ? "success" : "error");
            if (res.ok) router.replace("/admin/prijave");
            else setConfirm(false);
          })
        }
      />
    </>
  );
}
