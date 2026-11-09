import Link from "next/link";
import { AlertIcon, ArrowRight, InboxIcon } from "@/components/admin/icons";
import { Badge, ButtonLink, Card, CardHeader, EmptyState, PageHeader } from "@/components/admin/ui";
import { packages } from "@/content/packages";
import { requireAdmin } from "@/lib/admin/auth";
import {
  dayKey,
  dayMonth,
  initials,
  plural,
  prijavaForms,
  statusMeta,
  timeAgo,
  type ApplicationRow,
} from "@/lib/admin/applications";

type Row = Pick<
  ApplicationRow,
  "id" | "created_at" | "status" | "package_name" | "package_slug" | "full_name" | "archived_at"
>;

const DAY = 86_400_000;

function greeting(now: Date) {
  const h = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", timeZone: "Europe/Sarajevo" }).format(now),
  );
  if (h < 11) return "Dobro jutro";
  if (h < 18) return "Dobar dan";
  return "Dobro veče";
}

function Stat({
  label,
  value,
  note,
  href,
  accent = false,
}: {
  label: string;
  value: number;
  note: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-colors ${
        accent
          ? "border-brand-yellow/40 bg-brand-yellow/[0.07] hover:border-brand-yellow/70"
          : "border-white/[0.08] bg-white/[0.025] hover:border-white/20"
      }`}
    >
      <p className="text-[13px] font-semibold text-white/60">{label}</p>
      <p
        className={`mt-3 font-display text-6xl leading-none tabular-nums ${accent ? "text-brand-yellow" : "text-white"}`}
      >
        {value}
      </p>
      <p className="mt-2 flex items-center justify-between gap-2 text-[13px] text-white/45">
        {note}
        <ArrowRight className="size-4 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60" />
      </p>
    </Link>
  );
}

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("applications")
    .select("id, created_at, status, package_name, package_slug, full_name, archived_at")
    .order("created_at", { ascending: false })
    .limit(3000);
  const rows = (data ?? []) as Row[];
  const now = new Date();
  const nowMs = now.getTime();
  const active = rows.filter((r) => !r.archived_at);
  const fresh = active.filter((r) => r.status === "nova").length;
  const working = active.filter((r) => r.status === "u_obradi").length;
  const accepted = rows.filter((r) => r.status === "prihvacena").length;
  const age = (r: Row) => nowMs - new Date(r.created_at).getTime();
  const week = rows.filter((r) => age(r) < 7 * DAY).length;
  const lastWeek = rows.filter((r) => age(r) >= 7 * DAY && age(r) < 14 * DAY).length;
  const diff = week - lastWeek;

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(nowMs - (29 - i) * DAY);
    return { key: dayKey.format(date), label: dayMonth.format(date), count: 0 };
  });
  const byDay = new Map(days.map((d) => [d.key, d]));
  for (const r of rows) {
    const d = byDay.get(dayKey.format(new Date(r.created_at)));
    if (d) d.count++;
  }
  const peak = Math.max(1, ...days.map((d) => d.count));
  const monthTotal = days.reduce((s, d) => s + d.count, 0);

  const perPackage = packages
    .map((p) => ({
      name: p.name,
      count: rows.filter((r) => (r.package_slug ?? "") === p.slug || r.package_name === p.name)
        .length,
    }))
    .sort((a, b) => b.count - a.count);
  const topPackage = Math.max(1, ...perPackage.map((p) => p.count));
  const latest = active.slice(0, 6);

  return (
    <>
      <PageHeader
        title="Pregled"
        description={
          fresh > 0 ? (
            <>
              {greeting(now)}. Čeka te{" "}
              <span className="font-semibold text-brand-yellow">
                {fresh} {plural(fresh, ["nova prijava", "nove prijave", "novih prijava"])}
              </span>
              .
            </>
          ) : (
            `${greeting(now)}. Sve prijave su pregledane.`
          )
        }
        actions={
          <ButtonLink
            href={fresh ? "/admin/prijave?status=nova" : "/admin/prijave"}
            variant="primary"
          >
            {fresh ? "Otvori nove" : "Sve prijave"}
            <ArrowRight className="size-4" />
          </ButtonLink>
        }
      />

      {error && (
        <p className="mt-6 flex items-center gap-2.5 rounded-xl border border-[#ff6b5a]/25 bg-[#ff6b5a]/10 px-4 py-3 text-sm font-medium text-[#ffb3a8]">
          <AlertIcon className="size-5 shrink-0" />
          Podaci se nisu učitali. Provjeri vezu s bazom.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat
          label="Nove"
          value={fresh}
          note="Čekaju odgovor"
          href="/admin/prijave?status=nova"
          accent={fresh > 0}
        />
        <Stat
          label="Zadnjih 7 dana"
          value={week}
          note={
            diff === 0
              ? "Isto kao prošle sedmice"
              : `${diff > 0 ? "+" : ""}${diff} od prošle sedmice`
          }
          href="/admin/prijave"
        />
        <Stat
          label="U obradi"
          value={working}
          note="Razgovor u toku"
          href="/admin/prijave?status=u_obradi"
        />
        <Stat
          label="Prihvaćene"
          value={accepted}
          note={
            rows.length ? `${Math.round((accepted / rows.length) * 100)}% svih prijava` : "Još nema"
          }
          href="/admin/prijave?status=prihvacena"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6">
        <Card>
          <CardHeader
            title="Prijave po danima"
            description={`Zadnjih 30 dana: ${monthTotal} ${plural(monthTotal, prijavaForms)}`}
          />
          <div className="px-5 pt-6 pb-5 sm:px-6">
            <div className="relative">
              <span className="absolute -top-4 left-0 text-[11px] font-semibold text-white/35 tabular-nums">
                {peak}
              </span>
              <span className="absolute inset-x-0 top-0 border-t border-dashed border-white/[0.07]" />
              <div
                className="flex h-40 items-end gap-[2px] border-b border-white/15"
                aria-hidden="true"
              >
                {days.map((d) => (
                  <div key={d.key} className="group relative flex h-full flex-1 items-end">
                    <span
                      className={`w-full rounded-t-[4px] transition-colors ${
                        d.count ? "bg-brand-yellow group-hover:bg-[#f5c24a]" : "h-[2px] bg-white/10"
                      }`}
                      style={d.count ? { height: `${(d.count / peak) * 100}%` } : undefined}
                    />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-white shadow-xl group-hover:block">
                      {d.label}: {d.count} {plural(d.count, prijavaForms)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-white/40">
              <span>{days[0].label}</span>
              <span>{days[15].label}</span>
              <span>Danas</span>
            </div>
            <table className="sr-only">
              <caption>Prijave po danima, zadnjih 30 dana</caption>
              <tbody>
                {days.map((d) => (
                  <tr key={d.key}>
                    <th scope="row">{d.label}</th>
                    <td>{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Po paketima" description="Sve prijave do sada" />
          <ul className="space-y-4 px-5 py-5 sm:px-6">
            {perPackage.map((p) => (
              <li key={p.name}>
                <p className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-white/85">{p.name}</span>
                  <span className="font-semibold text-white tabular-nums">{p.count}</span>
                </p>
                <span className="mt-2 block h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className="block h-full rounded-full bg-brand-yellow"
                    style={{ width: `${p.count ? Math.max(4, (p.count / topPackage) * 100) : 0}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden lg:mt-6">
        <CardHeader
          title="Najnovije prijave"
          action={
            <ButtonLink href="/admin/prijave" variant="ghost" size="sm">
              Sve
              <ArrowRight className="size-3.5" />
            </ButtonLink>
          }
        />
        {latest.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<InboxIcon />}
              title="Još nema prijava"
              text="Kad neko popuni upitnik na sajtu, prijava se pojavi ovdje i stigne ti mail."
            />
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {latest.map((r) => {
              const meta = statusMeta(r.status);
              return (
                <li key={r.id}>
                  <Link
                    href={`/admin/prijave/${r.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.035] sm:px-6"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[13px] font-semibold text-white/80">
                      {initials(r.full_name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{r.full_name}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-white/50">
                        {r.package_name}
                      </span>
                    </span>
                    <Badge className={meta.tone}>{meta.label}</Badge>
                    <span className="hidden w-24 text-right text-[13px] text-white/45 sm:block">
                      {timeAgo(r.created_at, nowMs)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
