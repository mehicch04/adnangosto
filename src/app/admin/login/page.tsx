import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/app/admin/login/LoginForm";

export const metadata: Metadata = {
  title: "Prijava u panel",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-5 py-16">
      <div className="w-full max-w-sm rounded-lg border border-brand-line bg-brand-surface p-8">
        <Image
          src="/images/logo-ga.png"
          alt="Gosto Adnan"
          width={129}
          height={70}
          className="h-10 w-auto"
        />
        <h1 className="mt-8 font-display text-4xl leading-none">Panel</h1>
        <p className="mt-2 text-sm text-white/60">Prijave, status i bilješke na jednom mjestu.</p>
        <LoginForm />
      </div>
    </main>
  );
}
