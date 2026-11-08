"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { statuses } from "@/lib/admin/applications";

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

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(statuses.map((s) => s.id) as [string, ...string[]]),
});

export async function updateStatus(formData: FormData) {
  const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  revalidatePath("/admin");
  revalidatePath(`/admin/prijave/${parsed.data.id}`);
}

const notesSchema = z.object({ id: z.uuid(), notes: z.string().max(5000) });

export async function saveNotes(formData: FormData) {
  const parsed = notesSchema.safeParse({
    id: formData.get("id"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase
    .from("applications")
    .update({ admin_notes: parsed.data.notes || null })
    .eq("id", parsed.data.id);
  revalidatePath(`/admin/prijave/${parsed.data.id}`);
}
