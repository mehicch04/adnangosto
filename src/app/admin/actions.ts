"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { statusIds, statusMeta } from "@/lib/admin/applications";
import { APPLICATIONS_BUCKET } from "@/lib/supabase/bucket";

export type LoginState = { error: string | null };

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(200),
});

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Upiši ispravan e-mail i lozinku." };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { error: "Supabase još nije povezan." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Pogrešan e-mail ili lozinka." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type ActionResult = { ok: boolean; message: string };

const statusSchema = z.object({ id: z.uuid(), status: z.enum(statusIds) });

export async function setStatus(id: string, status: string): Promise<ActionResult> {
  const parsed = statusSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false, message: "Neispravan status." };
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  if (error) return { ok: false, message: "Status nije sačuvan. Pokušaj ponovo." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: `Status promijenjen: ${statusMeta(parsed.data.status).label}` };
}

const notesSchema = z.object({ id: z.uuid(), notes: z.string().max(5000) });

export async function saveNotes(id: string, notes: string): Promise<ActionResult> {
  const parsed = notesSchema.safeParse({ id, notes });
  if (!parsed.success) return { ok: false, message: "Bilješka je preduga." };
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("applications")
    .update({ admin_notes: parsed.data.notes.trim() || null })
    .eq("id", parsed.data.id);
  if (error) return { ok: false, message: "Bilješka nije sačuvana." };
  return { ok: true, message: "Sačuvano" };
}

export async function setArchived(id: string, archived: boolean): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Nepoznata prijava." };
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("applications")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return { ok: false, message: "Promjena nije sačuvana. Pokušaj ponovo." };
  revalidatePath("/admin", "layout");
  return {
    ok: true,
    message: archived ? "Prijava je arhivirana." : "Prijava je vraćena iz arhive.",
  };
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Nepoznata prijava." };
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("applications").select("photos").eq("id", id).maybeSingle();
  const photos = (data?.photos as string[] | null) ?? [];
  if (photos.length) {
    const { error } = await supabase.storage.from(APPLICATIONS_BUCKET).remove(photos);
    if (error) return { ok: false, message: "Slike nisu obrisane, prijava je ostala." };
  }
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) return { ok: false, message: "Prijava nije obrisana. Pokušaj ponovo." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Prijava i slike su trajno obrisane." };
}

const passwordSchema = z
  .object({
    password: z.string().min(8, "Lozinka mora imati najmanje 8 znakova.").max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Lozinke se ne poklapaju.",
    path: ["confirm"],
  });

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, message: "Lozinka nije promijenjena. Pokušaj ponovo." };
  return { ok: true, message: "Lozinka je promijenjena." };
}

export async function signOutEverywhere() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/admin/login");
}
