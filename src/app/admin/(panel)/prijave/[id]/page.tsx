import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveIcon, ChatIcon, ChevronLeft, MailIcon, PhoneIcon } from "@/components/admin/icons";
import { Badge, Card, CardHeader, buttonClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import {
  dateTime,
  initials,
  phoneDigits,
  statusMeta,
  timeAgo,
  type ApplicationRow,
} from "@/lib/admin/applications";
import { APPLICATIONS_BUCKET } from "@/lib/supabase/bucket";
import { CopyButton } from "./CopyButton";
import { RecordActions, StatusControl } from "./DetailActions";
import { NotesEditor } from "./NotesEditor";
import { PhotoGallery } from "./PhotoGallery";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Prijava" };

export default async function ApplicationDetail({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const app = data as ApplicationRow;
  const meta = statusMeta(app.status);
  const first = app.full_name.split(/\s+/)[0] ?? app.full_name;

  let photos: string[] = [];
  if (app.photos?.length) {
    const { data: signed } = await supabase.storage
      .from(APPLICATIONS_BUCKET)
      .createSignedUrls(app.photos, 60 * 60);
    photos = (signed ?? []).flatMap((s) => (s.signedUrl ? [s.signedUrl] : []));
  }

  const sections: { title: string; rows: { question: string; answer: string }[] }[] = [];
  for (const a of app.answers ?? []) {
    const title = a.section ?? "Odgovori";
    const last = sections.at(-1);
    if (last && last.title === title) last.rows.push(a);
    else sections.push({ title, rows: [a] });
  }

  const digits = phoneDigits(app.phone);
  const mail = `mailto:${app.email}?subject=${encodeURIComponent(`${app.package_name}, tvoja prijava`)}&body=${encodeURIComponent(`Zdravo ${first},\n\n`)}`;
  const wa = `https://wa.me/${digits}?text=${encodeURIComponent(`Zdravo ${first}, Adnan ovdje. Javljam se u vezi tvoje prijave za ${app.package_name}.`)}`;
  const archived = Boolean(app.archived_at);

  return (
    <>
      <Link
        href={archived ? "/admin/prijave?arhiva=1" : "/admin/prijave"}
        className="inline-flex h-9 items-center gap-1 rounded-lg pr-3 pl-1.5 text-sm font-semibold text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
      >
        <ChevronLeft className="size-4" />
        {archived ? "Arhiva" : "Sve prijave"}
      </Link>

      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-yellow font-display text-2xl leading-none text-brand-black sm:size-16 sm:text-3xl">
            {initials(app.full_name)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-5xl leading-none tracking-wide sm:text-6xl">
              {app.full_name}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-white/55">
              <Badge className={meta.tone}>{meta.label}</Badge>
              {archived && (
                <Badge className="bg-white/[0.06] text-white/60">
                  <ArchiveIcon className="size-3.5" />
                  Arhivirana
                </Badge>
              )}
              <span className="font-semibold text-white/80">{app.package_name}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={app.created_at} title={dateTime.format(new Date(app.created_at))}>
                {timeAgo(app.created_at)}
              </time>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <RecordActions
            id={app.id}
            name={app.full_name}
            archived={archived}
            photos={app.photos?.length ?? 0}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6">
        <aside className="space-y-4 lg:sticky lg:top-8 lg:order-last lg:self-start">
          <Card>
            <CardHeader title="Status" />
            <div className="p-4 sm:p-5">
              <StatusControl key={app.status} id={app.id} value={app.status} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Kontakt" />
            <div className="space-y-2 p-4 sm:p-5">
              <a href={mail} className={buttonClass("primary", "md", "w-full")}>
                <MailIcon className="size-[18px]" />
                Odgovori mailom
              </a>
              {digits && (
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("secondary", "md")}
                  >
                    <ChatIcon className="size-[18px]" />
                    WhatsApp
                  </a>
                  <a href={`tel:+${digits}`} className={buttonClass("secondary", "md")}>
                    <PhoneIcon className="size-[18px]" />
                    Pozovi
                  </a>
                </div>
              )}
              <dl className="mt-3 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-3.5">
                  <dt className="sr-only">E-mail</dt>
                  <dd className="min-w-0 flex-1 truncate text-sm text-white/80">{app.email}</dd>
                  <CopyButton value={app.email} label="Kopiraj e-mail" />
                </div>
                {app.phone && (
                  <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-3.5">
                    <dt className="sr-only">Telefon</dt>
                    <dd className="min-w-0 flex-1 truncate text-sm text-white/80 tabular-nums">
                      {app.phone}
                    </dd>
                    <CopyButton value={app.phone} label="Kopiraj broj" />
                  </div>
                )}
              </dl>
            </div>
          </Card>

          <Card>
            <CardHeader title="Bilješke" description="Interno, klijent ih nikad ne vidi." />
            <div className="p-4 sm:p-5">
              <NotesEditor id={app.id} initial={app.admin_notes ?? ""} />
            </div>
          </Card>

          <dl className="grid grid-cols-2 gap-3 px-1 text-[12px] text-white/40">
            <div>
              <dt>Primljena</dt>
              <dd className="mt-0.5 font-medium text-white/65">
                {dateTime.format(new Date(app.created_at))}
              </dd>
            </div>
            <div>
              <dt>Zadnja izmjena</dt>
              <dd className="mt-0.5 font-medium text-white/65">
                {dateTime.format(new Date(app.updated_at ?? app.created_at))}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="min-w-0 space-y-4 lg:space-y-6">
          {photos.length > 0 && (
            <Card>
              <CardHeader
                title="Slike"
                description={`${photos.length} ${photos.length === 1 ? "slika" : photos.length < 5 ? "slike" : "slika"}, klikni za veći prikaz`}
              />
              <div className="p-4 sm:p-5">
                <PhotoGallery photos={photos} name={app.full_name} />
              </div>
            </Card>
          )}

          {sections.map((s) => (
            <Card key={s.title}>
              <CardHeader title={s.title} />
              <dl className="divide-y divide-white/[0.06]">
                {s.rows.map((r, i) => (
                  <div
                    key={`${r.question}-${i}`}
                    className="grid gap-1 px-5 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6 sm:px-6"
                  >
                    <dt className="text-[13px] text-white/50">{r.question}</dt>
                    <dd className="text-[15px] [overflow-wrap:anywhere] whitespace-pre-line text-white/90">
                      {r.answer || <span className="text-white/30">Bez odgovora</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
