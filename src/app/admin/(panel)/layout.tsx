import type { Metadata } from "next";
import { signOut } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email } = await requireAdmin();
  const { count } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "nova")
    .is("archived_at", null);
  return (
    <AdminShell email={email} signOut={signOut} counts={{ "/admin/prijave": count ?? 0 }}>
      {children}
    </AdminShell>
  );
}
