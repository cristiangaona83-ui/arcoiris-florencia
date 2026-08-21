import { Download, FileText } from "lucide-react";
import type { InstitutionalDocument } from "@/data/documents";

export function DocumentCard({ doc }: { doc: InstitutionalDocument }) {
  return (
    <article className="reveal flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink/5 sm:p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
        <FileText className="h-7 w-7" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-bold text-ink">{doc.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{doc.description}</p>
      </div>

      <a
        href={doc.file}
        download
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white transition-colors hover:bg-sky-600"
        aria-label={`Descargar ${doc.name}`}
      >
        <Download className="h-5 w-5" aria-hidden="true" />
      </a>
    </article>
  );
}
