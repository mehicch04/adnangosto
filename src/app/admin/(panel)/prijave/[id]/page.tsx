import Link from "next/link";
import { notFound } from "next/navigation";
import { saveNotes, updateStatus } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { APPLICATIONS_BUCKET } from "@/lib/supabase/bucket";
import { dateTime, statusMeta, statuses, type ApplicationRow } from "@/lib/admin/applications";

type Props = { params: Promise<{ id: string }> };

export default async function ApplicationDetail({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const app = data as ApplicationRow;
  const meta = statusMeta(app.status);

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
  const phone = app.phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <Link href="/admin" className="text-sm font-semibold text-white/60 hover:text-white">
        ← Sve prijave
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className={`rounded-sm px-2 py-0.5 text-xs font-bold ${meta.tone}`}>
              {meta.label}
            </span>
            {dateTime.format(new Date(app.created_at))}
          </p>
          <h1 className="mt-3 font-display text-6xl leading-none">{app.full_name}</h1>
          <p className="mt-2 text-lg text-white/70">{app.package_name}</p>

          {photos.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase">
                Slike ({photos.length})
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((src, i) => (
                  <li key={src}>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-[3/4] overflow-hidden rounded-md bg-brand-surface"
                    >
                      <img
                        src={src}
                        alt={`Slika ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {sections.map((s) => (
            <section key={s.title} className="mt-10">
              <h2 className="text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase">
                {s.title}
              </h2>
              <dl className="mt-3 divide-y divide-brand-line rounded-lg border border-brand-line bg-brand-surface">
                {s.rows.map((r) => (
                  <div
                    key={r.question}
                    className="grid gap-1 p-4 sm:grid-cols-[14rem_1fr] sm:gap-6"
                  >
                    <dt className="text-sm text-white/55">{r.question}</dt>
                    <dd className="[overflow-wrap:anywhere] whitespace-pre-line">{r.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-brand-line bg-brand-surface p-5">
            <h2 className="text-xs font-bold tracking-[0.16em] text-white/50 uppercase">Kontakt</h2>
            <a
              href={`mailto:${app.email}?subject=${encodeURIComponent(`${app.package_name}, tvoja prijava`)}`}
              className="mt-4 flex min-h-12 items-center justify-center rounded-md bg-brand-yellow font-bold text-brand-black transition-colors hover:bg-[#f5c24a]"
            >
              Odgovori na mail
            </a>
            {phone && (
              <a
                href={`https://wa.me/${phone.replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex min-h-12 items-center justify-center rounded-md border border-white/15 font-semibold transition-colors hover:border-white/40"
              >
                WhatsApp
              </a>
            )}
            <p className="mt-4 text-sm [overflow-wrap:anywhere] text-white/70">{app.email}</p>
            {app.phone && <p className="text-sm text-white/70">{app.phone}</p>}
          </div>

          <form
            action={updateStatus}
            className="rounded-lg border border-brand-line bg-brand-surface p-5"
          >
            <input type="hidden" name="id" value={app.id} />
            <h2 className="text-xs font-bold tracking-[0.16em] text-white/50 uppercase">Status</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  type="submit"
                  name="status"
                  value={s.id}
                  aria-pressed={app.status === s.id}
                  className={`min-h-11 rounded-md border px-3 text-sm font-semibold transition-colors ${
                    app.status === s.id
                      ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                      : "border-white/15 text-white/75 hover:border-white/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </form>

          <form
            action={saveNotes}
            className="rounded-lg border border-brand-line bg-brand-surface p-5"
          >
            <input type="hidden" name="id" value={app.id} />
            <label
              htmlFor="notes"
              className="text-xs font-bold tracking-[0.16em] text-white/50 uppercase"
            >
              Bilješke
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              defaultValue={app.admin_notes ?? ""}
              placeholder="Vidiš ih samo ti."
              className="mt-3 block w-full rounded-md border border-white/15 bg-brand-black p-3 text-sm text-white outline-none focus:border-brand-yellow"
            />
            <button
              type="submit"
              className="mt-3 min-h-11 w-full rounded-md border border-white/15 text-sm font-semibold transition-colors hover:border-white/40"
            >
              Sačuvaj bilješke
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
