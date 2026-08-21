import { SectionTitle } from "@/components/SectionTitle";
import { missionVision, valueGroups } from "@/data/projectPillars";
import { cn } from "@/lib/utils";

const cardColors = {
  coral: "bg-coral-50 text-coral-600 ring-coral-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  leaf: "bg-leaf-50 text-leaf-600 ring-leaf-100",
  grape: "bg-grape-50 text-grape-600 ring-grape-100",
} as const;

const chipColors = {
  leaf: "bg-leaf-100 text-leaf-700",
  grape: "bg-grape-100 text-grape-700",
} as const;

export function ProjectSection() {
  return (
    <section id="proyecto-educativo" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Identidad institucional" title="Nuestro Proyecto Educativo" />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {missionVision.map((item, index) => (
            <article
              key={item.label}
              className="reveal rounded-3xl bg-cream-soft p-7 shadow-card ring-1 ring-ink/5 sm:p-8"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div
                className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-4",
                  cardColors[item.color]
                )}
              >
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">{item.label}</h3>
              <p className="mt-3 text-left text-[15px] leading-relaxed text-ink-soft sm:text-justify">
                {item.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {valueGroups.map((group, index) => (
            <article
              key={group.label}
              className="reveal rounded-3xl bg-cream-soft p-7 shadow-card ring-1 ring-ink/5 sm:p-8"
              style={{ transitionDelay: `${(index + 2) * 80}ms` }}
            >
              <div
                className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-4",
                  cardColors[group.color]
                )}
              >
                <group.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">{group.label}</h3>

              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((chip) => (
                  <li
                    key={chip}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-bold font-display",
                      chipColors[group.color]
                    )}
                  >
                    {chip}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-left text-[15px] leading-relaxed text-ink-soft sm:text-justify">
                {group.summary}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
