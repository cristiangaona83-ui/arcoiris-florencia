import { SectionTitle } from "@/components/SectionTitle";
import { projectPillars } from "@/data/projectPillars";

export function ProjectSection() {
  return (
    <section id="proyecto-educativo" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Identidad institucional"
          title="Nuestro Proyecto Educativo"
          description="Estructura preparada para incorporar la misión, visión, sellos y valores oficiales del jardín."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projectPillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="reveal rounded-3xl border-2 border-dashed border-ink/10 bg-cream-soft p-7"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-coral-500 shadow-card">
                <pillar.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{pillar.title}</h3>
              <p className="mt-3 text-sm italic leading-relaxed text-ink-faint">
                {pillar.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
