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
          description="Un registro de las actividades, celebraciones y experiencias de nuestra comunidad educativa."
        />

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {news.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
