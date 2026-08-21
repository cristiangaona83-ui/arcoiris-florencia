import { FolderOpen } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { DocumentCard } from "@/components/DocumentCard";
import { documents } from "@/data/documents";

export function DocumentsSection() {
  return (
    <section id="documentos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Transparencia institucional"
          title="Documentos Institucionales"
          description="Proyecto Educativo Institucional, reglamentos, protocolos, calendarios y comunicaciones para las familias."
        />

        <div className="mt-12">
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="reveal flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-sky-200 bg-sky-50 p-12 text-center">
              <FolderOpen className="h-12 w-12 text-sky-400" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-ink">
                Próximamente disponibles
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-ink-soft">
                Aún no se han incorporado documentos institucionales. Aquí se
                publicarán el Proyecto Educativo Institucional, el Reglamento
                Interno, protocolos, calendarios y comunicaciones para las
                familias.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
