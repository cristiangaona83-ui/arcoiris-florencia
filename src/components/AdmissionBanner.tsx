import { SectionTitle } from "@/components/SectionTitle";

/**
 * Aviso de Admisión 2027, integrado como una sección normal más de la
 * página de inicio (no es un modal): usa el mismo encabezado
 * (eyebrow + título) que el resto de las secciones para que se sienta
 * parte del diseño original, y el mismo marco de tarjeta con sombra
 * suave que ya usa el Hero para la imagen de portada.
 */
export function AdmissionBanner() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Matrículas abiertas"
          title="Admisión 2027"
          description="Conoce los niveles disponibles para el proceso de matrícula del próximo año y súmate a la comunidad Arcoíris Florencia."
        />

        <div className="reveal mx-auto mt-10 max-w-xs sm:max-w-sm md:max-w-md">
          <div className="overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-soft ring-1 ring-ink/5 sm:rounded-[2rem] sm:p-3">
            <img
              src="/images/admision_2027_jardin_web.webp"
              alt="Admisión 2027 - Matrículas abiertas Jardín Infantil Arcoíris Florencia"
              className="h-auto w-full rounded-[1.25rem] sm:rounded-[1.5rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
