import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { AlertIcon, ArrowRight, InboxIcon } from "@/components/admin/icons";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { dateTime, statusMeta, statuses, type ApplicationRow } from "@/lib/admin/applications";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const active = statuses.find((s) => s.id === status)?.id ?? null;
  const { supabase } = await requireAdmin();
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
      <PageHeader
        title="Prijave"
        description={
          <>
            {rows.length} ukupno,{" "}
            <span className="font-semibold text-brand-yellow">{counts.nova ?? 0} novih</span>
          </>
        }
      />

      <nav
        aria-label="Filter po statusu"
        className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[
          { id: null, label: "Sve", count: rows.length },
          ...statuses.map((s) => ({ id: s.id, label: s.label, count: counts[s.id] ?? 0 })),
        ].map((f) => {
          const on = active === f.id;
          return (
            <Link
              key={f.label}
              href={f.id ? `/admin?status=${f.id}` : "/admin"}
              aria-current={on ? "page" : undefined}
              className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                on
                  ? "border-white bg-white text-brand-black"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-[11px] ${on ? "bg-black/10" : "bg-white/[0.08]"}`}
              >
                {f.count}
              </span>
            </Link>
          );
        })}
      </nav>

      {error && (
        <p className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#ff6b5a]/25 bg-[#ff6b5a]/10 px-4 py-3 text-sm font-medium text-[#ffb3a8]">
          <AlertIcon className="size-5 shrink-0" />
          Prijave nije moguće učitati. Provjeri vezu s bazom.
        </p>
      )}

      {visible.length === 0 && !error ? (
        <div className="mt-6">
          <EmptyState
            icon={<InboxIcon />}
            title={active ? "Nema prijava s ovim statusom" : "Još nema prijava"}
            text={
              active
                ? "Izaberi drugi filter ili pogledaj sve prijave."
                : "Kad neko popuni upitnik na sajtu, prijava se pojavi ovdje i stigne ti mail."
            }
          />
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden">
          <ul className="divide-y divide-white/[0.06]">
            {visible.map((r) => {
              const meta = statusMeta(r.status);
              const initials = r.full_name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <li key={r.id}>
                  <Link
                    href={`/admin/prijave/${r.id}`}
                    className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.035] sm:px-5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[13px] font-semibold text-white/80">
                      {initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold">{r.full_name}</span>
                        <Badge className={meta.tone}>{meta.label}</Badge>
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] text-white/50">
                        {[r.package_name, r.email, country(r)].filter(Boolean).join(", ")}
                      </span>
                    </span>
                    <span className="hidden text-[13px] text-white/45 tabular-nums sm:block">
                      {dateTime.format(new Date(r.created_at))}
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
