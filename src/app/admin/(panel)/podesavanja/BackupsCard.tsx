"use client";

import { useState, useTransition } from "react";
import { DownloadIcon } from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Button, Card, CardHeader } from "@/components/admin/ui";
import type { BackupFile } from "@/lib/maintenance";
import { backupLink, backupNow } from "./actions";

const dayFormat = new Intl.DateTimeFormat("bs-BA", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function size(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function BackupsCard({ initial }: { initial: BackupFile[] }) {
  const toast = useToast();
  const [files, setFiles] = useState(initial);
  const [busy, start] = useTransition();
  const [loading, setLoading] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader
        title="Sigurnosne kopije"
        description="Sistem svaku noć sam napravi kopiju prijava i sadržaja i čuva zadnjih 7 dana."
        action={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={busy}
            onClick={() =>
              start(async () => {
                const res = await backupNow();
                toast(res.message, res.ok ? "success" : "error");
                if (res.files) setFiles(res.files);
              })
            }
          >
            Napravi sada
          </Button>
        }
      />
      {files.length === 0 ? (
        <p className="px-5 py-5 text-sm text-white/50 sm:px-6">Prva kopija nastaje noćas.</p>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {files.map((f) => (
            <li key={f.name} className="flex items-center gap-4 px-5 py-3 sm:px-6">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold first-letter:uppercase">
                  {dayFormat.format(new Date(`${f.day}T00:00:00Z`))}
                </span>
                <span className="block text-xs text-white/45">{size(f.size)}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                loading={loading === f.name}
                onClick={async () => {
                  setLoading(f.name);
                  const res = await backupLink(f.name);
                  setLoading(null);
                  if (res.url) window.location.href = res.url;
                  else toast(res.message, "error");
                }}
              >
                <DownloadIcon className="size-4" />
                Preuzmi
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
