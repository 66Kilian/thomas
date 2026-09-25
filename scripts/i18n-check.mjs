// Prüft, dass messages/de.json und messages/en.json dieselben Schlüssel haben — eine fehlende
// Übersetzung soll hier auffallen, nicht erst als leerer Text auf der Seite.
import { readFileSync } from 'node:fs';

const flach = (obj, pfad = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' ? flach(v, `${pfad}${k}.`) : [`${pfad}${k}`]));
const de = new Set(flach(JSON.parse(readFileSync('messages/de.json', 'utf8'))));
const en = new Set(flach(JSON.parse(readFileSync('messages/en.json', 'utf8'))));
const nurDe = [...de].filter((k) => !en.has(k));
const nurEn = [...en].filter((k) => !de.has(k));
if (nurDe.length || nurEn.length) {
  if (nurDe.length) console.error('Fehlt in en.json:', nurDe.join(', '));
  if (nurEn.length) console.error('Fehlt in de.json:', nurEn.join(', '));
  process.exit(1);
}
console.log(`i18n ok — ${de.size} Schlüssel in beiden Sprachen.`);
