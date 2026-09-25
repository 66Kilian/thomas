/**
 * Platzhalterbilder als SVG (Daten-URL) — das Kit enthält bewusst kein echtes Material.
 * Jedes Bild hat einen eigenen Farbverlauf und eine Beschriftung mit Format, damit man in der
 * Vorschau sieht, welche Fassung wo landet (klein 400 / groß 1200 / Titelbild 1920).
 */

function hue(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

function svgUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Vorschaubild mit Verlauf und Beschriftung „Label · B×H". */
export function placeholder(seed: string, width: number, height: number, label?: string): string {
  const h = hue(seed);
  const text = label ?? `${width}×${height}`;
  const size = Math.max(14, Math.round(Math.min(width, height) / 12));
  return svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="hsl(${h},55%,42%)"/><stop offset="1" stop-color="hsl(${(h + 60) % 360},60%,22%)"/>` +
      `</linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/>` +
      `<circle cx="${width * 0.72}" cy="${height * 0.3}" r="${Math.min(width, height) * 0.18}" fill="hsla(${(h + 180) % 360},70%,70%,0.25)"/>` +
      `<text x="50%" y="54%" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${size}" fill="rgba(255,255,255,0.85)">${text}</text>` +
      `</svg>`
  );
}

/** Bildstreifen fürs „Daumenkino": `tiles` Einzelbilder nebeneinander, je mit eigener Nummer. */
export function spriteStrip(seed: string, tiles: number, tileWidth: number, tileHeight: number): string {
  const h = hue(seed);
  let body = '';
  for (let i = 0; i < tiles; i++) {
    const x = i * tileWidth;
    const th = (h + i * 25) % 360;
    body +=
      `<rect x="${x}" y="0" width="${tileWidth}" height="${tileHeight}" fill="hsl(${th},55%,35%)"/>` +
      `<text x="${x + tileWidth / 2}" y="${tileHeight / 2 + 8}" text-anchor="middle" font-family="system-ui" font-size="24" fill="rgba(255,255,255,0.8)">${i + 1}/${tiles}</text>`;
  }
  return svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tiles * tileWidth}" height="${tileHeight}">${body}</svg>`
  );
}
