import { Button } from "@/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import { FaqAccordion } from "@/components/FaqAccordion";
import { RainbowArc, StarShape } from "@/components/decor/Decorations";

export function AdmissionSection() {
  return (
    <section id="admision" className="relative overflow-hidden bg-coral-500 py-14 sm:py-28">
      <RainbowArc className="absolute -left-6 -top-2 h-24 w-40 opacity-30" />
      <StarShape className="absolute right-14 top-14 h-6 w-6 text-white opacity-40" />
      <StarShape className="absolute left-16 bottom-10 h-4 w-4 text-white opacity-40" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold uppercase tracking-wide text-white font-display">
          Admisión y matrícula
        </span>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          ¿Quieres ser parte de Arcoíris Florencia?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
          Si deseas conocer nuestro jardín, consultar disponibilidad o
          recibir información sobre el proceso de matrícula, puedes
          comunicarte directamente con nosotros.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="#contacto" variant="ghost">
            Consultar disponibilidad
          </Button>
          <Button href="#contacto" variant="outlineLight">
            Contactarnos
          </Button>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-4xl rounded-[2.5rem] bg-cream p-6 sm:p-10">
        <SectionTitle title="Preguntas frecuentes" align="center" className="mb-10" />
        <FaqAccordion />
      </div>
    </section>
  );
}
