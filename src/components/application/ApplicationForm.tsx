"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PHOTO_MAX,
  PHOTO_MIN,
  isVisible,
  photoRules,
  questionnaires,
  validateStep,
  type Answers,
  type Step,
} from "@/content/questionnaire";
import type { PackageSlug } from "@/content/packages";
import { FieldInput } from "@/components/application/Fields";
import { compressImage, uploadBlob } from "@/components/application/image";
import { requestPhotoUploads, submitApplication } from "@/app/prijava/[paket]/actions";

type Photo = { id: string; blob: Blob; url: string };

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; progress: number }
  | { kind: "submitting" }
  | { kind: "done"; name: string; email: string }
  | { kind: "error"; message: string };

type Props = {
  slug: PackageSlug;
  packageName: string;
  price: string;
  checkIn: string;
  backHref: string;
  instagram: string;
};

const STORAGE_PREFIX = "adnangosto:prijava:";

function readSaved(slug: string): { values: Answers; step: number } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + slug);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { values?: Answers; step?: number; savedAt?: number };
    if (!parsed.values || Date.now() - (parsed.savedAt ?? 0) > 1000 * 60 * 60 * 24 * 14)
      return null;
    return { values: parsed.values, step: parsed.step ?? 0 };
  } catch {
    return null;
  }
}

function clearSaved(slug: string) {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + slug);
  } catch {}
}

function display(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v.join(", ");
  return v?.trim() ?? "";
}

export function ApplicationForm({ slug, packageName, price, checkIn, backHref, instagram }: Props) {
  const steps = questionnaires[slug];
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [restored, setRestored] = useState(false);
  const [maxReached, setMaxReached] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const dirty = useRef(false);
  const firstRender = useRef(true);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const busy = status.kind === "uploading" || status.kind === "submitting";

  useEffect(() => {
    const saved = readSaved(slug);
    if (!saved) return;
    const t = window.setTimeout(() => {
      setValues(saved.values);
      const target = Math.min(saved.step, steps.length - 1);
      const photoIdx = steps.findIndex((s) => s.kind === "photos");
      const safe = photoIdx >= 0 ? Math.min(target, photoIdx) : target;
      setStepIndex(safe);
      setMaxReached(safe);
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, [slug, steps]);

  useEffect(() => {
    if (status.kind === "done") return;
    const t = window.setTimeout(() => {
      if (!Object.keys(values).length) return;
      try {
        window.localStorage.setItem(
          STORAGE_PREFIX + slug,
          JSON.stringify({ values, step: stepIndex, savedAt: Date.now() }),
        );
      } catch {}
    }, 400);
    return () => window.clearTimeout(t);
  }, [values, stepIndex, slug, status.kind]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current && status.kind !== "done") e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [status.kind]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex, status.kind]);

  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const setValue = useCallback((id: string, v: string | string[]) => {
    dirty.current = true;
    setValues((prev) => ({ ...prev, [id]: v }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const blurField = useCallback(
    (id: string) => {
      const field = step.fields.find((f) => f.id === id);
      if (!field) return;
      const v = values[id];
      const empty = Array.isArray(v) ? v.length === 0 : !v || !String(v).trim();
      if (empty) return;
      const e = validateStep({ ...step, fields: [field] }, values)[id];
      setErrors((prev) => {
        const next = { ...prev };
        if (e) next[id] = e;
        else delete next[id];
        return next;
      });
    },
    [step, values],
  );

  const focusFirstError = (errs: Record<string, string>) => {
    const first = step.fields.find((f) => errs[f.id]);
    if (!first) return;
    window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(
        `[data-field="${first.id}"] input, [data-field="${first.id}"]:is(input,textarea)`,
      );
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 30);
  };

  const validateCurrent = (): boolean => {
    if (step.kind === "photos") {
      if (processing > 0) {
        setPhotoError("Sačekaj da se slike obrade.");
        return false;
      }
      if (photos.length < PHOTO_MIN) {
        setPhotoError("Dodaj barem jednu sliku cijelog tijela.");
        return false;
      }
      setPhotoError(null);
      return true;
    }
    if (step.kind === "review") return true;
    const errs = validateStep(step, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return false;
    }
    return true;
  };

  const goTo = (i: number) => {
    if (busy) return;
    setStatus({ kind: "idle" });
    setStepIndex(i);
  };

  const next = () => {
    if (!validateCurrent()) return;
    const target = Math.min(stepIndex + 1, steps.length - 1);
    setMaxReached((m) => Math.max(m, target));
    goTo(target);
  };

  const back = () => {
    if (stepIndex > 0) goTo(stepIndex - 1);
  };

  const addFiles = async (list: FileList | File[]) => {
    const files = Array.from(list).filter(
      (f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name),
    );
    if (!files.length) {
      setPhotoError("Izaberi fotografije u JPG ili PNG formatu.");
      return;
    }
    const room = PHOTO_MAX - photos.length;
    if (room <= 0) {
      setPhotoError(`Možeš poslati najviše ${PHOTO_MAX} slika.`);
      return;
    }
    const take = files.slice(0, room);
    setPhotoError(
      files.length > room ? `Dodano je prvih ${room}. Najviše ${PHOTO_MAX} slika.` : null,
    );
    dirty.current = true;
    setProcessing((n) => n + take.length);
    for (const file of take) {
      try {
        const blob = await compressImage(file);
        const photo: Photo = { id: crypto.randomUUID(), blob, url: URL.createObjectURL(blob) };
        setPhotos((prev) => (prev.length >= PHOTO_MAX ? prev : [...prev, photo]));
      } catch (e) {
        setPhotoError(e instanceof Error ? e.message : "Sliku nije moguće učitati.");
      } finally {
        setProcessing((n) => n - 1);
      }
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const submit = async () => {
    if (!consent) {
      setConsentError(true);
      document.getElementById("consent")?.focus();
      return;
    }
    setStatus({ kind: "uploading", progress: 0 });
    try {
      const tickets = await requestPhotoUploads(slug, photos.length);
      if (tickets.mode === "error") {
        setStatus({ kind: "error", message: tickets.message });
        return;
      }
      let paths: string[] = [];
      if (tickets.mode === "live") {
        const progress = new Array(photos.length).fill(0);
        await Promise.all(
          tickets.uploads.map((t, i) =>
            uploadBlob(t.url, tickets.apiKey, photos[i].blob, (r) => {
              progress[i] = r;
              setStatus({
                kind: "uploading",
                progress: progress.reduce((a, b) => a + b, 0) / photos.length,
              });
            }),
          ),
        );
        paths = tickets.uploads.map((t) => t.path);
      } else {
        for (let i = 1; i <= 10; i++) {
          await new Promise((r) => window.setTimeout(r, 60));
          setStatus({ kind: "uploading", progress: i / 10 });
        }
      }
      setStatus({ kind: "submitting" });
      const res = await submitApplication({
        slug,
        values,
        photos: paths,
        photoCount: photos.length,
        consent,
        website: honeypot.current?.value ?? "",
        startedAt,
      });
      if (!res.ok) {
        setStatus({ kind: "error", message: res.message });
        if (res.step) {
          const idx = steps.findIndex((s) => s.id === res.step);
          if (idx >= 0 && idx !== stepIndex) {
            setStepIndex(idx);
            if (res.fieldErrors) setErrors(res.fieldErrors);
          }
        }
        return;
      }
      clearSaved(slug);
      dirty.current = false;
      setStatus({
        kind: "done",
        name: display(values.fullName).split(" ")[0] ?? "",
        email: display(values.email),
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Slanje nije uspjelo. Provjeri internet vezu i pokušaj ponovo.",
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (isLast) submit();
    else next();
  };

  const startOver = () => {
    clearSaved(slug);
    setValues({});
    setErrors({});
    setStepIndex(0);
    setMaxReached(0);
    setRestored(false);
    dirty.current = false;
  };

  const reviewSections = useMemo(
    () =>
      steps
        .map((s, i) => ({
          step: s,
          index: i,
          rows: s.fields
            .filter((f) => isVisible(f, values) && display(values[f.id]))
            .map((f) => ({
              label: f.label,
              value: `${display(values[f.id])}${f.suffix ? ` ${f.suffix}` : ""}`,
            })),
        }))
        .filter((s) => s.rows.length),
    [steps, values],
  );

  if (status.kind === "done") {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <Success
          name={status.name}
          email={status.email}
          packageName={packageName}
          checkIn={checkIn}
          instagram={instagram}
          headingRef={headingRef}
        />
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className="grid scroll-mt-28 gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12 xl:grid-cols-[19rem_1fr]"
    >
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="rounded-lg border border-brand-line bg-brand-surface p-6">
            <p className="text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase">
              Prijava za paket
            </p>
            <p className="mt-2 font-display text-4xl leading-none">{packageName}</p>
            <p className="mt-3 text-sm text-white/70">
              <span className="font-semibold text-white">{price}</span> · {checkIn}
            </p>
            <Link
              href={backHref}
              className="mt-4 inline-flex text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              Detalji paketa
            </Link>
          </div>
          <ol className="mt-6 space-y-1" aria-label="Koraci prijave">
            {steps.map((s, i) => {
              const done = i < stepIndex || (i <= maxReached && i !== stepIndex);
              const current = i === stepIndex;
              const reachable = i <= maxReached;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    disabled={!reachable || busy}
                    onClick={() => reachable && goTo(i)}
                    aria-current={current ? "step" : undefined}
                    className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      current ? "bg-brand-surface" : reachable ? "hover:bg-brand-surface/60" : ""
                    } disabled:cursor-default`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full border text-sm font-bold transition-colors duration-300 ${
                        current
                          ? "border-brand-yellow bg-brand-yellow text-brand-black"
                          : done
                            ? "border-brand-yellow text-brand-yellow"
                            : "border-white/20 text-white/45"
                      }`}
                    >
                      {done && !current ? (
                        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
                          <path
                            d="m3 8.5 3 3 7-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={`text-[15px] font-semibold ${current ? "text-white" : reachable ? "text-white/75" : "text-white/40"}`}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 flex gap-3 rounded-md border border-brand-line p-4 text-sm leading-relaxed text-white/60">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-brand-yellow"
            >
              <path
                d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Odgovore i slike vidi samo Adnan. Napredak se čuva na ovom uređaju dok ne pošalješ
            prijavu.
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="font-semibold text-white/70">
              Korak {stepIndex + 1} od {steps.length}
            </p>
            <p className="font-semibold text-brand-yellow">{step.short}</p>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Napredak prijave"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={stepIndex + 1}
          >
            <div
              className="h-full rounded-full bg-brand-yellow transition-[width] duration-500 ease-out"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {restored && stepIndex < steps.length - 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-3 text-sm lg:mt-0 lg:mb-6">
            <p className="text-white/85">
              Odgovori od prošlog puta su sačuvani. Slike treba dodati ponovo.
            </p>
            <button
              type="button"
              onClick={startOver}
              className="font-semibold text-brand-yellow underline-offset-4 hover:underline"
            >
              Počni ispočetka
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="mt-6 lg:mt-0">
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Web stranica</label>
            <input
              ref={honeypot}
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div
            key={step.id}
            className="animate-step rounded-lg border border-brand-line bg-brand-surface p-5 sm:p-8"
          >
            <p className="hidden text-xs font-bold tracking-[0.18em] text-brand-yellow uppercase lg:block">
              Korak {stepIndex + 1} od {steps.length}
            </p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-4xl leading-none outline-none sm:text-5xl lg:mt-2"
            >
              {step.title}
            </h2>
            {step.intro && <p className="mt-3 max-w-xl text-white/65">{step.intro}</p>}

            <div className="mt-8">
              {step.kind === "photos" ? (
                <PhotoStep
                  photos={photos}
                  processing={processing}
                  error={photoError}
                  dragOver={dragOver}
                  setDragOver={setDragOver}
                  onFiles={addFiles}
                  onRemove={removePhoto}
                />
              ) : step.kind === "review" ? (
                <ReviewStep
                  sections={reviewSections}
                  photos={photos}
                  onEdit={goTo}
                  consent={consent}
                  consentError={consentError}
                  onConsent={(v) => {
                    setConsent(v);
                    if (v) setConsentError(false);
                  }}
                  photoStepIndex={steps.findIndex((s) => s.kind === "photos")}
                />
              ) : (
                <FieldsGrid
                  step={step}
                  values={values}
                  errors={errors}
                  setValue={setValue}
                  blurField={blurField}
                />
              )}
            </div>
          </div>

          {status.kind === "error" && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-[#ff8a7a]/50 bg-[#ff8a7a]/10 px-4 py-3 text-sm font-semibold text-[#ffb3a8]"
            >
              {status.message}
            </div>
          )}

          <div className="sticky bottom-0 z-10 -mx-5 mt-4 border-t border-brand-line bg-brand-black/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-2">
            <div className="flex items-center gap-3">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={back}
                  disabled={busy}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md border border-white/15 px-5 font-semibold text-white transition-colors hover:border-white/40 disabled:opacity-50"
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
                    <path
                      d="M16 10H4m0 0 5-5m-5 5 5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Nazad</span>
                </button>
              )}
              <button
                type="submit"
                disabled={busy}
                className="group relative inline-flex min-h-13 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md bg-brand-yellow px-6 text-[15px] font-bold tracking-wide text-brand-black transition-colors hover:bg-[#f5c24a] disabled:cursor-wait sm:flex-none sm:px-8"
              >
                {status.kind === "uploading" && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 bg-black/10 transition-[width] duration-200"
                    style={{ width: `${Math.round(status.progress * 100)}%` }}
                  />
                )}
                <span className="relative">
                  {status.kind === "uploading"
                    ? `Šaljem slike ${Math.round(status.progress * 100)}%`
                    : status.kind === "submitting"
                      ? "Šaljem prijavu..."
                      : isLast
                        ? "Pošalji prijavu"
                        : "Dalje"}
                </span>
                {!busy && (
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="relative size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M4 10h12m0 0-5-5m5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <p className="ml-auto hidden text-sm text-white/45 sm:block">
                {isLast ? "Prijava te ni na šta ne obavezuje." : "Napredak se čuva automatski."}
              </p>
            </div>
          </div>
        </form>
        <p className="sr-only" aria-live="polite">
          Korak {stepIndex + 1} od {steps.length}: {step.title}
        </p>
      </div>
    </div>
  );
}

function FieldsGrid({
  step,
  values,
  errors,
  setValue,
  blurField,
}: {
  step: Step;
  values: Answers;
  errors: Record<string, string>;
  setValue: (id: string, v: string | string[]) => void;
  blurField: (id: string) => void;
}) {
  return (
    <div className="grid gap-7 sm:grid-cols-2">
      {step.fields.map((field) =>
        isVisible(field, values) ? (
          <div
            key={field.id}
            className={`${field.half ? "" : "sm:col-span-2"} ${field.showIf ? "animate-step" : ""}`}
          >
            <FieldInput
              field={field}
              value={values[field.id]}
              error={errors[field.id]}
              onChange={(v) => setValue(field.id, v)}
              onBlur={() => blurField(field.id)}
            />
          </div>
        ) : null,
      )}
    </div>
  );
}

function PhotoStep({
  photos,
  processing,
  error,
  dragOver,
  setDragOver,
  onFiles,
  onRemove,
}: {
  photos: Photo[];
  processing: number;
  error: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onFiles: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
}) {
  const full = photos.length >= PHOTO_MAX;
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {photoRules.map((rule, i) => (
          <li
            key={rule}
            className="flex gap-3 rounded-md bg-brand-black/60 p-4 text-sm leading-snug text-white/75"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-yellow font-display text-base leading-none text-brand-black">
              {i + 1}
            </span>
            {rule}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-white/55">
        Preporuka: tri slike, sprijeda, bočno i s leđa. Najviše {PHOTO_MAX}.
      </p>

      <label
        htmlFor="photos"
        onDragOver={(e) => {
          e.preventDefault();
          if (!full) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!full) onFiles(e.dataTransfer.files);
        }}
        className={`mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-[border-color,background-color] duration-200 ${
          full
            ? "cursor-not-allowed border-white/10 opacity-60"
            : dragOver
              ? "border-brand-yellow bg-brand-yellow/10"
              : error
                ? "border-[#ff8a7a]/60 hover:border-brand-yellow"
                : "border-white/20 hover:border-brand-yellow hover:bg-brand-yellow/5"
        }`}
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-yellow text-brand-black">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7">
            <path
              d="M4 8h3l2-3h6l2 3h3v11H4V8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <span className="mt-4 text-[15px] font-semibold text-white">
          {full ? "Dodan je maksimalan broj slika" : "Dodaj slike"}
        </span>
        <span className="mt-1 text-sm text-white/55">
          {full ? "Ukloni neku ako želiš drugu" : "Klikni ili prevuci slike ovdje. JPG ili PNG."}
        </span>
        <input
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          disabled={full}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-[#ff8a7a]">
          {error}
        </p>
      )}

      {(photos.length > 0 || processing > 0) && (
        <>
          <p className="mt-6 text-sm font-semibold text-white/70">
            {photos.length} od {PHOTO_MAX} slika
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {photos.map((p, i) => (
              <li
                key={p.id}
                className="relative aspect-[3/4] animate-step overflow-hidden rounded-md bg-brand-black"
              >
                <Image
                  src={p.url}
                  alt={`Slika ${i + 1}`}
                  fill
                  unoptimized
                  sizes="160px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label={`Ukloni sliku ${i + 1}`}
                  className="absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-full bg-brand-black/80 text-white transition-colors hover:bg-[#ff8a7a] hover:text-brand-black"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
                    <path
                      d="m4 4 8 8m0-8-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
            {Array.from({ length: processing }).map((_, i) => (
              <li
                key={`p-${i}`}
                className="relative grid aspect-[3/4] place-items-center overflow-hidden rounded-md bg-brand-black"
              >
                <span className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-brand-yellow" />
                <span className="sr-only">Obrađujem sliku</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ReviewStep({
  sections,
  photos,
  onEdit,
  consent,
  consentError,
  onConsent,
  photoStepIndex,
}: {
  sections: { step: Step; index: number; rows: { label: string; value: string }[] }[];
  photos: Photo[];
  onEdit: (i: number) => void;
  consent: boolean;
  consentError: boolean;
  onConsent: (v: boolean) => void;
  photoStepIndex: number;
}) {
  return (
    <div>
      <p className="text-white/65">Provjeri odgovore prije slanja. Svaki dio možeš izmijeniti.</p>
      <div className="mt-6 divide-y divide-brand-line rounded-md border border-brand-line">
        {sections.map((s) => (
          <section key={s.step.id} className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase">
                {s.step.title}
              </h3>
              <button
                type="button"
                onClick={() => onEdit(s.index)}
                className="min-h-10 rounded-sm px-2 text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                Uredi
              </button>
            </div>
            <dl className="mt-2 grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
              {s.rows.map((r) => (
                <div key={r.label} className="contents">
                  <dt className="text-sm text-white/50">{r.label}</dt>
                  <dd className="-mt-2 text-[15px] break-words whitespace-pre-line text-white sm:mt-0">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <section className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-bold tracking-[0.16em] text-brand-yellow uppercase">
              Slike ({photos.length})
            </h3>
            <button
              type="button"
              onClick={() => onEdit(photoStepIndex)}
              className="min-h-10 rounded-sm px-2 text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              Uredi
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {photos.map((p, i) => (
              <li key={p.id} className="relative size-16 overflow-hidden rounded-sm bg-brand-black">
                <Image
                  src={p.url}
                  alt={`Slika ${i + 1}`}
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <label
        htmlFor="consent"
        className={`mt-6 flex cursor-pointer gap-4 rounded-md border p-4 transition-colors ${
          consentError
            ? "border-[#ff8a7a]/70 bg-[#ff8a7a]/5"
            : consent
              ? "border-brand-yellow/60 bg-brand-yellow/5"
              : "border-white/15 hover:border-white/30"
        }`}
      >
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsent(e.target.checked)}
          aria-invalid={consentError || undefined}
          aria-describedby={consentError ? "consent-err" : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-sm border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-yellow peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-brand-surface ${
            consent ? "border-brand-yellow bg-brand-yellow text-brand-black" : "border-white/40"
          }`}
        >
          {consent && (
            <svg viewBox="0 0 16 16" className="size-4">
              <path
                d="m3 8.5 3 3 7-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="text-[15px] leading-relaxed text-white/85">
          Pristajem da Adnan Gosto obrađuje moje podatke iz ove prijave, uključujući fotografije i
          podatke o zdravlju, isključivo radi procjene i pripreme saradnje, kako je opisano u{" "}
          <Link
            href="/politika-privatnosti"
            target="_blank"
            className="font-semibold text-brand-yellow underline underline-offset-4"
          >
            Politici privatnosti
          </Link>
          .
        </span>
      </label>
      {consentError && (
        <p id="consent-err" role="alert" className="mt-2 text-sm font-semibold text-[#ff8a7a]">
          Za slanje prijave potrebna je tvoja saglasnost.
        </p>
      )}
    </div>
  );
}

function Success({
  name,
  email,
  packageName,
  checkIn,
  instagram,
  headingRef,
}: {
  name: string;
  email: string;
  packageName: string;
  checkIn: string;
  instagram: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const steps = [
    { title: "Pregledam prijavu", text: "Pročitam odgovore i pogledam slike." },
    { title: "Javljam ti se na mail", text: "Dogovaramo početak i način uplate." },
    { title: "Dobiješ početni plan", text: `Plan treninga i prehrane. ${checkIn}.` },
  ];
  return (
    <div className="mx-auto max-w-2xl py-6 text-center lg:py-12">
      <div className="mx-auto grid size-24 place-items-center rounded-full bg-brand-yellow text-brand-black">
        <svg viewBox="0 0 48 48" aria-hidden="true" className="size-12">
          <path
            d="m12 25 8 8 16-17"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draw-check"
          />
        </svg>
      </div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 animate-step font-display text-5xl leading-[0.9] outline-none sm:text-7xl"
      >
        Prijava je poslana{name ? `, ${name}` : ""}
      </h2>
      <p className="mx-auto mt-5 max-w-md animate-step text-lg text-white/75">
        Tvoja prijava za paket <span className="font-semibold text-white">{packageName}</span> je
        stigla. Potvrda je otišla na{" "}
        <span className="font-semibold [overflow-wrap:anywhere] text-white">{email}</span>. Ako je
        ne vidiš, provjeri spam.
      </p>
      <ol className="mt-10 grid gap-3 text-left sm:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="animate-step rounded-lg border border-brand-line bg-brand-surface p-5"
            style={{ animationDelay: `${150 + i * 90}ms` }}
          >
            <span className="font-display text-3xl leading-none text-brand-yellow">0{i + 1}</span>
            <p className="mt-2 font-semibold text-white">{s.title}</p>
            <p className="mt-1 text-sm text-white/60">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-white/50">
        Vikendom ne radim. Prijave stigle u petak ili subotu obrađujem od ponedjeljka.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-md bg-brand-yellow px-6 font-semibold text-brand-black transition-colors hover:bg-[#f5c24a]"
        >
          Nazad na početnu
        </Link>
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center rounded-md border border-white/15 px-6 font-semibold text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"
        >
          Prati me na Instagramu
        </a>
      </div>
    </div>
  );
}
