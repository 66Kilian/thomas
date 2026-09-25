import type { MediaFile } from '../types';

/**
 * Videoplayer der Plattform (Bedienelemente des Browsers, startet stumm). Im Kit gibt es keine echten
 * Videos — dann erscheint das Standbild mit dem Hinweis „Beispielvideo". Rahmen, Abstände und Ecken
 * gestaltet das Template über `className`.
 */
export function VideoPlayer({ file, className, sampleLabel }: { file: MediaFile; className?: string; sampleLabel: string }) {
  if (!file.url) {
    return (
      <div className={`relative overflow-hidden bg-black ${className ?? ''}`} style={{ aspectRatio: `${file.width} / ${file.height}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.posterUrl} alt="" className="h-full w-full object-cover opacity-80" />
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">▶ {sampleLabel}</span>
      </div>
    );
  }
  return (
    <video
      src={file.url}
      poster={file.posterUrl}
      controls
      muted
      playsInline
      preload="metadata"
      className={`w-full bg-black ${className ?? ''}`}
      style={{ aspectRatio: `${file.width} / ${file.height}` }}
    />
  );
}
