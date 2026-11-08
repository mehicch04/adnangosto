"use client";

import { countries, weeksUntil, type Field } from "@/content/questionnaire";

type Props = {
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  onChange: (value: string | string[]) => void;
  onBlur: () => void;
};

const control =
  "w-full rounded-md border bg-brand-black px-4 text-base text-white placeholder:text-white/35 transition-[border-color,box-shadow] outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/25";

function weekWord(n: number) {
  const a = n % 10;
  const b = n % 100;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "sedmice";
  return "sedmica";
}

function Label({ field, htmlFor }: { field: Field; htmlFor?: string }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag
      {...(htmlFor ? { htmlFor } : {})}
      className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-semibold text-white"
    >
      {field.label}
      {!field.required && (
        <span className="text-xs font-semibold tracking-wide text-white/45 uppercase">
          Neobavezno
        </span>
      )}
    </Tag>
  );
}

function Help({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1.5 text-sm leading-snug text-white/55">
      {text}
    </p>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#ff8a7a]">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0 fill-current">
        <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4.2h1.8v6h-1.8v-6Zm0 7.5h1.8V15h-1.8v-1.8Z" />
      </svg>
      {error}
    </p>
  );
}

export function FieldInput({ field, value, error, onChange, onBlur }: Props) {
  const id = `f-${field.id}`;
  const helpId = `${id}-help`;
  const errId = `${id}-err`;
  const describedBy = [field.help ? helpId : null, error ? errId : null].filter(Boolean).join(" ");
  const border = error ? "border-[#ff8a7a]" : "border-white/15 hover:border-white/30";
  const str = typeof value === "string" ? value : "";

  if (field.type === "radio" || field.type === "chips") {
    const multi = field.type === "chips";
    const list = Array.isArray(value) ? value : [];
    const compact = (field.options ?? []).every((o) => o.length <= 3);
    return (
      <fieldset
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        data-field={field.id}
      >
        <legend className="mb-3">
          <Label field={field} />
        </legend>
        <div className={compact ? "grid grid-cols-5 gap-2" : "flex flex-wrap gap-2"}>
          {field.options?.map((opt) => {
            const checked = multi ? list.includes(opt) : str === opt;
            return (
              <label key={opt} className="relative cursor-pointer">
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={field.id}
                  value={opt}
                  checked={checked}
                  onChange={() => {
                    if (multi) onChange(checked ? list.filter((v) => v !== opt) : [...list, opt]);
                    else onChange(opt);
                  }}
                  onBlur={onBlur}
                  className="peer sr-only"
                />
                <span
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-md border px-4 text-[15px] font-semibold transition-[background-color,border-color,color,transform] duration-200 select-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-yellow peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-brand-surface active:scale-[0.97] ${
                    checked
                      ? "border-brand-yellow bg-brand-yellow text-brand-black"
                      : `${error ? "border-[#ff8a7a]/60" : "border-white/15"} bg-brand-black text-white/85 hover:border-white/40`
                  }`}
                >
                  {multi && (
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className={`size-4 transition-[width,opacity] duration-200 ${checked ? "w-4 opacity-100" : "w-0 opacity-0"}`}
                    >
                      <path
                        d="m3 8.5 3 3 7-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
        <Help id={helpId} text={field.help} />
        <ErrorText id={errId} error={error} />
      </fieldset>
    );
  }

  const common = {
    id,
    name: field.id,
    value: str,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    "aria-required": field.required || undefined,
    placeholder: field.placeholder,
    autoComplete: field.autoComplete ?? "off",
    maxLength: field.maxLength,
    "data-field": field.id,
  };

  let input: React.ReactNode;
  if (field.type === "textarea") {
    const near = field.maxLength && str.length > field.maxLength * 0.75;
    input = (
      <div className="relative">
        <textarea
          {...common}
          rows={field.rows ?? 4}
          onChange={(e) => onChange(e.target.value)}
          className={`${control} ${border} block min-h-28 resize-y py-3 leading-relaxed`}
        />
        {near && (
          <span className="pointer-events-none absolute right-3 bottom-2 text-xs text-white/45 tabular-nums">
            {str.length}/{field.maxLength}
          </span>
        )}
      </div>
    );
  } else if (field.type === "number") {
    input = (
      <div className="relative">
        <input
          {...common}
          type="text"
          inputMode={field.inputMode ?? "decimal"}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
          className={`${control} ${border} min-h-12 pr-12`}
        />
        {field.suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-white/50">
            {field.suffix}
          </span>
        )}
      </div>
    );
  } else if (field.type === "country") {
    input = (
      <>
        <input
          {...common}
          type="text"
          list={`${id}-list`}
          onChange={(e) => onChange(e.target.value)}
          className={`${control} ${border} min-h-12`}
          placeholder="Počni kucati ili izaberi"
        />
        <datalist id={`${id}-list`}>
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </>
    );
  } else {
    input = (
      <input
        {...common}
        type={field.type === "date" ? "date" : field.type}
        inputMode={field.inputMode}
        min={field.type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${control} ${border} min-h-12 ${field.type === "date" ? "[color-scheme:dark]" : ""}`}
      />
    );
  }

  const weeks = field.type === "date" && str ? weeksUntil(str) : null;

  return (
    <div>
      <div className="mb-2">
        <Label field={field} htmlFor={id} />
      </div>
      {input}
      {weeks !== null && weeks >= 0 && !error && (
        <p
          className={`mt-2 inline-flex items-center gap-2 rounded-sm px-2.5 py-1 text-sm font-semibold ${
            weeks >= 12 ? "bg-brand-yellow/15 text-brand-yellow" : "bg-[#ff8a7a]/15 text-[#ffb3a8]"
          }`}
        >
          Do takmičenja: {weeks} {weekWord(weeks)}
        </p>
      )}
      {weeks !== null && weeks >= 0 && weeks < 12 && !error && (
        <p className="mt-2 text-sm text-white/60">
          Pripreme kraće od 3 mjeseca prihvatam samo pod posebnim uslovima, uz dogovor. Prijavu
          svejedno pošalji.
        </p>
      )}
      <Help id={helpId} text={field.help} />
      <ErrorText id={errId} error={error} />
    </div>
  );
}
