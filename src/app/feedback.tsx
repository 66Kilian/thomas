'use client';

import { useEffect, useMemo, useState } from 'react';

import { FEEDBACK } from './feedback-items';

/** Abstimmung mit dem Entwickler: je Punkt Gefällt / Gefällt nicht / Gefiele, wenn … + Kommentar. Nur Präsentation. */

type Verdict = 'ja' | 'nein' | 'wenn';
type Answer = { v?: Verdict; c?: string };
const KEY = 'aurora_feedback_v1';

const VERDICTS: { v: Verdict; label: string; on: string }[] = [
  { v: 'ja', label: 'Gefällt mir', on: 'border-emerald-400 bg-emerald-500/20 text-emerald-200' },
  { v: 'nein', label: 'Gefällt mir nicht', on: 'border-red-400 bg-red-500/20 text-red-200' },
  { v: 'wenn', label: 'Gefiele mir, wenn …', on: 'border-amber-400 bg-amber-500/20 text-amber-100' }
];
const WORD: Record<Verdict, string> = { ja: 'Gefällt mir', nein: 'Gefällt mir nicht', wenn: 'Gefiele mir, wenn …' };

export function Feedback() {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw) as { name?: string; answers?: Record<string, Answer> };
        setName(d.name ?? '');
        setAnswers(d.answers ?? {});
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ name, answers }));
    } catch {}
  }, [name, answers, loaded]);

  const all = FEEDBACK.flatMap((g) => g.items);
  const done = all.filter((i) => answers[i.id]?.v).length;
  const set = (id: string, a: Answer) => setAnswers((p) => ({ ...p, [id]: { ...p[id], ...a } }));

  const report = useMemo(() => {
    const date = new Date().toLocaleDateString('de-AT');
    const lines = [`# Rückmeldung Aurora${name ? ` — ${name}` : ''} (${date})`, '', `Beantwortet: ${done} von ${all.length}`, ''];
    for (const g of FEEDBACK) {
      lines.push(`## ${g.title}`, '');
      for (const i of g.items) {
        const a = answers[i.id] ?? {};
        lines.push(`- [${a.v === 'ja' ? 'x' : a.v ? '~' : ' '}] **${i.title}** — ${a.v ? WORD[a.v] : 'offen'}`);
        if (a.c?.trim()) lines.push(`  - Kommentar: ${a.c.trim().replace(/\n+/g, ' ')}`);
        if (i.backend) lines.push(`  - Backend: ${i.backend}`);
      }
      lines.push('');
    }
    const wanted = all.filter((i) => answers[i.id]?.v && answers[i.id]?.v !== 'nein' && i.backend);
    lines.push('## Backend-Änderungen für gewünschte Punkte', '');
    lines.push(...(wanted.length ? wanted.map((i) => `- ${i.title}: ${i.backend}`) : ['- keine']));
    return lines.join('\n') + '\n';
  }, [answers, name, done, all]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([report], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora-rueckmeldung${name ? '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="rueckmeldung" className="mt-24 scroll-mt-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e0558c]">Für die Umsetzung</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Rückmeldung</h2>
      <p className="mt-3 max-w-2xl text-white/60">
        Bitte jeden Punkt ansehen und markieren: <b className="text-white">Gefällt mir</b>, <b className="text-white">Gefällt mir nicht</b> oder{' '}
        <b className="text-white">Gefiele mir, wenn …</b> (dann bitte kurz schreiben, was anders sein soll). Unten als Text kopieren oder als Datei
        herunterladen und zurückschicken. Punkte mit <span className="rounded bg-amber-500/20 px-1.5 text-amber-100">Backend</span> brauchen eine
        Änderung an Plattform/Vertrag — alles andere ist reines Frontend mit dem vorhandenen Vertrag.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 text-sm text-white/70">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Thomas" className="h-10 w-48 rounded-lg border border-white/15 bg-white/5 px-3 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none" />
        </label>
        <span className="text-sm text-white/50">
          {done} von {all.length} beantwortet
        </span>
        <span className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full bg-[#e0558c] transition-all" style={{ width: `${(done / all.length) * 100}%` }} />
        </span>
      </div>

      <div className="mt-8 space-y-10">
        {FEEDBACK.map((g) => (
          <div key={g.title}>
            <h3 className="mb-3 text-lg font-bold text-white/80">{g.title}</h3>
            <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {g.items.map((i) => {
                const a = answers[i.id] ?? {};
                return (
                  <div key={i.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{i.title}</p>
                        {i.href && (
                          <a href={i.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70 hover:border-white/50 hover:text-white">
                            Ansehen ↗
                          </a>
                        )}
                      </div>
                      {i.text && <p className="mt-1 text-sm leading-6 text-white/55">{i.text}</p>}
                      {i.backend && (
                        <p className="mt-2 text-xs leading-5 text-amber-100/90">
                          <span className="mr-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 font-bold">Backend</span>
                          {i.backend}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {VERDICTS.map((d) => (
                          <button
                            key={d.v}
                            type="button"
                            aria-pressed={a.v === d.v}
                            onClick={() => set(i.id, { v: a.v === d.v ? undefined : d.v })}
                            className={`h-9 rounded-full border px-3.5 text-sm font-semibold transition ${a.v === d.v ? d.on : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'}`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={a.c ?? ''}
                        onChange={(e) => set(i.id, { c: e.target.value })}
                        rows={a.v === 'wenn' || a.c ? 2 : 1}
                        placeholder={a.v === 'wenn' ? 'Was soll anders sein?' : 'Kommentar (optional)'}
                        className="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 z-10 mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#0c0b10]/90 p-4 backdrop-blur-xl">
        <span className="text-sm text-white/60">
          {done} von {all.length} beantwortet · wird in diesem Browser gespeichert
        </span>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copy} className="h-11 rounded-lg bg-[#e0558c] px-5 text-sm font-bold text-[#1a0610] hover:opacity-90">
            {copied ? 'Kopiert ✓' : 'Als Text kopieren'}
          </button>
          <button type="button" onClick={download} className="h-11 rounded-lg border border-white/20 px-5 text-sm font-semibold hover:bg-white/10">
            Als Datei herunterladen
          </button>
        </div>
      </div>
    </section>
  );
}
