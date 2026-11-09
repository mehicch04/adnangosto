"use client";

import { useState, useTransition } from "react";
import { setStatus } from "@/app/admin/actions";
import { ChevronDown } from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Spinner } from "@/components/admin/ui";
import { statusMeta, statuses, type StatusId } from "@/lib/admin/applications";

export function StatusSelect({
  id,
  value,
  name,
  className = "",
}: {
  id: string;
  value: StatusId;
  name: string;
  className?: string;
}) {
  const toast = useToast();
  const [current, setCurrent] = useState(value);
  const [pending, start] = useTransition();
  const meta = statusMeta(current);

  return (
    <span className={`relative inline-flex ${className}`}>
      <select
        aria-label={`Status prijave: ${name}`}
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as StatusId;
          const prev = current;
          setCurrent(next);
          start(async () => {
            const res = await setStatus(id, next);
            if (!res.ok) setCurrent(prev);
            toast(res.message, res.ok ? "success" : "error");
          });
        }}
        className={`h-8 cursor-pointer appearance-none rounded-full pr-7 pl-3 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60 focus-visible:outline-none! disabled:cursor-wait ${meta.tone}`}
      >
        {statuses.map((s) => (
          <option key={s.id} value={s.id} className="bg-[#161616] text-white">
            {s.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center">
        {pending ? <Spinner className="size-3" /> : <ChevronDown className="size-3.5" />}
      </span>
    </span>
  );
}
