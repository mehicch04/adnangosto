import type { Metadata } from "next";
import { signOut } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  return (
    <AdminShell email={email} signOut={signOut}>
      {children}
    </AdminShell>
  );
}
