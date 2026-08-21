import { Clock } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { LevelCard } from "@/components/LevelCard";
import { levels } from "@/data/levels";
import { siteConfig } from "@/data/siteConfig";

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

        {siteConfig.schedules.length > 0 && (
          <div className="mt-16">
            <h3 className="text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Horarios
            </h3>

            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              {siteConfig.schedules.map((item, index) => (
                <div
                  key={item.label}
                  className="reveal flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink/5"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-ink">{item.label}</p>
                    <p className="text-sm text-ink-soft">{item.hours} hrs.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
