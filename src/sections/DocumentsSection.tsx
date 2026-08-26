import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { DocumentCard } from "@/components/DocumentCard";
import { documents as staticDocuments, type InstitutionalDocument } from "@/data/documents";
import { fetchVisibleDocuments } from "@/lib/institutionalDocuments";

export function DocumentsSection() {
  // Se inicializa ya con el respaldo estático: si Supabase falla o tarda,
  // la sección nunca queda vacía, muestra los documentos actuales sin
  // interrupción.
  const [documents, setDocuments] = useState<InstitutionalDocument[]>(staticDocuments);

  useEffect(() => {
    let active = true;
    fetchVisibleDocuments()
      .then((rows) => {
        if (!active) return;
        if (rows.length === 0) return; // sin filas aún: se mantiene el respaldo estático
        setDocuments(
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? "",
            file: row.file_url ?? "",
          }))
        );
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar los documentos desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="documentos" className="bg-white py-14 sm:py-28">
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
