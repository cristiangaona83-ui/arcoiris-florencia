import { Download, FileText } from "lucide-react";
import type { InstitutionalDocument } from "@/data/documents";

export function DocumentCard({ doc }: { doc: InstitutionalDocument }) {
  return (
    <article className="reveal flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink/5 sm:flex-row sm:items-center sm:p-6">
      <div className="flex items-start gap-4 sm:flex-1 sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
          <FileText className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-snug text-ink">{doc.name}</h3>
          <p className="mt-0.5 text-sm text-ink-soft">{doc.description}</p>
        </div>
      </div>

      <a
        href={doc.file}
        download
        className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-bold font-display text-white transition-colors hover:bg-sky-600 sm:w-auto"
        aria-label={`Descargar PDF: ${doc.name}`}
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        Descargar PDF
      </a>
    </article>
  );
}
