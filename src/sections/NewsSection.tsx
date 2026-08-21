import { SectionTitle } from "@/components/SectionTitle";
import { NewsCard } from "@/components/NewsCard";
import { news } from "@/data/news";

export function NewsSection() {
  return (
    <section id="noticias" className="bg-cream-soft py-14 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Comunidad Arcoíris Florencia"
          title="Noticias y actividades"
          description="Contenido de demostración: reemplazar por las noticias reales del jardín."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
