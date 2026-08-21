import { SectionTitle } from "@/components/SectionTitle";
import { pedagogyItems } from "@/data/pedagogy";

export function PedagogySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-grape-50 to-white py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nuestra propuesta pedagógica"
          title="Aprender es descubrir"
          description="Los ámbitos de experiencias que buscamos potenciar día a día junto a niños y niñas."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {pedagogyItems.map((item, index) => (
            <div
              key={item.label}
              className="reveal flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-grape-50 text-grape-500">
                <item.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-ink">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
