import { SectionTitle } from "@/components/SectionTitle";
import { Timeline } from "@/components/Timeline";

export function HistorySection() {
  return (
    <section id="historia" className="bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Trayectoria e identidad" title="Nuestra Historia" />

        <div className="reveal mx-auto mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            El Jardín Infantil Arcoíris Florencia nace el 1 de febrero de 2020 en
            Llolleo, comuna de San Antonio, como el sueño de dos profesionales de
            la educación: Rosa Verdugo Matamala, Educadora de Párvulos y
            Magíster en Dirección y Liderazgo para la Gestión Educacional,
            actual directora del establecimiento; y su esposo, Cristian Gaona,
            Profesor, Magíster en Dirección y Liderazgo para la Gestión
            Educacional y Magíster en Gestión Pedagógica y Curricular.
          </p>
          <p>
            A partir de su experiencia en jardines infantiles, escuelas y
            colegios, ambos decidieron dar vida a un proyecto educativo
            orientado a entregar una educación de calidad desde los primeros
            años, en un ambiente seguro, acogedor y comprometido con el
            desarrollo integral de niños y niñas.
          </p>
          <p>
            El nombre "Arcoíris Florencia" nace en honor a su primera hija,
            Florencia, cuya experiencia desde muy pequeña en sala cuna y jardín
            infantil permitió a sus padres valorar profundamente la importancia
            de la educación parvularia y de las experiencias tempranas en el
            desarrollo de la autonomía, los vínculos, las habilidades y los
            aprendizajes.
          </p>
          <p>
            Este proyecto representa así una convicción personal y
            profesional: que cada niño y niña merece vivir sus primeros años
            educativos en un espacio donde pueda sentirse protegido, valorado,
            acompañado y estimulado para descubrir el mundo.
          </p>
          <p>
            El 10 de mayo de 2022, el Jardín Infantil Arcoíris Florencia obtuvo
            su Reconocimiento Oficial del Estado, constituyéndose en un
            importante hito dentro de su proceso de consolidación
            institucional.
          </p>
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
