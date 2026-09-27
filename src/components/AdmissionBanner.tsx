/**
 * Aviso de Admisión 2027, integrado como parte normal del diseño de la
 * página de inicio (no es un modal): aparece justo debajo del encabezado,
 * antes del Hero, con el mismo tratamiento visual de tarjeta que usa esa
 * sección (marco blanco redondeado con sombra suave).
 */
export function AdmissionBanner() {
  return (
    <section className="bg-cream px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-md">
        <div className="overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-soft sm:rounded-[2rem] sm:p-3">
          <img
            src="/images/admision_2027_jardin_web.webp"
            alt="Admisión 2027 - Matrículas abiertas Jardín Infantil Arcoíris Florencia"
            className="h-auto w-full rounded-[1.25rem] sm:rounded-[1.5rem]"
          />
        </div>
      </div>
    </section>
  );
}
