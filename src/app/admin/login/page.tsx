import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/app/admin/login/LoginForm";

export const metadata: Metadata = {
  title: "Prijava u panel",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-[100svh] bg-[#0b0b0b] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
        <Image
          src="/images/logo-ga.png"
          alt="Gosto Adnan"
          width={129}
          height={70}
          priority
          className="h-10 w-auto self-start"
        />
        <div className="my-auto w-full max-w-sm py-16">
          <h1 className="font-display text-6xl leading-none tracking-wide">Panel</h1>
          <p className="mt-3 text-[15px] text-white/55">
            Prijave, paketi, transformacije i tekstovi sajta na jednom mjestu.
          </p>
          <LoginForm />
        </div>
        <p className="text-xs text-white/30">adnangosto.com</p>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/om-ledja-krov.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover object-[50%_25%] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/90 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-[14%] w-24 bg-brand-yellow"
          style={{ clipPath: "polygon(70% 0, 100% 0, 30% 100%, 0 100%)" }}
        />
        <p className="absolute right-12 bottom-12 left-12 font-display text-5xl leading-[0.95] text-white">
          Svaka prijava je
          <br />
          nečiji prvi korak.
        </p>
      </div>
    </main>
  );
}
