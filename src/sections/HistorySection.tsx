import { SectionTitle } from "@/components/SectionTitle";
import { Timeline } from "@/components/Timeline";

export function HistorySection() {
  return (
    <section id="historia" className="bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Trayectoria e identidad"
          title="Nuestra Historia"
          description="El Jardín Infantil Arcoíris Florencia fue creado el 1 de febrero de 2020, con el propósito de brindar una educación parvularia cercana, acogedora y comprometida con el desarrollo integral de niños y niñas. Como parte de su proceso de consolidación institucional, el establecimiento obtuvo su Reconocimiento Oficial del Estado el 10 de mayo de 2022, constituyéndose en un importante hito para nuestra comunidad educativa."
        />

        <div className="mt-16">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
