import type { Metadata } from "next";
import { fallbackPackages } from "@/content/site";

type Props = { params: Promise<{ paket: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paket } = await params;
  const name = fallbackPackages.find((p) => p.slug === paket)?.name;
  return { title: name ? `Prijava, ${name}` : "Prijava" };
}

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
