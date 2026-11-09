"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ExternalIcon,
  FormIcon,
  ImagesIcon,
  InboxIcon,
  LogoutIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  TextIcon,
} from "@/components/admin/icons";
import { CommandPalette, type Command } from "@/components/admin/CommandPalette";
import { Toaster } from "@/components/admin/Toaster";
import { adminNav, isActive, type AdminNavItem } from "@/lib/admin/nav";

const icons: Record<AdminNavItem["icon"], (p: { className?: string }) => ReactNode> = {
  inbox: InboxIcon,
  package: PackageIcon,
  images: ImagesIcon,
  text: TextIcon,
  form: FormIcon,
  settings: SettingsIcon,
};

function NavIcon({
  name,
  className = "size-5",
}: {
  name: AdminNavItem["icon"];
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} />;
}

export function AdminShell({
  email,
  signOut,
  children,
}: {
  email: string;
  signOut: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [palette, setPalette] = useState(false);
  const signOutForm = useRef<HTMLFormElement>(null);
  const initial = (email[0] ?? "A").toUpperCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands: Command[] = [
    ...adminNav
      .filter((n) => n.ready)
      .map((n) => ({
        id: n.href,
        label: n.label,
        group: "Idi na",
        keywords: n.keywords,
        href: n.href,
        icon: <NavIcon name={n.icon} className="size-[18px]" />,
      })),
    {
      id: "sajt",
      label: "Otvori sajt",
      group: "Akcije",
      keywords: "pogledaj sajt",
      href: "/",
      external: true,
      icon: <ExternalIcon className="size-[18px]" />,
    },
    {
      id: "odjava",
      label: "Odjavi se",
      group: "Akcije",
      keywords: "izlaz logout",
      run: () => signOutForm.current?.requestSubmit(),
      icon: <LogoutIcon className="size-[18px]" />,
    },
  ];

  const mobileMain = adminNav.filter((n) => n.ready && n.icon !== "settings").slice(0, 3);
  const settingsOn = isActive(pathname, "/admin/podesavanja");

  return (
    <Toaster>
      <form ref={signOutForm} action={signOut} hidden />
      <div className="min-h-[100svh] bg-[#0b0b0b] lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-[100svh] flex-col border-r border-white/[0.06] bg-[#080808] px-3 py-5 lg:flex">
          <Link href="/admin" className="flex items-center gap-3 px-3">
            <Image
              src="/images/logo-ga.png"
              alt="Gosto Adnan"
              width={129}
              height={70}
              className="h-8 w-auto"
            />
            <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-white/50">
              Panel
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setPalette(true)}
            className="mt-6 flex h-10 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white/45 transition-colors hover:border-white/15 hover:text-white/70"
          >
            <SearchIcon className="size-4" />
            <span className="flex-1 text-left">Traži</span>
            <kbd className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-semibold">
              Ctrl K
            </kbd>
          </button>

          <nav aria-label="Panel" className="mt-6 flex-1">
            <ul className="space-y-0.5">
              {adminNav.map((n) => {
                const on = isActive(pathname, n.href);
                if (!n.ready) {
                  return (
                    <li key={n.href}>
                      <span
                        aria-disabled="true"
                        className="flex h-10 cursor-default items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/30"
                      >
                        <NavIcon name={n.icon} />
                        <span className="flex-1">{n.label}</span>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold">
                          Uskoro
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                        on
                          ? "bg-white/[0.07] text-white"
                          : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {on && (
                        <span className="absolute top-2 bottom-2 -left-3 w-1 rounded-r-full bg-brand-yellow" />
                      )}
                      <NavIcon
                        name={n.icon}
                        className={`size-5 ${on ? "text-brand-yellow" : ""}`}
                      />
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalIcon className="size-5" />
            Otvori sajt
          </a>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-yellow font-display text-lg leading-none text-brand-black">
              {initial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">{email || "Admin"}</span>
              <Link href="/admin/podesavanja" className="text-xs text-white/45 hover:text-white">
                Podešavanja
              </Link>
            </span>
            <button
              type="button"
              aria-label="Odjavi se"
              title="Odjavi se"
              onClick={() => signOutForm.current?.requestSubmit()}
              className="grid size-9 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <LogoutIcon className="size-[18px]" />
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#0b0b0b]/85 px-4 backdrop-blur-xl lg:hidden">
            <Link href="/admin" aria-label="Panel">
              <Image
                src="/images/logo-ga.png"
                alt="Gosto Adnan"
                width={129}
                height={70}
                className="h-7 w-auto"
              />
            </Link>
            <span className="ml-auto" />
            <a
              href="/"
              target="_blank"
              rel="noopener"
              aria-label="Otvori sajt"
              className="grid size-10 place-items-center rounded-xl text-white/60 hover:bg-white/[0.06] hover:text-white"
            >
              <ExternalIcon className="size-5" />
            </a>
            <Link
              href="/admin/podesavanja"
              aria-label="Podešavanja"
              className="grid size-9 place-items-center rounded-full bg-brand-yellow font-display text-lg leading-none text-brand-black"
            >
              {initial}
            </Link>
          </header>

          <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-14">
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Panel"
        style={{
          gridTemplateColumns: `repeat(${Math.max(2, mobileMain.length) + 2}, minmax(0, 1fr))`,
        }}
        className="fixed inset-x-0 bottom-0 z-40 grid border-t border-white/[0.07] bg-[#0b0b0b]/90 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        {mobileMain.map((n) => {
          const on = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold ${on ? "text-brand-yellow" : "text-white/55"}`}
            >
              <NavIcon name={n.icon} className="size-[22px]" />
              {n.label.split(" ")[0]}
            </Link>
          );
        })}
        {Array.from({ length: Math.max(0, 2 - mobileMain.length) }).map((_, i) => (
          <span key={i} />
        ))}
        <button
          type="button"
          onClick={() => setPalette(true)}
          className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold text-white/55"
        >
          <SearchIcon className="size-[22px]" />
          Traži
        </button>
        <Link
          href="/admin/podesavanja"
          aria-current={settingsOn ? "page" : undefined}
          className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold ${settingsOn ? "text-brand-yellow" : "text-white/55"}`}
        >
          <SettingsIcon className="size-[22px]" />
          Nalog
        </Link>
      </nav>

      <CommandPalette open={palette} onClose={() => setPalette(false)} commands={commands} />
    </Toaster>
  );
}
