import { SectionTitle } from "@/components/SectionTitle";
import { whyUsItems } from "@/data/whyUs";
import { cn } from "@/lib/utils";

const colorStyles = {
  coral: "bg-coral-50 text-coral-500",
  sun: "bg-sun-50 text-sun-600",
  leaf: "bg-leaf-50 text-leaf-600",
  sky: "bg-sky-50 text-sky-500",
} as const;

export function WhyUsSection() {
  return (
    <section className="bg-white py-14 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nuestro sello"
          title="¿Por qué Arcoíris Florencia?"
          description="Cuatro pilares que guían el trabajo diario de nuestra comunidad educativa."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsItems.map((item, index) => (
            <article
              key={item.title}
              className="reveal rounded-3xl bg-cream-soft p-7 shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1.5"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div
                className={cn(
                  "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
                  colorStyles[item.color]
                )}
              >
                <item.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
