"use server";

import { randomUUID } from "node:crypto";
import { getPackage } from "@/content/packages";
import {
  PHOTO_MAX,
  PHOTO_MIN,
  isVisible,
  questionnaires,
  validateStep,
  type Answers,
} from "@/content/questionnaire";
import { APPLICATIONS_BUCKET, createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { APPLICATIONS_TO, EMAIL_FROM, SITE_URL, resend } from "@/lib/email/resend";
import { adminEmail, confirmationEmail, type AnswerRow } from "@/lib/email/templates";
import { submissionSchema } from "@/lib/validation/application";

export type UploadTicket = { path: string; url: string };

export type UploadResult =
  | { mode: "mock" }
  | { mode: "live"; uploads: UploadTicket[]; apiKey: string }
  | { mode: "error"; message: string };

const demoMode = () =>
  process.env.NODE_ENV !== "production" || process.env.APPLICATIONS_DEMO === "1";

const pathRe = /^\d{4}-\d{2}\/[0-9a-f-]{36}\/[1-6]\.jpg$/;

export async function requestPhotoUploads(slug: string, count: number): Promise<UploadResult> {
  if (!getPackage(slug)) return { mode: "error", message: "Nepoznat paket." };
  if (!Number.isInteger(count) || count < PHOTO_MIN || count > PHOTO_MAX)
    return { mode: "error", message: "Neispravan broj slika." };
  if (!isSupabaseConfigured()) {
    if (!demoMode())
      return { mode: "error", message: "Prijave trenutno nisu dostupne. Pokušaj ponovo kasnije." };
    return { mode: "mock" };
  }
  const supabase = createAdminClient();
  const folder = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}`;
  const uploads: UploadTicket[] = [];
  for (let i = 1; i <= count; i++) {
    const path = `${folder}/${i}.jpg`;
    const { data, error } = await supabase.storage
      .from(APPLICATIONS_BUCKET)
      .createSignedUploadUrl(path);
    if (error || !data) {
      console.error("signed upload", error);
      return { mode: "error", message: "Slanje slika trenutno nije moguće. Pokušaj ponovo." };
    }
    uploads.push({ path, url: data.signedUrl });
  }
  return {
    mode: "live",
    uploads,
    apiKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  };
}

export type SubmitInput = {
  slug: string;
  values: Answers;
  photos: string[];
  photoCount: number;
  consent: boolean;
  website: string;
  startedAt: number;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; step?: string; fieldErrors?: Record<string, string> };

function stringify(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v.join(", ");
  return (v ?? "").trim();
}

export async function submitApplication(raw: SubmitInput): Promise<SubmitResult> {
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success)
    return { ok: false, message: "Prijava nije ispravno poslana. Pokušaj ponovo." };
  const input = parsed.data;
  const pkg = getPackage(input.slug);
  if (!pkg) return { ok: false, message: "Nepoznat paket." };

  if (input.website || Date.now() - input.startedAt < 4000) return { ok: true };

  const steps = questionnaires[pkg.slug];
  for (const step of steps) {
    const errors = validateStep(step, input.values);
    if (Object.keys(errors).length) {
      return {
        ok: false,
        message: "Neka polja nisu ispravno popunjena.",
        step: step.id,
        fieldErrors: errors,
      };
    }
  }
  if (!input.consent)
    return {
      ok: false,
      message: "Za slanje prijave potrebna je tvoja saglasnost.",
      step: "pregled",
    };

  const live = isSupabaseConfigured();
  const photos = live ? input.photos : [];
  const count = live ? photos.length : input.photoCount;
  if (count < PHOTO_MIN || count > PHOTO_MAX)
    return { ok: false, message: "Dodaj barem jednu sliku.", step: "slike" };
  if (live) {
    const folder = photos[0]?.split("/").slice(0, 2).join("/");
    if (!photos.every((p) => pathRe.test(p) && p.startsWith(`${folder}/`)))
      return { ok: false, message: "Slike nisu ispravno poslane. Pokušaj ponovo.", step: "slike" };
  }

  const rows: AnswerRow[] = [];
  for (const step of steps) {
    for (const field of step.fields) {
      if (!isVisible(field, input.values)) continue;
      const answer = stringify(input.values[field.id]);
      if (!answer) continue;
      rows.push({
        section: step.title,
        question: field.label,
        answer: field.suffix ? `${answer} ${field.suffix}` : answer,
      });
    }
  }

  const name = stringify(input.values.fullName);
  const email = stringify(input.values.email);
  const phone = stringify(input.values.phone);

  if (!live) {
    if (!demoMode())
      return { ok: false, message: "Prijave trenutno nisu dostupne. Pokušaj ponovo kasnije." };
    console.info(
      "[prijava, razvoj]",
      pkg.name,
      name,
      email,
      rows.length,
      "odgovora",
      count,
      "slika",
    );
    return { ok: true };
  }

  const supabase = createAdminClient();
  let applicationId: string | null = null;
  const { data: inserted, error: insertError } = await supabase
    .from("applications")
    .insert({
      package_name: pkg.name,
      package_slug: pkg.slug,
      full_name: name,
      email,
      phone: phone || null,
      answers: rows,
      photos,
      status: "nova",
    })
    .select("id")
    .single();
  if (insertError) console.error("insert application", insertError);
  else applicationId = inserted.id;

  let photoLinks: string[] = [];
  if (photos.length) {
    const { data } = await supabase.storage
      .from(APPLICATIONS_BUCKET)
      .createSignedUrls(photos, 60 * 60 * 24 * 7);
    photoLinks = (data ?? []).flatMap((d) => (d.signedUrl ? [d.signedUrl] : []));
  }

  let mailed = false;
  if (resend) {
    const admin = adminEmail({
      pkg,
      name,
      email,
      rows,
      photoLinks,
      adminUrl: applicationId ? `${SITE_URL}/admin/prijave/${applicationId}` : null,
    });
    const sent = await resend.emails.send({
      from: EMAIL_FROM,
      to: APPLICATIONS_TO,
      replyTo: email,
      subject: `${pkg.name}, prijava: ${name}`,
      html: admin.html,
      text: admin.text,
    });
    if (sent.error) console.error("admin mail", sent.error);
    else mailed = true;

    const confirm = confirmationEmail({ pkg, firstName: name.split(" ")[0] || name });
    const confirmed = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      replyTo: APPLICATIONS_TO,
      subject: `Tvoja prijava je stigla: ${pkg.name}`,
      html: confirm.html,
      text: confirm.text,
    });
    if (confirmed.error) console.error("confirmation mail", confirmed.error);
  }

  if (!applicationId && !mailed)
    return {
      ok: false,
      message:
        "Prijava trenutno nije poslana. Pokušaj ponovo za par minuta ili mi piši na Instagram.",
    };

  return { ok: true };
}
