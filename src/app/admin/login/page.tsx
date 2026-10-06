/*
  Login za admin panel. Forma ide u sedmici 4 (Supabase signInWithPassword).
*/
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijava u panel",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-4xl uppercase">Prijava u panel</h1>
    </main>
  );
}
