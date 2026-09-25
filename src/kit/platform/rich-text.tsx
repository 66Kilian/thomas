import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Formatierter Text des Models (Beschreibungen, Textseiten, AGB). Kein rohes HTML — sicher.
 * Das Aussehen steuert die Klasse `.rich-text` in globals.css; ein Template darf sie überschreiben
 * (eigene Klasse über `className` mitgeben).
 */
export function RichText({ markdown, lang, className }: { markdown: string; lang?: string; className?: string }) {
  return (
    <div lang={lang} className={`rich-text ${className ?? ''}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
