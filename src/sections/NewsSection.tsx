import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { NewsCard } from "@/components/NewsCard";
import { news as staticNews, type NewsItem } from "@/data/news";
import { fetchPublishedNews } from "@/lib/newsService";

export function NewsSection() {
  // Se inicializa ya con el respaldo estático: si Supabase falla o tarda,
  // la sección nunca queda vacía, muestra las noticias actuales sin interrupción.
  const [items, setItems] = useState<NewsItem[]>(staticNews);

  useEffect(() => {
    let active = true;
    fetchPublishedNews()
      .then((rows) => {
        if (!active) return;
        if (rows.length === 0) return; // sin filas aún: se mantiene el respaldo estático
        setItems(
          rows.map((row) => ({
            id: row.id,
            title: row.title,
            summary: row.summary,
            date: row.event_date,
            category: row.category,
            image: row.cover_image_url ?? "",
            body: row.body.length > 0 ? row.body : undefined,
            gallery: row.gallery.length > 0 ? row.gallery : undefined,
          }))
        );
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar las noticias desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="noticias" className="bg-cream-soft py-14 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Comunidad Arcoíris Florencia"
          title="Noticias y actividades"
          description="Un registro de las actividades, celebraciones y experiencias de nuestra comunidad educativa."
        />

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {items.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
