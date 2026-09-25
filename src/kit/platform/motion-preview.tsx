'use client';

import { useEffect, useRef, useState } from 'react';

import type { MotionPreview as Preview } from '../types';

/**
 * **Bewegte Vorschau** auf einer Kachel — Verhalten der Plattform, bitte nicht nachbauen.
 *
 * - Maus: startet beim Überfahren (Daumenkino, dann ggf. Clip), stoppt beim Verlassen.
 * - Touch: nur über den runden Knopf (32 px). Er sitzt standardmäßig **unten links**; ein Template darf
 *   die Ecke über `buttonClassName` ändern, aber nie über die Laufzeit-Angabe (unten rechts) legen.
 * - „Bewegung reduzieren" im Betriebssystem ⇒ keine Vorschau.
 * - Ohne JavaScript bleibt das Standbild stehen.
 *
 * Das Template legt die Komponente als Ebene über das Vorschaubild (`absolute inset-0`).
 */
export function MotionPreview({
  preview,
  playLabel,
  pauseLabel,
  buttonClassName = 'bottom-2 left-2'
}: {
  preview: Preview;
  playLabel: string;
  pauseLabel: string;
  buttonClassName?: string;
}) {
  const [aktiv, setAktiv] = useState(false);
  const [bild, setBild] = useState(0);
  const [reduziert, setReduziert] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sprite = preview.sprite;

  useEffect(() => {
    setReduziert(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!aktiv || !sprite) return;
    const schritt = Math.max(120, Math.round(sprite.loopMs / sprite.tiles));
    timer.current = setInterval(() => setBild((b) => (b + 1) % sprite.tiles), schritt);
    return () => {
      if (timer.current) clearInterval(timer.current);
      setBild(0);
    };
  }, [aktiv, sprite]);

  if (reduziert || (!sprite && !preview.clipUrl)) return null;

  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setAktiv(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setAktiv(false)}
    >
      {aktiv && preview.clipUrl && (
        <video src={preview.clipUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      )}
      {aktiv && !preview.clipUrl && sprite && (
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url("${sprite.url}")`,
            backgroundSize: `${sprite.tiles * 100}% 100%`,
            backgroundPosition: `${(bild / Math.max(1, sprite.tiles - 1)) * 100}% 0`
          }}
        />
      )}
      <button
        type="button"
        tabIndex={-1}
        aria-label={aktiv ? pauseLabel : playLabel}
        onClick={(e) => {
          // Tippen auf den Knopf öffnet NICHT den Inhalt (die Kachel ist ein Link).
          e.preventDefault();
          e.stopPropagation();
          setAktiv((a) => !a);
        }}
        className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs text-white [@media(hover:hover)]:hidden ${buttonClassName}`}
      >
        {aktiv ? '❚❚' : '▶'}
      </button>
    </div>
  );
}
