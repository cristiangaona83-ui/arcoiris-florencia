import type { ReactNode } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { Timeline } from "@/components/Timeline";
import { useInstitutionalContent } from "@/contexts/InstitutionalContentContext";

/**
 * Convierte los tramos marcados con **texto** en <strong>, para permitir
 * que el resaltado se edite desde el admin como parte del propio texto.
 */
function renderBoldMarkup(text: string): ReactNode[] {
  return text
    .split(/(\*\*.+?\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part, i) => {
      const match = part.match(/^\*\*(.+)\*\*$/);
      return match ? (
        <strong key={i} className="font-bold text-ink">
          {match[1]}
        </strong>
      ) : (
        part
      );
    });
}

export function HistorySection() {
  const { historyParagraphs } = useInstitutionalContent();

  return (
    <section id="historia" className="bg-cream-soft py-14 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Trayectoria e identidad" title="Nuestra Historia" />

        <div className="reveal mx-auto mt-8 max-w-3xl space-y-6 text-left text-lg leading-[1.8] text-ink-soft [hyphens:auto] sm:text-justify">
          {historyParagraphs.map((paragraph, i) => (
            <p key={i}>{renderBoldMarkup(paragraph)}</p>
          ))}
        </div>

        <h3 className="mt-16 text-center font-display text-2xl font-bold text-ink sm:text-3xl">
          Nuestra trayectoria
        </h3>

        <div className="mt-12">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
