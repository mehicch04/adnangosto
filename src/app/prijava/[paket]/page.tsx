/*
  Upitnik za prijavu: /prijava/klasicni-coaching
  [paket] u nazivu foldera = dinamicki dio URL-a, kao :id u React Routeru.

  U Next 16 params je Promise, zato async + await.
  KOSTUR: upitnik u koracima pravimo u sedmici 2.
*/
import type { Metadata } from "next";

type Props = { params: Promise<{ paket: string }> };

export const metadata: Metadata = { title: "Prijava" };

export default async function ApplicationPage({ params }: Props) {
  const { paket } = await params;

  return (
    <main className="mx-auto max-w-2xl px-5 py-20">
      <h1 className="font-display text-5xl uppercase">Prijava</h1>
      <p className="mt-4 text-brand-muted">
        Paket: <span className="text-brand-yellow">{paket}</span>
      </p>
    </main>
  );
}
