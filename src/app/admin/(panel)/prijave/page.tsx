import Link from "next/link";
import { AlertIcon, ChevronLeft, ChevronRight, InboxIcon } from "@/components/admin/icons";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { packages } from "@/content/packages";
import { requireAdmin } from "@/lib/admin/auth";
import {
  dateTime,
  initials,
  plural,
  prijavaForms,
  statusIds,
  timeAgo,
  type ApplicationRow,
  type StatusId,
} from "@/lib/admin/applications";
import { listHref, type ListParams } from "@/lib/admin/list";
import { ListToolbar } from "./ListToolbar";
import { StatusSelect } from "./StatusSelect";

export const metadata = { title: "Prijave" };

type Search = {
  q?: string;
  status?: string;
  paket?: string;
  sort?: string;
  arhiva?: string;
  strana?: string;
};

const PAGE = 30;

type Row = Pick<
  ApplicationRow,
  "id" | "created_at" | "package_name" | "full_name" | "email" | "phone" | "status" | "answers"
>;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const params: ListParams = {
    q: (sp.q ?? "").slice(0, 80).trim(),
    status: statusIds.includes(sp.status as StatusId) ? (sp.status as StatusId) : null,
    paket: packages.some((p) => p.slug === sp.paket) ? (sp.paket as string) : null,
    sort: sp.sort === "starije" ? "starije" : "novije",
    arhiva: sp.arhiva === "1",
  };
  const page = Math.max(1, Math.floor(Number(sp.strana) || 1));
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("applications")
    .select("id, created_at, package_name, full_name, email, phone, status, answers", {
      count: "exact",
    });
  query = params.arhiva ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  if (params.status) query = query.eq("status", params.status);
  if (params.paket) query = query.eq("package_slug", params.paket);
  const term = params.q.replace(/[%_*,()"\\]/g, " ").trim();
  if (term)
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);

  const [{ data, count, error }, { data: all }] = await Promise.all([
    query
      .order("created_at", { ascending: params.sort === "starije" })
      .range((page - 1) * PAGE, page * PAGE - 1),
    supabase.from("applications").select("status, archived_at").limit(5000),
  ]);

  const rows = (data ?? []) as Row[];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const summary = (all ?? []) as { status: StatusId; archived_at: string | null }[];
  const live = summary.filter((r) => !r.archived_at);
  const counts = Object.fromEntries(
    statusIds.map((id) => [id, live.filter((r) => r.status === id).length]),
  );
  const archived = summary.length - live.length;
  const filtered = Boolean(params.q || params.status || params.paket);
  const nowMs = new Date().getTime();
  const country = (r: Row) => r.answers?.find((a) => a.question.startsWith("Država"))?.answer ?? "";

  return (
    <>
      <PageHeader
        title={params.arhiva ? "Arhiva" : "Prijave"}
        description={
          params.arhiva ? (
            "Arhivirane prijave ne smetaju u listi, a ostaju sačuvane."
          ) : (
            <>
              {live.length} {plural(live.length, prijavaForms)},{" "}
              <span className="font-semibold text-brand-yellow">{counts.nova ?? 0} novih</span>
            </>
          )
        }
      />

      <ListToolbar
        params={params}
        counts={counts}
        archived={archived}
        packages={packages.map((p) => ({ slug: p.slug, name: p.name }))}
      />

      {error && (
        <p className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#ff6b5a]/25 bg-[#ff6b5a]/10 px-4 py-3 text-sm font-medium text-[#ffb3a8]">
          <AlertIcon className="size-5 shrink-0" />
          Prijave nije moguće učitati. Provjeri vezu s bazom.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <div className="mt-6">
          <EmptyState
            icon={<InboxIcon />}
            title={
              filtered
                ? "Ništa ne odgovara pretrazi"
                : params.arhiva
                  ? "Arhiva je prazna"
                  : "Još nema prijava"
            }
            text={
              filtered
                ? "Probaj drugi pojam ili skini neki od filtera."
                : params.arhiva
                  ? "Kad arhiviraš prijavu, ovdje je možeš naći i vratiti."
                  : "Kad neko popuni upitnik na sajtu, prijava se pojavi ovdje i stigne ti mail."
            }
            action={
              filtered ? (
                <ButtonLink href={params.arhiva ? "/admin/prijave?arhiva=1" : "/admin/prijave"}>
                  Skini filtere
                </ButtonLink>
              ) : undefined
            }
          />
        </div>
      ) : (
        <Card className="mt-5 overflow-hidden">
          <ul className="divide-y divide-white/[0.06]">
            {rows.map((r) => {
              const fresh = r.status === "nova";
              return (
                <li
                  key={r.id}
                  className="group relative flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.035] sm:gap-4 sm:px-5"
                >
                  <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[13px] font-semibold text-white/80">
                    {initials(r.full_name)}
                    {fresh && (
                      <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-[#0f0f0f] bg-brand-yellow" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/admin/prijave/${r.id}`}
                      className={`block truncate outline-none after:absolute after:inset-0 focus-visible:outline-none! focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-brand-yellow/60 ${fresh ? "font-bold text-white" : "font-semibold text-white/90"}`}
                    >
                      {r.full_name}
                    </Link>
                    <span className="mt-0.5 block truncate text-[13px] text-white/50">
                      {[r.package_name, r.email, country(r)].filter(Boolean).join(", ")}
                    </span>
                  </span>
                  <time
                    dateTime={r.created_at}
                    title={dateTime.format(new Date(r.created_at))}
                    className="hidden w-24 shrink-0 text-right text-[13px] text-white/45 md:block"
                  >
                    {timeAgo(r.created_at, nowMs)}
                  </time>
                  <StatusSelect
                    id={r.id}
                    value={r.status}
                    name={r.full_name}
                    className="relative z-10 shrink-0"
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {total > PAGE && (
        <nav
          aria-label="Stranice"
          className="mt-5 flex items-center justify-between gap-3 text-[13px] text-white/50"
        >
          <span className="tabular-nums">
            {(page - 1) * PAGE + 1} do {Math.min(page * PAGE, total)} od {total}
          </span>
          <span className="flex gap-2">
            {page > 1 ? (
              <ButtonLink href={listHref(params, page - 1)} size="sm" aria-label="Prethodna strana">
                <ChevronLeft className="size-4" />
                Nazad
              </ButtonLink>
            ) : null}
            {page < pages ? (
              <ButtonLink href={listHref(params, page + 1)} size="sm" aria-label="Sljedeća strana">
                Dalje
                <ChevronRight className="size-4" />
              </ButtonLink>
            ) : null}
          </span>
        </nav>
      )}
    </>
  );
}
