"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Button, Card, CardHeader, Field, inputClass } from "@/components/admin/ui";
import type { SiteTexts, TextsSection } from "@/content/texts";
import { saveTexts } from "./actions";

type Tab = TextsSection | "kontakt";

const areaClass = `${inputClass} h-auto min-h-28 resize-y py-2.5 leading-relaxed`;
const iconBtn =
  "grid size-9 shrink-0 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25";

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span
      className={`text-xs tabular-nums ${value.length > max ? "text-[#ff9b8f]" : "text-white/35"}`}
    >
      {value.length}/{max}
    </span>
  );
}

function Area({
  id,
  label,
  value,
  max,
  hint,
  rows = 4,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  max: number;
  hint?: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-white/80">
          {label}
        </label>
        <Counter value={value} max={max} />
      </div>
      <textarea
        id={id}
        rows={rows}
        className={areaClass}
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1.5 text-[13px] text-white/45">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  description,
  dirty,
  saving,
  onSave,
  onReset,
  children,
}: {
  title: string;
  description: string;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
  children: ReactNode;
}) {
  return (
    <Card className="mt-6 max-w-3xl">
      <CardHeader title={title} description={description} />
      <div className="grid gap-5 px-5 py-5 sm:px-6">{children}</div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4 sm:px-6">
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="text-[13px] font-semibold text-white/45 underline-offset-4 hover:text-white hover:underline"
          >
            Vrati početni tekst
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          {dirty && <span className="text-[13px] text-brand-yellow">Nesačuvane izmjene</span>}
          <Button type="button" onClick={onSave} loading={saving} disabled={!dirty}>
            Sačuvaj
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function TextsEditor({
  tab,
  initial,
  defaults,
}: {
  tab: Tab;
  initial: SiteTexts;
  defaults: SiteTexts;
}) {
  const toast = useToast();
  const [saved, setSaved] = useState(initial);
  const [texts, setTexts] = useState(initial);
  const [saving, startSaving] = useTransition();

  const dirty = (...keys: TextsSection[]) =>
    keys.some((k) => JSON.stringify(texts[k]) !== JSON.stringify(saved[k]));

  const save = (...keys: TextsSection[]) =>
    startSaving(async () => {
      for (const key of keys) {
        if (JSON.stringify(texts[key]) === JSON.stringify(saved[key])) continue;
        const value =
          key === "hero"
            ? { ...texts.hero, proof: texts.hero.proof.map((p) => p.trim()).filter(Boolean) }
            : texts[key];
        const res = await saveTexts(key, value);
        toast(res.message, res.ok ? "success" : "error");
        if (!res.ok) return;
        setSaved((s) => ({ ...s, [key]: value }));
        setTexts((t) => ({ ...t, [key]: value }));
      }
    });

  const patch = <K extends TextsSection>(key: K, value: Partial<SiteTexts[K]>) =>
    setTexts((t) => ({ ...t, [key]: { ...(t[key] as object), ...value } as SiteTexts[K] }));

  if (tab === "hero") {
    const h = texts.hero;
    const proof = [0, 1, 2].map((i) => h.proof[i] ?? "");
    return (
      <Panel
        title="Naslovna"
        description="Prvo što posjetilac vidi. Kratko i jasno."
        dirty={dirty("hero")}
        saving={saving}
        onSave={() => save("hero")}
        onReset={() => setTexts((t) => ({ ...t, hero: defaults.hero }))}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Naslov, prvi red" htmlFor="h-title">
            <input
              id="h-title"
              className={inputClass}
              value={h.title}
              maxLength={40}
              onChange={(e) => patch("hero", { title: e.target.value })}
            />
          </Field>
          <Field label="Naslov, drugi red" htmlFor="h-accent" hint="Prikazuje se žutom bojom.">
            <input
              id="h-accent"
              className={inputClass}
              value={h.titleAccent}
              maxLength={40}
              onChange={(e) => patch("hero", { titleAccent: e.target.value })}
            />
          </Field>
        </div>
        <Area
          id="h-sub"
          label="Podnaslov"
          value={h.subtitle}
          max={320}
          rows={3}
          onChange={(v) => patch("hero", { subtitle: v })}
        />
        <div>
          <p className="mb-1.5 text-[13px] font-semibold text-white/80">Tri kratke činjenice</p>
          <div className="grid gap-2">
            {proof.map((p, i) => (
              <input
                key={i}
                aria-label={`Činjenica ${i + 1}`}
                className={inputClass}
                value={p}
                maxLength={70}
                placeholder={defaults.hero.proof[i] ?? ""}
                onChange={(e) => {
                  const next = [...proof];
                  next[i] = e.target.value;
                  patch("hero", { proof: next });
                }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[13px] text-white/45">
            Kartica desno od naslova na računaru. Prazna polja se ne prikazuju.
          </p>
        </div>
      </Panel>
    );
  }

  if (tab === "about") {
    return (
      <Panel
        title="O meni na početnoj"
        description="Tekst uz tvoju fotografiju i citat na početnoj stranici."
        dirty={dirty("about")}
        saving={saving}
        onSave={() => save("about")}
        onReset={() => setTexts((t) => ({ ...t, about: defaults.about }))}
      >
        <Area
          id="a-text"
          label="Tekst"
          value={texts.about.text}
          max={600}
          rows={6}
          onChange={(v) => patch("about", { text: v })}
        />
      </Panel>
    );
  }

  if (tab === "faq") {
    const list = texts.faq;
    const setList = (next: SiteTexts["faq"]) => setTexts((t) => ({ ...t, faq: next }));
    return (
      <Panel
        title="Česta pitanja"
        description="Pitanja pri dnu početne. Redoslijed je isti kao ovdje."
        dirty={dirty("faq")}
        saving={saving}
        onSave={() => save("faq")}
        onReset={() => setTexts((t) => ({ ...t, faq: defaults.faq }))}
      >
        <ol className="grid gap-3">
          {list.map((f, i) => (
            <li key={i} className="rounded-xl border border-white/[0.08] bg-black/20 p-3 sm:p-4">
              <div className="flex items-center gap-1">
                <span className="mr-auto text-xs font-bold tracking-[0.14em] text-brand-yellow uppercase">
                  Pitanje {i + 1}
                </span>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Pomjeri gore"
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...list];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    setList(next);
                  }}
                >
                  <ArrowUpIcon className="size-4" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Pomjeri dolje"
                  disabled={i === list.length - 1}
                  onClick={() => {
                    const next = [...list];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    setList(next);
                  }}
                >
                  <ArrowDownIcon className="size-4" />
                </button>
                <button
                  type="button"
                  className={`${iconBtn} hover:bg-[#ff6b5a]/15 hover:text-[#ff9b8f]`}
                  aria-label="Obriši pitanje"
                  onClick={() => setList(list.filter((_, j) => j !== i))}
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
              <input
                aria-label={`Pitanje ${i + 1}`}
                className={`${inputClass} mt-2`}
                value={f.q}
                maxLength={160}
                placeholder="Pitanje"
                onChange={(e) =>
                  setList(list.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))
                }
              />
              <textarea
                aria-label={`Odgovor ${i + 1}`}
                className={`${areaClass} mt-2 min-h-24`}
                value={f.a}
                maxLength={900}
                placeholder="Odgovor"
                onChange={(e) =>
                  setList(list.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))
                }
              />
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="secondary"
          className="justify-self-start"
          disabled={list.length >= 16}
          onClick={() => setList([...list, { q: "", a: "" }])}
        >
          <PlusIcon className="size-[18px]" />
          Dodaj pitanje
        </Button>
      </Panel>
    );
  }

  if (tab === "kontakt") {
    return (
      <Panel
        title="Kontakt i web shop"
        description="Gdje vode gumbi za poruku i blok web shopa na početnoj."
        dirty={dirty("contact", "shop")}
        saving={saving}
        onSave={() => save("contact", "shop")}
      >
        <Field
          label="WhatsApp broj"
          htmlFor="c-wa"
          hint="S pozivnim brojem, npr. +385 91 234 5678. Kad je upisan, svi gumbi za poruku vode na WhatsApp. Prazno znači poruke na Instagramu."
        >
          <input
            id="c-wa"
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={texts.contact.whatsapp}
            maxLength={30}
            placeholder="+385"
            onChange={(e) => patch("contact", { whatsapp: e.target.value })}
          />
        </Field>
        <div className="border-t border-white/[0.06] pt-5">
          <p className="text-[13px] font-bold tracking-[0.14em] text-brand-yellow uppercase">
            Web shop
          </p>
          <p className="mt-1 text-[13px] text-white/45">
            Dok link nije upisan, blok web shopa se ne prikazuje.
          </p>
        </div>
        <Field label="Link web shopa" htmlFor="c-shop">
          <input
            id="c-shop"
            type="url"
            inputMode="url"
            className={inputClass}
            value={texts.shop.url}
            placeholder="https://"
            onChange={(e) => patch("shop", { url: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kod za popust" htmlFor="c-code" hint="Prazno ako nema koda.">
            <input
              id="c-code"
              className={inputClass}
              value={texts.shop.code}
              maxLength={30}
              placeholder="npr. ADONI10"
              onChange={(e) => patch("shop", { code: e.target.value })}
            />
          </Field>
          <Field label="Popust" htmlFor="c-disc" hint="Prazno ako nema popusta.">
            <input
              id="c-disc"
              className={inputClass}
              value={texts.shop.discount}
              maxLength={10}
              placeholder="npr. 10%"
              onChange={(e) => patch("shop", { discount: e.target.value })}
            />
          </Field>
        </div>
      </Panel>
    );
  }

  const hasTerms = Boolean(saved.terms.body.trim());
  return (
    <Panel
      title="Opći uvjeti poslovanja"
      description="Uvjeti suradnje, plaćanja i povrata novca."
      dirty={dirty("terms")}
      saving={saving}
      onSave={() => save("terms")}
    >
      <div
        className={`rounded-xl border px-4 py-3 text-sm ${hasTerms ? "border-[#4ade80]/25 bg-[#4ade80]/[0.06] text-white/80" : "border-white/10 bg-white/[0.03] text-white/65"}`}
      >
        {hasTerms ? (
          <span className="flex flex-wrap items-center justify-between gap-2">
            Stranica je na sajtu, link je u podnožju, a u prijavi je kvačica za prihvaćanje.
            <a
              href="/opci-uvjeti"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 font-semibold text-brand-yellow"
            >
              Otvori <ExternalIcon className="size-3.5" />
            </a>
          </span>
        ) : (
          "Kad upišeš tekst i sačuvaš, na sajtu se pojavi stranica Opći uvjeti, link u podnožju i kvačica u prijavi."
        )}
      </div>
      <Area
        id="t-body"
        label="Tekst"
        value={texts.terms.body}
        max={40000}
        rows={18}
        hint="Prazan red odvaja odlomke. Red koji počinje s # je podnaslov, a redovi koji počinju s - su stavke liste."
        onChange={(v) => patch("terms", { body: v })}
      />
    </Panel>
  );
}
