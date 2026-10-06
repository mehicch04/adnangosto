"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Photo = { src: string; alt: string };

const SPEED = 40;
const RESUME_AFTER = 2500;

function resumeTime() {
  return performance.now() + RESUME_AFTER;
}

export function TransformationsGrid({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const state = useRef({
    pos: 0,
    paused: false,
    resumeAt: 0,
    dragging: false,
    startX: 0,
    startPos: 0,
    moved: false,
  });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    let frame = 0;
    let last = performance.now();
    let visible = false;

    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (s.pos >= half) s.pos -= half;
      if (s.pos < 0) s.pos += half;
    };

    const tick = (t: number) => {
      const dt = Math.min(t - last, 64) / 1000;
      last = t;
      if (visible && !reduce && !s.paused && !s.dragging && t >= s.resumeAt) {
        s.pos += SPEED * dt;
        wrap();
        el.scrollLeft = s.pos;
      }
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    const hold = () => {
      s.resumeAt = resumeTime();
    };
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - s.pos) > 2) {
        s.pos = el.scrollLeft;
        wrap();
        if (s.pos !== el.scrollLeft) el.scrollLeft = s.pos;
        hold();
      }
    };
    const onEnter = () => (s.paused = true);
    const onLeave = () => {
      s.paused = false;
      hold();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", hold, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", hold);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    const s = state.current;
    s.dragging = true;
    s.moved = false;
    s.startX = e.clientX;
    s.startPos = track.current.scrollLeft;
    track.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    const el = track.current;
    if (!s.dragging || !el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    el.scrollLeft = s.startPos - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.resumeAt = resumeTime();
    track.current?.releasePointerCapture(e.pointerId);
  };

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const w = card ? card.getBoundingClientRect().width + 16 : 400;
    state.current.resumeAt = resumeTime();
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <div className="relative mt-12 lg:mt-16">
      <div
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => state.current.moved && e.preventDefault()}
        className="transformations-track cursor-grab overflow-x-auto overscroll-x-contain select-none active:cursor-grabbing"
        tabIndex={0}
        role="region"
        aria-label="Transformacije klijenata, prije i poslije"
      >
        <ul className="flex w-max gap-4 px-5 lg:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))]">
          {[...photos, ...photos].map((p, i) => (
            <li
              key={`${p.src}-${i}`}
              aria-hidden={i >= photos.length}
              className="w-[78vw] shrink-0 sm:w-[360px] lg:w-[420px]"
            >
              <figure className="relative overflow-hidden rounded-lg bg-brand-paper-line shadow-[0_20px_40px_-24px_rgba(10,10,10,0.45)]">
                <Image
                  src={p.src}
                  alt={i >= photos.length ? "" : p.alt}
                  width={720}
                  height={720}
                  draggable={false}
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 78vw"
                  className="aspect-square w-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-sm bg-brand-black/80 px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-white uppercase">
                  Prije
                </span>
                <span className="absolute top-3 right-3 rounded-sm bg-brand-yellow px-2.5 py-1 text-[11px] font-bold tracking-[0.16em] text-brand-black uppercase">
                  Poslije
                </span>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between gap-4 px-5">
        <p className="text-sm text-brand-ink-muted">Povuci mišem, prstom ili koristi strelice.</p>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              aria-label={dir === -1 ? "Prethodna transformacija" : "Sljedeća transformacija"}
              className="grid size-12 place-items-center rounded-full border-2 border-brand-black transition-colors hover:bg-brand-black hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={`size-5 ${dir === -1 ? "rotate-180" : ""}`}
              >
                <path
                  d="M5 12h14m0 0-6-6m6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
