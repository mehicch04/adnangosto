/*
  Admin panel (kancelarija). Do ovdje se stize samo ako je proxy.ts
  potvrdio da je korisnik prijavljen.
  KOSTUR: pregled prijava i uredjivanje sadrzaja u sedmici 4.
*/
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel",
  // admin nikad ne smije u Google pretragu
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl uppercase">Panel</h1>
    </main>
  );
}
