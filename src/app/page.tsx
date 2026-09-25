import { PAGE_KEYS, PART_KEYS } from '@/kit/template';
import { paletteChecks, THEME_KEYS, THEME_LABELS } from '@/kit/theme';
import { SCENARIO_KEYS, SCENARIOS } from '@/mock/scenarios';
import { TEMPLATES } from '@/templates/registry';

/**
 * Übersicht des Kits: Templates, Vollständigkeit, Szenarien, Kontrast-Prüfung der Farbwelten.
 * Bewusst neutral gestaltet — sie gehört zum Werkzeug, nicht zum Template.
 */
export default function Uebersicht() {
  const templates = Object.values(TEMPLATES);
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10 font-sans text-zinc-900">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Template-Kit · Fan-Seite</h1>
        <p className="max-w-3xl text-sm text-zinc-600">
          Jede Seite lässt sich mit Beispieldaten in jedem Szenario, jeder Farbwelt und beiden Sprachen ansehen. Die Leiste unter
          jeder Vorschauseite schaltet um. Anleitung: <code>README.md</code> · Regeln: <code>CLAUDE.md</code> · Datenvertrag:{' '}
          <code>src/kit/types.ts</code> + <code>src/kit/template.ts</code>.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Szenarien</h2>
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          {SCENARIO_KEYS.map((k) => (
            <li key={k} className="rounded-lg border border-zinc-200 p-3">
              <strong>{SCENARIOS[k].label}</strong> <code className="text-xs text-zinc-500">?s={k}</code>
              <p className="text-zinc-600">{SCENARIOS[k].description}</p>
            </li>
          ))}
        </ul>
      </section>

      {templates.map((tpl) => (
        <section key={tpl.key} className="space-y-4">
          <h2 className="text-xl font-semibold">
            {tpl.meta.name.de} <code className="text-sm font-normal text-zinc-500">{tpl.key}</code>
          </h2>
          <p className="text-sm text-zinc-600">{tpl.meta.description.de}</p>

          <div>
            <h3 className="mb-2 font-medium">Vollständigkeit</h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[...PART_KEYS, ...PAGE_KEYS].map((k) => {
                const da = !!tpl[k as keyof typeof tpl];
                const istSeite = (PAGE_KEYS as readonly string[]).includes(k);
                const cls = `rounded px-2 py-1 ${da ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`;
                return istSeite ? (
                  <a key={k} href={`/v/${tpl.key}/${k}?s=voll&w=gothic`} className={cls}>
                    {da ? '✓' : '○'} {k}
                  </a>
                ) : (
                  <span key={k} className={cls}>
                    {da ? '✓' : '○'} {k}
                  </span>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-zinc-500">✓ = vom Template geliefert · ○ = fehlt noch (Vorschau zeigt dann das Basis-Template)</p>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Farbwelten — Kontrast (Soll ≥ 4,5)</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {THEME_KEYS.map((w) => {
                const p = tpl.palettes[w];
                return (
                  <a key={w} href={`/v/${tpl.key}/Home?s=voll&w=${w}`} className="block rounded-lg border border-zinc-200 p-3 text-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <strong className="text-sm">{THEME_LABELS[w].de}</strong>
                      <span className="flex gap-0.5">
                        {[p.background, p.surface, p.text, p.primary, p.accent].map((c, i) => (
                          <span key={i} className="h-4 w-4 rounded-sm border border-zinc-300" style={{ background: c }} />
                        ))}
                      </span>
                    </div>
                    {paletteChecks(p).map((c) => (
                      <div key={c.label} className="flex justify-between">
                        <span>{c.label}</span>
                        <span className={c.ok ? 'text-emerald-700' : 'font-bold text-red-600'}>
                          {c.ratio} {c.ok ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
