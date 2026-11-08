import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dateTime, statusMeta, statuses, type ApplicationRow } from "@/lib/admin/applications";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const active = statuses.find((s) => s.id === status)?.id ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("id, created_at, package_name, full_name, email, status, answers")
    .order("created_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as Pick<
    ApplicationRow,
    "id" | "created_at" | "package_name" | "full_name" | "email" | "status" | "answers"
  >[];
  const counts = Object.fromEntries(
    statuses.map((s) => [s.id, rows.filter((r) => r.status === s.id).length]),
  );
  const visible = active ? rows.filter((r) => r.status === active) : rows;
  const country = (r: (typeof rows)[number]) =>
    r.answers?.find((a) => a.question.startsWith("Država"))?.answer ?? "";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-6xl leading-none">Prijave</h1>
          <p className="mt-2 text-white/60">
            {rows.length} ukupno · {counts.nova ?? 0} novih
          </p>
        </div>
      </div>

      <nav aria-label="Filter po statusu" className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
            !active
              ? "border-white bg-white text-brand-black"
              : "border-white/15 text-white/75 hover:border-white/40"
          }`}
        >
          Sve <span className="opacity-60">{rows.length}</span>
        </Link>
        {statuses.map((s) => (
          <Link
            key={s.id}
            href={`/admin?status=${s.id}`}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
              active === s.id
                ? "border-white bg-white text-brand-black"
                : "border-white/15 text-white/75 hover:border-white/40"
            }`}
          >
            {s.label} <span className="opacity-60">{counts[s.id] ?? 0}</span>
          </Link>
        ))}
      </nav>

      {error && (
        <p className="mt-8 rounded-md border border-[#ff8a7a]/50 bg-[#ff8a7a]/10 p-4 text-sm text-[#ffb3a8]">
          Prijave nije moguće učitati. Provjeri vezu s bazom.
        </p>
      )}

      {visible.length === 0 && !error ? (
        <div className="mt-8 rounded-lg border border-dashed border-white/15 p-12 text-center text-white/60">
          Nema prijava u ovoj kategoriji.
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-brand-line overflow-hidden rounded-lg border border-brand-line">
          {visible.map((r) => {
            const meta = statusMeta(r.status);
            return (
              <li key={r.id}>
                <Link
                  href={`/admin/prijave/${r.id}`}
                  className="grid gap-2 bg-brand-surface p-4 transition-colors hover:bg-brand-raised sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-5"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-3">
                      <span className="text-lg font-semibold">{r.full_name}</span>
                      <span className={`rounded-sm px-2 py-0.5 text-xs font-bold ${meta.tone}`}>
                        {meta.label}
                      </span>
                    </p>
                    <p className="mt-1 truncate text-sm text-white/60">
                      {r.package_name} · {r.email}
                      {country(r) ? ` · ${country(r)}` : ""}
                    </p>
                  </div>
                  <p className="text-sm text-white/50 tabular-nums">
                    {dateTime.format(new Date(r.created_at))}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
