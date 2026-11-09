"use client";

import { useActionState, useState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";
import { AlertIcon, EyeIcon, EyeOffIcon } from "@/components/admin/icons";
import { Button, Field, inputClass } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, { error: null });
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-10 grid gap-5">
      <Field label="E-mail" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          aria-invalid={Boolean(state.error)}
          className={`${inputClass} h-12`}
        />
      </Field>
      <Field label="Lozinka" htmlFor="password">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            aria-invalid={Boolean(state.error)}
            className={`${inputClass} h-12 pr-12`}
          />
          <button
            type="button"
            aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-1.5 my-auto grid size-9 place-items-center rounded-lg text-white/45 hover:text-white"
          >
            {show ? <EyeOffIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
          </button>
        </div>
      </Field>
      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-[#ff6b5a]/25 bg-[#ff6b5a]/10 px-3.5 py-3 text-sm font-medium text-[#ffb3a8]"
        >
          <AlertIcon className="size-5 shrink-0" />
          {state.error}
        </p>
      )}
      <Button type="submit" loading={pending} className="mt-1 h-12 text-[15px]">
        {pending ? "Ulazim..." : "Uđi u panel"}
      </Button>
    </form>
  );
}
