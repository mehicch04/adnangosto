"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";

const input =
  "mt-2 block min-h-12 w-full rounded-md border border-white/15 bg-brand-black px-4 text-white outline-none transition-[border-color,box-shadow] focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/25";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, { error: null });
  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-semibold">
        E-mail
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Lozinka
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={input}
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm font-semibold text-[#ff8a7a]">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center rounded-md bg-brand-yellow font-bold text-brand-black transition-colors hover:bg-[#f5c24a] disabled:opacity-60"
      >
        {pending ? "Prijavljujem..." : "Prijavi se"}
      </button>
    </form>
  );
}
