import { SectionTitle } from "@/components/SectionTitle";
import { LevelCard } from "@/components/LevelCard";
import { levels } from "@/data/levels";

export function LevelsSection() {
  return (
    <section id="niveles" className="bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Educación Parvularia"
          title="Nuestros Niveles"
          description="Acompañamos el desarrollo de niños y niñas en cuatro niveles educativos, cada uno con experiencias pedagógicas acordes a su etapa de crecimiento."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {levels.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
