"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GOAL_EVENT } from "@/components/sections/HeroPaths";
import { ArrowRightIcon, TickIcon } from "@/components/ui/icons";
import type { PackageSlug } from "@/content/packages";

export type PackageCard = {
  slug: PackageSlug;
  name: string;
  badge?: string;
  audience: string;
  price: string;
  priceUnit: string;
  checkIn: string;
  features: string[];
};

const goals = [
  { id: "forma", label: "Formu i zdravlje" },
  { id: "bina", label: "Nastup na takmičenju" },
  { id: "znanje", label: "Naučiti raditi s klijentima" },
] as const;

const pace = [
  { id: "sedmicno", label: "Svake sedmice", slug: "online-coaching" },
  { id: "mjesecno", label: "Jednom mjesečno, bez pritiska", slug: "paket-12-sedmica" },
] as const;

type Goal = (typeof goals)[number]["id"];

function recommend(goal: Goal | null, p: string | null): PackageSlug | null {
  if (goal === "bina") return "takmicarske-pripreme";
  if (goal === "znanje") return "coaching-i-edukacija";
  if (goal === "forma") return pace.find((x) => x.id === p)?.slug ?? null;
  return null;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[15px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
        active
          ? "border-brand-black bg-brand-black text-white"
          : "border-brand-black/15 bg-white text-brand-black hover:border-brand-black/50"
      }`}
    >
      {children}
    </button>
  );
}

export function PackagesGrid({ packages }: { packages: PackageCard[] }) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [p, setPace] = useState<string | null>(null);
  const picked = recommend(goal, p);

  useEffect(() => {
    const onGoal = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (goals.some((g) => g.id === id)) {
        setGoal(id as Goal);
        setPace(null);
      }
    };
    window.addEventListener(GOAL_EVENT, onGoal);
    return () => window.removeEventListener(GOAL_EVENT, onGoal);
  }, []);
  const pickedPkg = packages.find((x) => x.slug === picked);

  return (
    <>
      <div className="mt-12 rounded-lg border border-brand-paper-line bg-white/60 p-5 sm:p-6 lg:mt-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
          <p className="shrink-0 font-display text-3xl leading-none lg:pt-2">Ne znaš koji paket?</p>
          <div className="flex flex-col gap-3">
            <div
              role="group"
              aria-label="Šta želiš postići"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="mr-1 w-16 text-sm font-semibold text-brand-ink-muted">Želim</span>
              {goals.map((g) => (
                <Pill
                  key={g.id}
                  active={goal === g.id}
                  onClick={() => {
                    setGoal(goal === g.id ? null : g.id);
                    setPace(null);
                  }}
                >
                  {g.label}
                </Pill>
              ))}
            </div>
            {goal === "forma" && (
              <div
                role="group"
                aria-label="Koliko često želiš check-in"
                className="flex animate-step flex-wrap items-center gap-2"
              >
                <span className="mr-1 w-16 text-sm font-semibold text-brand-ink-muted">
                  Check-in
                </span>
                {pace.map((x) => (
                  <Pill
                    key={x.id}
                    active={p === x.id}
                    onClick={() => setPace(p === x.id ? null : x.id)}
                  >
                    {x.label}
                  </Pill>
                ))}
              </div>
            )}
          </div>
        </div>
        <p aria-live="polite" className="text-[15px]">
          {pickedPkg && (
            <span className="mt-5 flex animate-step flex-wrap items-center gap-x-3 gap-y-2 border-t border-brand-paper-line pt-5">
              <span className="text-brand-ink-muted">Preporuka:</span>
              <span className="font-semibold">{pickedPkg.name}</span>
              <Link
                href={`/paketi/${pickedPkg.slug}`}
                className="inline-flex items-center gap-1.5 font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:decoration-brand-black"
              >
                Pogledaj paket
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </span>
          )}
        </p>
      </div>

      <ul className="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        {packages.map((pkg) => {
          const active = picked === pkg.slug;
          const dimmed = picked !== null && !active;
          const tag = active ? "Preporuka za tebe" : pkg.badge;
          return (
            <li
              key={pkg.slug}
              className={`group relative row-span-6 grid grid-rows-subgrid gap-0 rounded-lg border bg-white px-6 pt-7 pb-6 transition-[transform,box-shadow,border-color,opacity] duration-500 ease-out lg:px-7 ${
                active
                  ? "border-brand-black shadow-[0_24px_50px_-24px_rgba(10,10,10,0.55)] lg:-translate-y-2"
                  : "border-brand-paper-line hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(10,10,10,0.4)]"
              } ${dimmed ? "opacity-60 hover:opacity-100" : ""}`}
            >
              {tag && (
                <span
                  key={tag}
                  className={`absolute -top-3 left-6 animate-step rounded-sm px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] uppercase lg:left-7 ${
                    active ? "bg-brand-yellow text-brand-black" : "bg-brand-black text-white"
                  }`}
                >
                  {tag}
                </span>
              )}
              <p className="text-xs font-bold tracking-[0.14em] text-brand-ink-muted uppercase">
                {pkg.checkIn}
              </p>
              <h3 className="mt-4 self-end font-display text-[2.6rem] leading-[0.9]">{pkg.name}</h3>
              <p className="mt-3 text-[15px] leading-snug text-brand-ink-muted">{pkg.audience}</p>
              <p className="mt-6 flex items-baseline gap-2 border-t border-brand-paper-line pt-5">
                <span className="font-display text-6xl leading-none">{pkg.price}</span>
                <span className="text-sm font-semibold text-brand-ink-muted">{pkg.priceUnit}</span>
              </p>
              <ul className="mt-5 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px] leading-snug">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-yellow">
                      <TickIcon className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid gap-2 self-end">
                <Link
                  href={`/prijava/${pkg.slug}`}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md bg-brand-black px-5 font-semibold text-white transition-colors hover:bg-brand-yellow hover:text-brand-black"
                >
                  Prijavi se
                  <span className="sr-only"> za {pkg.name}</span>
                  <ArrowRightIcon />
                </Link>
                <Link
                  href={`/paketi/${pkg.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-md text-[15px] font-semibold text-brand-black underline-offset-4 hover:underline"
                >
                  Detalji paketa
                  <span className="sr-only">: {pkg.name}</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
