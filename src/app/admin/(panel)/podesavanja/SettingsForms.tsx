"use client";

import { useRef, useState, useTransition } from "react";
import { changePassword, signOutEverywhere } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EyeIcon, EyeOffIcon } from "@/components/admin/icons";
import { useToast } from "@/components/admin/Toaster";
import { Button, Card, CardHeader, Field, inputClass } from "@/components/admin/ui";

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const levels = ["Preslaba", "Slaba", "Solidna", "Jaka", "Odlična"];
const colors = [
  "bg-[#ff6b5a]",
  "bg-[#ff6b5a]",
  "bg-brand-yellow",
  "bg-emerald-400",
  "bg-emerald-400",
];

export function PasswordForm() {
  const toast = useToast();
  const form = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const score = strength(value);

  return (
    <Card>
      <CardHeader
        title="Promjena lozinke"
        description="Najmanje 8 znakova. Duža lozinka je sigurnija."
      />
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          start(async () => {
            const res = await changePassword(data);
            if (res.ok) {
              setError(null);
              setValue("");
              form.current?.reset();
              toast(res.message);
            } else {
              setError(res.message);
              toast(res.message, "error");
            }
          });
        }}
        className="grid gap-5 px-5 py-5 sm:px-6"
      >
        <Field label="Nova lozinka" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-1 my-auto grid size-9 place-items-center rounded-lg text-white/45 hover:text-white"
            >
              {show ? <EyeOffIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
            </button>
          </div>
          {value && (
            <div className="mt-2 flex items-center gap-3">
              <div className="grid flex-1 grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full ${i < score ? colors[score] : "bg-white/10"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-white/55">{levels[score]}</span>
            </div>
          )}
        </Field>
        <Field label="Ponovi lozinku" htmlFor="confirm" error={error}>
          <input
            id="confirm"
            name="confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            aria-invalid={Boolean(error)}
            className={inputClass}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={pending}>
            Sačuvaj lozinku
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function SessionsCard() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  return (
    <Card>
      <CardHeader
        title="Prijavljeni uređaji"
        description="Ako si se prijavio na tuđem računaru, odjavi se svuda odjednom."
        action={
          <Button type="button" variant="danger" size="sm" onClick={() => setOpen(true)}>
            Odjavi sve uređaje
          </Button>
        }
      />
      <ConfirmDialog
        open={open}
        title="Odjaviti sve uređaje?"
        text="Bićeš odjavljen i ovdje. Prijavi se ponovo svojim mailom i lozinkom."
        confirmLabel="Odjavi sve"
        loading={pending}
        onClose={() => setOpen(false)}
        onConfirm={() => start(() => signOutEverywhere())}
      />
    </Card>
  );
}
